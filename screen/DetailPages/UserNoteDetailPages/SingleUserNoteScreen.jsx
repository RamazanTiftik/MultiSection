import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomIcons from '../../../component/CustomIcons';
import CustomContainer from '../../../component/CustomContainer';
import CustomAlert from '../../../component/CustomAlert';
import { themes } from '../../../theme/Themes';
import CustomPopup from '../../../component/CustomPopup';
import { deleteNoteById, getNoteById } from '../../../redux/slices/UserNoteSlice';
import TextView from '../../../component/TextView';
import Input from '../../../component/Input';

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
    console.log(content, 3
    )
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
                color: "#007AFF",
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


    //VIEW
    return (
        <CustomContainer>

            {/* Note Text */}
            <Input label={content} />


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

        </CustomContainer>
    )
}

export default SingleUserNoteScreen

const styles = StyleSheet.create({})