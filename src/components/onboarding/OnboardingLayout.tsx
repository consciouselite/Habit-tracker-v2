import { Target } from 'lucide-react';

type OnboardingLayoutProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
};

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Target className="mx-auto h-12 w-12 text-blue-600" />
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
