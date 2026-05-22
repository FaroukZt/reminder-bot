import {
  Client,
  User,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { TaskService } from './taskService.js';
import { formatTimeRemaining, formatDateTime } from '../utils/timeUtils.js';
import { logger } from '../utils/logger.js';

export class NotificationService {
  private static client: Client;

  static initialize(client: Client) {
    this.client = client;
  }

  static async sendNotification(
    userId: string,
    taskName: string,
    nextTrigger: Date
  ) {
    try {
      const user = await this.client.users.fetch(userId);
      if (!user) {
        logger.error(`User ${userId} not found`);
        return;
      }

      const dmChannel = await user.createDM();
      const embed = new EmbedBuilder()
        .setColor('#ff6b35')
        .setTitle('⏰ تنبيه المهمة')
        .setDescription(`حان الوقت للقيام بـ: **${taskName}**`)
        .addFields(
          {
            name: '📋 المهمة',
            value: taskName,
            inline: true,
          },
          {
            name: '⏱️ الوقت الحالي',
            value: formatDateTime(new Date()),
            inline: true,
          },
          {
            name: '📅 التنبيه التالي',
            value: formatDateTime(nextTrigger),
            inline: false,
          }
        )
        .setTimestamp();

      await dmChannel.send({ embeds: [embed] });
      logger.info(`Notification sent to ${userId} for task: ${taskName}`);
    } catch (error) {
      logger.error(`Error sending notification to ${userId}:`, error);
    }
  }

  static async checkAndSendNotifications() {
    try {
      const activeTasks = await TaskService.getActiveTasks();
      const now = new Date();

      for (const task of activeTasks) {
        if (now >= task.nextTrigger && !task.notificationSent) {
          await this.sendNotification(task.userId, task.name, task.nextTrigger);
          await TaskService.markAsNotified(task._id.toString(), task.pattern);
        }
      }
    } catch (error) {
      logger.error('Error checking notifications:', error);
    }
  }
}
