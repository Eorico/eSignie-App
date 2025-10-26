import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFR } from "@/hooks/useFR";
import { AuthProvider, useAuth } from "./+auth/context/authContext";

// Root lay out para sa routers connections ng mga pages
const RootLayoutNav = () => {
  const {user, loading} = useAuth(); // ginagamit to for the user accessing at yung loading sa pagloloading once naglogin or create or forget pass

  const segments = useSegments(); // segments to be able to identify the current folder structure by the help of index
  const router = useRouter(); // ito naman ung naghehelp mag navigate ng mga router or pages

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '+auth';
    const inTabGroup = segments[0] === '+tabs';
    const currentScreen = segments[1] as string;  // nirerepresent nito ung folder context 

    // kapag wala pang account 
    if (!user && !inAuthGroup) {
      router.replace("/+auth/login");
      return;
    }
    // once successfull na ung creation ng account 
    else if (user && inAuthGroup && !['signUp', 'forgotPass'].includes(currentScreen)) {
      router.replace("/+tabs/Agreements");
      return;
    }
    // kapag none of the previous logic de nagsatisfied dito yan pupunta balik login
    else if (!user && !inAuthGroup && !inTabGroup) {
      router.replace("/+auth/login");
    }
    

}, [user, loading, segments, router]);


  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+auth" />
        <Stack.Screen name="+tabs" />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}

export default function RootLayout() {
  useFR();
  // heirchy positions ng mga logics determin mo nalang kasi each tags has specific tasks
  return (
    <AuthProvider>
      <RootLayoutNav/>
      <StatusBar style="auto"/>
    </AuthProvider>
  );
}
