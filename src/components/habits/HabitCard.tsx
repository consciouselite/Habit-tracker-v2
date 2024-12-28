import { Check, Pencil, Trash2 } from 'lucide-react';
import { WeeklyProgress } from './WeeklyProgress';
import type { Database } from '../../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'] & {
  streak: number;
  progress: boolean[];
};

type HabitCardProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

const CATEGORY_COLORS = {
  Health: 'green',
  Productivity: 'blue',
  Finance: 'yellow',
  Relationships: 'pink',
  Learning: 'purple',
  'Spiritual/Mental': 'indigo',
} as const;

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const categoryColor = CATEGORY_COLORS[habit.category];
  const isCompletedToday = habit.progress[habit.progress.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{habit.name}</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full bg-${categoryColor}-100 text-${categoryColor}-800 mt-1`}>
            {habit.category}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(habit)}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {habit.description && (
        <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{habit.streak}</span> day streak
        </div>
        <button
          onClick={() => onToggle(habit.id)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
            isCompletedToday
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Check className={`h-4 w-4 ${isCompletedToday ? 'text-green-500' : ''}`} />
          <span>{isCompletedToday ? 'Completed' : 'Mark Complete'}</span>
        </button>
      </div>

      <WeeklyProgress progress={habit.progress} color={categoryColor} />
    </div>
  );
}
