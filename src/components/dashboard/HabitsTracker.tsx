import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'];

export function HabitsTracker() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user!.id);

        if (error) throw error;
        setHabits(data || []);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Habit Tracker</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {habits.map((habit) => (
          <div key={habit.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{habit.name}</h3>
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {habit.category}
              </span>
            </div>
            {habit.description && (
              <p className="text-sm text-gray-600">{habit.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
