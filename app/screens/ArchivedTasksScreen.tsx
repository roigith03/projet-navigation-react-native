import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import DataSingleton from '../../data/DataSingleton';
import { Task } from '../../data/TaskModel';

interface ArchivedTasksScreenProps {
  navigation: any;
  onLogout: () => void; // Add onLogout prop
}

export default function ArchivedTasksScreen({ navigation, onLogout }: ArchivedTasksScreenProps) {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]); // State to manage archived tasks

  useEffect(() => {
    const fetchArchivedTasks = () => {
      const tasks = DataSingleton.getArchivedTasks(); // Fetch archived tasks
      setArchivedTasks(tasks); // Update state with archived tasks
    };

    fetchArchivedTasks(); // Initial fetch when component mounts
  }, []);

  const handleUnarchiveTask = (taskId: string) => {
    // Update the task to set isDone to false, which will unarchive it
    DataSingleton.updateTask(taskId, { isDone: false });

    // Refresh the archived tasks list
    setArchivedTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));

    // Navigate back to TaskListScreen after unarchiving
    navigation.navigate('TaskListScreen');
  };

  const formatDate = (dateString: string) => {
    const taskDate = new Date(dateString.replace(' ', 'T')); // Convert to ISO format for Date
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

    return `${formattedDate}, ${formattedTime}`; // Return combined formatted date and time
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={archivedTasks}
        keyExtractor={task => task.taskId}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{formatDate(item.date)}</Text> {/* Formatted date and time */}
            <Text style={styles.status}>Status: Archived</Text>
            <Button
              title="Unarchive"
              onPress={() => handleUnarchiveTask(item.taskId)} // Call the unarchive function
            />
          </View>
        )}
        ListEmptyComponent={<Text>No archived tasks available.</Text>}
      />
      <Button color={'red'} title="Logout" onPress={onLogout} /> {/* Logout Button */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
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
  status: {
    marginVertical: 5,
    fontStyle: 'italic',
  },
});
