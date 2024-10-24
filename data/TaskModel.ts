export interface Task {
  taskId: string;       // Unique identifier for the task
  ownerId: string;      // User ID of the task owner
  title: string;        // Title of the task
  description: string;  // Detailed description of the task
  isDone: boolean;      // Status of the task (completed or not)
  date: string;         // Date associated with the task
  ownerName?: string;   // Optional name of the task owner
  ownerEmail?: string;  // Optional email of the task owner
}
