import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../credenciales';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext'; // Importa el contexto del tema

export default function ReportesScreen() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para refresco

  const { theme } = useContext(ThemeContext); // Accede al tema actual desde el contexto

  const fetchFacturasConTotales = async () => {
    try {
      const facturasSnapshot = await getDocs(collection(db, 'facturas'));
      const productosSnapshot = await getDocs(collection(db, 'productos'));

      const productos = productosSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      const facturasData = facturasSnapshot.docs.map(doc => {
        const data = doc.data();
        const total = data.cantidad * (productos[data.producto]?.precio || 0);
        return {
          id: doc.id,
          ...data,
          total,
        };
      });

      setFacturas(facturasData);
    } catch (error) {
      console.error('Error al cargar las facturas:', error);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFacturasConTotales();
  }, []);


  const handleRefresh = () => {
    setRefreshing(true); 
    fetchFacturasConTotales(); 
  };

  const renderFactura = ({ item }) => (
    <View style={[styles.facturaItem, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.facturaTexto, { color: theme.colors.text }]}>Factura ID: {item.id}</Text>
      <Text style={[styles.facturaTextoSecundario, { color: theme.colors.text }]}>Cliente: {item.cliente}</Text>
      <Text style={[styles.facturaTextoSecundario, { color: theme.colors.text }]}>Producto ID: {item.producto}</Text>
      <Text style={[styles.facturaTextoTotal, { color: theme.colors.primary }]}>Total: ${item.total.toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Reportes de Ventas</Text>
        {cargando ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={facturas}
            keyExtractor={(item) => item.id.toString()} 
            renderItem={renderFactura}
            contentContainerStyle={styles.lista}
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  lista: {
    paddingBottom: 20,
  },
  facturaItem: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  facturaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  facturaTextoSecundario: {
    fontSize: 14,
    marginTop: 5,
  },
  facturaTextoTotal: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});