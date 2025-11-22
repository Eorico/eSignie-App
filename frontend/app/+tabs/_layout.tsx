import { useRouter } from "expo-router";
import { Tabs } from "expo-router";
import { List, User, Bell, XCircle, Settings } from "lucide-react-native"; 
import { useRef, useState } from "react";
import { Modal, Pressable, GestureResponderEvent, Text, StyleSheet, View, Animated, Image} from "react-native";
import { useAuth } from "../+auth/context/authContext";
import { useNotif } from "@/lib/notification";

export default function TabLayout() {
  const {user} = useAuth();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { notifications, clearNotifications } = useNotif();
  const handleBellPress = (event: GestureResponderEvent) => {
    setModalVisible(true);
    clearNotifications();
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/capybaraIcon.png')}
              style={{ 
                width: 38, 
                height: 38, 
                marginRight: 8,
                borderRadius: 20
               }}
              resizeMode="contain"
            />
            <Text style={{ color: '#F5F5F0', fontSize: 22, fontWeight: 'bold' }}>
              E-Signie
            </Text>
          </View>
        ),
        tabBarActiveTintColor: "#fedfb4ff",
        tabBarInactiveTintColor: "#F5F5F0",
        tabBarStyle: {
          backgroundColor: "#552c00ff",
          shadowRadius: 5,
          paddingBottom: 5,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          position: 'absolute'
        },
        headerStyle: {
          backgroundColor: "#552c00ff",
        },
        headerTintColor: "#F5F5F0",

        headerRight: () => (
          <>
            <Pressable
              onPress={handleBellPress}
              style={{ marginRight: 15 }}
              accessibilityLabel="Notifications"
            >
              <View>
                <Bell size={24} color="#F5F5F0" style={{ marginRight: 10 }}/>
                {notifications.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: -4,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      borderWidth: 1,
                      minWidth: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 3,
                      borderColor: '#eb0000ff'
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {notifications.length}
                    </Text>
                  </View>
                )}
              </View>
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
                    
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <View key={item.id} style={NotifStyle.notificationItem}>
                          <Text style={NotifStyle.notificationText}>{item.message}</Text>
                          <Text style={NotifStyle.timestamp}>{item.timestamp}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={NotifStyle.notificationText}>No New notification</Text>
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
        name="SelectAgreement"
        options={{
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => {
            const {onPress, accessibilityState} = props;
            const moveButtonAnim = useRef(new Animated.Value(0)).current;

            const handlePress = (event: GestureResponderEvent) => {
              Animated.sequence([
                Animated.timing(moveButtonAnim, {
                  toValue: 10,
                  duration: 150,
                  useNativeDriver: true,
                }),
                Animated.timing(moveButtonAnim, {
                  toValue: 0,
                  duration: 150,
                  useNativeDriver: true,
                }),
              ]).start();

             if (onPress) onPress(event);
            }

            return (
              <Animated.View style={{ 
                position: 'absolute',
                top: -15,  
                left: '50%',
                transform: [{ translateX: -30 }, { translateY: moveButtonAnim }],
                zIndex: 10,  
              }}>
                <Pressable
                  onPress={handlePress}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "#9A3F3F",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                    borderWidth: 2,
                    borderColor: '#762a2aff'
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>+</Text>
                </Pressable>
              </Animated.View>
            )},
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
