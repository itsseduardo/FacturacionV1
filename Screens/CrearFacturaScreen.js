import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../credenciales';
import { getAuth } from 'firebase/auth';

export default function CrearFacturaScreen({ navigation }) {
  const [cliente, setCliente] = useState('');
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [cantidadInput, setCantidadInput] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const q = query(collection(db, 'productos'), where('userId', '==', user.uid));
        const productosSnapshot = await getDocs(q);
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarFactura = async () => {
    if (cliente && Object.keys(cantidades).length > 0) {
      try {
        const facturas = Object.keys(cantidades).map((productoId) => ({
          cliente,
          producto: productoId,
          cantidad: cantidades[productoId],
          fecha: new Date(),
        }));

        for (const factura of facturas) {
          await addDoc(collection(db, 'facturas'), factura);
        }

        Alert.alert('Facturas creadas', 'Las facturas se han creado exitosamente');
        navigation.goBack(); // Regresar a la pantalla anterior
      } catch (error) {
        console.error('Error al crear la factura: ', error);
      }
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  const toggleSeleccionado = (producto) => {
    const productoId = producto.id;
    const yaSeleccionado = seleccionados[productoId];

    if (!yaSeleccionado) {
      // Si no está seleccionado, abrir el modal
      setProductoActual(producto);
      setCantidadInput(cantidades[productoId]?.toString() || ''); // Prellenar con la cantidad existente
      setModalVisible(true);
    } else {
      // Si ya está seleccionado, eliminarlo de la selección
      const { [productoId]: _, ...rest } = seleccionados;
      setSeleccionados(rest);
      setCantidades(prev => {
        const { [productoId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleConfirmarCantidad = () => {
    if (cantidadInput) {
      const cantidad = parseInt(cantidadInput, 10);
      if (!isNaN(cantidad) && cantidad > 0) {
        setCantidades(prev => ({ ...prev, [productoActual.id]: cantidad }));
        setSeleccionados(prev => ({ ...prev, [productoActual.id]: true }));
        setCantidadInput('');
        setModalVisible(false);
        setProductoActual(null);
      } else {
        Alert.alert('Error', 'Por favor ingrese una cantidad válida.');
      }
    }
  };

  const eliminarProducto = (productoId) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const { [productoId]: _, ...restSeleccionados } = seleccionados;
            setSeleccionados(restSeleccionados);
            const { [productoId]: __, ...restCantidades } = cantidades;
            setCantidades(restCantidades);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const calcularTotal = () => {
    return Object.keys(seleccionados).reduce((total, productoId) => {
      const cantidad = cantidades[productoId] ? parseInt(cantidades[productoId]) : 0;
      const precio = productos.find(p => p.id === productoId)?.precio || 0;
      return total + (precio * cantidad);
    }, 0);
  };

  const total = calcularTotal();

  // Función para formatear el total con comas
  const formatearTotal = (total) => {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleVistaPrevia = () => {
    if (cliente && Object.keys(cantidades).length > 0) {
      const productosSeleccionados = productos.filter(producto => seleccionados[producto.id]);
      navigation.navigate('VistaPreviaFactura', {
        cliente,
        productosSeleccionados,
        total,
        cantidades,
      });
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Factura</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Cliente"
        value={cliente}
        onChangeText={setCliente}
      />
      <Text style={styles.label}>Seleccionar Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productoItem}>
            <TouchableOpacity onPress={() => toggleSeleccionado(item)}>
              <Text>{item.nombre} - Precio: ${item.precio}</Text>
            </TouchableOpacity>
            {seleccionados[item.id] && (
              <View style={styles.productoAcciones}>
                <TouchableOpacity onPress={() => eliminarProducto(item.id)}>
                  <Text style={styles.eliminarTexto}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${formatearTotal(total)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleVistaPrevia}>
        <Text style={styles.buttonText}>Vista Previa Factura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAgregarFactura}>
        <Text style={styles.buttonText}>Crear Factura</Text>
      </TouchableOpacity>

      {/* Modal para ingresar la cantidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ingrese la Cantidad</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={cantidadInput}
              onChangeText={setCantidadInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmarCantidad}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  productoItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productoAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  eliminarTexto: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#4c68af',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4c68af',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
  },
});
