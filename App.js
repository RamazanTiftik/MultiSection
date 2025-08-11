// App.js
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/Store';
import MainApp from './component/Navigation/MainApp';
import { loadTheme } from './redux/slices/ThemeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTheme = async () => {
      const savedThemeId = await AsyncStorage.getItem('selectedThemeId');
      if (savedThemeId) {
        dispatch(loadTheme(savedThemeId));
      }
    };
    fetchTheme();
  }, []);

  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer>
        <MainApp />
      </ThemeInitializer>
    </Provider>
  );
}
