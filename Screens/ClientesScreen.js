import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Styles from '../estilos/Styles';

export default function ClientesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  return (
    <ImageBackground
      source={require('../assets/customer_3126589.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[Styles.titleText, styles.titleText, { color: theme.colors.text }]}>
          Clientes
        </Text>

        {/* Botón para ir a la pantalla de DetalleCliente */}
        <TouchableOpacity
          style={[Styles.button, styles.button]}
          onPress={() => navigation.navigate('DetalleCliente')}
        >
          <Text style={Styles.buttonText}>Ver Lista de Clientes</Text>
        </TouchableOpacity>

        {/* Botón para agregar cliente */}
        <TouchableOpacity
          style={[Styles.button, styles.button]}
          onPress={() => navigation.navigate('AgregarCliente')}
        >
          <Text style={Styles.buttonText}>Agregar Cliente</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
  },
});
