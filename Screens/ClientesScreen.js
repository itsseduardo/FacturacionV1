import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Styles from '../estilos/Styles';  // Importa los estilos globales

export default function ClientesScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/customer_3126589.png')}  
      style={Styles.container}  // Estilo para la imagen de fondo
      resizeMode
    >
      
        <Text style={Styles.titleText}>Lista de Clientes</Text>  
        
        {/* Botón "Ver Detalle De Cliente" con estilos globales */}
        <TouchableOpacity 
          style={Styles.button} 
          onPress={() => navigation.navigate('DetalleCliente')}  // Navega a la pantalla de detalles del cliente
        >
          <Text style={Styles.buttonText}>Ver Detalle De Cliente</Text>  
        </TouchableOpacity>

        {/* Botón "Agregar Cliente" con estilos globales */}
        <TouchableOpacity 
          style={Styles.button} 
          onPress={() => navigation.navigate('AgregarCliente')}  // Navega a la pantalla de agregar cliente
        >
          <Text style={Styles.buttonText}>Agregar Cliente</Text>  
        </TouchableOpacity>
     
    </ImageBackground>
  );
}
