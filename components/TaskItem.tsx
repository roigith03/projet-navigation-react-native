import React from 'react';
import { View, Text, Button } from 'react-native';
import { Task } from '../data/TaskModel';

interface TaskItemProps {
  task: Task;
  onArchiveTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onArchiveTask }) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
      <Text>{task.date}</Text>
      <Button title="Archive" onPress={() => onArchiveTask(task.taskId)} />
    </View>
  );
};

export default TaskItem;
