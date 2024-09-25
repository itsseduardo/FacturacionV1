import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navegacion/TabNavigator';  // Asegúrate de la ruta correcta

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
