import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { addTaskCommand } from './slashCommands/addTask.js';
import { listTasksCommand } from './slashCommands/listTasks.js';
import { editTaskCommand } from './slashCommands/editTask.js';
import { deleteTaskCommand } from './slashCommands/deleteTask.js';
import { helpCommand } from './slashCommands/help.js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

export const commands = [
  addTaskCommand,
  listTasksCommand,
  editTaskCommand,
  deleteTaskCommand,
  helpCommand,
];

export async function registerCommands() {
  const rest = new REST().setToken(config.discord.token);
  const commandsData = commands.map((cmd) => cmd.data);

  try {
    logger.info('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(
        config.discord.clientId,
        config.discord.guildId
      ),
      { body: commandsData }
    );
    logger.success('✅ Slash commands registered successfully');
  } catch (error) {
    logger.error('Failed to register commands:', error);
    throw error;
  }
}

export function getCommandByName(name: string) {
  return commands.find((cmd) => cmd.data.name === name);
}
