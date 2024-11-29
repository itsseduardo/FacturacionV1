import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConfiguracionesScreen from '../Screens/ConfiguracionesScreen';
import ActualizarContraScreen from '../Screens/ActualizarContraScreen';

const Stack = createStackNavigator();

export default function ConfiguracionesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Configuración" component={ConfiguracionesScreen} />
      <Stack.Screen 
        name="UpdatePassword" component={ActualizarContraScreen} />
    </Stack.Navigator>
  );
}