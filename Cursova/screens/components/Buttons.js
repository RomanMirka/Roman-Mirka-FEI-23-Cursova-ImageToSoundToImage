import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function Buttons({ title, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress && onPress();
      }}
    >
      <BlurView intensity={50} tint="light" style={styles.glassButton}>
        <LinearGradient
          colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.15)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glassInner}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glassButton: {
    width: 140,
    height: 55,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(222, 222, 222, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.24)",
  },
  glassInner: {
    flex: 1,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});
