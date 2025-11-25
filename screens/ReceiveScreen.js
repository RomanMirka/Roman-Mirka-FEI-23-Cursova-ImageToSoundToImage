import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Buttons from "../components/Buttons";

import { Audio } from "expo-av";

export default function ReceiveScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState(null);

  const handlePlay = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
      await rec.startAsync();

      setRecording(rec);
      setIsListening(true);
    } catch (error) {
      console.error("Помилка запуску мікрофона:", error);
    }
  };

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
    } catch (e) {
      console.log("Stop error:", e);
    }

    setRecording(null);
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f6faedff", "#e5f0e7ff", "#aaaaaaff"]}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.center}>
          <View style={styles.photoBox}>
            <Text style={styles.text}>
              {isListening ? "Мікрофон увімкнено..." : "Готовий до прийому"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isListening && <Buttons title="Слухати" onPress={handlePlay} />}
          {isListening && <Buttons title="Зупинити" onPress={handleStop} />}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  photoBox: {
    width: "90%",
    height: "50%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#444",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "300",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingBottom: 146,
  },
});
