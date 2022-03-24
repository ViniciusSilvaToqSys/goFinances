import React from 'react';
import { Register } from './src/screens/Register';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme'
import { ThemeProvider } from 'styled-components';
import { loadAsync } from 'expo-font';
import { CategorySelect } from './src/screens/CategorySelect';

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//expo install expo-font @expo-google-fonts/poppins
export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  // tem que instalr expo install @expo-app-loading
if (!fontsLoaded){
  return <AppLoading />
}

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar barStyle="light-content"/>
          <AppRoutes />
        </NavigationContainer>      
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
