import { Tabs } from "expo-router";
import { List, FileText } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#B6771D",
        tabBarInactiveTintColor: "#F5F5F0",

        tabBarStyle: {
          backgroundColor: "#37353E",
        },
        
        headerStyle: {
          backgroundColor: "#37353E",
        },

        headerTintColor: "#F5F5F0",
    }}
    >

    <Tabs.Screen
        name="Agreements"
        options={{
        title: "Agreements",
        tabBarIcon: ({ size, color }) => <List size={size} color={color} />,
        }}
    />
    
    <Tabs.Screen
        name="create"
        options={{
        title: "Create Agreements",
        tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
        }}
    />
    </Tabs>
  );
}
