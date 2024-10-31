import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../credenciales';

export default function EditarFacturaScreen({ route, navigation }) {
  const { facturaId } = route.params;
  const [factura, setFactura] = useState(null);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const obtenerFactura = async () => {
      try {
        const docRef = doc(db, 'facturas', facturaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const facturaData = docSnap.data();
          setFactura(facturaData);
          setCantidades(facturaData.productos.reduce((acc, producto) => {
            acc[producto.productoId] = producto.cantidad;
            return acc;
          }, {}));
        } else {
          Alert.alert('Error', 'Factura no encontrada');
        }
      } catch (error) {
        console.error('Error al obtener la factura:', error);
      }
    };

    obtenerFactura();
  }, [facturaId]);

  const actualizarCantidad = (productoId, cantidad) => {
    setCantidades(prevCantidades => ({
      ...prevCantidades,
      [productoId]: cantidad,
    }));
  };

  const guardarCambios = async () => {
    try {
      const productosActualizados = factura.productos.map(producto => ({
        ...producto,
        cantidad: cantidades[producto.productoId] || 0,
      }));

      await updateDoc(doc(db, 'facturas', facturaId), {
        ...factura,
        productos: productosActualizados,
      });

      Alert.alert('Éxito', 'Factura actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
      Alert.alert('Error', 'No se pudo actualizar la factura');
    }
  };

  if (!factura) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Factura</Text>
      <Text style={styles.label}>Cliente: {factura.cliente}</Text>

      <FlatList
        data={factura.productos}
        keyExtractor={(item) => item.productoId}
        renderItem={({ item }) => (
          <View style={styles.productoItem}>
            <Text>{item.nombre}</Text>
            <TextInput
              style={styles.inputCantidad}
              keyboardType="numeric"
              value={cantidades[item.productoId]?.toString() || ''}
              onChangeText={(cantidad) => actualizarCantidad(item.productoId, parseInt(cantidad))}
            />
            <Text>Precio: ${item.precio}</Text>
          </View>
        )}
      />

      <Button title="Guardar Cambios" onPress={guardarCambios} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  productoItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
  },
  inputCantidad: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
