import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { themes } from '../../theme/Themes'
import CustomContainer from '../../component/CustomContainer'
import Input from '../../component/Input'
import TextView from '../../component/TextView'
import CustomIcons from '../../component/CustomIcons'
import CustomButton from '../../component/CustomButton'
import { useDispatch } from 'react-redux'
import { autoSignInHandle, loginHandle } from '../../redux/slices/AuthSlice'
import CustomIndicator from '../../component/CustomIndicator'


const SignInScreen = ({ navigation, onLogin }) => {

  //theme
  const text = themes.textTheme.text
  const card = themes.card.cardView

  //email & password
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //email error state
  const [hasEmailError, setHasEmailError] = useState(false);
  const [hasPasswordError, setHasPasswordError] = useState(false)

  //redux
  const dispatch = useDispatch()

  //loading state
  const [loading, setLoading] = useState(false)


  //useEffect to check if user is already logged id
  useEffect(() => {
    dispatch(autoSignInHandle());
  }, [dispatch]);


  //useEffect to reset email and password
  useEffect(() => {
    setEmail("")
    setPassword("")
  }, [])

  //SignUp button handle
  const signInBtnHandle = async () => {
    //inputs empty
    if (!email && !password) {
      if (!email) {
        setHasEmailError(true)
      }
      if (!password) {
        setHasPasswordError(true)
      }

    } else {
      //user login is successful
      setLoading(true)
      try {
        dispatch(loginHandle({ email, password }))
        setLoading(false);

      } catch (error) {
        setLoading(false)
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
    navigation.navigate("Reset Password")
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
  if (loading) {
    <View>
      <CustomIndicator />
    </View>
  } else {
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
    marginTop: 30
  },
  registerText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 30,
    marginTop: 30,
    color: "#007AFF"
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontWeight: "500",
  }
})