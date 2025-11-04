import { Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { NotFoundstyles } from "@/styles/NotFound_Design";
import { useRouter } from "expo-router";
// once na mali ung path or hinde nageexist ung page
export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title:'Oops!' }} />
      <View style={NotFoundstyles.container}>
        <Text style={NotFoundstyles.text}>THIS SCREEN DOES'NT EXIST</Text>
        <Pressable onPress={() => router.replace('/+tabs/Agreements')} style={NotFoundstyles.link}>
          <Text>GO TO HOME SCREEN</Text>
        </Pressable>
      </View>
    </>
  );
}
