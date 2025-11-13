import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Moon, Shield, Trash2, Globe, Bell, History } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const router = useRouter();
  const AGREEMENTS_KEY = '@agreements';
  const { t } = useTranslation();

  // ✅ Clear Storage function
  const clearAppStorage = () => {
    Alert.alert(
      t('clear_storage_alert_title'),
      "This will delete all locally saved data. You can’t undo this action.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(AGREEMENTS_KEY);
              Alert.alert("Storage Cleared", "All data has been removed.");
            } catch (error) {
              Alert.alert("Error", "Something went wrong while clearing storage.");
            }
          },
        },
      ]
    );
  };

  // ✅ Simplified settings options
  const settingsOptions = [
    { title: "Dark Mode / Light Mode", icon: Moon },
    { title: "Account & Privacy", icon: Shield, onPress: () => router.push("./accountAndPrivacy") },
    { title: "Language", icon: Globe}, //nikki: lalagyan ng onpress na maglalabas ng popup na may options ng fil o eng
    { title: "Notification Permission", icon: Bell },
    { title: "Login History", icon: History },
    { title: "Clear Storage", icon: Trash2, onPress: clearAppStorage }, // ✅ only one clear storage
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/+tabs/Profile')}>
          <ArrowLeft color="#F5F5F0" size={25} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 25 }}></View>
      </View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {settingsOptions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={index}
              style={styles.option}
              onPress={item.onPress} // ✅ works for both navigations and alerts
            >
              <View style={styles.iconText}>
                <Icon color="#8B5E3C" size={22} style={{ marginRight: 15 }} />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9cfa3ff",
  },
  header: {
    backgroundColor: "#8B5E3C",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#F5F5F0",
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
    borderBottomColor: "#eee",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
