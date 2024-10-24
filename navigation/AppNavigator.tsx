import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../app/screens/LoginScreen';
import RegisterScreen from '../app/screens/RegisterScreen';
import TaskListScreen from '../app/screens/TaskListScreen';
import ArchivedTasksScreen from '../app/screens/ArchivedTasksScreen';
import OtherUsersTasksScreen from '../app/screens/OtherUsersTasksScreen';
import DataSingleton from '../data/DataSingleton'; // Import DataSingleton

const Tab = createBottomTabNavigator();

interface AppNavigatorProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppNavigator({ isLoggedIn, setIsLoggedIn }: AppNavigatorProps) {
  
  const handleLogout = async () => {
    await DataSingleton.logoutUser(); // Call the logout method
    setIsLoggedIn(false); // Update the logged-in state
  };

  return (
    <Tab.Navigator>
      {!isLoggedIn ? (
        <>
          <Tab.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
          <Tab.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="My Tasks">
            {(props) => (
              <TaskListScreen {...props} onLogout={handleLogout} />
            )}
          </Tab.Screen>          
          <Tab.Screen name="Other Users' Tasks">
            {(props) => (
              <OtherUsersTasksScreen {...props} onLogout={handleLogout} />
            )}
          </Tab.Screen>
          <Tab.Screen name="Archived Tasks">
            {(props) => (
              <ArchivedTasksScreen {...props} onLogout={handleLogout} />
            )}
          </Tab.Screen>

        </>
      )}
    </Tab.Navigator>
  );
}
