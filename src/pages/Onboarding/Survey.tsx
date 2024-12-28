import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { RadioGroup } from '../../components/forms/RadioGroup';
import { supabase } from '../../lib/supabase';
import { surveySchema } from '../../lib/validations/onboarding';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const AGE_OPTIONS = [
  { label: '18-25', value: '18-25' },
  { label: '26-35', value: '26-35' },
  { label: '36-45', value: '36-45' },
  { label: '46+', value: '46+' },
];

type SurveyInput = {
  ageCategory: '18-25' | '26-35' | '36-45' | '46+';
};

export default function Survey() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<SurveyInput>({
    resolver: zodResolver(surveySchema),
  });

  const ageCategory = watch('ageCategory');

  const onSubmit = async (data: SurveyInput) => {
    try {
      const { error: surveyError } = await supabase
        .from('onboarding_surveys')
        .insert({
          user_id: user!.id,
          age_category: data.ageCategory,
        });

      if (surveyError) throw surveyError;

      navigate('/onboarding/goals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={5}>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <RadioGroup
            label="What is your age group?"
            options={AGE_OPTIONS}
            value={ageCategory || ''}
            onChange={(value) => setValue('ageCategory', value as SurveyInput['ageCategory'])}
            error={errors.ageCategory?.message}
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
