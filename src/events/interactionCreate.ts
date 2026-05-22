import { Events, Interaction } from 'discord.js';
import { getCommandByName } from '../commands/commandHandler.js';
import { logger } from '../utils/logger.js';

export const interactionCreateEvent = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = getCommandByName(interaction.commandName);

    if (!command) {
      logger.warn(`No command found for ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(
        `Error executing command ${interaction.commandName}:`,
        error
      );
      await interaction.reply({
        content: '❌ حدث خطأ أثناء تنفيذ الأمر!',
        ephemeral: true,
      });
    }
  },
};
