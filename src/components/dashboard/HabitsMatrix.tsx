import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type HabitCompletion = {
  date: string;
  completed: boolean;
};

export function HabitsMatrix() {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const weeks = 4;
  const daysPerWeek = 7;

  useEffect(() => {
    // Simulate habit completion data
    const today = new Date();
    const data: HabitCompletion[] = [];
    
    for (let i = 0; i < weeks * daysPerWeek; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        completed: Math.random() > 0.5,
      });
    }
    
    setCompletions(data.reverse());
  }, [user]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Progress</h2>
      <div className="grid grid-cols-7 gap-2">
        {completions.map((completion, index) => (
          <div
            key={index}
            className={`w-full pt-[100%] rounded-full relative ${
              completion.completed ? 'bg-purple-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
