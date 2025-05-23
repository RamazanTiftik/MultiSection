import { LinearGradient } from 'expo-linear-gradient'
import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';
import Input from '../../../component/Input';


const FeedBackScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color
  const card = themes.card.cardView

  //local text states
  const [feedBackText, setFeedBackText] = useState("")
  const [hasFeedBackTextError, setHasFeedBackTextError] = useState(false)


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
        backgroundColor: "red"
      },
      headerTitle: "Geri",
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


  //sent button func
  const buttonClickHandle = () => {
    console.log("feedback")
  }


  //Input func
  function updateInput(inputType, enteredValue) {
    switch (inputType) {
      case '':
        setFeedBackText(enteredValue);
        if (enteredValue.trim() !== "") setHasFeedBackTextError(false);
        break;

    }
  }


  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
      <CustomContainer>

        <View style={card}>
          <TextView label={"Uygulamayla ilgili herhangi bir geri bildiriminiz varsa bildirebilirsiniz."} />

          <View>
            <Input
              label={"Geri bildiriminizi yazınız"}
              onUpdateValue={updateInput.bind(this, "feedback")}
              value={feedBackText}
              hasError={hasFeedBackTextError}
            />
          </View>


          {/* Save Button */}
          <View style={[styles.inputCard, { paddingHorizontal: 20, marginTop: 15 }]}>
            <LinearGradient
              colors={['#56ab2f', '#a8e063']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButtonHandle}
            >
              <TouchableOpacity
                style={styles.touchable}
                onPress={buttonClickHandle}
              >
                <Text style={styles.selectedBtnText}>{"Gönder"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </View>

      </CustomContainer>
    </SafeAreaView >
  )
}

export default FeedBackScreen

const styles = StyleSheet.create({
  addButtonHandle: {
    borderRadius: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  },
})
