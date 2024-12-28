import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Goal = Database['public']['Tables']['goals']['Row'];

export function GoalsSummary() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user!.id);

        if (error) throw error;
        setGoals(data || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-900">{goal.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{goal.importance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
