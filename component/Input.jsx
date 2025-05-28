import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'

const Input = ({ label, keyboardType, onUpdateValue, value, secure, maxLength, hasError }) => {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focused,
          hasError && styles.errorBorder
        ]}
        placeholder={label}
        autoCapitalize="none"
        keyboardType={keyboardType}
        onChangeText={onUpdateValue}
        value={value || ""}
        secureTextEntry={secure}
        maxLength={maxLength || 50}
        multiline={!secure}
        textAlignVertical={secure ? "center" : "top"}
        numberOfLines={secure ? 1 : 5}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {hasError && <Text style={{ color: "red" }}>Bu alan boş bırakılamaz.</Text>}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#dee2e6",
    borderRadius: 5,
    width: 280,
    marginVertical: 5,
    padding: 8,
    fontSize: 16,
    marginRight: 5,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: "red",
  },
  focused: {
    backgroundColor: "#ffffff", // Beyaz arka plan
    borderWidth: 1,
    borderColor: "#007bff", // Hafif mavi border da olur istersen
  },
})