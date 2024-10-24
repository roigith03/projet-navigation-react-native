import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DataSingleton from '../../data/DataSingleton';

export default function LoginScreen({ navigation, setIsLoggedIn }: { navigation: any, setIsLoggedIn: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    // Verify user credentials
    const isValidUser = await DataSingleton.loginUser(email, password);
    if (isValidUser) {
      Alert.alert('Success', 'Login successful!');
      setIsLoggedIn(true); // Update the state to indicate the user is logged in
      navigation.navigate('TaskListScreen'); // Navigate to the task list
    } else {
      Alert.alert('Error', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
});
