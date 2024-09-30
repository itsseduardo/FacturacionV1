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
    color: 'black',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 450, // Cambia el ancho según lo que necesites
    height: 500, // Cambia la altura según lo que necesites
    resizeMode: 'hover', // Mantiene la proporción de la imagen
    marginVertical: 10,
  },
});

export default Styles;
