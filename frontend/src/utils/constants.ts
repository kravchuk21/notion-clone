export const PRIORITY_COLORS = {
  HIGH: 'bg-priority-high',
  MEDIUM: 'bg-priority-medium',
  LOW: 'bg-priority-low',
} as const;

export const PRIORITY_LABELS = {
  HIGH: 'Высокий',
  MEDIUM: 'Средний',
  LOW: 'Низкий',
} as const;

export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'Высокий', color: 'bg-priority-high' },
  { value: 'MEDIUM', label: 'Средний', color: 'bg-priority-medium' },
  { value: 'LOW', label: 'Низкий', color: 'bg-priority-low' },
] as const;

export const TAG_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
] as const;

export const getTagColor = (index: number) => {
  return TAG_COLORS[index % TAG_COLORS.length];
};

