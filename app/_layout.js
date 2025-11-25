import {
  NativeTabs,
  Icon,
  VectorIcon,
  Label,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Receive">
        {Platform.select({
          ios: <Icon sf="mic.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="mic" />} />
          ),
        })}
        <Label>Mic</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
