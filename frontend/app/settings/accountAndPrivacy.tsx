import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, User, Mail, Lock } from "lucide-react-native";

export default function AccountAndPrivacy() {
  const router = useRouter();

  const options = [
    { title: "Change Name", icon: User, onPress: () => alert("Change Name clicked!") },
    { title: "Change Email", icon: Mail, onPress: () => alert("Change Email clicked!") },
    { title: "Change Password", icon: Lock, onPress: () => alert("Change Password feature coming soon!") },
  ];  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color="#F5F5F0" size={25} />
        </Pressable>
        <Text style={styles.headerTitle}>Account & Privacy</Text>
        <View style={{ width: 25 }}></View> {/* Spacer for alignment */}
      </View>

      {/* Options */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {options.map((item, index) => {
          console.log('Render', item.title)
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
