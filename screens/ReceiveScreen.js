import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SoundReceiver from "../logic/SoundReceiver"; 

export default function ReceiveScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f6faedff", "#e5f0e7ff", "#aaaaaaff"]}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.center}>
          <SoundReceiver />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});