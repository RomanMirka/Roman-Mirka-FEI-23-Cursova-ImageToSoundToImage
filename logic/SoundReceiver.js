import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import Buttons from "../components/Buttons";

const THRESHOLD = -55;
const GRID_SIZE = 16;
const TOTAL_PIXELS = GRID_SIZE * GRID_SIZE;

const MIN_NOISE_DURATION = 120;    
const ONE_MAX = 500;               
const ZERO_MIN = 501;              
const ZERO_MAX =900;          

export default function SoundReceiver() {
  const [isListening, setIsListening] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [recording, setRecording] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(-160);

  const signalStart = useRef(null);
  const isSignalActive = useRef(false);
  const quietCounter = useRef(0); 

  const handleStartListening = async () => {
    setPixels([]);
    signalStart.current = null;
    isSignalActive.current = false;
    quietCounter.current = 0;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Помилка", "Потрібен доступ до мікрофона");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HighQuality,
        onRecordingStatusUpdate
      );

      await recording.setProgressUpdateInterval(10);

      setRecording(recording);
      setIsListening(true);
    } catch (error) {
      console.error("Помилка запуску:", error);
    }
  };

  const handleStopListening = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (recording) await recording.stopAndUnloadAsync();
    } catch {}
    setRecording(null);
    setIsListening(false);
    setCurrentLevel(-160);
  };

  const onRecordingStatusUpdate = (status) => {
    if (!status.isRecording) return;
    const level = status.metering;
    setCurrentLevel(level);

    if (level > THRESHOLD) {
      isSignalActive.current = true;
      signalStart.current = signalStart.current || Date.now();
      quietCounter.current = 0; 
      return;
    }

    quietCounter.current++;

    if (quietCounter.current < 4) return;

    if (isSignalActive.current && signalStart.current) {
      const duration = Date.now() - signalStart.current;

      if (duration > MIN_NOISE_DURATION) {
        analyzeSignal(duration);
      }
    }

    isSignalActive.current = false;
    signalStart.current = null;
    quietCounter.current = 0;
  };

  const analyzeSignal = (duration) => {
    if (pixels.length >= TOTAL_PIXELS) return;

    let bit = null;

    if (duration < MIN_NOISE_DURATION) {
      return; 
    } else if (duration < ONE_MAX) {
      bit = 1;
      console.log(`Біт 1 (${duration} мс)`);
    } else if (duration >= ZERO_MIN && duration <= ZERO_MAX) {
      bit = 0;
      console.log(`Біт 0 (${duration} мс)`);
    } else {
      console.log("Сумнівний сигнал:", duration);
      return;
    }

    setPixels((prev) => {
      const arr = [...prev, bit];
      if (arr.length % 4 === 0) Haptics.selectionAsync();
      return arr;
    });
  };

  const widthPercent = Math.min(100, Math.max(0, (currentLevel + 80) * 2));
  const thresholdPercent = Math.min(100, Math.max(0, (THRESHOLD + 80) * 2));

  return (
    <View style={styles.container}>

      {isListening && (
        <View style={styles.debugPanel}>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${widthPercent}%` }]} />
            <View style={[styles.thresholdLine, { left: `${thresholdPercent}%` }]} />
          </View>
          <Text style={styles.debugText}>
            {Math.floor(currentLevel)} dB (Поріг: {THRESHOLD})
          </Text>
        </View>
      )}

      <View style={styles.photoBox}>
        {pixels.length === 0 && !isListening && (
          <Text style={styles.placeholderText}>Готовий до прийому</Text>
        )}

        <View style={styles.gridContainer}>
          {pixels.map((bit, index) => (
            <View
              key={index}
              style={[
                styles.pixel,
                { backgroundColor: bit === 0 ? "#000" : "#fff" },
              ]}
            />
          ))}

          {isListening && pixels.length < TOTAL_PIXELS && (
            <View style={[styles.pixel, styles.cursor]} />
          )}
        </View>
      </View>

      <Text style={styles.statusText}>
        Отримано: {pixels.length} / {TOTAL_PIXELS}
      </Text>

      <View style={styles.buttonContainer}>
        {!isListening ? (
          <Buttons title="Слухати" onPress={handleStartListening} />
        ) : (
          <Buttons title="Зупинити" onPress={handleStopListening} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", width: "100%" },

  debugPanel: {
    width: "90%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },

  barContainer: {
    width: "100%",
    height: 15,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
    marginBottom: 5,
  },

  barFill: { height: "100%", backgroundColor: "#4cd964" },
  thresholdLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "red",
    zIndex: 10,
  },

  debugText: { fontSize: 12, color: "#333", fontWeight: "bold" },

  photoBox: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 2,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 256,
    height: 256,
  },

  pixel: { width: 16, height: 16 },
  cursor: { backgroundColor: "red", opacity: 0.5 },

  placeholderText: {
    position: "absolute",
    color: "#999",
    fontSize: 18,
  },

  statusText: { marginTop: 10, fontSize: 16, color: "#333" },

  buttonContainer: { marginTop: 20, width: "100%", alignItems: "center" },
});
