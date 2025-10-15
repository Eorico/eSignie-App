import { StyleSheet } from "react-native";

export const CreateAgreementstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#292a2bff',
    marginVertical: 24,
  },
  partySection: {
    marginBottom: 20,
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
    color: '#6b7280',
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
    color: '#6b7280',
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