import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import useImagePicker from "../logic/useImagePicker";
import ImageBox from "../components/ImageBox";
import Buttons from "../components/Buttons";
import { playImageAsSound } from "../logic/AudioEncoder";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { image, base64, transferTime, pickImage, removeImage } =
    useImagePicker();

  const [sendTitle, setSendTitle] = useState("Передати");

  const handleSend = async () => {
    if (!base64) {
      Alert.alert("Немає фото", "Спочатку виберіть зображення.");
      return;
    }

    setSendTitle("Передається...");

    try {
      await playImageAsSound(base64);

      setSendTitle("Передано!");
      setTimeout(() => setSendTitle("Передати"), 2000);
    } catch {
      Alert.alert("Помилка", "Не вдалося передати звук");
      setSendTitle("Передати");
    }
  };

  return (
    <LinearGradient
      colors={["#f5ffd9", "#b2f0c0", "#97e4a8"]}
      style={styles.background}
    >
      {/* Фото */}
      <View style={styles.center}>
        <ImageBox image={image} onPick={pickImage} onRemove={removeImage} />
      </View>

      {/* Час передачі */}
      {transferTime && (
        <Text style={styles.transferText}>
          Час передачі ≈ {transferTime} сек
        </Text>
      )}

      {/* Кнопки */}
      <View style={styles.buttonContainer}>
        <Buttons
          title="Прийняти"
          onPress={() => navigation.navigate("Receive")}
        />
        <Buttons title={sendTitle} onPress={handleSend} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  center: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  transferText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#5C5C5C",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingBottom: 146,
  },
});
