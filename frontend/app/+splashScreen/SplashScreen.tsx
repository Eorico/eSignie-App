import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";


// splash screen
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

        <View style={Spalshstyles.footerTextContainer}>
            <Text style={Spalshstyles.madeBy}>
              FROM:
            </Text>
            <Text style={Spalshstyles.names}>
              Eo and Nikki
            </Text>
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
  footerTextContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  madeBy: {
    fontSize: 25,
    color: "#72450aff",
    opacity: 0.8,
    fontWeight: 800,
    fontStyle: "italic",
  },
  names: {
    fontSize: 15,
    color: "white",
    opacity: 0.8,
    marginTop: 4,
    fontWeight: 600
  },

});
