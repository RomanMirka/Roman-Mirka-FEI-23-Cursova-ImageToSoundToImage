import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

export default function ImageBox({ image, onPick, onRemove }) {
  return (
    <TouchableOpacity
      style={styles.photoBox}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPick();
      }}
    >
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.closeBtn} onPress={onRemove}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>Натисни, щоб вибрати фото</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  photoBox: {
    width: "90%",
    height: "50%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(242, 242, 242, 0.23)",
    backgroundColor: "rgba(255, 255, 255, 0.19)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
