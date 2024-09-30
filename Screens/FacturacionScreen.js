import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Styles from '../estilos/Styles'; // Importa los estilos globales

export default function FacturacionScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/bill_3188333.png')}  // Cambia la ruta según sea necesario
      style={Styles.container} 
      resizeMode  // Asegúrate de que la imagen cubra toda la pantalla
    >
      <Text style={Styles.titleText}>Facturación</Text>  
      {/* Botón "Ver Detalle de Factura" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('DetalleFactura')}
      >
        <Text style={Styles.buttonText}>Ver Detalle de Factura</Text>  
      </TouchableOpacity>

      {/* Botón "Crear Nueva Factura" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('CrearFactura')}
      >
        <Text style={Styles.buttonText}>Crear Nueva Factura</Text>  
      </TouchableOpacity>
    </ImageBackground>
  );
}
