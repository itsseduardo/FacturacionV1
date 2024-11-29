import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../credenciales';
import { getAuth } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';

export default function CrearFacturaScreen({ navigation }) {
  const [cliente, setCliente] = useState('');
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [cantidadInput, setCantidadInput] = useState('');
  const { theme } = useContext(ThemeContext);

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

  const formatearConComas = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Crear Factura</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.colors.text,
            backgroundColor: theme.colors.card,
            color: theme.colors.text, // Ajuste del color del texto
          },
        ]}
        placeholder="Nombre del Cliente"
        value={cliente}
        onChangeText={setCliente}
        placeholderTextColor={theme.colors.placeholder}
      />
      <Text style={[styles.label, { color: theme.colors.text }]}>Seleccionar Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.productoItem, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity onPress={() => toggleSeleccionado(item)}>
              <Text style={[styles.text, { color: theme.colors.text }]}>
                {item.nombre} - Precio: ${formatearConComas(item.precio)}
              </Text>
            </TouchableOpacity>
            {seleccionados[item.id] && (
              <View style={styles.productoAcciones}>
                <TouchableOpacity onPress={() => eliminarProducto(item.id)}>
                  <Text style={[styles.eliminarTexto, { color: '#ff3b30' }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <Text style={[styles.total, { color: theme.colors.text }]}>Total: ${formatearConComas(total)}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleVistaPrevia}
      >
        <Text style={styles.buttonText}>Vista Previa Factura</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleAgregarFactura}
      >
        <Text style={styles.buttonText}>Crear Factura</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Ingrese la Cantidad</Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  borderColor: theme.colors.text,
                  color: theme.colors.text, // Ajuste del color del texto
                },
              ]}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={cantidadInput}
              onChangeText={setCantidadInput}
              placeholderTextColor={theme.colors.placeholder}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmarCantidad}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff3b30' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Cancelar</Text>
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  productoItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 16,
  },
  eliminarTexto: {
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  total: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: '100%',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});