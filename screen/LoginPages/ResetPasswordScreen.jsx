import { Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextView from '../../component/TextView'
import Input from '../../component/Input'
import CustomIcons from '../../component/CustomIcons'
import { themes } from '../../theme/Themes'
import CustomButton from '../../component/CustomButton'
import CustomContainer from '../../component/CustomContainer'
import { auth } from '../../firebaseConfig/Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import CustomPopup from '../../component/CustomPopup'


const ResetPasswordScreen = ({ navigation }) => {

  //theme
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const loadingContainer = themes.loading.loadingContainer

  //email & password
  const [email, setEmail] = useState("")

  //email error state
  const [hasEmailError, setHasEmailError] = useState(false);

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
  const resetPasswordBtnHandle = async () => {
    //inputs empty
    if (!email) {
      if (!email) {
        setHasEmailError(true)
      }

    } else {
      //reset user password
      try {
        await sendPasswordResetEmail(auth, email);
        //show popup message
        setPopupMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.")
        setPopupVisible(true)

      } catch (error) {
        setPopupMessage("Şifre sıfırlama işlemi başarısız oldu. E-posta adresini kontrol edin.")
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

    }
  }


  //VIEW
  return (
    <CustomContainer>

      <View>
        <Image source={require('../../assets/walletLogo.jpg')} style={styles.logo} />
      </View>

      <View style={styles.staticText}>
        <TextView label={"Mail adresinizi girerek, mail adresinize şifre yenileme bağlantısı gönderebilirsiniz."} />
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


      {/* Custom Pop-up */}
      <CustomPopup visible={popupVisible} message={popupMessage} onClose={popupCloseHandle} type={type} />

      {/* Sign Up Button */}
      <View style={styles.btn}>
        <CustomButton btnTitle={"Gönder"} onPressAction={resetPasswordBtnHandle} />
      </View>

    </CustomContainer>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
  btn: {
    marginTop: 30,
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