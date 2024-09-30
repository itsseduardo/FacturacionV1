import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Styles from '../estilos/Styles';  // Importa los estilos globales

export default function ProductosScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/shopping_16507871.png')} 
      style={Styles.container}
      resizeMode 
    >
      <Text style={Styles.titleText}>Lista de Productos</Text>  
      
      {/* Botón "Ver Detalle de Producto" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('DetalleProducto')}  // Navega a la pantalla de detalles del producto
      >
        <Text style={Styles.buttonText}>Ver Detalle de Producto</Text>  
      </TouchableOpacity>

      {/* Botón "Agregar Producto" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('AgregarProducto')}  // Navega a la pantalla de agregar producto
      >
        <Text style={Styles.buttonText}>Agregar Producto</Text>  
      </TouchableOpacity>
    </ImageBackground>
  );
}
