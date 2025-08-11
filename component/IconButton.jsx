import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { themes } from './../theme/Themes';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';


const IconButton = ({ navigation, navScreen, icon, id, onAction }) => {

    //theme - color
    const secondaryColor = themes.colorTheme.secondary.color

    //icon size
    const btnIconSize = 30
    const btnColor = "red"


    return (
        <View>
            {
                icon === "Edit" ? (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(navScreen, { id: id })
                        }}
                    >
                        <FontAwesome style={[styles.icon, { marginRight: 30 }]} name="pencil" size={btnIconSize} color={btnColor} />
                    </TouchableOpacity>

                ) : icon === "Edit2" ? ( //change icon color for custom table row 
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(navScreen, { id: id })
                        }}
                    >
                        <FontAwesome style={[styles.icon, { marginRight: 20 }]} name="pencil" size={btnIconSize} color={secondaryColor} />
                    </TouchableOpacity>

                ) : icon === "Add" ? (
                    <TouchableOpacity
                        onPress={() => {
                            onAction()
                        }}
                    >
                        <Foundation style={styles.icon} name="page-add" size={btnIconSize} color={btnColor} />
                    </TouchableOpacity>

                ) : icon === "Delete" ? (
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                "Emin Misin!",
                                "Silmek istediğinizden emin misiniz?",
                                [
                                    { text: "Hayır", style: "cancel" },
                                    {
                                        text: "Evet",
                                        onPress: () => {
                                            onAction()
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "Pano", params: { isDeletePopup: true } }]
                                            });
                                        },
                                    },
                                ]
                            );
                        }}
                    >
                        <MaterialIcons name="delete-forever" size={35} color={btnColor} style={{ marginRight: 20 }} />
                    </TouchableOpacity>

                ) : icon === "Log" ? (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(navScreen, { id: id })
                        }}
                    >
                        <Octicons name='log' size={27} color={btnColor} style={{ marginRight: 20 }} />
                    </TouchableOpacity>

                ) : icon === "Add-Log" ? (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(navScreen, { id: id })
                        }}
                    >
                        <Entypo name="squared-plus" size={35} color={btnColor} style={{ marginRight: 25 }} />
                    </TouchableOpacity>

                ) : null
            }

        </View >
    )
}

export default IconButton

const styles = StyleSheet.create({
    icon: {
        marginRight: 30,
        //shadow
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    }
})
