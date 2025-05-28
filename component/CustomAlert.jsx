import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

const CustomAlert = ({
    visible,
    message,
    onConfirm,
    onCancel,
    confirmText = "Evet",
    cancelText = "Hayır"
}) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.alertContainer}>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    alertContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "#F28B82", 
        borderRadius: 10,
        alignItems: "center"
    },
    message: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        marginBottom: 25
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: "center"
    },
    confirmButton: {
        backgroundColor: "white"
    },
    confirmText: {
        color: "#F28B82",
        fontWeight: "bold",
        fontSize: 16
    },
    cancelButton: {
        backgroundColor: "rgba(255,255,255,0.3)"
    },
    cancelText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16
    }
});
