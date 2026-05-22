import { ITask, DurationUnit, Pattern } from '../types/index.js';

export function calculateNextTriggerTime(
  duration: number,
  unit: string,
  pattern: string
): Date {
  const now = new Date();
  const next = new Date(now);

  switch (unit) {
    case DurationUnit.MINUTE:
      next.setMinutes(next.getMinutes() + duration);
      break;
    case DurationUnit.HOUR:
      next.setHours(next.getHours() + duration);
      break;
    case DurationUnit.DAY:
      next.setDate(next.getDate() + duration);
      break;
  }

  if (pattern === Pattern.DAILY) {
    // اليوم القادم بنفس الوقت
    const nextDaily = new Date(next);
    nextDaily.setDate(nextDaily.getDate() + 1);
    return nextDaily;
  } else if (pattern === Pattern.WEEKLY) {
    // الأسبوع القادم بنفس اليوم والوقت
    const nextWeekly = new Date(next);
    nextWeekly.setDate(nextWeekly.getDate() + 7);
    return nextWeekly;
  }

  return next;
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatTimeRemaining(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return 'انتهى الوقت';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days} يوم و ${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
  if (minutes > 0) return `${minutes} دقيقة و ${seconds} ثانية`;
  return `${seconds} ثانية`;
}

export function getTaskSummary(task: ITask): string {
  const timeRemaining = formatTimeRemaining(task.nextTrigger);
  const status = task.isActive ? '✅ نشطة' : '⛔ موقوفة';

  return (
    `**${task.name}**\n` +
    `${status} | ${task.pattern}\n` +
    `المدة: ${task.duration} ${task.durationUnit}\n` +
    `الوقت المتبقي: ${timeRemaining}`
  );
}
