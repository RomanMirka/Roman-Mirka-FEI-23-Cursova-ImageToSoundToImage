import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Buttons from "../components/Buttons";

export default function ReceiveScreen() {
  const navigation = useNavigation();
  const [receivedImage, setReceivedImage] = useState(null);

  const goBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    navigation.goBack();
  };

  const handlePlay = async () => {
    await await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStop = async () => {
    await await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={["#f6faedff", "#caedd2ff", "#b8e0c1ff"]}
      style={styles.container}
    >
      {/* верхній надпис */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
      </View>

      {/* центральне вікно */}
      <View style={styles.center}>
        <View style={styles.photoBox}>
          {receivedImage ? (
            <Image source={{ uri: receivedImage }} style={styles.image} />
          ) : (
            <Text style={styles.text}>Фото ще не отримано</Text>
          )}
        </View>
      </View>

      {/* кнопки */}
      <View style={styles.buttonContainer}>
        <Buttons title="Слухати" onPress={handlePlay} />
        <Buttons title="Зупинити" onPress={handleStop} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: "#1b5e20",
    fontWeight: "600",
    opacity: 0.9,
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
    borderColor: "rgba(0, 0, 0, 0.11)",
    backgroundColor: "rgba(255, 255, 255, 0.19)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "#3333336f",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "300",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingBottom: 54,
  },
});
