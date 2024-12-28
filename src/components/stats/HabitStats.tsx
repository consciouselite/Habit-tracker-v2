import type { Database } from '../../lib/database.types';

type HabitWithStats = Database['public']['Tables']['habits']['Row'] & {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  weeklyProgress: boolean[];
};

type HabitStatsProps = {
  habit: HabitWithStats;
};

export function HabitStats({ habit }: HabitStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{habit.name}</h3>
        <span className={`px-2 py-1 text-xs rounded-full bg-${getCategoryColor(habit.category)}-100 text-${getCategoryColor(habit.category)}-800`}>
          {habit.category}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard
          label="Current Streak"
          value={habit.currentStreak}
          unit="days"
          icon="🔥"
        />
        <StatCard
          label="Best Streak"
          value={habit.bestStreak}
          unit="days"
          icon="⭐"
        />
        <StatCard
          label="Completion Rate"
          value={habit.completionRate}
          unit="%"
          icon="📊"
        />
      </div>

      <WeeklyProgressGrid progress={habit.weeklyProgress} />
    </div>
  );
}

function StatCard({ label, value, unit, icon }: { label: string; value: number; unit: string; icon: string }) {
  return (
    <div className="text-center p-2 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium text-lg text-gray-900">
        {value}
        {unit}
      </div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function WeeklyProgressGrid({ progress }: { progress: boolean[] }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Progress</h4>
      <div className="grid grid-cols-7 gap-1">
        {progress.map((completed, index) => (
          <div
            key={index}
            className={`w-full pt-[100%] rounded-sm ${
              completed ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
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
