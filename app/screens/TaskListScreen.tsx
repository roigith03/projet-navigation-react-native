import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import DataSingleton from '../../data/DataSingleton';
import { Task } from '../../data/TaskModel';

interface TaskListScreenProps {
  onLogout: () => void;
}

export default function TaskListScreen({ onLogout }: TaskListScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const userId = '1'; // Replace with actual logged-in user ID

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const userTasks = DataSingleton.getTasksByOwner(userId, false) || []; // Fallback to an empty array
    setTasks(userTasks);
  };

  const handleAddTask = () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please enter both title and description.');
      return;
    }

    const newTask: Task = {
      taskId: Date.now().toString(),
      ownerId: userId,
      title,
      description,
      isDone: false,
      date: new Date().toISOString(),
    };

    DataSingleton.addTask(newTask);
    resetForm();
    loadTasks();
    Alert.alert('Success', 'Task added successfully!');
  };

  const handleToggleTaskStatus = (taskId: string, isDone: boolean) => {
    DataSingleton.updateTask(taskId, { isDone: !isDone });
    loadTasks();
    Alert.alert('Success', isDone ? 'Task marked as not done!' : 'Task marked as done!');
  };

  const handleArchiveTask = (taskId: string) => {
    DataSingleton.updateTask(taskId, { isDone: true });
    loadTasks();
    Alert.alert('Success', 'Task archived successfully!');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!title || !description || !editingTask) {
      Alert.alert('Error', 'Please enter both title and description.');
      return;
    }

    const updatedTask: Task = {
      ...editingTask,
      title,
      description,
    };

    DataSingleton.updateTask(editingTask.taskId, updatedTask);
    resetForm();
    loadTasks();
    Alert.alert('Success', 'Task updated successfully!');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIsEditing(false);
    setEditingTask(null);
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const taskDate = new Date(item.date);
    
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
        <Text style={[styles.taskTitle, item.isDone && styles.completed]}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{`${formattedDate}, ${formattedTime}`}</Text>
        <Text style={styles.status}>
          Status: {item.isDone ? 'Completed' : 'Not Completed'}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => handleEditTask(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.archiveButton]}
            onPress={() => handleArchiveTask(item.taskId)}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={task => task.taskId}
        renderItem={renderTaskItem}
        ListEmptyComponent={<Text>No tasks available.</Text>}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Edit Task</Text>
          <TextInput
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
            style={styles.modalInput}
          />
          <Button title="Save" onPress={handleSaveEdit} />
          <Button color={'grey'} title="Cancel" onPress={resetForm} />
        </View>
      </Modal>
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
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  status: {
    marginVertical: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffca28',
  },
  archiveButton: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalHeader: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
});
