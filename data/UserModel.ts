export type Task = {
  taskId: string;
  ownerId: string;
  title: string;
  description: string;
  isDone: boolean;
  date: string;
  owner: { firstName: string; lastName: string };  // Nom et prénom du propriétaire
};

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: Task[];  // Chaque utilisateur a une liste de tâches
};

export class UserSingleton {
  private static instance: UserSingleton;
  private users: User[] = [];
  private loggedInUser: User | null = null;

  private constructor() {}

  public static getInstance(): UserSingleton {
    if (!UserSingleton.instance) {
      UserSingleton.instance = new UserSingleton();
    }
    return UserSingleton.instance;
  }

  // Créer un nouvel utilisateur
  public createUser(firstName: string, lastName: string, email: string, password: string): User {
    const newUser: User = {
      userId: Math.random().toString(36).substr(2, 9),  // Génère un ID unique
      firstName,
      lastName,
      email,
      password,
      tasks: [],  // Initialiser les tâches comme un tableau vide
    };
    this.users.push(newUser);
    return newUser;
  }

  // Connexion d'un utilisateur existant
  public login(email: string, password: string): User | null {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (user) {
      this.loggedInUser = user;
      return user;
    }
    return null;
  }

  // Déconnexion de l'utilisateur
  public logout(): void {
    this.loggedInUser = null;
  }

  // Récupérer l'utilisateur connecté
  public getLoggedInUser(): User | null {
    return this.loggedInUser;
  }

  // Créer une nouvelle tâche pour l'utilisateur connecté
  public createTask(title: string, description: string): Task | null {
    if (this.loggedInUser) {
      const newTask: Task = {
        taskId: Math.random().toString(36).substr(2, 9),  // Unique task ID
        ownerId: this.loggedInUser.userId,
        title,
        description,
        isDone: false,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
        owner: { firstName: this.loggedInUser.firstName, lastName: this.loggedInUser.lastName },
      };
      console.log("Creating task:", newTask); // Log the created task
      this.loggedInUser.tasks.push(newTask);
      return newTask;
    }
    return null;
  }
  

  public getTasks(): Task[] | null {
      if (this.loggedInUser) {
        console.log('Tâches de l\'utilisateur connecté:', this.loggedInUser.tasks);  // Vérifier les tâches de l'utilisateur connecté
        return this.loggedInUser.tasks;  // Retourne les tâches de l'utilisateur connecté
      }
      console.log('Aucun utilisateur connecté.');  // Débogage si aucun utilisateur n'est connecté
      return null;  // Si aucun utilisateur n'est connecté
    }
   

  // Récupérer les tâches de tous les utilisateurs
  public getTasksFromAllUsers(): Task[] {
    let allTasks: Task[] = [];
    this.users.forEach(user => {
      allTasks = [...allTasks, ...user.tasks];
    });
    return allTasks;
  }

  // Modifier une tâche
  public updateTask(taskId: string, title: string, description: string, isDone: boolean): boolean {
    if (this.loggedInUser) {
      const task = this.loggedInUser.tasks.find((t) => t.taskId === taskId);
      if (task && task.ownerId === this.loggedInUser.userId) {
        task.title = title;
        task.description = description;
        task.isDone = isDone;
        return true;
      }
    }
    return false;
  }
}