import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message';

export const showCustomToast = (type, title, message) => {
    Toast.show({
        type: type, // 'success' | 'error' | 'info'
        text1: title,
        text2: message,
        position: 'top',
    });
};

const styles = StyleSheet.create({})