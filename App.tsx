import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import DataSingleton from './data/DataSingleton';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const currentUserId = await DataSingleton.getCurrentUserId(); // Implement this method in DataSingleton
      if (currentUserId) {
        setIsLoggedIn(true);
      }
    };

    checkUserSession();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </NavigationContainer>
  );
}
