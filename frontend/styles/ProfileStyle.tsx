import { StyleSheet } from "react-native";

export const Profilestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37353E",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F5F5F0",
    marginBottom: 20,
  },
  label: {
    color: "#E0E0E0",
    fontSize: 16,
  },
  email: {
    color: "#B6771D",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#B6771D",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
