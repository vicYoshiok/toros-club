import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({
    correo: '',
    contrasena: '',
  });

  // Cargar la fuente personalizada
  const [fontsLoaded] = useFonts({
    'MiFuente': require('../fonts/TypoCollegeDemo.otf'),
  });

  // Verificar si el usuario ya ha iniciado sesión
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          navigation.replace('Home'); // Redirigir a Home si ya hay una sesión activa
        }
      } catch (err) {
        console.error('Error al verificar el estado de inicio de sesión:', err);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  // Ocultar la pantalla de splash cuando la fuente esté cargada
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Si la fuente no está cargada, retornar null
  if (!fontsLoaded) {
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = { correo: '', contrasena: '' };

    if (!correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      newErrors.correo = 'El correo no es válido.';
      isValid = false;
    }

    if (!contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es obligatoria.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post('http://192.168.0.115:3000/api/auth/login', {
          correo,
          contrasena,
        });

        // Guardar el estado de inicio de sesión
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        Alert.alert('Éxito', response.data.message);
        navigation.replace('Home'); // Usar replace en lugar de navigate
      } catch (err) {
        console.error(err);
        Alert.alert('Error', err.response?.data?.message || 'Error al iniciar sesión.');
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
          <Text style={styles.welcomeText}>Iniciar Sesión</Text>
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
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />
          {errors.contrasena ? <Text style={styles.errorText}>{errors.contrasena}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
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
  image: {
    width: '80%',
    height: '80%',
  },
  rectangle: {
    flexDirection: 'row',
    width: '80%',
    height: 400,
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
    fontSize:40,
    color: '#000',
    textAlign: 'center',
    paddingBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#FBBE08',
    padding: 10,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 15,
    height: 40,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
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
});

export default LoginScreen;