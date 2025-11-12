import React, { useState, useRef } from "react";
import { View, StyleSheet, Alert, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import ImageBox from "../components/ImageBox";
import Buttons from "../components/Buttons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Немає дозволу", "Будь ласка, дозволь доступ до галереї");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert(
        "Фото не вибрано!",
        "Будь ласка, обери зображення з галереї.",
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setImage(null);

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
  const gradientAnim = useRef(new Animated.Value(0)).current;

  const animateGradient = (direction) => {
    Animated.sequence([
      Animated.timing(gradientAnim, {
        toValue: direction === "left" ? -4.3 : 4.3,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(gradientAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startX = gradientAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [0.3, 0.8],
  });

  const endX = gradientAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [1, 0.2],
  });

  return (
    <AnimatedGradient
      colors={["#f5ffd9", "#b2f0c0", "#97e4a8"]}
      start={{ x: startX, y: 0 }}
      end={{ x: endX, y: 1 }}
      style={[
        styles.background,
        {
          background:
            "linear-gradient(180deg, #e1f2e5ff 0%, #bae5c4ff 50%, #b2f0c0 100%)",
        },
      ]}
    >
      <View style={styles.center}>
        <ImageBox image={image} onPick={pickImage} onRemove={removeImage} />
      </View>

      <View style={styles.buttonContainer}>
        <Buttons
          title="Прийняти"
          onPress={() => {
            animateGradient("left");
            navigation.navigate("Receive");
          }}
        />
        <Buttons title="Передати" onPress={() => animateGradient("right")} />
      </View>
    </AnimatedGradient>
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
    paddingBottom: 54,
  },
});
