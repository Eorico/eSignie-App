import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { useFR } from "@/hooks/useFR";
import { AuthProvider, useAuth } from "./+auth/context/authContext";
import SplashScreen from "./+splashScreen/SplashScreen";
import { Animated } from "react-native";

// Root layout for router connections
const RootLayoutNav = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Show splash for 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle routing after splash + loading
  useEffect(() => {
    if (loading || showSplash) return;

    const inAuthGroup = segments[0] === "+auth";
    const inTabGroup = segments[0] === "+tabs";
    const currentScreen = segments[1] as string;

    if (!user && !inAuthGroup) {
      router.replace("/+auth/login");
      return;
    }

    if (user && inAuthGroup && !["signUp", "forgotPass"].includes(currentScreen)) {
      router.replace("/+tabs/Agreements");
      return;
    }

    if (!user && !inAuthGroup && !inTabGroup) {
      router.replace("/+auth/login");
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()

  }, [user, loading, segments, router, showSplash]);

  // Show splash screen first
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // Render main stack after splash
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+auth" />
        <Stack.Screen name="+tabs" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Animated.View>
  );
};

export default function RootLayout() {
  useFR();
  return (
    <AuthProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
