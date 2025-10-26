import { StyleSheet } from "react-native";

export const CreatedAgreementstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 32,
  },

  loadingText: {
    fontSize: 16,
    color: "#9CA3AF",
  },

  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  headerButton: {
    padding: 8,
    marginRight: 10,
  },

  header: {
    marginBottom: 26,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 12,
    letterSpacing: 0.3,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  termsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  termsText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },

  partyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  partyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  partyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },

  signedText: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "600",
  },

  partyInfo: {
    marginBottom: 10,
  },

  partyLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 3,
  },

  partyValue: {
    fontSize: 14,
    color: "#111827",
  },

  signatureContainer: {
    marginTop: 8,
  },

  signatureImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },

  signedDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  signButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9a3f3fd6",
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    marginTop: 8,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  signButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9A3F3F",
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
