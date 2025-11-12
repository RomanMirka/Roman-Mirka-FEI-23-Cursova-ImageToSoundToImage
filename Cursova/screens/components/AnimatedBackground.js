// components/AnimatedBackground.js
import React, { useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AnimatedBackground({ children, theme, trigger }) {
  const gradientAnim = useRef(new Animated.Value(0)).current;

  const themes = {
  light: ["#ffd3b1ff", "#f8b988ff"],
  dark: ["#1e1e1e", "#3a3a3a"],
};

  React.useEffect(() => {
    if (!trigger) return;

    Animated.sequence([
      Animated.timing(gradientAnim, {
        toValue: trigger === "left" ? -0.3 : 0.3,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(gradientAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [trigger]);

  const startX = gradientAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [0.3, 0.0],
  });
  const endX = gradientAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [1.0, 0.7],
  });

  return (
    <AnimatedGradient
      colors={themes[theme] || themes.peach}
      start={{ x: startX, y: 0 }}
      end={{ x: endX, y: 1 }}
      style={styles.background}
    >
      {children}
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
