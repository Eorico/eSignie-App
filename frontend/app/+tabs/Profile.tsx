import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../+auth/context/authContext";
import { Profilestyles } from "@/styles/ProfileStyle";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/+auth/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={Profilestyles.container}>
      <Text style={Profilestyles.title}>Profile</Text>

      {user ? (
        <>
          <Text style={Profilestyles.label}>Logged in as:</Text>
          <Text style={Profilestyles.email}>{user.email}</Text>
        </>
      ) : (
        <Text style={Profilestyles.label}>No user found.</Text>
      )}

      <TouchableOpacity style={Profilestyles.logoutButton} onPress={handleLogout}>
        <Text style={Profilestyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
