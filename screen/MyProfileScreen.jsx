import { LinearGradient } from 'expo-linear-gradient'
import { Alert, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { themes } from '../theme/Themes'
import CustomContainer from '../component/CustomContainer'
import CustomIcons from '../component/CustomIcons'
import TextView from '../component/TextView'
import Input from '../component/Input'
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig/Firebase';
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/AuthSlice'


const MyProfileScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const tertiaryColor = themes.colorTheme.tertiary.color
  const text = themes.textTheme.text
  const card = themes.card.cardView
  const titleTxt = themes.textTheme.titleTxt
  const profileText = themes.textTheme.profileText

  //change password states
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  //input error state
  const [hasOldPasswordError, setHasOldPasswordError] = useState(false);
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [hasConfirmPasswordError, setHasConfirmPasswordError] = useState(false);

  //redux
  const dispatch = useDispatch()


  useEffect(() => {
    //when screen is focused, clear inputs
    //dispatch ile kontrol edilebilr bu durum
    setOldPassword("")
    setConfirmPassword("")
    setNewPassword("")
  }, [])


  //note button handle
  const noteClickHandle = () => {
    navigation.navigate('ProfileStack', {
      screen: 'User Note',
    });
  }

  //monthly info button handle
  const monthlyClickHandle = () => {
    navigation.navigate('ProfileStack', {
      screen: 'Mouthly Info',
    });
  }

  //notificaiton button handle
  const notificationClickHandle = () => {
    navigation.navigate('ProfileStack', {
      screen: 'Notification',
    });
  }

  //feedback button handle
  const feedbackClickHandle = () => {
    navigation.navigate('ProfileStack', {
      screen: 'FeedBack',
    });
  }

  //logout button handle
  const logoutClickHandle = async () => {
    try {
      await signOut(auth);
      dispatch(logout())

    } catch (error) {
      console.log("Çıkış hatası:", error.message);
    }
  }

  const logoutAlert = () => {
    Alert.alert("Emin Misin!", "Çıkış yapmak istediğinizden emin misiniz ?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: () => logoutClickHandle() }
      ]
    )
  }


  //save button handle
  const saveButtonHandle = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      if (!oldPassword) {
        setHasOldPasswordError(true)
      } else if (!newPassword) {
        setHasPasswordError(true)
      } else if (!confirmPassword) {
        setHasConfirmPasswordError(true)
      }

    } else {
      console.log(34)
    }
  }


  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case 'oldPassword':
        setOldPassword(enteredValue);
        if (enteredValue.trim() !== "") setHasOldPasswordError(false);
        break;

      case 'newPassword':
        setNewPassword(enteredValue);
        if (enteredValue.trim() !== "") setHasPasswordError(false);
        break;

      case 'confirmPassword':
        setConfirmPassword(enteredValue);
        if (enteredValue.trim() !== "") setHasConfirmPasswordError(false);
        break;
    }
  }


  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
      <CustomContainer>

        {/* Profile Main Card */}
        <View style={[card, { alignItems: "center", marginTop: 15 }]}>

          {/* Icon */}
          <View style={styles.iconCon}>
            <CustomIcons icon={"Username"} />
          </View>

          {/* User Infos */}
          <View style={styles.titleTxtCon}>
            <TextView label={"Ramazan Tiftik"} textStyle={text} />
            <TextView label={"ramazan.tiftik3@gmail.com"} textStyle={text} />
          </View>

          {/* Amount Infos */}
          <View style={styles.bottomCon}>
            <TextView label={"Düzenli (Aylık)"} textStyle={text} />
            <View style={styles.amountTxtCon}>
              <View style={[styles.amountItem, { borderRightWidth: 2, borderRightColor: "#ddd" }]}>
                <TextView label={"30000$"} textStyle={profileText} />
                <TextView label={"Maaş"} textStyle={text} />
              </View>
              <View style={styles.amountItem}>
                <TextView label={"10000$"} textStyle={profileText} />
                <TextView label={"Gider"} textStyle={text} />
              </View>
              <View style={[styles.amountItem, { borderLeftColor: "#ddd", borderLeftWidth: 2 }]}>
                <TextView label={"20000$"} textStyle={profileText} />
                <TextView label={"Tasarruf"} textStyle={text} />
              </View>
            </View>
          </View>

        </View>


        {/* Bottom Card (Options) */}
        <View style={styles.bottomCard}>

          {/* Monthly Info Change */}
          <TouchableOpacity
            onPress={monthlyClickHandle}
            style={[card, { width: "100%", height: 60, justifyContent: "center" }]}
          >
            <TextView label={"Aylık Bilgilerimi Düzenle"} textStyle={text} />
          </TouchableOpacity>

          {/* User Note */}
          <TouchableOpacity
            onPress={noteClickHandle}
            style={[card, { width: "100%", height: 60, justifyContent: "center" }]}
          >
            <TextView label={"Kişisel Notlarım"} textStyle={text} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={notificationClickHandle}
            style={[card, { width: "100%", height: 60, justifyContent: "center" }]}
          >
            <TextView label={"Bildirim Ayarları"} textStyle={text} />
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity
            onPress={feedbackClickHandle}
            style={[card, { width: "100%", height: 60, justifyContent: "center" }]}
          >
            <TextView label={"Sorun Bildir"} textStyle={text} />
          </TouchableOpacity>


        </View>


        {/* Change Password */}
        <View style={[card, styles.bottomContainer, { borderColor: tertiaryColor }]}>

          <TextView label={"Şifre Değiştirme"} textStyle={text} isBold />

          {/* Old Password */}
          <View style={styles.bottomContainerItem}>
            <CustomIcons icon={"Password"} />
            <View style={{ flexDirection: "column" }}>
              <TextView label={"Eski Şifre:"} isBold={true} textStyle={text} />
              <Input
                label={"Eski Şifre"}
                onUpdateValue={updateInput.bind(this, "oldPassword")}
                value={oldPassword}
                secure
                hasError={hasOldPasswordError}
              />
            </View>
          </View>

          {/* New Password */}
          <View style={styles.bottomContainerItem}>
            <CustomIcons icon={"Password"} />
            <View style={{ flexDirection: "column" }}>
              <TextView label={"Yeni Şifre:"} isBold={true} textStyle={text} />
              <Input
                label={"Yeni Şifre"}
                onUpdateValue={updateInput.bind(this, "newPassword")}
                value={newPassword}
                secure
                hasError={hasPasswordError}
              />
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.bottomContainerItem}>
            <CustomIcons icon={"Password"} />
            <View style={{ flexDirection: "column" }}>
              <TextView label={"Yeni Şifre (Tekrar)"} isBold={true} textStyle={text} />
              <Input
                label={"Yeni Şifre (Tekrar)"}
                onUpdateValue={updateInput.bind(this, "confirmPassword")}
                value={confirmPassword}
                secure
                hasError={hasConfirmPasswordError}
              />
            </View>
          </View>


          {/* Change Password Button */}
          <View style={[styles.buttonCon, { marginTop: 15 }]}>
            <LinearGradient
              colors={['#ff416c', '#ff4b2b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonHandle}
            >
              <TouchableOpacity
                style={styles.touchable}
                onPress={saveButtonHandle}
              >
                <TextView label={"Şifreyi Değiştir"} textStyle={[text, { color: "white" }]} />
              </TouchableOpacity>
            </LinearGradient>
          </View>


        </View>


        {/* Logout */}
        <TouchableOpacity
          onPress={logoutAlert}
          style={[card, { width: "100%", height: 60, justifyContent: "center", marginTop: 13 }]}
        >
          <TextView label={"Çıkış Yap"} textStyle={[text, { color: "red" }]} />
        </TouchableOpacity>



      </CustomContainer>
    </SafeAreaView>
  )
}

export default MyProfileScreen

const styles = StyleSheet.create({
  iconCon: {
    marginTop: 15
  },
  titleTxtCon: {
    marginTop: "25",
    alignItems: "center"
  },
  amountTxtCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3
  },
  amountItem: {
    alignItems: "center",
    paddingHorizontal: 5,
    justifyContent: "center",
    flex: 1
  },
  bottomCon: {
    width: "95%",
    marginTop: 25,
  },
  bottomCard: {
    width: "100%",
    marginTop: 10
  },
  bottomContainer: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 20,
    marginTop: 10,
    width: "100%",
    borderRadius: 30,
    marginBottom: 10
  },
  bottomContainerItem: {
    marginVertical: 15,
    flexDirection: "row"
  },
  saveButtonHandle: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: "center",
  },
  buttonCon: {
    width: "100%",
    paddingHorizontal: 15,

  }
})