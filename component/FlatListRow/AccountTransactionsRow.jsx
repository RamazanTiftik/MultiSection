import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomIcons from '../CustomIcons'
import TextView from '../TextView'
import { themes } from '../../theme/Themes'

const AccountTransactionsRow = ({ title, date, amount, type }) => {

    //theme
    const text = themes.textTheme.text

    return (
        <View style={styles.rowContainer}>
            <View style={styles.leftSide}>
                <CustomIcons icon={"Bank"} />
                <View>
                    <TextView label={"Maaş"} textStyle={text} />
                    <TextView label={"01.03.20025"} textStyle={text} />
                </View>
            </View>
            <View style={styles.rightSide}>
                <TextView label={"400$"} textStyle={text} />
            </View>
        </View>
    )
}

export default AccountTransactionsRow

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        marginVertical: 5
    },
    leftSide: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rightSide: {

    }
})