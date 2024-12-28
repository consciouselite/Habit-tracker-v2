import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { TextField } from '../../components/forms/TextField';
import { TextArea } from '../../components/forms/TextArea';
import { supabase } from '../../lib/supabase';
import { goalSchema } from '../../lib/validations/onboarding';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

type GoalInput = {
  name: string;
  importance: string;
};

export default function Goals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = async (data: GoalInput) => {
    try {
      if (goals.length >= 3) {
        throw new Error('Maximum 3 goals allowed');
      }

      const newGoals = [...goals, data];
      setGoals(newGoals);
      reset();

      if (newGoals.length === 3) {
        const { error: goalsError } = await supabase
          .from('goals')
          .insert(
            newGoals.map(goal => ({
              user_id: user!.id,
              name: goal.name,
              importance: goal.importance,
            }))
          );

        if (goalsError) throw goalsError;
        navigate('/onboarding/habits');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={5}>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Your Goals</h2>
        <div className="mb-6">
          <p className="text-gray-600">Add up to 3 goals that matter most to you ({3 - goals.length} remaining)</p>
        </div>

        {goals.map((goal, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{goal.name}</h3>
            <p className="text-sm text-gray-600">{goal.importance}</p>
          </div>
        ))}

        {goals.length < 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <TextField
              label="Goal Name"
              {...register('name')}
              error={errors.name?.message}
            />

            <TextArea
              label="Why this matters"
              {...register('importance')}
              error={errors.importance?.message}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : goals.length === 2 ? 'Complete Goals' : 'Add Goal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </OnboardingLayout>
  );
}
