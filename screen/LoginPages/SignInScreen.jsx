import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { themes } from '../../theme/Themes'
import CustomContainer from '../../component/CustomContainer'
import Input from '../../component/Input'
import TextView from '../../component/TextView'
import CustomIcons from '../../component/CustomIcons'
import CustomButton from '../../component/CustomButton'

const SignInScreen = ({ navigation }) => {

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
  const signInBtnHandle = () => {

    if (!email) {
      setHasEmailError(true)
      return
    } else if (!password) {
      setHasPasswordError(true)
      return

    } else {
      console.log(email)
    }

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

      {/* Sign Up Button */}
      <View style={styles.btn}>
        <CustomButton btnTitle={"Giriş Yap"} onPressAction={signInBtnHandle} />
      </View>

    </CustomContainer>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  btn: {
    marginTop: 30
  },
  staticText: {
    marginBottom: 15
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 30
  }
})