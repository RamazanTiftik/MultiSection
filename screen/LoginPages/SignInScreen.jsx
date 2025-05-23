import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { themes } from '../../theme/Themes'
import CustomContainer from '../../component/CustomContainer'
import Input from '../../component/Input'
import TextView from '../../component/TextView'
import CustomIcons from '../../component/CustomIcons'
import CustomButton from '../../component/CustomButton'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { auth } from '../../firebaseConfig/Firebase';


/* const firebaseConfig = {
  apiKey: "AIzaSyBIsIgoXlK2DkJ7iPtINbTLpD75kgparX0",
  authDomain: "walletapp-ce690.firebaseapp.com",
  projectId: "walletapp-ce690",
  storageBucket: "walletapp-ce690.appspot.com",
  messagingSenderId: "342743455734",
  appId: "1:342743455734:web:d8a18dbacb5526dd6d59d7",
  measurementId: "G-HVPW4N99PW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); */


const SignInScreen = ({ navigation, onLogin }) => {

  //theme
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const loadingContainer = themes.loading.loadingContainer

  //email & password
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //email error state
  const [hasEmailError, setHasEmailError] = useState(false);
  const [hasPasswordError, setHasPasswordError] = useState(false)


  //SignUp button handle
  const signInBtnHandle = async () => {

    if (!email && !password) {
      if (!email) {
        setHasEmailError(true)
      }
      if (!password) {
        setHasPasswordError(true)
      }

    } else {
      //user login is successful
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin()

      } catch (error) {
        //user login is failed
        Alert.alert('Hata', 'Giriş başarısız. Bilgilerinizi kontrol edin.');
      }
    }
  }

  //register button handle
  const registerHandle = () => {
    navigation.navigate("SignUp")
  }

  //forgot password handle
  const forgotPasswordHandle = () => {
    console.log("234")

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
        if (enteredValue.trim() !== "") setHasPasswordError(false);
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

          <TouchableOpacity
            onPress={forgotPasswordHandle}
            style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: 10, marginRight: 10 }}
          >
            <TextView label={"Şifremi Unuttum"} textStyle={styles.forgotPasswordText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up Button */}
      <View style={styles.btn}>
        <CustomButton btnTitle={"Giriş Yap"} onPressAction={signInBtnHandle} />
      </View>

      <TouchableOpacity
        onPress={registerHandle}
      >
        <Text style={styles.registerText}>Hesabınız Yok Mu?</Text>
      </TouchableOpacity>

    </CustomContainer>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  btn: {
    marginTop: 25
  },
  staticText: {
    marginBottom: 15
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 150,
    marginBottom: 30,
  },
  registerText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 30,
    marginTop: 20,
    color: "blue"
  },
  forgotPasswordText: {
    color: "blue",
    fontWeight: "500",
  }
})