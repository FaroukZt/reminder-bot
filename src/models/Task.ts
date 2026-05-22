import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types/index.js';

const TaskSchema = new Schema<ITask>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  durationUnit: {
    type: String,
    required: true,
    enum: ['دقيقة', 'ساعة', 'يوم'],
  },
  pattern: {
    type: String,
    required: true,
    enum: ['مرة_واحدة', 'يومي', 'أسبوعي'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nextTrigger: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastTriggered: {
    type: Date,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
