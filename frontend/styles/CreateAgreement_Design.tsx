import { StyleSheet } from "react-native";

export const CreateAgreementstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9cfa3ff',
  },
  content: {
    padding: 15,
    paddingBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#632402ff',
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  titleAndterms: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#632402ff',
  },
  divider: {
    height: 1,
    backgroundColor: '#632402ff',
    marginVertical: 24,
  },
  partySectionWrapper: {
    height: 280,
  },
  partySection: {
    marginBottom: 0,
    flexGrow: 0,
    maxHeight: 350,
    overflow: 'hidden',
  },
  partyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  partyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#632402ff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#632402ff',
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#9A3F3F',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});