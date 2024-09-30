import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue', // Color de fondo del botón
    paddingVertical: 10,        // Espaciado vertical
    paddingHorizontal: 20,      // Espaciado horizontal
    borderRadius: 5,            // Borde redondeado
    marginVertical: 10,         // Margen vertical
    alignItems: 'center',       // Alinear texto al centro
  },
  buttonText: {
    color: 'white',             // Color del texto
    fontSize: 16,               // Tamaño del texto
    fontWeight: 'bold',         // Negrita
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginVertical: 10,
    borderRadius: 5,
  },
  
});

export default Styles;
