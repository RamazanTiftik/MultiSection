import { BackHandler, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';
import IconButton from '../../../component/IconButton';
import Input from '../../../component/Input';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserNote } from '../../../redux/slices/UserNoteSlice';


const UserNoteScreen = ({ navigation }) => {

    //theme
    const secondaryColor = themes.colorTheme.secondary.color

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);

    // Local text states
    const [noteText, setNoteText] = useState("");
    const [hasNoteTextError, setHasNoteTextError] = useState(false);

    //redux
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();
    const userNotes = useSelector((state) => state.userNote.userNotes) || [];


    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "MyProfile" }]
        });
        return true;
    };

    //back button listener
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove()
    }, [])

    //Back Button and Header Options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitleStyle: {
                color: "#007AFF",
                fontSize: 18,
            },
            headerTitle: "Kişisel Notlarım",
            headerLeft: () => (
                <TouchableOpacity onPress={() => backAction()}>
                    <CustomIcons icon={"Back"} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: secondaryColor,
            },
        });
    }, [navigation]);


    //add user note handle 
    const addNoteHandle = () => {
        setModalVisible(true);
    }

    //Add User Note Button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => addNoteHandle()}>
                    <CustomIcons icon={"Add"} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    //Save Note Function
    const saveNote = () => {
        console.log("Kaydedilen not:", noteText);
        dispatch(saveUserNote({ userId: userId, content: noteText }))
        setNoteText("")
        setModalVisible(false)
    };

    //Cancel Note Function
    const cancelNote = () => {
        setModalVisible(false)
        setNoteText("")
    }


    //Input Update Function
    function updateInput(inputType, enteredValue) {
        switch (inputType) {
            case 'noteText':
                setNoteText(enteredValue);
                if (enteredValue.trim() !== "") setHasNoteTextError(false);
                break;

        }
    }


    //VIEW
    return (
        <CustomContainer>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Not Ekle</Text>
                        <Input
                            label={"Notunuzu yazınız"}
                            onUpdateValue={updateInput.bind(this, "noteText")}
                            value={noteText}
                            hasError={hasNoteTextError}
                            maxLength={500}
                            width={320}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={cancelNote}>
                                <Text style={styles.cancelButton}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveNote}>
                                <Text style={styles.saveButton}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CustomContainer>

    )
}

export default UserNoteScreen

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        minHeight: 80,
        textAlignVertical: 'top'
    },
    cancelButton: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    saveButton: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    }
})