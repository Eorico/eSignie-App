import { Tabs } from "expo-router";
import { List, FileText, User } from "lucide-react-native"; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "E-Signie",
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
          title: "Agreement",
          tabBarIcon: ({ size, color }) => <List size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create +",
          tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
