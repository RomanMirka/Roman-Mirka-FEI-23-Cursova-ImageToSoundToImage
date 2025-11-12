import React, { useState, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import ImageBox from "./components/ImageBox";
import Buttons from "./components/Buttons";
import AnimatedBackground from "./components/AnimatedBackground";

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const animateGradientRef = useRef(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Дозвіл потрібен", "Дозволь доступ до галереї");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Фото не вибрано!",
        "Будь ласка, обери зображення з галереї.",
      );
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setImage(null);

  return (
    <AnimatedBackground refCallback={(fn) => (animateGradientRef.current = fn)}>
      <View style={styles.center}>
        <ImageBox image={image} onPick={pickImage} onRemove={removeImage} />
      </View>

      <View style={styles.buttonContainer}>
        <Buttons
          title="Прийняти"
          onPress={() => animateGradientRef.current?.("left")}
        />
        <Buttons
          title="Передати"
          onPress={() => animateGradientRef.current?.("right")}
        />
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 54,
  },
});
