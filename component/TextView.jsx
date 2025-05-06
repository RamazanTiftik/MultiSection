import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TextView = ({ label, textStyle, isBold }) => {
    return (

        <View>
            {isBold ? (
                <Text style={[textStyle, { fontWeight: "bold" }]}>{label}</Text>
            ) : (
                <Text style={[textStyle]}>{label}</Text>
            )}
        </View>

    )
}

export default TextView

const styles = StyleSheet.create({})