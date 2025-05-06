import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    View,
} from 'react-native';
import { themes } from '../theme/Themes';

const CustomContainer = ({ children }) => {

    //themes
    const conPaddingHorizontal = themes.staticCss.container.paddingHorizontal


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.container, { paddingHorizontal: conPaddingHorizontal }]}>
                        {children}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CustomContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
});
