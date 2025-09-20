import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomIcons from '../../../component/CustomIcons';
import CustomContainer from '../../../component/CustomContainer';
import CustomAlert from '../../../component/CustomAlert';
import { themes } from '../../../theme/Themes';
import CustomPopup from '../../../component/CustomPopup';
import { deleteNoteById, getNoteById, updateNoteById } from '../../../redux/slices/UserNoteSlice';
import Input from '../../../component/Input';
import { LinearGradient } from 'expo-linear-gradient';
import CustomIndicator from '../../../component/CustomIndicator';


const SingleUserNoteScreen = ({ route, navigation }) => {

    //props
    const { noteId } = route.params;

    //theme
    const secondaryColor = themes.colorTheme.secondary.color

    //delete alert visible
    const [showAlert, setShowAlert] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    //redux
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();
    const { content, createdAt } = useSelector((state) => state.userNote.selectedNote)
    //theme - redux
    const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
    const theme = useSelector(state => state.theme.themes[selectedThemeId]);
    //general loading
    const authLoading = useSelector((state) => state.auth.loading)
    const userNoteLoading = useSelector((state) => state.userNote.loading)
    const themeLoading = useSelector((state) => state.theme.loading)
    const generalLoading = authLoading || userNoteLoading || themeLoading

    // Local text states
    const [noteText, setNoteText] = useState(content);
    const [noteCreatedAtText, setNoteCreatedAtText] = useState(createdAt);


    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "User Note" }]
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
                color: theme.text || "#007AFF",
                fontSize: 18,
            },
            headerTitle: "Not Detay",
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


    //Add User Note Button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => showAlertHandle()}>
                    <CustomIcons icon={"Delete"} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    //delete user note handle 
    const deleteNoteHandle = () => {
        dispatch(deleteNoteById({ userId: userId, noteId: noteId }))
        setShowPopup(true)
    }

    //update user note handle
    const saveButtonHandle = () => {
        dispatch(updateNoteById({ userId: userId, noteId: noteId, content: noteText }))
    }

    //delete user note handle 
    const showAlertHandle = () => {
        setShowAlert(true);
    }

    //after delete note, navigate to previous screen
    const navigateHandle = () => {
        backAction()
        setShowPopup(false)
    }


    //get user note datas when screen is focused
    useEffect(() => {
        dispatch(getNoteById({ userId: userId, noteId: noteId }))
    }, [dispatch])

    //set data for ui when screen is focused
    useEffect(() => {
        //set texts
        setNoteText(content)
        setNoteCreatedAtText(createdAt)
    }, [dispatch, content, createdAt])


    //Text update func
    function updateInput(inputType, enteredValue) {
        switch (inputType) {
            case 'noteText':
                setNoteText(enteredValue);
                break;
        }
    }


    //VIEW
    if (generalLoading) {
        return (
            <View>
                <CustomIndicator />
            </View>
        )

    } else {
        return (
            <CustomContainer>

                {/* CreatedAt Text */}
                <Text style={styles.createdAtText}>
                    Oluşturulma: {noteCreatedAtText ? new Date(noteCreatedAtText).toLocaleString('tr-TR') : '—'}
                </Text>


                {/* Note Text */}
                <Input
                    onUpdateValue={updateInput.bind(this, "noteText")}
                    value={noteText}
                    label={"Lütfen notunuzu giriniz"}
                    multiline={true}
                    style={styles.noteInput}
                    maxLength={500}
                />


                {/* Add Button */}
                <View style={[styles.inputCard, { paddingHorizontal: 20, marginTop: 15 }]}>
                    <LinearGradient
                        colors={[theme.income1 || '#f0f0f0', theme.income2 || '#e0e0e0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.addButtonHandle}
                    >
                        <TouchableOpacity
                            style={styles.touchable}
                            onPress={saveButtonHandle}
                        >
                            <Text style={styles.selectedBtnText}>{"Kaydet"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>




                {/* Logout Alert */}
                <CustomAlert
                    visible={showAlert}
                    message="Notu silmek istediğinizden emin misiniz?"
                    onConfirm={() => {
                        deleteNoteHandle()
                        setShowAlert(false);
                    }}
                    onCancel={() => setShowAlert(false)}
                />

                {/* Delete Note Popup */}
                <CustomPopup
                    visible={showPopup}
                    message={"Notunuz başarıyla silinmiştir."}
                    onClose={navigateHandle}
                    type={"Success"}
                />

            </CustomContainer >
        )
    }
}

export default SingleUserNoteScreen

const styles = StyleSheet.create({
    createdAtText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
        textAlign: 'right',
    },
    noteInput: {
        fontSize: 16,
        minHeight: 420,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    touchable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    addButtonHandle: {
        borderRadius: 15,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        marginTop: 20
    },
    selectedBtnText: {
        fontWeight: 600,
        fontSize: 18,
        color: "#000000"
    },
    inputCard: {
        flexDirection: "row",
        marginBottom: 20
    },
})