import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import useImagePicker from "../logic/useImagePicker";
import ImageBox from "../components/ImageBox";
import SoundTransmitter from "../logic/SoundTransmitter"; 

export default function HomeScreen() {
  const navigation = useNavigation();
  const { image, pixelArray, pickImage, removeImage } = useImagePicker();

  return (
    <LinearGradient
      colors={["#b4b4b4ff", "#929292ff", "#878484ff"]}
      style={styles.background}
    >
      <View style={styles.center}>
        <ImageBox image={image} onPick={pickImage} onRemove={removeImage} />
      </View>

      <View style={styles.buttonContainer}>
        <SoundTransmitter pixelArray={pixelArray} />
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