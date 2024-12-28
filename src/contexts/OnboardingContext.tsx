import { createContext, useContext, useReducer, ReactNode } from 'react';

type OnboardingState = {
  step: number;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
  survey: {
    ageCategory: string;
  };
  goals: Array<{
    name: string;
    importance: string;
  }>;
  habits: Array<{
    name: string;
    category: string;
    description: string;
  }>;
  oldMe: {
    limitingBeliefs: string;
    badHabits: string;
    timeWasters: string;
    energyDrainers: string;
    growthBlockers: string;
  };
  newMe: {
    newBeliefs: string;
    empoweringHabits: string;
    timeInvestment: string;
    energyGains: string;
    growthAreas: string;
  };
};

type OnboardingAction =
  | { type: 'SET_PROFILE'; payload: OnboardingState['profile'] }
  | { type: 'SET_SURVEY'; payload: OnboardingState['survey'] }
  | { type: 'SET_GOALS'; payload: OnboardingState['goals'] }
  | { type: 'SET_HABITS'; payload: OnboardingState['habits'] }
  | { type: 'SET_OLD_ME'; payload: OnboardingState['oldMe'] }
  | { type: 'SET_NEW_ME'; payload: OnboardingState['newMe'] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

const initialState: OnboardingState = {
  step: 1,
  profile: {
    firstName: '',
    lastName: '',
    email: '',
  },
  survey: {
    ageCategory: '',
  },
  goals: [],
  habits: [],
  oldMe: {
    limitingBeliefs: '',
    badHabits: '',
    timeWasters: '',
    energyDrainers: '',
    growthBlockers: '',
  },
  newMe: {
    newBeliefs: '',
    empoweringHabits: '',
    timeInvestment: '',
    energyGains: '',
    growthAreas: '',
  },
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_SURVEY':
      return { ...state, survey: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'SET_OLD_ME':
      return { ...state, oldMe: action.payload };
    case 'SET_NEW_ME':
      return { ...state, newMe: action.payload };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) };
    default:
      return state;
  }
}

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
} | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
