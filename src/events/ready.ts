import { Events, Client } from 'discord.js';
import { NotificationService } from '../services/notificationService.js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import cron from 'node-cron';

export const readyEvent = {
  name: Events.ClientReady,
  once: false,
  execute(client: Client<true>) {
    logger.success(`✅ Bot is ready as ${client.user.tag}`);

    // Initialize notification service
    NotificationService.initialize(client);

    // Check notifications every minute
    cron.schedule('*/1 * * * *', async () => {
      await NotificationService.checkAndSendNotifications();
    });

    logger.info('Notification scheduler started');
  },
};
