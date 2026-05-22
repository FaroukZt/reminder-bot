import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { TaskService } from '../../services/taskService.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';

export const deleteTaskCommand = {
  data: new SlashCommandBuilder()
    .setName('delete-task')
    .setNameLocalization('ar', 'حذف-مهمة')
    .setDescription('Delete a task')
    .setDescriptionLocalization('ar', 'حذف مهمة')
    .addStringOption((option) =>
      option
        .setName('task_id')
        .setNameLocalization('ar', 'معرف_المهمة')
        .setDescription('Task ID to delete')
        .setDescriptionLocalization('ar', 'معرف المهمة المراد حذفها')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const taskId = interaction.options.getString('task_id', true);
      const task = await TaskService.getTaskById(taskId);

      if (!task) {
        const embed = createErrorEmbed('خطأ', 'لم يتم العثور على المهمة.');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      if (task.userId !== interaction.user.id) {
        const embed = createErrorEmbed('خطأ', 'لا يمكنك حذف مهام الآخرين!');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const deleted = await TaskService.deleteTask(taskId);

      if (deleted) {
        const embed = createSuccessEmbed(
          'تم الحذف',
          `تم حذف المهمة **${task.name}** بنجاح.`
        );
        await interaction.editReply({ embeds: [embed] });
        logger.success(`Task deleted: ${taskId}`);
      }
    } catch (error) {
      logger.error('Error deleting task:', error);
      const embed = createErrorEmbed(
        'خطأ',
        'حدث خطأ أثناء حذف المهمة. يرجى المحاولة مرة أخرى.'
      );
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
