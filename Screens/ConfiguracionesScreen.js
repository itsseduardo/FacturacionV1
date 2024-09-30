import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Styles from '../estilos/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfiguracionesScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      // Elimina el token de usuario
      await AsyncStorage.removeItem('userToken');
      // Redirige a la pantalla de bienvenida
      navigation.replace('Welcome');
    } catch (e) {
      console.log('Error al cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Pantalla de Configuraciones</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
