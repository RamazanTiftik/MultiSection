import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
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
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 10, backgroundColor: "#e5e5e5" }}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    contentInsetAdjustmentBehavior="never"
                    overScrollMode="never" // Android için
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
