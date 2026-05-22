export interface Task {
  id: string;
  name: string;
  duration: number; // في الدقائق
  durationUnit: 'دقيقة' | 'ساعة' | 'يوم';
  pattern: 'يومي' | 'أسبوعي' | 'مخصص';
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  nextTrigger: Date;
  notificationSent: boolean;
  color?: string;
}

export interface NotificationData {
  taskId: string;
  taskName: string;
  time: Date;
}

export interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  notificationEnabled: boolean;
  defaultPattern: 'يومي' | 'أسبوعي' | 'مخصص';
}
