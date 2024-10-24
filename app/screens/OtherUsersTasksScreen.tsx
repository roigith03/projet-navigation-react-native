import React from 'react'; 
import { View, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface OtherUsersTasksScreenProps {
  onLogout: () => void; // Add onLogout prop
}

// Simulated tasks with specified properties
const tasks = [
  {
    taskId: '1',
    ownerId: '2', // Owner is different
    ownerName: 'Alice Johnson',
    ownerEmail: 'alice.johnson@example.com',
    title: 'Finish Project Report',
    description: 'Complete the project report by end of the week.',
    isDone: false,
    date: '2024-10-20 12:00:00', // Format: yyyy-MM-dd HH:mm:ss
  },
  {
    taskId: '2',
    ownerId: '3', // Owner is different
    ownerName: 'Bob Smith',
    ownerEmail: 'bob.smith@example.com',
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week.',
    isDone: false,
    date: '2024-10-21 09:00:00', // Format: yyyy-MM-dd HH:mm:ss
  },
  {
    taskId: '3',
    ownerId: '4', // Owner is different
    ownerName: 'Charlie Brown',
    ownerEmail: 'charlie.brown@example.com',
    title: 'Workout',
    description: 'Attend the gym at 6 PM.',
    isDone: false,
    date: '2024-10-22 18:00:00', // Format: yyyy-MM-dd HH:mm:ss
  },
];

const OtherUsersTasksScreen: React.FC<OtherUsersTasksScreenProps> = ({ onLogout }) => {
  const renderTaskItem = ({ item }: any) => {
    const taskDate = new Date(item.date.replace(' ', 'T')); // Convert to ISO format for Date

    const formattedDate = taskDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = taskDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return (
      <View style={styles.taskItem}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.ownerInfo}>
          Owner: <Text style={styles.boldText}>{item.ownerName}</Text> ({item.ownerEmail})
        </Text>
        <Text>{`${formattedDate}, ${formattedTime}`}</Text>
        <Text style={styles.status}>
          Status: {item.isDone ? 'Completed' : 'Not Completed'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={task => task.taskId}
        renderItem={renderTaskItem}
        ListEmptyComponent={<Text>No tasks available.</Text>}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity> {/* Logout Button */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ownerInfo: {
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold', // Make owner info bold
  },
  status: {
    marginVertical: 5,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#FF0000', // Example color for logout button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default OtherUsersTasksScreen;
