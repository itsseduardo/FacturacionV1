import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../credenciales';
import { useNavigation } from '@react-navigation/native';

export default function ListaFacturasScreen() {
  const [facturas, setFacturas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'facturas'));
        const facturasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFacturas(facturasData);
      } catch (error) {
        console.error("Error obteniendo las facturas: ", error);
      }
    };

    obtenerFacturas();
  }, []);

  const renderFacturaItem = ({ item }) => (
    <View style={styles.facturaItem}>
      <TouchableOpacity onPress={() => navigation.navigate('DetalleFactura', { facturaId: item.id })}>
        <Text style={styles.facturaCliente}>Cliente: {item.cliente || 'N/A'}</Text>
        <Text style={styles.facturaTotal}>Total: ${item.total ? item.total.toLocaleString() : '0'}</Text>
      </TouchableOpacity>
      <View style={styles.botones}>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('EditarFactura', { facturaId: item.id })}>
          <Text style={styles.botonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={() => {/* Lógica para generar PDF */}}>
          <Text style={styles.botonText}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={() => {/* Lógica para imprimir */}}>
          <Text style={styles.botonText}>Imprimir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facturas</Text>
      <FlatList
        data={facturas}
        keyExtractor={(item) => item.id}
        renderItem={renderFacturaItem}
      />
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
    textAlign: 'center',
    marginBottom: 20,
  },
  facturaItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
  },
  facturaCliente: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  facturaTotal: {
    fontSize: 16,
    color: '#4CAF50',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  boton: {
    backgroundColor: '#4c68af',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  botonText: {
    color: '#fff',
  },
});
