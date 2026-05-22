import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config/config.js';
import { connectDatabase, disconnectDatabase } from './services/database.js';
import { registerCommands, commands } from './commands/commandHandler.js';
import { events } from './events/eventHandler.js';
import { logger } from './utils/logger.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Handle process termination
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await disconnectDatabase();
  client.destroy();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Register events
events.forEach((event) => {
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
});

// Connect to database and start bot
async function start() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    logger.success('✅ Database connected');

    // Register slash commands
    await registerCommands();

    // Login to Discord
    await client.login(config.discord.token);
    logger.success('✅ Bot logged in');
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

start();
