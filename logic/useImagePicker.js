import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import * as jpeg from "jpeg-js"; 
import { decode } from "base64-arraybuffer";

const TARGET_SIZE = 16; 

export default function useImagePicker() {
  const [image, setImage] = useState(null);
  const [pixelArray, setPixelArray] = useState([]); 

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return Alert.alert("Немає дозволу");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;
      const uri = result.assets?.[0]?.uri;

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: TARGET_SIZE, height: TARGET_SIZE } }],
        { base64: true, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipResult.uri); 

      const base64 = manipResult.base64;
      const arrayBuffer = decode(base64); 
 
      const decoded = jpeg.decode(arrayBuffer, { useTArray: true }); 
      
      const binaries = [];

      for (let i = 0; i < decoded.data.length; i += 4) {
        const r = decoded.data[i];
        const g = decoded.data[i + 1];
        const b = decoded.data[i + 2];

        const brightness = (r + g + b) / 3;

        const bit = brightness > 128 ? 1 : 0;
        binaries.push(bit);
      }

      console.log("Довжина масиву:", binaries.length);
      console.log(binaries); 
      
      setPixelArray(binaries); 
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (err) {
      console.error("Помилка:", err);
      Alert.alert("Помилка обробки");
    }
  };

  const removeImage = () => {
    setImage(null);
    setPixelArray([]);
  };

  return { image, pixelArray, pickImage, removeImage };
}