import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { TaskService } from '../../services/taskService.js';
import { createSuccessEmbed, createErrorEmbed, createTaskEmbed } from '../../utils/embeds.js';
import { Pattern, DurationUnit } from '../../types/index.js';
import { logger } from '../../utils/logger.js';

export const addTaskCommand = {
  data: new SlashCommandBuilder()
    .setName('add-task')
    .setNameLocalization('ar', 'اضف-مهمة')
    .setDescription('Add a new task with reminders')
    .setDescriptionLocalization('ar', 'أضف مهمة جديدة مع تذكيرات')
    .addStringOption((option) =>
      option
        .setName('name')
        .setNameLocalization('ar', 'الاسم')
        .setDescription('Task name')
        .setDescriptionLocalization('ar', 'اسم المهمة')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addNumberOption((option) =>
      option
        .setName('duration')
        .setNameLocalization('ar', 'المدة')
        .setDescription('Task duration')
        .setDescriptionLocalization('ar', 'مدة المهمة')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10000)
    )
    .addStringOption((option) =>
      option
        .setName('unit')
        .setNameLocalization('ar', 'الوحدة')
        .setDescription('Time unit')
        .setDescriptionLocalization('ar', 'وحدة الزمن')
        .setRequired(true)
        .addChoices(
          { name: 'Minute', name_localizations: { ar: 'دقيقة' }, value: 'دقيقة' },
          { name: 'Hour', name_localizations: { ar: 'ساعة' }, value: 'ساعة' },
          { name: 'Day', name_localizations: { ar: 'يوم' }, value: 'يوم' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('pattern')
        .setNameLocalization('ar', 'النمط')
        .setDescription('Repeat pattern')
        .setDescriptionLocalization('ar', 'نمط التكرار')
        .setRequired(false)
        .setChoices(
          { name: 'Once', name_localizations: { ar: 'مرة واحدة' }, value: 'مرة_واحدة' },
          { name: 'Daily', name_localizations: { ar: 'يومي' }, value: 'يومي' },
          { name: 'Weekly', name_localizations: { ar: 'أسبوعي' }, value: 'أسبوعي' }
        )
    ),

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const name = interaction.options.getString('name', true);
      const duration = interaction.options.getNumber('duration', true);
      const unit = interaction.options.getString('unit', true) as DurationUnit;
      const pattern = (interaction.options.getString('pattern') || 'مرة_واحدة') as Pattern;

      const task = await TaskService.createTask(interaction.user.id, {
        name,
        duration,
        durationUnit: unit,
        pattern,
      });

      const embed = createTaskEmbed(task);
      const successEmbed = createSuccessEmbed(
        'تم إضافة المهمة',
        `تم إضافة المهمة **${name}** بنجاح!`
      );

      await interaction.editReply({ embeds: [successEmbed, embed] });
      logger.success(`Task created: ${task._id} by ${interaction.user.id}`);
    } catch (error) {
      logger.error('Error creating task:', error);
      const embed = createErrorEmbed(
        'خطأ',
        'حدث خطأ أثناء إضافة المهمة. يرجى المحاولة مرة أخرى.'
      );
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
