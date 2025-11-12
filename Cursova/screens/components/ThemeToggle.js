// components/ThemeToggle.js
import React, { useState } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggle({ isDark, onToggle }) {
  const [rotation] = useState(new Animated.Value(0));

  const handlePress = () => {
    Animated.timing(rotation, {
      toValue: isDark ? 0 : 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    onToggle();
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={27}
          color={isDark ? "#ffffffff" : "#333333"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
