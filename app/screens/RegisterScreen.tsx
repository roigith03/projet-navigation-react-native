import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DataSingleton from '../../data/DataSingleton';
import { User } from '../../data/UserModel';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => { // Marked as async
    console.log('Attempting to register:', { firstName, lastName, email, password });

    const newUser: User = {
      userId: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
      tasks: []
    };

    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      console.log('Adding user:', newUser);
      await DataSingleton.addUser(newUser); // Await the asynchronous call
      console.log('User added successfully');

      // Display success alert
      Alert.alert('Success', 'You have registered successfully!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Navigating to LoginScreen');
            navigation.navigate('LoginScreen'); // Ensure 'LoginScreen' is the correct name
          },
        },
      ]);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
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
      <Button title="Register" onPress={handleRegister} />
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
