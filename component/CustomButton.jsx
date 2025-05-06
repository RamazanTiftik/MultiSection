import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { themes } from '../theme/Themes'

const CustomButton = ({ btnTitle, onPressAction }) => {

    //theme
    const btnText = themes.textTheme.btnText
    const secondaryColor = themes.colorTheme.secondary.color

    return (
        <View style={styles.btnContainer}>
            <TouchableOpacity
                style={[styles.btn, {backgroundColor: secondaryColor}]}
                onPress={onPressAction}
            >
                <Text style={btnText}>{btnTitle}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    btn: {
        borderRadius: 7,
        width: 150,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    btnText: {
        color: "white"
    }
})