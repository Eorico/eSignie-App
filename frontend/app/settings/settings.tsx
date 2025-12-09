import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Animated,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Shield, Trash2, Globe, Bell, History } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/language";
import { useNotif } from "@/lib/notification";

const THEME_KEY = "@theme_mode";
const NOTIF_KEY = "@notifications_enabled";
const LOGIN_HISTORY_KEY = "@login_history";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const AGREEMENTS_KEY = "@agreements";

  // Theme Mode
  const [isChocoMode, setIsChocoMode] = useState(false); // default: Cream
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = Cream, 1 = Choco

  // Notification Toggle
  const { notifications, addNotification, clearNotifications } = useNotif();
  const [ notifSwitch, setNotifSwitch ] = useState(false);
  // Login history modal & data 
  const [historyModal, setHistoryModal] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);

  // Load theme and notification preference from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "choco") {
          setIsChocoMode(true);
          slideAnim.setValue(1);
        } else {
          setIsChocoMode(false);
          slideAnim.setValue(0);
        }

        const notif = await AsyncStorage.getItem(NOTIF_KEY);
        if (notif === "true") {
          addNotification("Notification Enabled");
        } else {
          clearNotifications();
        }
      } catch (e) {
        console.log("Error loading settings:", e);
      }
    };
    loadSettings();
  }, []);

  // Load login history when modal opens
  useEffect(() => {
    if (!historyModal) return;
    const loadLoginHistory = async () => {
      try {
        const raw = await AsyncStorage.getItem(LOGIN_HISTORY_KEY);
        const items = raw ? JSON.parse(raw) : [];
        setLoginHistory(Array.isArray(items) ? items : []);
      } catch (e) {
        console.log("Failed to load login history:", e);
        setLoginHistory([]);
      }
    };
    loadLoginHistory();
  }, [historyModal]);

  const toggleMode = async () => {
    const newValue = isChocoMode ? 0 : 1;
    Animated.timing(slideAnim, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    const newMode = !isChocoMode;
    setIsChocoMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode ? "choco" : "cream");
    } catch (e) {
      console.log("Error saving theme:", e);
    }
  };

  const toggleNotifications = async (value?: boolean) => {
    const enable = typeof value === "boolean" ? value : notifications.length > 0;
    setNotifSwitch(enable);
    try {
      await AsyncStorage.setItem(NOTIF_KEY, enable ? "true" : "false");

      if (!enable) {
        clearNotifications();
      } else {
        addNotification("Notification Enabled")
      }
    } catch (e) {
      console.log("Error saving notification preference:", e);
    }
  };

  const clearAppStorage = () => {
    Alert.alert(
      t("settings.clear_storage_alert_title"),
      t("settings.clear_storage_alert_message"),
      [
        { text: t("settings.cancel"), style: "cancel" as const },
        {
          text: t("settings.clear"),
          style: "destructive" as const,
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(AGREEMENTS_KEY);
              Alert.alert(t("settings.storage_clear_title"), t("settings.storage_clear_message"));
            } catch (error) {
              Alert.alert(t("settings.error"), t("settings.error_message"));
            }
          },
        },
      ]
    );
  };

  const openHistoryModal = () => setHistoryModal(true);

  const clearLoginHistory = async () => {
    Alert.alert(
      t("settings.clear_storage_alert_title"),
      t("settings.clear_login_history_message") || "Clear login history?",
      [
        { text: t("settings.cancel"), style: "cancel" as const },
        {
          text: t("settings.clear"),
          style: "destructive" as const,
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(LOGIN_HISTORY_KEY);
              setLoginHistory([]);
              Alert.alert(t("settings.storage_clear_title"), t("settings.login_history_cleared") || "Login history cleared.");
            } catch (e) {
              console.log("Failed to clear login history:", e);
              Alert.alert(t("settings.error"), t("settings.error_message"));
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    { key: "account", title: t("settings.account_privacy"), icon: Shield, onPress: () => router.push("/settings/accountAndPrivacy") },
    { key: "language", title: t("settings.language"), icon: Globe, onPress: () => setLanguageModal(true) },
    { key: "notification", title: t("settings.notification"), icon: Bell },
    { key: "history", title: t("settings.login_history"), icon: History, onPress: openHistoryModal },
    { key: "clear", title: t("settings.clear_storage"), icon: Trash2, onPress: clearAppStorage },
  ];

  // Language Modal
  const [languageModal, setLanguageModal] = useState(false);
  const [, forceUpdate] = useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate((prev) => !prev));
    setLanguageModal(false);
  };

  const textColor = isChocoMode ? "#F5F5F0" : "#333";
  const iconColor = isChocoMode ? "#F5F5F0" : "#8B5E3C";

  const formatEntry = (entry: any) => {
    // entry can be string or object; try to format gracefully
    if (!entry) return "";
    if (typeof entry === "string") return entry;
    if (typeof entry === "object") {
      const time = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : null;
      const device = entry.device || entry.userAgent || null;
      const ip = entry.ip || null;
      return [time, device, ip].filter(Boolean).join(" • ");
    }
    return String(entry);
  };

  return (
    <View style={[styles.container, { backgroundColor: isChocoMode ? "#8B5E3C" : "#f9cfa3ff" }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/+tabs/Profile")}>
          <ArrowLeft color={textColor} size={25} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>{t("settings.title")}</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Theme Toggle */}
      <View style={styles.option}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.optionText, { color: textColor }]}>
            {isChocoMode ? "Switch to Cream Mode" : "Switch to Choco Mode"}
          </Text>
          <Pressable
            onPress={toggleMode}
            style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              backgroundColor: isChocoMode ? "#4B2E2E" : "#f2f2f2",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Animated.View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#fff",
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 22],
                    }),
                  },
                ],
              }}
            />
          </Pressable>
        </View>
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {settingsOptions.map((item) => {
          const Icon = item.icon;
          // Render notification row with a Switch
          if (item.key === "notification") {
            return (
              <View key={item.key} style={[styles.option, { borderBottomColor: "#eee" }]}>
                <View style={styles.iconText}>
                  <Icon color={iconColor} size={22} style={{ marginRight: 15 }} />
                  <Text style={[styles.optionText, { color: textColor, flex: 1 }]}>{item.title}</Text>
                  <Switch
                    value={notifications.length > 0}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: "#767577", true: isChocoMode ? "#4B2E2E" : "#8B5E3C" }}
                    thumbColor={notifications.length > 0 ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                  />
                </View>
              </View>
            );
          }

          return (
            <Pressable key={item.key} style={styles.option} onPress={item.onPress ?? (() => {})}>
              <View style={styles.iconText}>
                <Icon color={iconColor} size={22} style={{ marginRight: 15 }} />
                <Text style={[styles.optionText, { color: textColor }]}>{item.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* LOGIN HISTORY MODAL */}
      <Modal visible={historyModal} transparent animationType="slide" onRequestClose={() => setHistoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.historyModalBox, { backgroundColor: isChocoMode ? "#4B2E2E" : "#fff" }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{t("settings.login_history")}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable onPress={clearLoginHistory} style={styles.historyAction}>
                  <Text style={[styles.historyActionText, { color: isChocoMode ? "#F5F5F0" : "#8B5E3C" }]}>{t("settings.clear")}</Text>
                </Pressable>
                <Pressable onPress={() => setHistoryModal(false)} style={styles.historyAction}>
                  <Text style={[styles.historyActionText, { color: isChocoMode ? "#F5F5F0" : "#333" }]}>{t("settings.close") || "Close"}</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView style={{ width: "100%", maxHeight: 380, marginTop: 8 }}>
              {loginHistory.length === 0 ? (
                <View style={{ padding: 20 }}>
                  <Text style={{ color: textColor }}>{t("settings.no_login_history") || "No login history available."}</Text>
                </View>
              ) : (
                loginHistory.map((entry, idx) => (
                  <View key={idx} style={[styles.historyItem, { borderColor: isChocoMode ? "rgba(245,245,240,0.06)" : "#eee" }]}>
                    <Text style={{ color: textColor, fontWeight: "600" }}>{formatEntry(entry)}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE MODAL */}
      <Modal visible={languageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isChocoMode ? "#4B2E2E" : "#fff" }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t("settings.language")}</Text>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("en")}>
              <Text style={[styles.modalButtonText, { color: textColor }]}>English</Text>
            </Pressable>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("fil")}>
              <Text style={[styles.modalButtonText, { color: textColor }]}>Filipino</Text>
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={() => setLanguageModal(false)}>
              <Text style={[styles.modalCancelText, { color: isChocoMode ? "#F5F5F0" : "red" }]}>{t("settings.cancel")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#8B5E3C",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  scroll: { paddingVertical: 20 },
  option: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  iconText: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 280, borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  modalButton: { width: "100%", paddingVertical: 12, backgroundColor: "#f2f2f2", borderRadius: 12, marginBottom: 10 },
  modalButtonText: { textAlign: "center", fontSize: 16 },
  modalCancel: { marginTop: 5 },
  modalCancelText: { fontSize: 14 },

  // history modal
  historyModalBox: {
    width: "90%",
    maxWidth: 720,
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
  },
  historyHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyItem: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
});