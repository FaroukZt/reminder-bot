import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'reminder_tasks';

export class TaskService {
  static getAllTasks(): Task[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        nextTrigger: new Date(task.nextTrigger),
        lastTriggered: task.lastTriggered ? new Date(task.lastTriggered) : undefined,
      }));
    } catch (error) {
      console.error('Error parsing tasks:', error);
      return [];
    }
  }

  static saveTask(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
    };

    const tasks = this.getAllTasks();
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  }

  static updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks[index];
  }

  static deleteTask(id: string): boolean {
    const tasks = this.getAllTasks();
    const filtered = tasks.filter(t => t.id !== id);
    
    if (filtered.length === tasks.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static toggleTaskStatus(id: string): Task | null {
    const tasks = this.getAllTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) return null;
    
    task.isActive = !task.isActive;
    const index = tasks.findIndex(t => t.id === id);
    tasks[index] = task;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return task;
  }

  static calculateNextTriggerTime(duration: number, unit: string, pattern: string): Date {
    const now = new Date();
    const next = new Date(now);

    if (unit === 'دقيقة') {
      next.setMinutes(next.getMinutes() + duration);
    } else if (unit === 'ساعة') {
      next.setHours(next.getHours() + duration);
    } else if (unit === 'يوم') {
      next.setDate(next.getDate() + duration);
    }

    return next;
  }
}
