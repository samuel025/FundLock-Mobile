import React from "react";
import { Modal, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from "react-native";

export function VirtualAccountModal({
  visible,
  onClose,
  virtualAccount,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  virtualAccount: { accountNumber: string; bank: string } | null;
  onCreate: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Virtual Account</Text>
            {virtualAccount ? (
              <>
                <Text style={{ fontFamily: "Poppins_500Medium", color: "#1B263B", marginBottom: 8 }}>{virtualAccount.bank}</Text>
                <Text style={{ fontFamily: "Poppins_400Regular", color: "#415A77", marginBottom: 12 }}>Account number: {virtualAccount.accountNumber}</Text>
                <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => { onClose(); }}>
                  <Text style={styles.modalButtonTextPrimary}>Copy / Use</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ fontFamily: "Poppins_400Regular", color: "#415A77", marginBottom: 12 }}>No virtual account yet. Create one to receive deposits.</Text>
                <TouchableOpacity style={styles.modalButtonPrimary} onPress={onCreate}>
                  <Text style={styles.modalButtonTextPrimary}>Create Virtual Account</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={{ marginTop: 12 }} onPress={onClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontFamily: "Poppins_600SemiBold", fontSize: 16, marginBottom: 12 },
  modalButtonPrimary: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: "#38B2AC", alignItems: "center", justifyContent: "center" },
  modalButtonTextPrimary: { fontFamily: "Poppins_600SemiBold", color: "#fff" },
  modalCloseText: { color: "#38B2AC", fontFamily: "Poppins_600SemiBold", textAlign: "center", marginTop: 8 },
});