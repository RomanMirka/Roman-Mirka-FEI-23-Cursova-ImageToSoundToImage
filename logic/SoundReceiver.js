import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { Audio } from "expo-av";
import Buttons from "../components/Buttons";

const THRESHOLD = Platform.OS === "ios" ? -30 : -55;
const GRID_SIZE = 16;
const TOTAL_PIXELS = GRID_SIZE * GRID_SIZE;

const MIN_NOISE_DURATION = 120;
const ONE_MAX = 599;
const ZERO_MIN = 601;
const ZERO_MAX = 1200;

export default function SoundReceiver() {
  const [isListening, setIsListening] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [recording, setRecording] = useState(null);

  const signalStart = useRef(null);
  const isSignalActive = useRef(false);
  const quietCounter = useRef(0);

  const handleStartListening = async () => {
    setPixels([]);
    signalStart.current = null;
    isSignalActive.current = false;
    quietCounter.current = 0;

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Помилка", "Потрібен доступ до мікрофона");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HighQuality,
        onRecordingStatusUpdate,
      );

      await recording.setProgressUpdateInterval(10);

      setRecording(recording);
      setIsListening(true);
    } catch (error) {
      console.error("Помилка запуску:", error);
    }
  };

  const handleStopListening = async () => {
    try {
      if (recording) await recording.stopAndUnloadAsync();
    } catch {}
    setRecording(null);
    setIsListening(false);
  };

  const onRecordingStatusUpdate = (status) => {
    if (!status.isRecording) return;

    const level = status.metering;

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
      return arr;
    });
  };

  return (
    <View style={styles.container}>
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
  container: { alignItems: "center", width: "000%" },

  photoBox: {
    width: "90%",
    height: "49%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.33)",
    backgroundColor: "#f2f7feff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 20,
  },

  gridContainer: {
    fexDirection: "row",
    flexWrap: "wrap",
    width: 256,
    height: 256,
  },

  pixel: { width: 16, height: 16 },
  cursor: { backgroundColor: "red", opacity: 0.5 },

  placeholderText: {
    position: "absolute",
    color: "#828282ff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },

  statusText: { marginTop: 10, fontSize: 16, color: "#333" },

  buttonContainer: { marginTop: 150, width: "100%", alignItems: "center" },
});
