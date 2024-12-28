import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/navigation/BottomNav';
import { HabitStats } from '../components/stats/HabitStats';
import { ComparisonChart } from '../components/stats/ComparisonChart';
import { TrendChart } from '../components/stats/TrendChart';
import type { Database } from '../lib/database.types';

type HabitWithStats = Database['public']['Tables']['habits']['Row'] & {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  weeklyProgress: boolean[];
  monthlyData: number[];
};

export default function Stats() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);

  useEffect(() => {
    async function fetchHabits() {
      const { data } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user!.id);

      if (data) {
        // Simulate stats data
        const habitsWithStats = data.map(habit => ({
          ...habit,
          currentStreak: Math.floor(Math.random() * 10),
          bestStreak: Math.floor(Math.random() * 30),
          completionRate: Math.floor(Math.random() * 100),
          weeklyProgress: Array(7).fill(false).map(() => Math.random() > 0.5),
          monthlyData: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
        }));
        setHabits(habitsWithStats);
        setSelectedHabit(habitsWithStats[0]);
      }
    }
    fetchHabits();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h1>

        {/* Habit Selection */}
        <div className="flex overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          {habits.map(habit => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(habit)}
              className={`flex-shrink-0 px-4 py-2 rounded-full mr-2 text-sm font-medium ${
                selectedHabit?.id === habit.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {habit.name}
            </button>
          ))}
        </div>

        {/* Selected Habit Stats */}
        {selectedHabit && (
          <>
            <HabitStats habit={selectedHabit} />
            <div className="space-y-6">
              <TrendChart habit={selectedHabit} />
              <ComparisonChart habits={habits} />
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
