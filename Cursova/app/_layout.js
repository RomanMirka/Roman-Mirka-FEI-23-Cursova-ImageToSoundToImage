import { NativeTabs, Icon } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";

export default function Layout() {
  return (
    <NativeTabs
      labelStyle={{
        color:
          Platform.OS === "ios"
            ? DynamicColorIOS({
                dark: "white",
                light: "black",
              })
            : "black",
      }}
      tintColor={
        Platform.OS === "ios"
          ? DynamicColorIOS({
              dark: "white",
              light: "black",
            })
          : "black"
      }
    >
      <NativeTabs.Trigger name="Index">
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          drawable="custom_home_drawable"
        />
        <NativeTabs.Label>Home</NativeTabs.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Receive">
        <Icon
          sf={{ default: "mic", selected: "mic.fill" }}
          drawable="custom_home_drawable"
        />
        <NativeTabs.Label>Settings</NativeTabs.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
