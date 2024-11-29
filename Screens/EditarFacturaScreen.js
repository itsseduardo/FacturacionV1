import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import { ThemeContext } from '../context/ThemeContext';

export default function EditarFacturaScreen({ route, navigation }) {
  const { facturaId } = route.params;
  const [factura, setFactura] = useState(null);
  const [cantidades, setCantidades] = useState({});
  const { theme } = useContext(ThemeContext);

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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.text, { color: theme.colors.text }]}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Editar Factura</Text>
      <Text style={[styles.label, { color: theme.colors.text }]}>Cliente: {factura.cliente}</Text>

      <FlatList
        data={factura.productos}
        keyExtractor={(item) => item.productoId}
        renderItem={({ item }) => (
          <View style={[styles.productoItem, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.text, { color: theme.colors.text }]}>{item.nombre}</Text>
            <TextInput
              style={[styles.inputCantidad, { borderColor: theme.colors.text, backgroundColor: theme.colors.card }]}
              keyboardType="numeric"
              value={cantidades[item.productoId]?.toString() || ''}
              onChangeText={(cantidad) => actualizarCantidad(item.productoId, parseInt(cantidad))}
              placeholderTextColor={theme.colors.placeholder}
              selectionColor={theme.colors.primary}
            />
            <Text style={[styles.text, { color: theme.colors.text }]}>Precio: ${item.precio}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
  inputCantidad: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});