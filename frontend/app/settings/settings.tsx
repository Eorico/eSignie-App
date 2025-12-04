import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Modal, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Shield, Trash2, Globe, Bell, History } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";  
import { useTranslation } from "react-i18next";    
import i18n from "@/lib/language";    

const THEME_KEY = "@theme_mode";

export default function SettingsScreen() {  
  const router = useRouter();
  const { t } = useTranslation();
  const AGREEMENTS_KEY = '@agreements';

  // Theme Mode
  const [isChocoMode, setIsChocoMode] = useState(false); // default: Cream
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = Cream, 1 = Choco

  // Load theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "choco") {
          setIsChocoMode(true);
          slideAnim.setValue(1);
        } else {
          setIsChocoMode(false);
          slideAnim.setValue(0);
        }
      } catch (e) {
        console.log("Error loading theme:", e);
      }
    };
    loadTheme();
  }, []);

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

  // Language Modal
  const [languageModal, setLanguageModal] = useState(false);
  const [, forceUpdate] = useState(false);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => forceUpdate(prev => !prev));
    setLanguageModal(false);
  };

  const clearAppStorage = () => {
    Alert.alert(
      t('settings.clear_storage_alert_title'),
      t('settings.clear_storage_alert_message'),
      [
        { text: t('settings.cancel'), style: "cancel" },
        {
          text: t('settings.clear'),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(AGREEMENTS_KEY);
              Alert.alert(t('settings.storage_clear_title'), t('settings.storage_clear_message'));
            } catch (error) {
              Alert.alert(t('settings.error'), t('settings.error_message'));
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    { title: t('settings.account_privacy'), icon: Shield, onPress: () => router.push("/settings/accountAndPrivacy") },
    { title: t('settings.language'), icon: Globe, onPress: () => setLanguageModal(true) },
    { title: t('settings.notification'), icon: Bell },
    { title: t('settings.login_history'), icon: History },
    { title: t('settings.clear_storage'), icon: Trash2, onPress: clearAppStorage },
  ];

  const textColor = isChocoMode ? "#F5F5F0" : "#333";
  const iconColor = isChocoMode ? "#F5F5F0" : "#8B5E3C";

  return (
    <View style={[styles.container, { backgroundColor: isChocoMode ? '#8B5E3C' : '#f9cfa3ff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/+tabs/Profile')}>
          <ArrowLeft color={textColor} size={25} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>{t('settings.title')}</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Theme Toggle */}
      <View style={styles.option}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.optionText, { color: textColor }]}>
            {isChocoMode ? "Switch to Cream Mode" : "Switch to Choco Mode"}
          </Text>
          <Pressable 
            onPress={toggleMode}
            style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              backgroundColor: isChocoMode ? '#4B2E2E' : '#f2f2f2',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Animated.View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#fff',
                transform: [{
                  translateX: slideAnim.interpolate({
                    inputRange: [0,1],
                    outputRange: [0, 22]
                  })
                }],
              }}
            />
          </Pressable>
        </View>
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {settingsOptions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Pressable key={index} style={styles.option} onPress={item.onPress ?? (()=> {})}>
              <View style={styles.iconText}>
                <Icon color={iconColor} size={22} style={{ marginRight: 15 }} />
                <Text style={[styles.optionText, { color: textColor }]}>{item.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* LANGUAGE MODAL */}
      <Modal visible={languageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isChocoMode ? '#4B2E2E' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t('settings.language')}</Text>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("en")}>
              <Text style={[styles.modalButtonText, { color: textColor }]}>English</Text>
            </Pressable>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("fil")}>
              <Text style={[styles.modalButtonText, { color: textColor }]}>Filipino</Text>
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={() => setLanguageModal(false)}>
              <Text style={[styles.modalCancelText, { color: isChocoMode ? '#F5F5F0' : 'red' }]}>{t('settings.cancel')}</Text>
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
});
