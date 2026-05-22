import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { TaskService } from '../../services/taskService.js';
import { createErrorEmbed, createTaskEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';

export const listTasksCommand = {
  data: new SlashCommandBuilder()
    .setName('list-tasks')
    .setNameLocalization('ar', 'قائمة-المهام')
    .setDescription('Show all your active tasks')
    .setDescriptionLocalization('ar', 'عرض جميع مهامك النشطة'),

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const tasks = await TaskService.getUserTasks(interaction.user.id);

      if (tasks.length === 0) {
        const embed = new EmbedBuilder()
          .setColor(Colors.Yellow)
          .setTitle('📋 قائمة مهامك')
          .setDescription('لا توجد مهام حالياً. استخدم `/add-task` لإضافة مهمة جديدة!')
          .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const activeTasks = tasks.filter(t => t.isActive);
      const inactiveTasks = tasks.filter(t => !t.isActive);

      const embeds: EmbedBuilder[] = [];

      if (activeTasks.length > 0) {
        const activeEmbed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle('✅ المهام النشطة')
          .setDescription(`لديك **${activeTasks.length}** مهمة نشطة`);

        activeTasks.slice(0, 5).forEach((task) => {
          activeEmbed.addFields({
            name: task.name,
            value: `🔄 ${task.pattern} | ⏱️ ${task.duration} ${task.durationUnit}\nID: \`${task._id.toString()}\``,
            inline: false,
          });
        });

        embeds.push(activeEmbed);
      }

      if (inactiveTasks.length > 0) {
        const inactiveEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('⛔ المهام الموقوفة')
          .setDescription(`لديك **${inactiveTasks.length}** مهمة موقوفة`);

        inactiveTasks.slice(0, 5).forEach((task) => {
          inactiveEmbed.addFields({
            name: task.name,
            value: `🔄 ${task.pattern} | ⏱️ ${task.duration} ${task.durationUnit}\nID: \`${task._id.toString()}\``,
            inline: false,
          });
        });

        embeds.push(inactiveEmbed);
      }

      await interaction.editReply({ embeds });
      logger.info(`Listed tasks for user: ${interaction.user.id}`);
    } catch (error) {
      logger.error('Error listing tasks:', error);
      const embed = createErrorEmbed(
        'خطأ',
        'حدث خطأ أثناء جلب المهام. يرجى المحاولة مرة أخرى.'
      );
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
