import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SoundReceiver from "../logic/SoundReceiver";

export default function ReceiveScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#86a3e0ff", "#83a6f1ff", "#b3c4e9ff"]}
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
