import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { NotFoundstyles } from "@/styles/NotFound_Design";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title:'Oops!' }} />
      <View style={NotFoundstyles.container}>
        <Text style={NotFoundstyles.text}>THIS SCREEN DOES'NT EXIST</Text>
        <Link href=".." style={NotFoundstyles.link}>
          <Text>GO TO HOME SCREEN</Text>
        </Link>
      </View>
    </>
  );
}
