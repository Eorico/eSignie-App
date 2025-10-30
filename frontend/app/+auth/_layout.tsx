import { Stack } from "expo-router";

// layout pages
export default function AuthLayout () {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="login"/>
            <Stack.Screen name="signUp"/>
            <Stack.Screen name="forgotPass"/>
        </Stack>
    );
}