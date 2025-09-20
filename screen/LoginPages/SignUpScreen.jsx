import { Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextView from '../../component/TextView'
import Input from '../../component/Input'
import CustomIcons from '../../component/CustomIcons'
import { themes } from '../../theme/Themes'
import CustomButton from '../../component/CustomButton'
import CustomContainer from '../../component/CustomContainer'
import { useDispatch } from 'react-redux'
import { auth } from '../../firebaseConfig/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, updateDoc, addDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig/Firebase';
import CustomPopup from '../../component/CustomPopup'


const SignUpScreen = ({ navigation }) => {

    //theme
    const text = themes.textTheme.text
    const card = themes.card.cardView
    const loadingContainer = themes.loading.loadingContainer

    //email & password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    //email error state
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false)
    const [hasConfirmPasswordError, setConfirmHasPasswordError] = useState(false)

    //popup
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("")
    const [type, setType] = useState("success")


    //Back Button Func
    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }]
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

    //Back Button
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => backAction()}>
                    <CustomIcons icon={"Back"} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    //SignUp button handle
    const signUpBtnHandle = async () => {
        //inputs empty
        if (!email && !password && !confirmPassword) {
            if (!email) {
                setHasEmailError(true)
            }
            if (!password) {
                setHasPasswordError(true)
            }
            if (!confirmPassword) {
                setConfirmHasPasswordError(true)
            }

        } else {
            //user sign up is successful
            try {
                //sign up -> authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                //save user to firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    createdAt: new Date(),
                });

                //show popup message
                setPopupMessage("Başarıyla kaydınız oluşturulmuştur.")
                setPopupVisible(true)

            } catch (error) {
                //user sign up is failed
                setPopupMessage('Kayıt olma işlemi başarısız. Bilgilerinizi kontrol edin.')
                setType("error")
                setPopupVisible(true)
            }
        }
    }


    //popup close handle
    const popupCloseHandle = () => {
        setPopupMessage("")
        setPopupVisible(false)
        navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }]
        })
    }


    //Input fields
    function updateInput(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEmail(enteredValue);
                if (enteredValue.trim() !== "") setHasEmailError(false);
                break;

            case 'password':
                setPassword(enteredValue);
                if (enteredValue.trim() !== "") setHasEmailError(false);
                break;

            case 'confirmPassword':
                setConfirmPassword(enteredValue);
                if (enteredValue.trim() !== "") setConfirmHasPasswordError(false);
                break;
        }
    }


    //VIEW
    return (
        <CustomContainer>

            <View>
                <Image source={require('../../assets/walletLogo.jpg')} style={styles.logo} />
            </View>

            <View style={styles.staticText}>
                <TextView label={"Mail adresinizi ve şifrenizi girerek sisteme kayıt olabilirsiniz."} />
            </View>

            {/* E-Posta */}
            <View style={[card, { flexDirection: "row", paddingRight: 55 }]}>
                <CustomIcons icon={"Mail"} />
                <View style={styles.inputContainer}>
                    <TextView label={"E-Posta:"} textStyle={text} />
                    <Input
                        keyboardType="email-address"
                        onUpdateValue={updateInput.bind(this, 'email')}
                        value={email}
                        label={"E-Postanızı girin"}
                        hasError={hasEmailError}
                    />
                </View>
            </View>

            {/* Password */}
            <View style={[card, { flexDirection: "row", paddingRight: 55 }]}>
                <CustomIcons icon={"Password"} />
                <View style={styles.inputContainer}>
                    <TextView label={"Şifre:"} textStyle={text} />
                    <Input
                        secure
                        onUpdateValue={updateInput.bind(this, 'password')}
                        value={password}
                        label={"Şifrenizi girin"}
                        hasError={hasPasswordError}
                    />
                </View>
            </View>

            {/* Confirm Password */}
            <View style={[card, { flexDirection: "row", paddingRight: 55 }]}>
                <CustomIcons icon={"Password"} />
                <View style={styles.inputContainer}>
                    <TextView label={"Şifre:"} textStyle={text} />
                    <Input
                        secure
                        onUpdateValue={updateInput.bind(this, 'confirmPassword')}
                        value={confirmPassword}
                        label={"Şifrenizi tekrar girin"}
                        hasError={hasConfirmPasswordError}
                    />
                </View>
            </View>


            {/* Custom Pop-up */}
            <CustomPopup visible={popupVisible} message={popupMessage} onClose={popupCloseHandle} type={type} />

            {/* Sign Up Button */}
            <View style={styles.btn}>
                <CustomButton btnTitle={"Kayıt Ol"} onPressAction={signUpBtnHandle} />
            </View>

        </CustomContainer>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    btn: {
        marginTop: 30
    },
    staticText: {
        marginBottom: 15
    },
    logo: {
        width: 130,
        height: 130,
        borderRadius: 150,
        marginBottom: 30,
        marginTop: 30
    },
})