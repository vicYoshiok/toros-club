import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [errors, setErrors] = useState({
    nombreCompleto: '',
    correo: '',
    telefono: '',
    ocupacion: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { nombreCompleto: '', correo: '', telefono: '', ocupacion: '' };

    if (!nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es obligatorio.';
      isValid = false;
    }

    if (!correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      newErrors.correo = 'El correo no es válido.';
      isValid = false;
    }

    if (!telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
    } else if (!/^\d{10}$/.test(telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos.';
      isValid = false;
    }

    if (!ocupacion.trim()) {
      newErrors.ocupacion = 'La ocupación es obligatoria.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post('http://192.168.0.115:3000/api/auth/register', {
          nombreCompleto,
          correo,
          telefono,
          ocupacion,
        });

        Alert.alert('Éxito', response.data.message);
        navigation.navigate('Login'); // Redirigir al login después del registro
      } catch (err) {
        console.error(err);
        Alert.alert('Error', err.response?.data?.message || 'Error al registrar el usuario.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.leftColumn}>
          <Image
            source={require('../assets/logo.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
          
        </View>
        <View style={styles.rightColumn}>
        <Text style={styles.welcomeText}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#999"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
          />
          {errors.nombreCompleto ? <Text style={styles.errorText}>{errors.nombreCompleto}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
          />
          {errors.correo ? <Text style={styles.errorText}>{errors.correo}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Ocupación"
            placeholderTextColor="#999"
            value={ocupacion}
            onChangeText={setOcupacion}
          />
          {errors.ocupacion ? <Text style={styles.errorText}>{errors.ocupacion}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    flexDirection: 'row',
    width: '80%',
    height: 500,
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftColumn: {
    flex: 1,
    backgroundColor: '#FBBE08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    fontFamily: 'MiFuente',
    fontSize: 40,
    color: '#000',
    textAlign: 'center',
    paddingBottom:20,
  },
  input: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#FBBE08',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FBBE08',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  image: {
    width: '80%',
    height: '80%',
  },
});

export default RegisterScreen;