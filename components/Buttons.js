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
    width: 160,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2fefcff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.19)",
  },
  buttonText: {
    color: "#000000ff",
    fontWeight: "500",
    fontSize: 16,
  },
});
