import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { QrCode, HelpCircle, Info, LogOut, Plus, User2Icon, ArrowLeft } from "lucide-react-native"; 
import { useRouter } from "expo-router";  
import { useAuth } from "../+auth/context/authContext";  
import { Profilestyles } from "@/styles/ProfileStyle"; 
import QRCode from 'react-native-qrcode-svg'; 
import i18n from "@/lib/language";
import { useTranslation } from "react-i18next";
import { useUserStat } from "../+auth/context/userStatContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, ref, update } from 'firebase/database';
import { RealTimeDataBase } from "@/firebase/firebase";

const THEME_KEY = "@theme_mode";

const sanitizeKey = (key: string) => key.replace(/\./g, ",");

export const fetchProfileImageFromDB = async (email: string): Promise<string|null> => {
  try {
    const userKey = sanitizeKey(email);
    const snapShot = await get(ref(RealTimeDataBase, `users/${userKey}/profileImage`));
    return snapShot.exists() ? snapShot.val() : null;
  } catch (error) {
    console.error("Failed to fetch the image from the database:", error);
    return null;
  }
}

export const fetchUserStatFromDB = async (email: string) => {
  try {
    const userKey = sanitizeKey(email);
    const snapshot = await get(ref(RealTimeDataBase, `users/${userKey}/stats`));
    return snapshot.exists() ? snapshot.val() : {
      draftsAgreement: 0,
      completedAgreement: 0,
      createdAgreement: 0,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return null;
  }
}

export const saveProfileImageToDB = async (email: string, imageUri: string) => {
  try {
    const userKey = sanitizeKey(email);
    await update(ref(RealTimeDataBase, `users/${userKey}`), {
      profileImage: imageUri
    });
    console.log("Profile image saved for user:", email);
  } catch (error) {
    console.error("Failed to save profile image:", error);
  }
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'qr'| 'support' | 'about' | null>(null);
  const [isChocoMode, setIsChocoMode] = useState(false); // theme state
  const { userStat, setUserStat } = useUserStat();

  // Force re-render when language changes
  const [, forceUpdate] = useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
  };

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user?.email) return;
      
      const stats = await fetchUserStatFromDB(user.email);

      setUserStat(prev => ({
        ...prev, ...stats,
        name: user.name ?? '',
        email: user.email,
      }));
    };

    loadUserStats()
  }, [user?.email]);

  // Load theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "choco") setIsChocoMode(true);
      } catch (e) {
        console.log("Error loading theme:", e);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (user?.email) {
        const savedImage = await fetchProfileImageFromDB(user.email);
        if (savedImage) setProfileImage(savedImage);
      }
    };
    loadProfileImage()
  }, [user]);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setProfileImage(selectedUri);

      if (user?.email) {
        saveProfileImageToDB(user.email, selectedUri)
      }
    };
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/+auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const openModal = (type: 'qr' | 'support' | 'about') => {
    setModalType(type);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  // Colors based on theme
  const backgroundColor = isChocoMode ? "#8B5E3C" : "#f9cfa3ff"; // screen background
  const headerColor = isChocoMode ? "#704328" : "#f9cfa3ff"; // modal header
  const textColor = isChocoMode ? "#F5F5F0" : "#333"; // general text
  const boxColor = isChocoMode ? "#f9cfa3ff" : "#704328"; // menu & modal boxes
  const boxTextColor = isChocoMode ? "#000000" : "#ffffff"; // menu & modal text
  const iconColor = isChocoMode ? "#000000" : "#f5d9b2ff"; // icons
  const qrColor = isChocoMode  ? "#f9cfa3ff" : "#ffffff";

  return (
    <View style={[Profilestyles.container, { backgroundColor }]}>
      {/* Profile Section */}
      <View style={Profilestyles.profileRow}>
        <View style={Profilestyles.imageContainer}>
          <TouchableOpacity style={Profilestyles.imageWrapper} onPress={handleImagePick}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={Profilestyles.profileImage} />
            ) : (
              <View style={Profilestyles.placeholderCircle}>
                <User2Icon size={25} color={iconColor} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={Profilestyles.addIcon} onPress={handleImagePick}>
            <Plus size={12} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View style={Profilestyles.userInfo}>
          <Text style={[Profilestyles.userName, { color: textColor }]}>{user?.name || "No Name"}</Text>
          <View style={Profilestyles.statsRow}>
            <View style={Profilestyles.statBox}>
              <Text style={[Profilestyles.statNumber, { color: textColor }]}>{userStat?.draftsAgreement}</Text>
              <Text style={[Profilestyles.statLabel, { color: textColor }]}>{t('profile.drafts')}</Text>
            </View>
            <View style={Profilestyles.statBox}>
              <Text style={[Profilestyles.statNumber, { color: textColor }]}>{userStat?.completedAgreement}</Text>
              <Text style={[Profilestyles.statLabel, { color: textColor }]}>{t('profile.completed')}</Text>
            </View>
            <View style={Profilestyles.statBox}>
              <Text style={[Profilestyles.statNumber, { color: textColor }]}>{userStat?.createdAgreement}</Text>
              <Text style={[Profilestyles.statLabel, { color: textColor }]}>{t('profile.created')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={Profilestyles.divider} />

      {/* Menu Section */}
      <View style={Profilestyles.menuSection}>
        <TouchableOpacity style={[Profilestyles.menuCard, { backgroundColor: boxColor }]} activeOpacity={0.8} onPress={() => openModal('qr')}>
          <QrCode color={iconColor} size={25} />
          <Text style={[Profilestyles.menuText, { color: boxTextColor }]}>{t('profile.QRcode')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Profilestyles.menuCard, { backgroundColor: boxColor }]} activeOpacity={0.8} onPress={() => openModal('support')}>
          <HelpCircle color={iconColor} size={25} />
          <Text style={[Profilestyles.menuText, { color: boxTextColor }]}>{t('profile.support')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Profilestyles.menuCard, { backgroundColor: boxColor }]} activeOpacity={0.8} onPress={() => openModal('about')}>
          <Info color={iconColor} size={25} />
          <Text style={[Profilestyles.menuText, { color: boxTextColor }]}>{t('profile.about')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Profilestyles.menuCard, Profilestyles.logoutCard, { backgroundColor: boxColor }]} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color={iconColor} size={25} />
          <Text style={[Profilestyles.menuText, { color: boxTextColor }]}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={closeModal}>
        <View style={{ flex: 1, backgroundColor }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: headerColor, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 15,
            borderBottomWidth: 1, elevation: 8
          }}>
            <TouchableOpacity onPress={closeModal}>
              <ArrowLeft size={23} color={textColor} />
            </TouchableOpacity>

            <Text style={{ fontSize: 22, fontWeight: '700', color: textColor, textAlign: 'center', flex: 1, marginLeft: 20 }}>
              {modalType === 'qr' ? `${user?.name} QR Code` : modalType === 'support' ? t('profile.support') : t('profile.about')}
            </Text>
            <View style={{ width: 26 }}/>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20, paddingVertical: 45 }}>
            {modalType === 'qr' && (
              <View>
                <View style={{
                  alignItems: 'center', paddingVertical: 20, backgroundColor: qrColor, borderRadius: 20,
                  shadowColor: '#000', shadowOpacity: 1, shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 5, elevation: 5,
                }}>
                  {user?.email ? <QRCode value={user.email} size={300} backgroundColor={qrColor}/> : <Text>No QR Available</Text>}
                </View>

                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 15, fontStyle: 'italic' }}>QR CODE: {user?.email}</Text>
                </View>
              </View>
            )}


            {modalType === 'support' && (
              <View style={{ padding: 20, backgroundColor: boxColor, borderRadius: 20, shadowColor: '#000', shadowOpacity: 1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10, color: boxTextColor, textAlign: 'center' }}>
                  Support of E-Signie
                </Text>
                <Text style={{ fontSize: 16, lineHeight: 24, color: boxTextColor }}>
                  If you require assistance, have any questions, or encounter any issues, our support team is here to help. Please contact us at esignie_support@gmail.com, and one of our knowledgeable representatives will get back to you as promptly as possible. We are dedicated to providing timely, thorough, and friendly support to ensure that your experience with our services is seamless and enjoyable. Whether you need guidance, troubleshooting, or simply more information, we take every inquiry seriously and strive to resolve your concerns efficiently. Your satisfaction and peace of mind are our top priorities, and we are committed to offering the support you need whenever you need it.
                </Text>
              </View>
            )}

            {modalType === 'about' && (
              <View style={{ padding: 20, backgroundColor: boxColor, borderRadius: 20, shadowColor: '#000', shadowOpacity: 1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10, color: boxTextColor, textAlign: 'center' }}>
                  About E-Signie
                </Text>
                <Text style={{ fontSize: 16, lineHeight: 24, color: boxTextColor }}>
                  E-Signie is an innovative online agreement platform designed to streamline and simplify document management, ensuring that every process is handled securely, efficiently, and effortlessly. Our goal is to eliminate the traditional complexities of paperwork, allowing individuals and businesses to create, send, sign, and store agreements entirely online. With a strong focus on security, speed, and reliability, E-Signie is committed to providing a seamless experience that saves time, reduces errors, and enhances productivity. Our mission is to offer a trusted, fast, and dependable service that empowers users to manage their documents with confidence and peace of mind.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
