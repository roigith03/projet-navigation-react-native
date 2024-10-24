import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './UserModel';
import { Task } from './TaskModel';

class DataSingleton {
  private static instance: DataSingleton;
  private users: User[] = [];
  private tasks: Task[] = [];
  private currentUserId: string | null = null;

  private constructor() {
    this.loadUsers(); // Load users from AsyncStorage on initialization
    this.loadTasks(); // Load tasks from AsyncStorage on initialization
    this.loadCurrentUser(); // Load the currently logged-in user ID
    this.prepopulateData(); // Prepopulate tasks and users if needed
  }

  public static getInstance(): DataSingleton {
    if (!DataSingleton.instance) {
      DataSingleton.instance = new DataSingleton();
    }
    return DataSingleton.instance;
  }

  // Prepopulate users and tasks for testing
  private async prepopulateData() {
    const storedUsers = await AsyncStorage.getItem('users');
    const storedTasks = await AsyncStorage.getItem('tasks');

    if (!storedUsers || !storedTasks) {
      // Simulate some users
      this.users = [
        {
          userId: '1', email: 'user1@example.com', password: 'password123',
          firstName: '',
          lastName: '',
          tasks: []
        },
        {
          userId: '2', email: 'user2@example.com', password: 'password456',
          firstName: '',
          lastName: '',
          tasks: []
        },
        {
          userId: '3', email: 'user3@example.com', password: 'password789',
          firstName: '',
          lastName: '',
          tasks: []
        },
      ];

      // Simulate some tasks
      this.tasks = [
        {
          taskId: '1',
          ownerId: '1',
          title: 'Complete React Native Project',
          description: 'Finish the development of the React Native app',
          isDone: true, // Completed task
          date: '2024-10-01',
        },
        {
          taskId: '2',
          ownerId: '1',
          title: 'Review PRs',
          description: 'Check and review pending pull requests',
          isDone: false, // Incomplete task
          date: '2024-10-02',
        },
        {
          taskId: '3',
          ownerId: '2',
          title: 'Submit Expense Report',
          description: 'Submit the Q3 expense report',
          isDone: true, // Completed task
          date: '2024-09-25',
        },
        {
          taskId: '4',
          ownerId: '2',
          title: 'Prepare Presentation',
          description: 'Prepare slides for the next team meeting',
          isDone: false, // Incomplete task
          date: '2024-10-03',
        },
        {
          taskId: '5',
          ownerId: '3',
          title: 'Fix Bug #32',
          description: 'Resolve the issue in the login flow',
          isDone: true, // Completed task
          date: '2024-10-05',
        },
      ];

      // Save prepopulated data to AsyncStorage
      await this.saveUsers();
      await this.saveTasks();
    }
  }

  // Load users from AsyncStorage
  private async loadUsers() {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  // Save users to AsyncStorage
  private async saveUsers() {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  // Load tasks from AsyncStorage
  private async loadTasks() {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  // Save tasks to AsyncStorage
  private async saveTasks() {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }

  // Load current user ID from AsyncStorage
  private async loadCurrentUser() {
    try {
      const userId = await AsyncStorage.getItem('currentUserId');
      this.currentUserId = userId;
    } catch (error) {
      console.error('Failed to load current user ID:', error);
    }
  }

  // Save current user ID to AsyncStorage
  private async saveCurrentUser(userId: string) {
    try {
      await AsyncStorage.setItem('currentUserId', userId);
      this.currentUserId = userId;
    } catch (error) {
      console.error('Failed to save current user ID:', error);
    }
  }

  // User management
  public async addUser(user: User) {
    this.users.push(user);
    await this.saveUsers(); // Save users after adding a new user
  }

  public async loginUser(email: string, password: string): Promise<boolean> {
    const user = this.users.find(user => user.email === email && user.password === password);
    if (user) {
      await this.saveCurrentUser(user.userId); // Save user ID for the logged-in user
      return true; // Return true if login is successful
    }
    return false; // Return false if user is not found
  }

  public async logoutUser() {
    await AsyncStorage.removeItem('currentUserId');
    this.currentUserId = null;
  }

  public verifyUser(email: string, password: string): boolean {
    return this.users.some(user => user.email === email && user.password === password);
  }

  public getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  public getUser(email: string, password: string): User | undefined {
    return this.users.find(user => user.email === email && user.password === password);
  }

  // Task management
  public getTasksByOwner(userId: string, isDone: boolean): Task[] {
    return this.tasks.filter(task => task.ownerId === userId && task.isDone === isDone);
  }

  public getTasksByOtherUsers(userId: string, isDone: boolean): Task[] {
    return this.tasks.filter(task => task.ownerId !== userId && task.isDone === isDone);
  }

  public getArchivedTasks(): Task[] {
    return this.tasks.filter(task => task.isDone === true);
  }

  public addTask(task: Task) {
    this.tasks.push(task);
    this.saveTasks(); // Save tasks after adding a new task
  }

  public updateTask(taskId: string, updatedTask: Partial<Task>) {
    const taskIndex = this.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
      this.saveTasks(); // Save tasks after updating
    }
  }
}

export default DataSingleton.getInstance();
