import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/navigation/BottomNav';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitForm } from '../components/habits/HabitForm';
import type { Database } from '../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'] & {
  streak: number;
  progress: boolean[];
};

export default function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    fetchHabits();
  }, [user]);

  async function fetchHabits() {
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user!.id);

    if (data) {
      // Simulate progress and streak data
      const habitsWithProgress = data.map(habit => ({
        ...habit,
        streak: Math.floor(Math.random() * 10),
        progress: Array(14).fill(false).map(() => Math.random() > 0.5),
      }));
      setHabits(habitsWithProgress);
    }
  }

  async function handleSubmit(data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'streak' | 'progress'>) {
    if (editingHabit) {
      await supabase
        .from('habits')
        .update(data)
        .eq('id', editingHabit.id);
    } else {
      await supabase
        .from('habits')
        .insert({
          ...data,
          user_id: user!.id,
        });
    }
    
    setShowForm(false);
    setEditingHabit(null);
    fetchHabits();
  }

  async function handleDelete(id: string) {
    await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    fetchHabits();
  }

  async function handleToggle(id: string) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newProgress = [...habit.progress];
    newProgress[newProgress.length - 1] = !newProgress[newProgress.length - 1];

    setHabits(habits.map(h => 
      h.id === id ? { ...h, progress: newProgress } : h
    ));
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Habit</span>
          </button>
        </div>

        <div className="space-y-4">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={(habit) => {
                setEditingHabit(habit);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {(showForm || editingHabit) && (
          <HabitForm
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
            initialData={editingHabit || undefined}
          />
        )}
      </div>
      <BottomNav />
    </div>
  );
}
