import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Screens/WelcomeScreen'; // Importa la pantalla de bienvenida
import TabNavigator from './navegacion/TabNavigator'; // Importa el TabNavigator principal

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Pantalla de bienvenida */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // Oculta el header de la pantalla de bienvenida
        />
        {/* Pantalla principal con las tabs */}
        <Stack.Screen
          name="MainApp"
          component={TabNavigator} // TabNavigator principal
          options={{ headerShown: false }} // Oculta el header en la navegación principal
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
