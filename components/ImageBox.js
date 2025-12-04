import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

function ImageBox({ image, onPick, onRemove }) {
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

export default React.memo(ImageBox);

const styles = StyleSheet.create({
  photoBox: {
    width: "90%",
    height: "50%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.33)",
    backgroundColor: "#f2fefcff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "#828282ff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
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
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    width: 32,
    height: 32,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
