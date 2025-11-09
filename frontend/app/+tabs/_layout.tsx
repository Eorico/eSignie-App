import { useRouter } from "expo-router";
import { Tabs } from "expo-router";
import { List, FileText, User, Bell, XCircle, Settings } from "lucide-react-native"; 
import { useState } from "react";
import { Modal, Pressable, GestureResponderEvent, Text, StyleSheet, View} from "react-native";
import { useAuth } from "../+auth/context/authContext";

export default function TabLayout() {
  const {user} = useAuth();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const notif = useState<boolean>(true);
  const handleBellPress = (event: GestureResponderEvent) => {
    setModalVisible(true);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "E-Signie",
        tabBarActiveTintColor: "#fedfb4ff",
        tabBarInactiveTintColor: "#F5F5F0",
        tabBarStyle: {
          backgroundColor: "#552c00ff",
          position: "absolute",
          shadowRadius: 5,
          height: 60,
          paddingBottom: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        },
        headerStyle: {
          backgroundColor: "#552c00ff",
          borderRadius: 5,
          shadowRadius: 2,
          position: "absolute",
        },
        headerTintColor: "#F5F5F0",

        headerRight: () => (
          <>
            <Pressable
              onPress={handleBellPress}
              style={{ marginRight: 15 }}
              accessibilityLabel="Notifications"
            >
              <Bell size={24} color="#F5F5F0" style={{ marginRight: 10 }}/>
            </Pressable>

            <Modal
              animationType="fade"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={NotifStyle.modalOverlay}>
                <View style={NotifStyle.modalCard}>
                  <View style={NotifStyle.headerRow}>

                    <Text style={NotifStyle.modalTitle}>Notifications</Text>
                    <Pressable onPress={() => setModalVisible(false)}>
                      <Text style={NotifStyle.closeX}><XCircle size={24}/></Text>
                    </Pressable>

                  </View>
                  <View style={NotifStyle.divider} />

                  <View style={NotifStyle.notificationList}>
                    
                    {notif ? (
                      <>
                        <View style={NotifStyle.notificationItem}>
                        
                        <Text style={NotifStyle.notificationText}>
                          Document signed by John Doe
                        </Text>
                        <Text style={NotifStyle.timestamp}>2 mins ago</Text>

                        </View>
                        <View style={NotifStyle.notificationItem}>

                          <Text style={NotifStyle.notificationText}>
                            New agreement request received
                          </Text>
                          <Text style={NotifStyle.timestamp}>10 mins ago</Text>

                        </View>
                        <View style={NotifStyle.notificationItem}>

                          <Text style={NotifStyle.notificationText}>
                            Signature verified successfully
                          </Text>
                          <Text style={NotifStyle.timestamp}>1 hour ago</Text>

                        </View>
                      </>
                    ):(
                      <Text style={NotifStyle.notificationText}>No new notifications</Text>
                    )}
                    
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ),
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
          headerTitle: user ? `${user.email}` : "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.replace('../settings/settings')}> 
            
              <Settings size={25} color='#F5F5F0' style={{ marginRight: 20 }}/>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

const NotifStyle = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#552c00ff",
  },
  closeX: {
    fontSize: 20,
    color: "#552c00ff",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
    marginBottom: 15,
  },
  notificationList: {
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: "#fff9f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fedfb4ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    color: "#552c00ff",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    textAlign: "left",
  }
});
