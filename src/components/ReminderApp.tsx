import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import NotificationModal from './NotificationModal';
import { Task, NotificationData } from '../types';
import { TaskService } from '../services/taskService';
import { NotificationService } from '../services/notificationService';
import './ReminderApp.css';

interface ReminderAppProps {
  onToggleDarkMode: () => void;
}

const ReminderApp: React.FC<ReminderAppProps> = ({ onToggleDarkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = TaskService.getAllTasks();
    setTasks(loadedTasks);
    NotificationService.requestPermission();
  }, []);

  // Check for tasks to trigger
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.isActive &&
          !task.notificationSent &&
          now >= task.nextTrigger
        ) {
          triggerNotification(task);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const triggerNotification = (task: Task) => {
    const notificationData: NotificationData = {
      taskId: task.id,
      taskName: task.name,
      time: new Date(),
    };

    setNotification(notificationData);
    setShowNotification(true);

    // Send browser notification
    NotificationService.sendNotification(`⏰ تنبيه: ${task.name}`, {
      body: `حان وقت: ${task.name}`,
      tag: task.id,
    });

    // Mark as notified
    const updated = TaskService.updateTask(task.id, {
      notificationSent: true,
      lastTriggered: new Date(),
    });
    if (updated) {
      setTasks(TaskService.getAllTasks());
    }
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = TaskService.saveTask(task);
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    const updated = TaskService.updateTask(id, updates);
    if (updated) {
      setTasks(TaskService.getAllTasks());
    }
  };

  const handleDeleteTask = (id: string) => {
    TaskService.deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    TaskService.toggleTaskStatus(id);
    setTasks(TaskService.getAllTasks());
  };

  return (
    <div className="reminder-app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎮 تطبيق التذكيرات - Last War</h1>
          <button className="theme-toggle" onClick={onToggleDarkMode} title="تبديل المظهر">
            🌙
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TaskForm onAddTask={handleAddTask} existingTasks={tasks} />
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        </div>
      </main>

      {showNotification && notification && (
        <NotificationModal
          notification={notification}
          onClose={() => setShowNotification(false)}
          onSnooze={(minutes) => {
            const task = tasks.find(t => t.id === notification.taskId);
            if (task) {
              const newNextTrigger = new Date();
              newNextTrigger.setMinutes(newNextTrigger.getMinutes() + minutes);
              handleUpdateTask(task.id, {
                nextTrigger: newNextTrigger,
                notificationSent: false,
              });
              setShowNotification(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default ReminderApp;
