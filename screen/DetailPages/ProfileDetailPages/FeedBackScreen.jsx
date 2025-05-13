import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import CustomIcons from '../../../component/CustomIcons';
import { themes } from '../../../theme/Themes';
import CustomContainer from '../../../component/CustomContainer';
import TextView from '../../../component/TextView';

const FeedBackScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color

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

  //VIEW
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor }}>
      <CustomContainer>

        <TextView label={"234"} />

      </CustomContainer>
    </SafeAreaView >
  )
}

export default FeedBackScreen

const styles = StyleSheet.create({})
