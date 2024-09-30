import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import Styles from '../estilos/Styles';


// Importa los StackNavigators
import ProductosStack from './ProductosStacks';
import FacturacionStack from './FacturacionStacks';
import ReportesScreen from '../Screens/ReportesScreen'; // stack para reportes
import ClientesScreen from '../Screens/ClientesScreen';  // Stack para clientes
import ConfiguracionesScreen from '../Screens/ConfiguracionesScreen';// Stack para configuraciones

const Tab = createBottomTabNavigator();

export default function App() {
  return (
   
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
  
        if (route.name === 'Productos') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'Facturación') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'Reportes') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Clientes') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Configuraciones') {
          iconName = focused ? 'settings' : 'settings-outline';  //Oe Revisa si este nombre es correcto
        }
  
        return <Ionicons name={iconName} size={size} color={color} />;
      
          },
          tabBarActiveTintColor: 'red',  // Color cuando la pestaña está activa
          tabBarInactiveTintColor: 'black',  // Color cuando la pestaña está inactiva
          tabBarStyle: {
            backgroundColor: '#fff',  // Color del fondo de las pestañas
            paddingBottom: 20,  // Ajuste del padding inferior
            height: 80,  // Altura de la barra de pestañas
          },
          tabBarLabelStyle: {
            fontSize: 12,  // Tamaño de la fuente de las etiquetas
            fontWeight: 'bold',  // Negrita en las etiquetas
          },
          tabBarIconStyle: {
            marginBottom: -10,  // Ajusta la posición del ícono
          },
        })}
    >
      <Tab.Screen name="Productos" component={ProductosStack} options={{ headerShown: false }}/>
      
      <Tab.Screen name="Facturación" component={FacturacionStack} options={{ headerShown: false }}/>

      <Tab.Screen name="Reportes" component={ReportesScreen} />
      <Tab.Screen name="Clientes" component={ClientesScreen} />
      <Tab.Screen name="Configuraciones" component={ConfiguracionesScreen} />
      </Tab.Navigator>
    
  );
}