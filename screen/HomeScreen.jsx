import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomContainer from '../component/CustomContainer'
import TextView from '../component/TextView'

const HomeScreen = () => {
  return (
    <CustomContainer>
      <TextView label={"sad"} />
    </CustomContainer>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})