import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'

const ModalContent = ({ tabImage, tabTitle }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={tabImage}
        resizeMode='cover'
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{tabTitle}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export default ModalContent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden', // köşeleri düzgün kırpmak için
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // yazıyı alta yasla
  },
  imageStyle: {
    borderRadius: 15,
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // yarı saydam arka plan
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
