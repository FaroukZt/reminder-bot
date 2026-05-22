import { Document } from 'mongoose';

export interface ITask extends Document {
  userId: string;
  name: string;
  duration: number;
  durationUnit: 'دقيقة' | 'ساعة' | 'يوم';
  pattern: 'مرة_واحدة' | 'يومي' | 'أسبوعي';
  createdAt: Date;
  nextTrigger: Date;
  isActive: boolean;
  lastTriggered?: Date;
  notificationSent: boolean;
}

export interface TaskInput {
  name: string;
  duration: number;
  durationUnit: 'دقيقة' | 'ساعة' | 'يوم';
  pattern: 'مرة_واحدة' | 'يومي' | 'أسبوعي';
}

export enum DurationUnit {
  MINUTE = 'دقيقة',
  HOUR = 'ساعة',
  DAY = 'يوم',
}

export enum Pattern {
  ONCE = 'مرة_واحدة',
  DAILY = 'يومي',
  WEEKLY = 'أسبوعي',
}
