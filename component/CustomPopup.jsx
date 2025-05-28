import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomPopup = ({ visible, message, onClose, type }) => {
    const buttonColor = type === "error" ? "#F28B82" : "#5CB338"; // soft kırmızı vs yeşil

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonColor }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CustomPopup;
