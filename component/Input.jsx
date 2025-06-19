import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'

const Input = ({ label, keyboardType, onUpdateValue, value, secure, maxLength, hasError, width, disabled, currency, style }) => {

  const [isFocused, setIsFocused] = useState(false);

  //if currency is 'tl', format the value as Turkish Lira
  const formatCurrencyTR = (value) => {
    if (!value) return "";

    // Sadece rakamları al (virgül ve nokta dahil değil)
    const numericValue = value.toString().replace(/[^\d]/g, '');

    // Sayı yoksa boş döndür
    if (numericValue === "") return "";

    // Sayıyı kuruşları da dahil ederek formatla
    const floatValue = parseFloat(numericValue) / 100;

    // Türkçe para biçimlendirme (örnek: 3.500,00)
    return floatValue.toLocaleString('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  return (
    <View style={{ width: width || 280 }}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            style && style,
            styles.input,
            isFocused && styles.focused,
            hasError && styles.errorBorder,
            currency && { paddingRight: 30 }, // ₺ simgesi için boşluk bırak
            disabled && styles.disabledInput,
          ]}
          placeholder={label}
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={(text) => {
            if (currency === 'tl') {
              const formatted = formatCurrencyTR(text);
              onUpdateValue(formatted);
            } else {
              onUpdateValue(text);
            }
          }}

          value={value || ""}
          secureTextEntry={secure}
          maxLength={maxLength || 50}
          multiline={!secure}
          textAlignVertical={secure ? "center" : "top"}
          numberOfLines={secure ? 1 : 5}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
        />
        {currency === 'tl' && (
          <Text style={styles.currencySymbol}>₺</Text>
        )}
      </View>
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
  currencySymbol: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    fontSize: 16,
    color: '#6c757d',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  disabledInput: {
    backgroundColor: "#e9ecef", // daha soluk bir gri tonu
    color: "#6c757d", // yazı da soluklaşsın
  }
})