import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import useImagePicker from "../logic/useImagePicker";
import ImageBox from "../components/ImageBox";
import SoundTransmitter from "../logic/SoundTransmitter"; 

export default function HomeScreen() {
  const { image, pixelArray, pickImage, removeImage } = useImagePicker();

  return (
    <LinearGradient
      colors={["#b4c9f8ff", "#a8c3fcff", "#bdcae6ff"]}
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