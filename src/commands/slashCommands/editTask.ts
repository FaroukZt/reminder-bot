import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { TaskService } from '../../services/taskService.js';
import { createSuccessEmbed, createErrorEmbed, createTaskEmbed } from '../../utils/embeds.js';
import { calculateNextTriggerTime } from '../../utils/timeUtils.js';
import { logger } from '../../utils/logger.js';

export const editTaskCommand = {
  data: new SlashCommandBuilder()
    .setName('edit-task')
    .setNameLocalization('ar', 'عدل-مهمة')
    .setDescription('Edit an existing task')
    .setDescriptionLocalization('ar', 'عدل مهمة موجودة')
    .addStringOption((option) =>
      option
        .setName('task_id')
        .setNameLocalization('ar', 'معرف_المهمة')
        .setDescription('Task ID')
        .setDescriptionLocalization('ar', 'معرف المهمة')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('duration')
        .setNameLocalization('ar', 'المدة')
        .setDescription('New duration')
        .setDescriptionLocalization('ar', 'المدة الجديدة')
        .setRequired(false)
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName('name')
        .setNameLocalization('ar', 'الاسم')
        .setDescription('New task name')
        .setDescriptionLocalization('ar', 'اسم المهمة الجديد')
        .setRequired(false)
        .setMaxLength(100)
    ),

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const taskId = interaction.options.getString('task_id', true);
      const newDuration = interaction.options.getNumber('duration');
      const newName = interaction.options.getString('name');

      const task = await TaskService.getTaskById(taskId);

      if (!task) {
        const embed = createErrorEmbed('خطأ', 'لم يتم العثور على المهمة المطلوبة.');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      if (task.userId !== interaction.user.id) {
        const embed = createErrorEmbed('خطأ', 'لا يمكنك تعديل مهام الآخرين!');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const updates: any = {};

      if (newName) updates.name = newName;
      if (newDuration) {
        updates.duration = newDuration;
        updates.nextTrigger = calculateNextTriggerTime(
          newDuration,
          task.durationUnit,
          task.pattern
        );
      }

      const updatedTask = await TaskService.updateTask(taskId, updates);

      if (updatedTask) {
        const embed = createTaskEmbed(updatedTask);
        const successEmbed = createSuccessEmbed(
          'تم التحديث',
          'تم تحديث المهمة بنجاح!'
        );
        await interaction.editReply({ embeds: [successEmbed, embed] });
        logger.success(`Task updated: ${taskId}`);
      }
    } catch (error) {
      logger.error('Error updating task:', error);
      const embed = createErrorEmbed(
        'خطأ',
        'حدث خطأ أثناء تحديث المهمة. يرجى المحاولة مرة أخرى.'
      );
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
