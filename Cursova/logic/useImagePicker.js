import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

const TARGET_SIZE = 32;
const COMPRESSION = 0.7;
const TONE_DURATION = 0.05;

export default function useImagePicker() {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [transferTime, setTransferTime] = useState(null);

  const pickImage = async () => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return Alert.alert("Немає дозволу");

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
      if (!uri) return Alert.alert("Помилка вибору");

      setImage(uri);

      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: TARGET_SIZE, height: TARGET_SIZE } }],
        { base64: true, compress: COMPRESSION },
      );

      const b64 = resized.base64 || "";
      setBase64(b64);

      const seconds = b64.length * TONE_DURATION;
      setTransferTime(seconds.toFixed(1));
    } catch (err) {
      console.error("Помилка:", err);
      Alert.alert("Сталася помилка при обробці фото");
    }
  };

  const removeImage = () => {
    setImage(null);
    setBase64(null);
    setTransferTime(null);
  };

  return { image, base64, transferTime, pickImage, removeImage };
}
