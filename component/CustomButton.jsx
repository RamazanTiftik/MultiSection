import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { themes } from '../theme/Themes'


const CustomButton = ({ btnTitle, onPressAction }) => {

    //theme
    const btnText = themes.textTheme.btnText
    const secondaryColor = themes.colorTheme.secondary.color

    return (
        <View style={styles.btnContainer}>
            <TouchableOpacity
                style={[styles.btn, { backgroundColor: secondaryColor }]}
                onPress={onPressAction}
            >
                <Text style={[btnText, styles.btnText]}>{btnTitle}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    btn: {
        borderRadius: 15,
        width: 175,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        color: "#444444",
        fontSize: 18,
        fontWeight: "600",
        color: "#007AFF"
    }
})