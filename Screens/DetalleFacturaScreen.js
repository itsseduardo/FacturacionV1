import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../credenciales';

export default function DetalleFacturaScreen() {
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    const obtenerFactura = async () => {
      try {
        // Cambia el criterio de consulta según tu necesidad, aquí se utiliza el nombre del cliente como ejemplo
        const q = query(collection(db, 'facturas'), where('cliente', '==', 'nombreDelCliente'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const facturaData = querySnapshot.docs[0].data();
          facturaData.id = querySnapshot.docs[0].id; // Guarda el ID de la factura
          setFactura(facturaData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error al obtener la factura:', error);
      }
    };

    obtenerFactura();
  }, []);

  if (!factura) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Factura</Text>
      <Text style={styles.label}>Cliente: {factura.cliente || 'N/A'}</Text>
      <Text style={styles.label}>
        Fecha: {factura.fecha ? factura.fecha.toDate().toLocaleDateString() : 'Fecha no disponible'}
      </Text>
      <Text style={styles.label}>Productos:</Text>

      <FlatList
        data={factura.productos || []}
        keyExtractor={(item) => item.productoId}
        renderItem={({ item }) => (
          <View style={styles.productoItem}>
            <Text style={styles.productoNombre}>{item.nombre}</Text>
            <Text>Cantidad: {item.cantidad ? item.cantidad.toString() : '0'}</Text>
            <Text>Precio: ${item.precio}</Text>
            <Text>Total: ${item.cantidad && item.precio ? (item.cantidad * item.precio).toLocaleString() : '0'}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>
        Total de la Factura: ${factura.total ? factura.total.toLocaleString() : '0'}
      </Text>

      <Button title="Editar Factura" onPress={() => navigation.navigate('EditarFactura', { facturaId: factura.id })} />
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
    fontSize: 16,
    marginBottom: 10,
  },
  productoItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});