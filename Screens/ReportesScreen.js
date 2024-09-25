import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ReportesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Reportes</Text>
      <Button
        title="Ver Reporte de Ventas"
        onPress={() => navigation.navigate('ReporteVentas')}
      />
      <Button
        title="Ver Reporte de Inventario"
        onPress={() => navigation.navigate('ReporteInventario')}
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
