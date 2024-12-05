import React, { useCallback, useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../credenciales';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ThemeContext } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import Styles from '../estilos/Styles';

export default function DetalleClienteScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      const listaClientes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(listaClientes);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [])
  );

  const eliminarCliente = async (clienteId) => {
    try {
      await deleteDoc(doc(db, 'clientes', clienteId));
      setClientes((prevClientes) => prevClientes.filter(cliente => cliente.id !== clienteId));
      Alert.alert('Cliente eliminado', 'El cliente ha sido eliminado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el cliente.');
      console.error('Error al eliminar cliente:', error);
    }
  };

  const confirmarEliminacion = (clienteId) => {
    Alert.alert(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => eliminarCliente(clienteId), style: 'destructive' },
      ]
    );
  };

  const renderCliente = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.nombre, { color: theme.colors.text }]}>{item.nombre}</Text>
      <Text style={[styles.detalle, { color: theme.colors.text }]}>Teléfono: {item.telefono}</Text>
      <Text style={[styles.detalle, { color: theme.colors.text }]}>Correo: {item.correo}</Text>
      <Text style={[styles.detalle, { color: theme.colors.text }]}>Dirección: {item.direccion}</Text>

      {/* Contenedor para los botones */}
      <View style={styles.botonesContainer}>
        {/* Botón Editar */}
        <TouchableOpacity
          style={[styles.boton, styles.botonEditar]}
          onPress={() => navigation.navigate('EditarCliente', { clienteId: item.id })}
        >
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>

        {/* Botón Eliminar */}
        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => confirmarEliminacion(item.id)}
        >
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[Styles.titleText, styles.titleText, { color: theme.colors.text }]}>
        Lista de Clientes
      </Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={renderCliente}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detalle: {
    fontSize: 14,
    marginTop: 4,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: 10,
  },
  boton: {
    flex: 1, 
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5, 
  },
  botonEditar: {
    backgroundColor: '#007BFF',
  },
  botonEliminar: {
    backgroundColor: 'red',
  },
  botonTexto: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});