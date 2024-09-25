import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FacturacionScreen from '../Screens/FacturacionScreen';
import DetalleFacturaScreen from '../Screens/DetalleFacturaScreen';
import CrearFacturaScreen from '../Screens/CrearFacturaScreen';
import EditarFacturaScreen from '../Screens/EditarFacturaScreen';
import ReportesScreen from '../Screens/ReportesScreen';

const Stack = createStackNavigator();

export default function FacturacionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Facturación" component={FacturacionScreen} />
      <Stack.Screen name="DetalleFactura" component={DetalleFacturaScreen} />
      <Stack.Screen name="CrearFactura" component={CrearFacturaScreen} />
      <Stack.Screen name="EditarFactura" component={EditarFacturaScreen} />
      <Stack.Screen name="Reportes" component={ReportesScreen} />
    </Stack.Navigator>
  );
}
