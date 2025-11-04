import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { QrCode, HelpCircle, Info, LogOut, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../+auth/context/authContext";
import { Profilestyles } from "@/styles/ProfileStyle";
import { useState } from "react";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

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
      {/* Profile Section */}
      <View style={Profilestyles.profileRow}>
        <View style={Profilestyles.imageContainer}>
          <TouchableOpacity style={Profilestyles.imageWrapper} onPress={handleImagePick}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={Profilestyles.profileImage} />
            ) : (
              <View style={Profilestyles.placeholderCircle}>
                <Plus size={25} color="#ffd8a2ff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={Profilestyles.addIcon} onPress={handleImagePick}>
            <Plus size={12} color="#f5d9b2ff" />
          </TouchableOpacity>
        </View>

        <View style={Profilestyles.userInfo}>
          <Text style={Profilestyles.userName}>{user?.name || "No Name"}</Text>

          <View style={Profilestyles.statsRow}>
            <View style={Profilestyles.statBox}>

              <Text style={Profilestyles.statNumber}>0</Text>
              <Text style={Profilestyles.statLabel}>Drafts</Text>
              
            </View>

            <View style={Profilestyles.statBox}>

              <Text style={Profilestyles.statNumber}>0</Text>
              <Text style={Profilestyles.statLabel}>Completed</Text>
              
            </View>

            <View style={Profilestyles.statBox}>

              <Text style={Profilestyles.statNumber}>0</Text>
              <Text style={Profilestyles.statLabel}>Created</Text>

            </View>
          </View>
        </View>
      </View>

      <View style={Profilestyles.divider} />

      {/* Menu Section */}
      <View style={Profilestyles.menuSection}>
        <TouchableOpacity style={Profilestyles.menuCard} activeOpacity={0.8}>
          <QrCode color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={Profilestyles.menuCard}  activeOpacity={0.8}>
          <HelpCircle color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={Profilestyles.menuCard}  activeOpacity={0.8}>
          <Info color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Profilestyles.menuCard, Profilestyles.logoutCard]} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color="#f5e5dbff" size={25} />
          <Text style={[Profilestyles.menuText, {color: 'white'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
