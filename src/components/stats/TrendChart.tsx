import { useMemo } from 'react';
import type { Database } from '../../lib/database.types';

type HabitWithTrend = Database['public']['Tables']['habits']['Row'] & {
  monthlyData: number[];
};

type TrendChartProps = {
  habit: HabitWithTrend;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function TrendChart({ habit }: TrendChartProps) {
  const maxValue = useMemo(() => Math.max(...habit.monthlyData), [habit.monthlyData]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium text-gray-900 mb-4">Yearly Trend</h3>
      <div className="relative h-40">
        <div className="absolute inset-0 flex items-end">
          {habit.monthlyData.map((value, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className={`w-4 bg-${getCategoryColor(habit.category)}-500 rounded-t`}
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-gray-600 mt-1">{MONTHS[index]}</span>
            </div>
          ))}
        </div>
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
