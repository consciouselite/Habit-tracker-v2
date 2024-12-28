import { useMemo } from 'react';
import type { Database } from '../../lib/database.types';

type HabitWithStats = Database['public']['Tables']['habits']['Row'] & {
  completionRate: number;
};

type ComparisonChartProps = {
  habits: HabitWithStats[];
};

export function ComparisonChart({ habits }: ComparisonChartProps) {
  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => b.completionRate - a.completionRate);
  }, [habits]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium text-gray-900 mb-4">Habit Comparison</h3>
      <div className="space-y-4">
        {sortedHabits.map(habit => (
          <div key={habit.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{habit.name}</span>
              <span className="text-gray-600">{habit.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${getCategoryColor(habit.category)}-500`}
                style={{ width: `${habit.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors = {
    Health: 'green',
    Productivity: 'blue',
    Finance: 'yellow',
    Relationships: 'pink',
    Learning: 'purple',
    'Spiritual/Mental': 'indigo',
  };
  return colors[category as keyof typeof colors] || 'gray';
}
