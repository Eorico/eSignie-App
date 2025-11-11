import { StyleSheet } from "react-native";

export const CreateAgreementstyles = StyleSheet.create({
  container: {
    backgroundColor: '#f9cfa3ff',
  },
  content: {
    padding: 15,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 25,
    paddingTop: 60,
    backgroundColor: '#632402ff',  
    borderBottomWidth: 1,
    borderBottomColor: '#63240255', 
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 25
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F5F5F0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,

  },

  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 200,
    paddingTop: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#632402ff',
    textAlign: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: '#632402ff',
    marginVertical: 24,
  },
  partySectionWrapper: {
    flexGrow: 1,
    marginTop: 10,
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
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 1,
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