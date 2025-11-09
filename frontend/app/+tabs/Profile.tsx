import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { QrCode, HelpCircle, Info, LogOut, Plus, XCircle, User2Icon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../+auth/context/authContext";
import { Profilestyles } from "@/styles/ProfileStyle";
import { useState } from "react";
import QRCode from 'react-native-qrcode-svg';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [modalVisible, setmodalVisible] = useState(false);
  const [modalType, setmodalType] = useState<'qr'| 'support' | 'about' | null>(null);

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

  const openModal = (type: 'qr' | 'support' | 'about') => {
    setmodalType(type);
    setmodalVisible(true);
  };

  const closeModal = () => {
    setmodalVisible(false);
    setmodalType(null);
  }

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
                <User2Icon size={25} color="#ffd8a2ff" />
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
        <TouchableOpacity 
          style={Profilestyles.menuCard} 
          activeOpacity={0.8}
          onPress={() => openModal('qr')}
          >
          <QrCode color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={Profilestyles.menuCard}  
          activeOpacity={0.8}
          onPress={() => openModal('support')}
          >
          <HelpCircle color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={Profilestyles.menuCard}  
          activeOpacity={0.8}
          onPress={() => openModal('about')}
          >
          <Info color="#f5d9b2ff" size={25} />
          <Text style={Profilestyles.menuText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Profilestyles.menuCard, Profilestyles.logoutCard]} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color="#f5e5dbff" size={25} />
          <Text style={[Profilestyles.menuText, {color: 'white'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true} 
        visible={modalVisible}
        onRequestClose={closeModal}
      >
       
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          
          <View
            style={{
              backgroundColor: '#8B5E3C',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              paddingVertical: 20,
              paddingHorizontal: 20,
              maxHeight: '80%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 20,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#ffffffff' }}>
                {modalType === 'qr'
                  ? `${user?.name} QR Code`
                  : modalType === 'support'
                  ? ''
                  : ''}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <XCircle size={23} color="#ffffffff" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={false}
            >
              {modalType === 'qr' && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  {user?.email ? (
                    <QRCode
                      value={user.email}
                      size={300}
                      backgroundColor="white"
                    />
                  ) : (
                    <Text>No QR Available</Text>
                  )}
                </View>
              )}

              {modalType === 'support' && (
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#7a4a06ff', textAlign: 'center' }}>
                    Support
                  </Text>
                  <Text style={{ fontSize: 16, lineHeight: 24, color: '#333' }}>
                    If you require assistance, have any questions, or encounter any issues, our support team is here to help. 
                    Please contact us at esignie_support@gmail.com, and one of our knowledgeable representatives will get back to you as promptly as possible. We are dedicated to providing timely, 
                    thorough, and friendly support to ensure that your experience with our services is seamless and enjoyable. 
                    Whether you need guidance, troubleshooting, or simply more information, we take every inquiry seriously and strive to resolve your concerns efficiently. 
                    Your satisfaction and peace of mind are our top priorities, and we are committed to offering the support you need whenever you need it.
                  </Text>
                </View>
              )}

              {modalType === 'about' && (
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#7a4a06ff', textAlign: 'center' }}>
                    About E-Signie
                  </Text>
                  <Text style={{ fontSize: 16, lineHeight: 24, color: '#333' }}>
                    E-Signie is an innovative online agreement platform designed to streamline and simplify document management, ensuring that every process is handled securely, efficiently, and effortlessly. 
                    Our goal is to eliminate the traditional complexities of paperwork, allowing individuals and businesses to create, send, sign, and store agreements entirely online. With a strong focus on security, speed, and reliability, E-Signie is committed to providing a seamless experience that saves time, reduces errors, and enhances productivity. 
                    Our mission is to offer a trusted, fast, and dependable service that empowers users to manage their documents with confidence and peace of mind.
                  </Text>
                </View>
              )}
            </ScrollView>
            
          </View>
        </View>

      </Modal>
   
    </View>
  );
}
