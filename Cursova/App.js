import { SafeAreaProvider } from "react-native-safe-area-context";
import { ExpoRoot } from "expo-router";

export default function App() {
  const ctx = require.context("./app");

  return (
    <SafeAreaProvider>
      <ExpoRoot context={ctx} />
    </SafeAreaProvider>
  );
}
