import { StyleSheet } from "react-native";

export const Profilestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#432607ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffffff",
    marginBottom: 20,
  },
  label: {
    color: "#ffffffff",
    fontSize: 16,
  },
  email: {
    color: "#ffd8a2ff",
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
