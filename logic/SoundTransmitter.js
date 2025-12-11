import React, { useState, useRef } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Buttons from "../components/Buttons";

const DURATION_ZERO = 600;
const DURATION_ONE = 200;
const PAUSE_BETWEEN = 500;

export default function SoundTransmitter({ pixelArray }) {
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const stopSignal = useRef(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleStop = () => {
    stopSignal.current = true;
  };

  const handleTransmit = async () => {
    if (!pixelArray || pixelArray.length === 0) {
      Alert.alert("Увага", "Спочатку виберіть фото!");
      return;
    }

    setIsSending(true);
    stopSignal.current = false;
    setProgress(0);

    let soundZero = null;
    let soundOne = null;

    try {
      const s0 = await Audio.Sound.createAsync(require("../assets/zero.mp3"));
      const s1 = await Audio.Sound.createAsync(require("../assets/one.mp3"));

      soundZero = s0.sound;
      soundOne = s1.sound;

      console.log("Починаємо передачу...");

      for (let i = 0; i < pixelArray.length; i++) {
        if (stopSignal.current) break;

        const bit = pixelArray[i];

        if (bit === 0) {
          await soundZero.replayAsync();
          await sleep(DURATION_ZERO);
          await soundZero.stopAsync();
        } else {
          await soundOne.replayAsync();
          await sleep(DURATION_ONE);
          await soundOne.stopAsync();
        }

        setProgress(i + 1);

        await sleep(PAUSE_BETWEEN);
      }
    } catch (error) {
      console.error("Помилка звуку:", error);
      Alert.alert("Помилка", "Не вдалося відтворити звук.");
    } finally {
      setIsSending(false);
      setProgress(0);
      if (soundZero) await soundZero.unloadAsync();
      if (soundOne) await soundOne.unloadAsync();
    }
  };

  return (
    <View style={styles.container}>
      {isSending && (
        <Text style={styles.progressText}>
          Передача: {progress} / {pixelArray.length} пікс.
        </Text>
      )}

      {!isSending ? (
        <Buttons title="Передати" onPress={handleTransmit} />
      ) : (
        <Buttons title="Стоп" onPress={handleStop} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  progressText: {
    color: "#333",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
