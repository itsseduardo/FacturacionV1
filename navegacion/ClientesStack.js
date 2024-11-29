import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientesScreen from '../Screens/ClientesScreen'; // Asegúrate de que la ruta sea correcta
import AgregarClienteScreen from '../Screens/AgregarClienteScreen';
import DetalleClienteScreen from '../Screens/DetalleClienteScreen';
import EditarClienteScreen from '../Screens/EditarClienteScreen';

const Stack = createStackNavigator();

export default function ClientesStack() {
  return (
    <Stack.Navigator initialRouteName="Clientes ">
      {/* Pantalla principal de clientes */}
      <Stack.Screen 
        name="Clientes2" 
        component={ClientesScreen} 
        options={{ title: 'Clientes' }} 
      />
      
      {/* Pantalla para agregar un cliente */}
      <Stack.Screen 
        name="AgregarCliente" 
        component={AgregarClienteScreen} 
        options={{ title: 'Agregar Cliente' }} 
      />
      
      {/* Pantalla para detalles del cliente */}
      <Stack.Screen 
        name="DetalleCliente" 
        component={DetalleClienteScreen} 
        options={{ title: 'Detalle del Cliente' }} 
      />
        <Stack.Screen 
        name="EditarCliente" 
        component={EditarClienteScreen} 
        
      />
      
    </Stack.Navigator>
  );
}
