import { StyleSheet, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { themes } from '../theme/Themes';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import TextView from './TextView';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const CustomIcons = ({ icon }) => {

    //themes - color
    const secondaryColor = themes.colorTheme.primary.color

    //icon size
    const titleIconSize = 20
    const backButtonSize = 25

    return (
        <View>
            {
                icon === "Mail" ? (
                    <Ionicons style={styles.titleIcon} name="mail" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Phone" ? (
                    <FontAwesome style={styles.titleIcon} name="phone" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Tc" ? (
                    <FontAwesome style={styles.titleIcon} name="id-card" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Date" ? (
                    <FontAwesome style={styles.titleIcon} name="calendar" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Blood" ? (
                    <Fontisto style={styles.titleIcon} name="blood-drop" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Department" ? (
                    <FontAwesome6 style={styles.titleIcon} name="building-user" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Tenant" ? (
                    < FontAwesome style={styles.titleIcon} name="building" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Role" ? (
                    <FontAwesome style={styles.titleIcon} name="users" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Username" ? (
                    <FontAwesome style={styles.titleIcon} name="user" size={80} color={secondaryColor} />
                ) : icon === "Password" ? (
                    <MaterialIcons name="password" size={titleIconSize} color={secondaryColor} style={{ marginRight: 5 }} />
                ) : icon === "Task" ? (
                    <FontAwesome5 name="tasks" size={titleIconSize} color={secondaryColor} style={{ marginRight: 5 }} />
                ) : icon === "Description" ? (
                    <Feather name="file-text" size={titleIconSize} color={secondaryColor} style={{ marginRight: 3 }} />
                ) : icon === "Category" ? (
                    <Octicons name='multi-select' size={titleIconSize} color={secondaryColor} style={{ marginRight: 3 }} />
                ) : icon === "Priority" ? (
                    <MaterialIcons name="priority-high" size={titleIconSize} color={secondaryColor} />
                ) : icon === "ResponsibleUser" ? (
                    <FontAwesome6 name="users-line" size={titleIconSize} color={secondaryColor} style={{ marginRight: 3 }} />
                ) : icon === "Document" ? (
                    <Ionicons name="documents" size={titleIconSize} color={secondaryColor} style={{ marginRight: 3 }} />
                ) : icon === "Duration" ? (
                    <AntDesign name="pushpin" size={titleIconSize} color={secondaryColor} style={{ marginRight: 2 }} />
                ) : icon === "Back" ? (
                    <MaterialIcons name="arrow-back-ios-new" size={backButtonSize} color={secondaryColor} style={{ marginLeft: 10, marginRight: 3 }} />
                ) : icon === "Required" ? (
                    <TextView label={"*"} textStyle={styles.required} />
                ) : icon === "Clock" ? (
                    <FontAwesome6 name="clock" size={titleIconSize} color={secondaryColor} style={{ marginRight: 4 }} />
                ) : icon === "Clock-Start" ? (
                    <MaterialCommunityIcons name="clock" size={23} color={secondaryColor} style={{ marginRight: 2 }} />
                ) : icon === "Clock-End" ? (
                    <MaterialCommunityIcons name="clock-alert" size={23} color={secondaryColor} style={{ marginRight: 2 }} />
                ) : icon === "Bank" ? (
                    <FontAwesome name="bank" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Amount" ? (
                    <FontAwesome5 name="money-bill-wave" size={titleIconSize} color={secondaryColor} />
                ) : icon === "Income" ? (
                    <View style={styles.income}>
                        <AntDesign name="arrowup" size={30} color="white" />
                    </View>
                ) : icon === "Outcome" ? (
                    <View style={styles.outcome}>
                        <AntDesign name="arrowdown" size={30} color="white" />
                    </View>
                ) : null
            }
        </View >
    )
}


export default CustomIcons

const styles = StyleSheet.create({
    titleIcon: {
        marginRight: 5,
        //shadow
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    btnIcon: {
        marginRight: 35
    },
    required: {
        fontSize: 16,
        color: "red",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    income: {
        backgroundColor: "#38b000",
        padding: 5,
        borderRadius: 55,
        marginRight: 10
    },
    outcome: {
        backgroundColor: "#d00000",
        padding: 5,
        borderRadius: 55,
        marginRight: 10
    }
})