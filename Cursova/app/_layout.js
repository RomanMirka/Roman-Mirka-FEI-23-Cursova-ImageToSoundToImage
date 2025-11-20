import { NativeTabs, Icon, VectorIcon } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
        <NativeTabs.Label>Home</NativeTabs.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Receive">
        {Platform.select({
          ios: <Icon sf="mic.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="mic" />} />
          ),
        })}
        <NativeTabs.Label>Settings</NativeTabs.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
