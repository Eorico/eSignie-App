import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.(); 
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[Spalshstyles.wrapper, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#f9a459ff", "#c88f56ff"]}
        style={Spalshstyles.gradient}
      >
        <View style={Spalshstyles.container}>
          <LottieView
            source={require("@/assets/splashAnimation/splash.json")}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={Spalshstyles.animation}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const Spalshstyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
