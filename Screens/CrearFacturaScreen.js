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

  // Función para formatear números con separadores de miles
  const formatearConComas = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
          const docRef = await addDoc(collection(db, 'facturas'), factura);
          navigation.navigate('DetalleFactura', { facturaId: docRef.id });
        }
  
        Alert.alert('Facturas creadas', 'Las facturas se han creado exitosamente');
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
      setProductoActual(producto);
      setCantidadInput(cantidades[productoId]?.toString() || '');
      setModalVisible(true);
    } else {
      eliminarProducto(productoId);
    }
  };

  const handleConfirmarCantidad = () => {
    if (cantidadInput) {
      const cantidad = parseInt(cantidadInput, 10);
      if (!isNaN(cantidad) && cantidad > 0) {
        setCantidades(prev => ({ ...prev, [productoActual.id]: cantidad.toString() }));
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
              <Text>{item.nombre} - Precio: ${formatearConComas(item.precio)}</Text>
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
      <Text style={styles.total}>Total: ${formatearConComas(total)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleVistaPrevia}>
        <Text style={styles.buttonText}>Vista Previa Factura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAgregarFactura}>
        <Text style={styles.buttonText}>Crear Factura</Text>
      </TouchableOpacity>

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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  productoItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  productoAcciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
