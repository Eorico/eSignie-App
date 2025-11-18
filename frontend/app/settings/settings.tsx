import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Moon, Shield, Trash2, Globe, Bell, History } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/language";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const AGREEMENTS_KEY = '@agreements';

  const [languageModal, setLanguageModal] = useState(false);

  // Force re-render when language changes
  const [, forceUpdate] = React.useState(false);
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
    { title: t('settings.dark_mode'), icon: Moon },
    { title: t('settings.account_privacy'), icon: Shield, onPress: () => router.push("./accountAndPrivacy") },
    { title: t('settings.language'), icon: Globe, onPress: () => setLanguageModal(true) },
    { title: t('settings.notification'), icon: Bell },
    { title: t('settings.login_history'), icon: History },
    { title: t('settings.clear_storage'), icon: Trash2, onPress: clearAppStorage },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/+tabs/Profile')}>
          <ArrowLeft color="#F5F5F0" size={25} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {settingsOptions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Pressable key={index} style={styles.option} onPress={item.onPress}>
              <View style={styles.iconText}>
                <Icon color="#8B5E3C" size={22} style={{ marginRight: 15 }} />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* LANGUAGE MODAL */}
      <Modal visible={languageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('settings.language')}</Text>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("en")}>
              <Text style={styles.modalButtonText}>English</Text>
            </Pressable>

            <Pressable style={styles.modalButton} onPress={() => changeLanguage("fil")}>
              <Text style={styles.modalButtonText}>Filipino</Text>
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={() => setLanguageModal(false)}>
              <Text style={styles.modalCancelText}>{t('settings.cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9cfa3ff" },
  header: {
    backgroundColor: "#8B5E3C",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#F5F5F0", fontSize: 20, fontWeight: "600" },
  scroll: { paddingVertical: 20 },
  option: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  iconText: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: 16, color: "#333" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 280, backgroundColor: "white", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  modalButton: { width: "100%", paddingVertical: 12, backgroundColor: "#f2f2f2", borderRadius: 12, marginBottom: 10 },
  modalButtonText: { textAlign: "center", fontSize: 16 },
  modalCancel: { marginTop: 5 },
  modalCancelText: { color: "red", fontSize: 14 },
});
