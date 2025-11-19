import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

function Buttons({ title, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress && onPress();
      }}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(Buttons);

const styles = StyleSheet.create({
  button: {
    width: 140,
    height: 55,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff83",
    borderWidth: 1,
    borderColor: "#ffffffe7",
  },
  buttonText: {
    color: "#303030",
    fontWeight: "600",
    fontSize: 16,
  },
});
