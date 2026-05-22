import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { createHelpEmbed } from '../../utils/embeds.js';

export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setNameLocalization('ar', 'مساعدة')
    .setDescription('Show help for all commands')
    .setDescriptionLocalization('ar', 'عرض مساعدة جميع الأوامر'),

  async execute(interaction: CommandInteraction) {
    const embed = createHelpEmbed();
    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
