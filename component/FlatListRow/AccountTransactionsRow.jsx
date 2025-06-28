import { StyleSheet, View } from 'react-native'
import CustomIcons from '../CustomIcons'
import TextView from '../TextView'
import { themes } from '../../theme/Themes'

const AccountTransactionsRow = ({ title, date, amount, type }) => {

    //theme
    const text = themes.textTheme.text

    return (
        <View style={styles.rowContainer}>
            <View style={styles.leftSide}>
                {
                    type === "Gelir" ? (
                        <CustomIcons icon={"Income"} />
                    ) : (
                        <CustomIcons icon={"Outcome"} />
                    )
                }

                <View>
                    {
                        type === "Gelir" ? (
                            <View>
                                <TextView label={title} textStyle={text} />
                                <TextView label={date} textStyle={text} />
                            </View>
                        ) : (
                            <View>
                                <TextView label={title} textStyle={text} />
                                <TextView label={date} textStyle={text} />
                            </View>
                        )
                    }

                </View>
            </View>
            <View style={styles.rightSide}>
                <TextView label={`${amount} ₺`} textStyle={text} />
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