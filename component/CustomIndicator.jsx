import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';


const CustomIndicator = ({ visible }) => {
    return (
        <Modal transparent={true} animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator animating={true} size={"large"} theme={{ colors: { primary: 'green' } }} />
                </View>
            </View>
        </Modal>
    );
};

export default CustomIndicator;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
/*     container: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    }, */
});
