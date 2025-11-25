import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import useImagePicker from "../logic/useImagePicker";
import ImageBox from "../components/ImageBox";
import Buttons from "../components/Buttons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { image, pickImage, removeImage } = useImagePicker();

  const handleSend = () => {
    if (!image) {
      Alert.alert("Немає фото", "Спочатку виберіть зображення.");
      return;
    }

    Alert.alert("Імітація", "Тут буде передавання звуку.");
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

      {/* Кнопки */}
      <View style={styles.buttonContainer}>
        <Buttons title="Передати" onPress={handleSend} />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingBottom: 146,
  },
});
