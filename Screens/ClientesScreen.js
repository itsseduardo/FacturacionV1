import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ClientesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Lista de Clientes</Text>
      <Button
        title="Ver Detalle de Cliente"
        onPress={() => navigation.navigate('DetalleCliente')}
      />
      <Button
        title="Agregar Cliente"
        onPress={() => navigation.navigate('AgregarCliente')}
      />
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
