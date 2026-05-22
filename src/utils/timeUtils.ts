export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} - ${formatTime(date)}`;
}

export function getTimeUntil(targetDate: Date): string {
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

export function convertToMinutes(duration: number, unit: string): number {
  switch (unit) {
    case 'دقيقة':
      return duration;
    case 'ساعة':
      return duration * 60;
    case 'يوم':
      return duration * 24 * 60;
    default:
      return duration;
  }
}
