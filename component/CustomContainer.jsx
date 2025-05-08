import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    View,
} from 'react-native';
import { themes } from '../theme/Themes';
import { SafeAreaView } from 'react-native-safe-area-context';


const CustomContainer = ({ children }) => {

    //themes
    const conPaddingHorizontal = themes.staticCss.container.paddingHorizontal
    const secondaryColor = themes.colorTheme.secondary.color


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <SafeAreaView style={[styles.container, { paddingHorizontal: conPaddingHorizontal, backgroundColor: secondaryColor }]}>
                        {children}
                    </SafeAreaView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CustomContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
});
