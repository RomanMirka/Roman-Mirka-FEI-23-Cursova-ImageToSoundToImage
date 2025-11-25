import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

// Розмір, до якого зменшується фото
const TARGET_SIZE = 32;
const COMPRESSION = 0.7;

export default function useImagePicker() {
  const [image, setImage] = useState(null); // URI оригінального фото
  const [base64, setBase64] = useState(null); // base64 зменшеного фото

  const pickImage = async () => {
    try {
      // Дозвіл
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return Alert.alert("Немає дозволу на доступ до галереї");

      // Вибір зображення
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.5,
      });

      if (result.canceled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      const uri = result.assets?.[0]?.uri;
      if (!uri) return Alert.alert("Помилка вибору фото");

      setImage(uri);

      // Зменшуємо фото (більше нічого не робимо!)
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: TARGET_SIZE, height: TARGET_SIZE } }],
        { base64: true, compress: COMPRESSION },
      );

      setBase64(resized.base64 || "");
    } catch (err) {
      console.error("Помилка вибору зображення:", err);
      Alert.alert("Сталася помилка при обробці фото");
    }
  };

  const removeImage = () => {
    setImage(null);
    setBase64(null);
  };

  return { image, base64, pickImage, removeImage };
}
