import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductosScreen from '../Screens/ProductosScreen';
import DetalleProductoScreen from '../Screens/DetalleProductoScreen';
import AgregarProductoScreen from '../Screens/AgregarProductoScreen';
import EditarProductoScreen from '../Screens/EditarProductoScreen';

const Stack = createStackNavigator();

export default function ProductosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Productos" component={ProductosScreen} />
      <Stack.Screen name="DetalleProducto" component={DetalleProductoScreen} />
      <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} />
      <Stack.Screen name="EditarProducto" component={EditarProductoScreen} />
    </Stack.Navigator>
  );
}
