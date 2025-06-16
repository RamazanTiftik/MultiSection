import 'react-native-get-random-values';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import MainApp from './component/Navigation/MainApp';

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
