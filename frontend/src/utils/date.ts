import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: ru });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: ru });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
}

export function formatDeadline(date: string | Date): string {
  const d = new Date(date);

  if (isToday(d)) {
    return 'Сегодня';
  }

  if (isTomorrow(d)) {
    return 'Завтра';
  }

  return format(d, 'dd MMM', { locale: ru });
}

export function isOverdue(date: string | Date): boolean {
  return isPast(new Date(date)) && !isToday(new Date(date));
}

export function formatDateForInput(date: string | Date | null): string {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
}

