import { Task } from '../models/Task.js';
import { ITask, TaskInput, Pattern } from '../types/index.js';
import { calculateNextTriggerTime } from '../utils/timeUtils.js';

export class TaskService {
  static async createTask(userId: string, input: TaskInput): Promise<ITask> {
    const nextTrigger = calculateNextTriggerTime(
      input.duration,
      input.durationUnit,
      input.pattern
    );

    const task = new Task({
      userId,
      name: input.name,
      duration: input.duration,
      durationUnit: input.durationUnit,
      pattern: input.pattern,
      nextTrigger,
      isActive: true,
      notificationSent: false,
    });

    return await task.save();
  }

  static async getUserTasks(userId: string): Promise<ITask[]> {
    return await Task.find({ userId }).sort({ nextTrigger: 1 });
  }

  static async getActiveTasks(): Promise<ITask[]> {
    return await Task.find({
      isActive: true,
      notificationSent: false,
    }).sort({ nextTrigger: 1 });
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }

  static async updateTask(
    taskId: string,
    updates: Partial<ITask>
  ): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(taskId, updates, { new: true });
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(taskId);
    return !!result;
  }

  static async toggleTaskStatus(taskId: string): Promise<ITask | null> {
    const task = await Task.findById(taskId);
    if (!task) return null;

    task.isActive = !task.isActive;
    return await task.save();
  }

  static async markAsNotified(taskId: string, pattern: Pattern): Promise<void> {
    const task = await Task.findById(taskId);
    if (!task) return;

    task.lastTriggered = new Date();
    task.notificationSent = true;

    if (pattern === Pattern.ONCE) {
      task.isActive = false;
    } else {
      task.nextTrigger = calculateNextTriggerTime(
        task.duration,
        task.durationUnit,
        task.pattern
      );
      task.notificationSent = false;
    }

    await task.save();
  }
}
