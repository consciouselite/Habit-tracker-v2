import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { TextArea } from '../../components/forms/TextArea';
import { supabase } from '../../lib/supabase';
import { assessmentSchema } from '../../lib/validations/onboarding';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

type AssessmentInput = {
  limitingBeliefs: string;
  badHabits: string;
  timeWasters: string;
  energyDrainers: string;
  growthBlockers: string;
};

export default function OldMe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AssessmentInput>({
    resolver: zodResolver(assessmentSchema),
  });

  const onSubmit = async (data: AssessmentInput) => {
    try {
      const { error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: user!.id,
          assessment_type: 'old_me',
          limiting_beliefs: data.limitingBeliefs,
          bad_habits: data.badHabits,
          time_wasters: data.timeWasters,
          energy_drainers: data.energyDrainers,
          growth_blockers: data.growthBlockers,
        });

      if (assessmentError) throw assessmentError;

      navigate('/onboarding/new-me');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={5}>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assess Your Current State</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <TextArea
            label="What limiting beliefs hold you back?"
            {...register('limitingBeliefs')}
            error={errors.limitingBeliefs?.message}
          />

          <TextArea
            label="What bad habits do you want to change?"
            {...register('badHabits')}
            error={errors.badHabits?.message}
          />

          <TextArea
            label="What activities waste your time?"
            {...register('timeWasters')}
            error={errors.timeWasters?.message}
          />

          <TextArea
            label="What drains your energy?"
            {...register('energyDrainers')}
            error={errors.energyDrainers?.message}
          />

          <TextArea
            label="What blocks your personal growth?"
            {...register('growthBlockers')}
            error={errors.growthBlockers?.message}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
