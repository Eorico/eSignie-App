import { StyleSheet } from "react-native";

export const Profilestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9cfa3ff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#f7f4f0ff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B6771D",
    overflow: "hidden",
  },
  imageContainer: {
  position: "relative",
  },

  addIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#B6771D",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#ffd8a2ff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#B6771D",
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#7a4a06ff",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#967039ff",
  },
  statLabel: {
    fontSize: 14,
    color: "#7a4a06ff",
  },
  divider: {
    height: 1.2,
    backgroundColor: "#8c5a1cff",
    width: "100%",
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderBottomColor: "#000000ff",
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 18,
    color: "#f5d9b2ff",
    marginLeft: 12,
    fontWeight: "500",
  },
  menuSection: {
  width: "100%",
  marginTop: 10,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c17a37ff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#8c5a1cff", 
  },

  logoutCard: {
    backgroundColor: "#9A3F3F",
    borderColor: "#9A3F3F",
    shadowColor: "#9A3F3F",
    shadowOpacity: 0.3,
    borderRadius: 30
  },
});
