import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { TextField } from '../../components/forms/TextField';
import { Select } from '../../components/forms/Select';
import { TextArea } from '../../components/forms/TextArea';
import { supabase } from '../../lib/supabase';
import { habitSchema } from '../../lib/validations/onboarding';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const HABIT_CATEGORIES = [
  { label: 'Health', value: 'Health' },
  { label: 'Productivity', value: 'Productivity' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Relationships', value: 'Relationships' },
  { label: 'Learning', value: 'Learning' },
  { label: 'Spiritual/Mental', value: 'Spiritual/Mental' },
];

type HabitInput = {
  name: string;
  category: 'Health' | 'Productivity' | 'Finance' | 'Relationships' | 'Learning' | 'Spiritual/Mental';
  description: string;
};

export default function Habits() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
  });

  const onSubmit = async (data: HabitInput) => {
    try {
      const { error: habitError } = await supabase
        .from('habits')
        .insert({
          user_id: user!.id,
          name: data.name,
          category: data.category,
          description: data.description,
        });

      if (habitError) throw habitError;

      setHabits([...habits, data]);
      reset();

      if (habits.length >= 2) {
        navigate('/onboarding/old-me');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={5}>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Habits</h2>
        
        {habits.map((habit, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{habit.name}</h3>
            <p className="text-sm text-gray-500">{habit.category}</p>
            <p className="text-sm text-gray-600 mt-2">{habit.description}</p>
          </div>
        ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <TextField
            label="Habit Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Select
            label="Category"
            options={HABIT_CATEGORIES}
            {...register('category')}
            error={errors.category?.message}
          />

          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/onboarding/old-me')}
              className="text-blue-600 hover:text-blue-500"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
