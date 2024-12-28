import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { TextArea } from '../../components/forms/TextArea';
import { supabase } from '../../lib/supabase';
import { visionSchema } from '../../lib/validations/onboarding';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

type VisionInput = {
  newBeliefs: string;
  empoweringHabits: string;
  timeInvestment: string;
  energyGains: string;
  growthAreas: string;
};

export default function NewMe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VisionInput>({
    resolver: zodResolver(visionSchema),
  });

  const onSubmit = async (data: VisionInput) => {
    try {
      const { error: visionError } = await supabase
        .from('assessments')
        .insert({
          user_id: user!.id,
          assessment_type: 'new_me',
          new_beliefs: data.newBeliefs,
          empowering_habits: data.empoweringHabits,
          time_investment: data.timeInvestment,
          energy_gains: data.energyGains,
          growth_areas: data.growthAreas,
        });

      if (visionError) throw visionError;

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <OnboardingLayout currentStep={5} totalSteps={5}>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Envision Your Future Self</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <TextArea
            label="What new beliefs will empower you?"
            {...register('newBeliefs')}
            error={errors.newBeliefs?.message}
          />

          <TextArea
            label="What empowering habits will you develop?"
            {...register('empoweringHabits')}
            error={errors.empoweringHabits?.message}
          />

          <TextArea
            label="How will you invest your time?"
            {...register('timeInvestment')}
            error={errors.timeInvestment?.message}
          />

          <TextArea
            label="What will give you more energy?"
            {...register('energyGains')}
            error={errors.energyGains?.message}
          />

          <TextArea
            label="What areas will you focus on for growth?"
            {...register('growthAreas')}
            error={errors.growthAreas?.message}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Completing...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
