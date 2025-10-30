import { Tabs } from "expo-router";
import { List, FileText, User } from "lucide-react-native"; 

// tab screen or ung nav bar type
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "E-Signie",
        tabBarActiveTintColor: "#fedfb4ff",
        tabBarInactiveTintColor: "#F5F5F0",
        tabBarStyle: {
          backgroundColor: "#552c00ff",
        },
        headerStyle: {
          backgroundColor: "#552c00ff",
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
