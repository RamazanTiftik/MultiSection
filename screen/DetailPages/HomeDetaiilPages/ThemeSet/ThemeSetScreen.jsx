import { StyleSheet, Text, View, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomContainer from '../../../../component/CustomContainer';
import { themes } from '../../../../theme/Themes';
import CustomIcons from '../../../../component/CustomIcons';
import SetThemeRow from '../../../../component/FlatListRow/SetThemeRow';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../../../redux/slices/ThemeSlice';
import CustomIndicator from '../../../../component/CustomIndicator';

// Tema paletleri
const themePalettes = [
  {
    id: 'cold_forest',
    name: 'Soğuk Orman', // Cold Forest
    colors: ["#A8E6CF", "#56C596", "#379683", "#05386B"],
  },
  {
    id: 'purple_clouds',
    name: 'Mor Bulutlar', // Purple Clouds
    colors: ["#D0F4FF", "#A6E3E9", "#89C2D9", "#6A4C93"],
  },
  {
    id: 'mango_dreams',
    name: 'Mango Rüyası', // Mango Dreams
    colors: ["#FFF176", "#FFD54F", "#FFB74D", "#FF8A65", "#D84315"],
  },
  {
    id: 'retro_summer',
    name: 'Retro Yaz', // Retro Summer
    colors: ["#FFF3E0", "#FFCCBC", "#FF8A65", "#D32F2F", "#4A148C"],
  },
  {
    id: 'purple_mint',
    name: 'Mor Nane', // Purple Mint
    colors: ["#A7FFEB", "#64FFDA", "#18FFFF", "#7C4DFF", "#311B92"],
  },
  {
    id: 'modern_fresh',
    name: 'Modern Fresh',
    colors: ["#FCA5A5", "#B91C1C", "#86EFAC", "#15803D", "#93C5FD"],
  },
  {
    id: 'modern_dark',
    name: 'Modern Koyu',
    colors: ["#FCA5A5", "#7F1D1D", "#6EE7B7", "#065F46", "#93C5FD"],
  },
  {
    id: 'modern_pastel',
    name: 'Modern Pastel',
    colors: ["#FECACA", "#EF4444", "#BBF7D0", "#16A34A", "#BAE6FD"],
  },
  {
    id: 'modern_neon',
    name: 'Modern Neon',
    colors: ["#FB7185", "#9F1239", "#4ADE80", "#065F46", "#60A5FA"],
  },
];


const ThemeSetScreen = ({ navigation }) => {

  //theme
  const secondaryColor = themes.colorTheme.secondary.color;

  //theme - redux
  const dispatch = useDispatch()
  const selectedThemeId = useSelector(state => state.theme.selectedThemeId);
  const theme = useSelector(state => state.theme.themes[selectedThemeId]);

  //general loading
  const themeLoading = useSelector((state) => state.theme.loading)
  const generalLoading = themeLoading

  //local state
  const [selectedTheme, setSelectedTheme] = useState(selectedThemeId);


  const backAction = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }]
    });
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleStyle: {
        color: theme.text || "#007AFF",
        fontSize: 18,
      },
      headerTitle: "Tema Seçimi",
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


  const clickHandle = (id) => {
    setSelectedTheme(id)
    dispatch(setTheme(id))
  }


  //VIEW
  if (generalLoading) {
    return (
      <View>
        <CustomIndicator />
      </View>
    )

  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: secondaryColor, paddingVertical: -20 }}>
        <CustomContainer>
          {themePalettes.map((theme) => (
            <SetThemeRow
              key={theme.id}
              id={theme.id}
              name={theme.name}
              colors={theme.colors}
              isSelected={selectedTheme === theme.id}
              onPress={() => clickHandle(theme.id)}
            />
          ))}
        </CustomContainer>
      </SafeAreaView>
    );
  }
};

export default ThemeSetScreen;

const styles = StyleSheet.create({

});
