import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Styles from '../estilos/Styles'; // Importa los estilos globales

export default function ReportesScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/chart_17010925.png')}  // Cambia la ruta según sea necesario
      style={Styles.container} 
      resizeMode  // Asegúrate de que la imagen cubra toda la pantalla
    >
      <Text style={Styles.titleText}>Reportes</Text>  

      {/* Botón "Ver Reporte de Ventas" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('ReporteVentas')}
      >
        <Text style={Styles.buttonText}>Ver Reporte de Ventas</Text>  
      </TouchableOpacity>

      {/* Botón "Ver Reporte de Inventario" con estilos globales */}
      <TouchableOpacity 
        style={Styles.button} 
        onPress={() => navigation.navigate('ReporteInventario')}
      >
        <Text style={Styles.buttonText}>Ver Reporte de Inventario</Text>  
      </TouchableOpacity>
    </ImageBackground>
  );
}
