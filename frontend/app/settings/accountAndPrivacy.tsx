import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, User, Mail, Lock, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../+auth/context/authContext";

export default function AccountAndPrivacy() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [changeNameModal, setChangeNameModal] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  const [changeEmailModal, setChangeEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const THEME_KEY = "@theme_mode";
  const [isChocoMode, setIsChocoMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(THEME_KEY);
        setIsChocoMode(v === "choco" || v === "true" || v === "dark");
      } catch (e) {
        /* ignore */
      }
    })();
  }, []);

  const backgroundColor = isChocoMode ? "#8B5E3C" : "#f9cfa3ff";
  const headerBackground = isChocoMode ? "#8B5E3C" : "#8B5E3C";
  const primaryTextColor = isChocoMode ? "#F5F5F0" : "#111827";
  const iconColor = isChocoMode ? "#F5F5F0" : "#8B5E3C";
  const optionBorder = isChocoMode ? "rgba(245,245,240,0.06)" : "#eee";

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    if (newName === user?.name) {
      Alert.alert("Info", "Name is the same as current");
      setChangeNameModal(false);
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfile({ name: newName });
      if (res && (res as any).success === false) {
        Alert.alert("Error", (res as any).error || "Failed to update name");
      } else {
        Alert.alert("Success", "Name updated successfully");
        setChangeNameModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update name");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChangeEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (email === user?.email) {
      Alert.alert("Info", "Email is the same as current");
      setChangeEmailModal(false);
      return;
    }
    setEmailLoading(true);
    try {
      const usersData = await AsyncStorage.getItem("@users");
      const users = usersData ? JSON.parse(usersData) : {};
      if (users[email]) {
        Alert.alert("Error", "Email already in use");
        return;
      }
      const res = await updateProfile({ email });
      if (res && (res as any).success === false) {
        Alert.alert("Error", (res as any).error || "Failed to update email");
      } else {
        Alert.alert("Success", "Email updated successfully");
        setChangeEmailModal(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      Alert.alert("Error", "No user logged in");
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const usersData = await AsyncStorage.getItem("@users");
      const users = usersData ? JSON.parse(usersData) : {};
      const currentEmail = user.email;
      if (!users[currentEmail]) {
        Alert.alert("Error", "User record not found");
        return;
      }
      if (users[currentEmail].password !== oldPassword) {
        Alert.alert("Error", "Old password is incorrect");
        return;
      }

      users[currentEmail].password = newPassword;
      await AsyncStorage.setItem("@users", JSON.stringify(users));
      Alert.alert("Success", "Password updated successfully");
      setChangePasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const options = [
    { title: "Change Name", icon: User, onPress: () => setChangeNameModal(true) },
    { title: "Change Email", icon: Mail, onPress: () => setChangeEmailModal(true) },
    { title: "Change Password", icon: Lock, onPress: () => setChangePasswordModal(true) },
  ];

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: headerBackground }]}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft color={primaryTextColor} size={25} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isChocoMode ? primaryTextColor : "#F5F5F0" }]}>
            Account & Privacy
          </Text>
          <View style={{ width: 25 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {options.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={index}
                style={[styles.option, { borderBottomColor: optionBorder }]}
                onPress={item.onPress}
              >
                <View style={styles.iconText}>
                  <Icon color={iconColor} size={22} style={{ marginRight: 15 }} />
                  <Text style={[styles.optionText, { color: isChocoMode ? primaryTextColor : "#333" }]}>
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Change Name Modal */}
      <Modal visible={changeNameModal} transparent animationType="fade" onRequestClose={() => setChangeNameModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: primaryTextColor }]}>Change Name</Text>
              <Pressable onPress={() => setChangeNameModal(false)}>
                <X color={primaryTextColor} size={24} />
              </Pressable>
            </View>

            <TextInput
              style={[styles.modalInput, { color: primaryTextColor, borderColor: primaryTextColor }]}
              placeholder="Enter new name"
              placeholderTextColor={isChocoMode ? "rgba(245,245,240,0.5)" : "#999"}
              value={newName}
              onChangeText={setNewName}
              editable={!loading}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.modalButton, { backgroundColor: "#999" }]} onPress={() => setChangeNameModal(false)} disabled={loading}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#8B5E3C" }]} onPress={handleChangeName} disabled={loading}>
                <Text style={styles.modalButtonText}>{loading ? "Saving..." : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Email Modal */}
      <Modal visible={changeEmailModal} transparent animationType="fade" onRequestClose={() => setChangeEmailModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: primaryTextColor }]}>Change Email</Text>
              <Pressable onPress={() => setChangeEmailModal(false)}>
                <X color={primaryTextColor} size={24} />
              </Pressable>
            </View>

            <TextInput
              style={[styles.modalInput, { color: primaryTextColor, borderColor: primaryTextColor }]}
              placeholder="Enter new email"
              placeholderTextColor={isChocoMode ? "rgba(245,245,240,0.5)" : "#999"}
              value={newEmail}
              onChangeText={setNewEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!emailLoading}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.modalButton, { backgroundColor: "#999" }]} onPress={() => setChangeEmailModal(false)} disabled={emailLoading}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#8B5E3C" }]} onPress={handleChangeEmail} disabled={emailLoading}>
                <Text style={styles.modalButtonText}>{emailLoading ? "Saving..." : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={changePasswordModal} transparent animationType="fade" onRequestClose={() => setChangePasswordModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: primaryTextColor }]}>Change Password</Text>
              <Pressable onPress={() => setChangePasswordModal(false)}>
                <X color={primaryTextColor} size={24} />
              </Pressable>
            </View>

            <TextInput
              style={[styles.modalInput, { color: primaryTextColor, borderColor: primaryTextColor }]}
              placeholder="Old password"
              placeholderTextColor={isChocoMode ? "rgba(245,245,240,0.5)" : "#999"}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              editable={!passwordLoading}
            />
            <TextInput
              style={[styles.modalInput, { color: primaryTextColor, borderColor: primaryTextColor }]}
              placeholder="New password"
              placeholderTextColor={isChocoMode ? "rgba(245,245,240,0.5)" : "#999"}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!passwordLoading}
            />
            <TextInput
              style={[styles.modalInput, { color: primaryTextColor, borderColor: primaryTextColor }]}
              placeholder="Confirm new password"
              placeholderTextColor={isChocoMode ? "rgba(245,245,240,0.5)" : "#999"}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!passwordLoading}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable style={[styles.modalButton, { backgroundColor: "#999" }]} onPress={() => setChangePasswordModal(false)} disabled={passwordLoading}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#8B5E3C" }]} onPress={handleChangePassword} disabled={passwordLoading}>
                <Text style={styles.modalButtonText}>{passwordLoading ? "Saving..." : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  scroll: {
    paddingVertical: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});