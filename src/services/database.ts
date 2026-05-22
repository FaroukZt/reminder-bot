import mongoose from 'mongoose';
import { config } from '../config/config.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ تم الاتصال بـ MongoDB بنجاح');
  } catch (error) {
    console.error('❌ خطأ في الاتصال بـ MongoDB:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log('✅ تم قطع الاتصال بـ MongoDB');
  } catch (error) {
    console.error('❌ خطأ في قطع الاتصال:', error);
  }
}
