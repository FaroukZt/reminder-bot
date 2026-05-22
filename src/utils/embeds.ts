import { EmbedBuilder, Colors } from 'discord.js';
import { ITask } from '../types/index.js';
import { formatTimeRemaining, formatDateTime } from './timeUtils.js';

export function createTaskEmbed(task: ITask): EmbedBuilder {
  const status = task.isActive ? '✅ نشطة' : '⛔ موقوفة';
  const timeRemaining = formatTimeRemaining(task.nextTrigger);

  return new EmbedBuilder()
    .setColor(task.isActive ? Colors.Green : Colors.Red)
    .setTitle(`📋 ${task.name}`)
    .addFields(
      { name: 'الحالة', value: status, inline: true },
      { name: 'النمط', value: task.pattern, inline: true },
      { name: 'المدة', value: `${task.duration} ${task.durationUnit}`, inline: true },
      { name: 'التنبيه في', value: formatDateTime(task.nextTrigger), inline: false },
      { name: 'الوقت المتبقي', value: timeRemaining, inline: false },
      { name: 'تاريخ الإنشاء', value: formatDateTime(task.createdAt), inline: true }
    )
    .setFooter({ text: `ID: ${task._id.toString()}` })
    .setTimestamp();
}

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function createErrorEmbed(title: string, error: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle(`❌ ${title}`)
    .setDescription(error)
    .setTimestamp();
}

export function createHelpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle('📚 مساعدة البوت - تذكيرات Last War')
    .setDescription('إليك جميع الأوامر المتاحة:')
    .addFields(
      {
        name: '/add-task',
        value: 'إضافة مهمة جديدة\nالمتغيرات: name | duration | unit | pattern',
        inline: false,
      },
      {
        name: '/list-tasks',
        value: 'عرض جميع مهامك النشطة',
        inline: false,
      },
      {
        name: '/edit-task',
        value: 'تعديل مهمة موجودة\nالمتغيرات: task_id | duration | [name]',
        inline: false,
      },
      {
        name: '/delete-task',
        value: 'حذف مهمة\nالمتغيرات: task_id',
        inline: false,
      },
      {
        name: '/toggle-task',
        value: 'تفعيل/إيقاف مهمة\nالمتغيرات: task_id',
        inline: false,
      },
      {
        name: 'وحدات الوقت المدعومة',
        value: 'دقيقة | ساعة | يوم',
        inline: false,
      },
      {
        name: 'الأنماط المدعومة',
        value: 'مرة_واحدة | يومي | أسبوعي',
        inline: false,
      }
    )
    .setTimestamp();
}
