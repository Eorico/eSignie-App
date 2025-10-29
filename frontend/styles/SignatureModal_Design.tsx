import { StyleSheet } from "react-native";

export const SignatureModalstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffbe78ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3e1e02ff',
  },
  subtitle: {
    fontSize: 14,
    color: '#3e1e02ff',
    padding: 16,
    paddingTop: 8,
  },
  canvasContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    margin: 16,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    backgroundColor: '#cd7126ff',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 25,
    backgroundColor: '#cd7126ff',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#cd7126ff',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
