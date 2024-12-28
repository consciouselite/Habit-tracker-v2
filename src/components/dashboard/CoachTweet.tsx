import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type CoachTweetProps = {
  day: number;
};

export function CoachTweet({ day }: CoachTweetProps) {
  const [tweet, setTweet] = useState<string>('');
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return { goals: [], assessments: [], first_name: '', streak: 0 };
      }
      try {
        const { data: profileData, error: profileError } = await supabase
       .from('profiles')
       .select('first_name')
       .eq('id', user.id)
       .single();

        if (profileError) {
          console.error('Error fetching user profile data:', profileError);
          return { goals: [], assessments: [], first_name: '', streak: 0 };
        }

        const { data: goalsData, error: goalsError } = await supabase
       .from('goals')
       .select('name, importance')
       .eq('user_id', user.id);

        if (goalsError) {
          console.error('Error fetching user goals data:', goalsError);
          return { goals: [], assessments: [], first_name: profileData.first_name, streak: 0 };
        }

        const oldMeAssessments = await supabase
       .from('assessments')
       .select('assessment_type, value')
       .eq('user_id', user.id)
       .in('assessment_type', ['limiting_beliefs', 'bad_habits', 'time_wasters', 'energy_drainers', 'growth_blockers'])
       .not('value', 'is', null);

        if (oldMeAssessments.error) {
          console.error('Error fetching old me assessments:', oldMeAssessments.error);
          return { goals: goalsData, assessments: [], first_name: profileData.first_name, streak: 0 };
        }

        const newMeAssessments = await supabase
       .from('assessments')
       .select('assessment_type, value')
       .eq('user_id', user.id)
       .in('assessment_type', ['new_beliefs', 'empowering_habits', 'time_investment', 'energy_gains', 'growth_areas'])
       .not('value', 'is', null);

          if (newMeAssessments.error) {
            console.error('Error fetching new me assessments:', newMeAssessments.error);
            return { goals: goalsData, assessments: oldMeAssessments.data, first_name: profileData.first_name, streak: 0 };
          }

        const { data: streakData, error: streakError } = await supabase
       .from('habit_streaks')
       .select('streak')
       .eq('user_id', user.id)
       .order('created_at', { ascending: false })
       .limit(1)
       .single();

        if (streakError) {
          console.error('Error fetching user streak data:', streakError);
           return { goals: goalsData, assessments: [...oldMeAssessments.data,...newMeAssessments.data], first_name: profileData.first_name, streak: 0 };
        }

        return { goals: goalsData, assessments: [...oldMeAssessments.data,...newMeAssessments.data], first_name: profileData.first_name, streak: streakData.streak };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return { goals: [], assessments: [], first_name: '', streak: 0 };
      }
    };

const generateTweet = async () => {
  const userData = await fetchUserData();
  const geminiApiKey = 'AIzaSyAigFtUTFDG91r2Z8daT09qGCUMYtzl94w';
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  let goalsText = '';
  if (userData.goals) {
    goalsText = userData.goals.map((goal: { name: string, importance: string }) => {
      return `You want to achieve ${goal.name} because ${goal.importance}.`;
    }).join(' ');
  }

  let assessmentText = '';
  if (userData.assessments) {
    assessmentText = userData.assessments.map((assessment: { assessment_type: string; value: string }) => {
      return `You have ${assessment.assessment_type} of ${assessment.value}.`;
    }).join(' ');
  }

  const prompt = `Generate a short, supportive and relatable tweet for ${userData.first_name} on this ${dayOfWeek} based on their goals: ${goalsText} and assessments: ${assessmentText}. The tweet should not include emojis or hashtags.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }],
          }],
        }),
      }
    );
    const data = await response.json();
    const generatedTweet = data.candidates[0].content.parts[0].text;
    setTweet(generatedTweet);
    localStorage.setItem('tweet', generatedTweet);
  } catch (error) {
    console.error('Error generating tweet:', error);
    setTweet('Failed to generate tweet.');
  }
};
    const storedTweet = localStorage.getItem('tweet');
    if (storedTweet) {
      setTweet(storedTweet);
    } else {
      const todayDate = new Date();
      const storedDate = localStorage.getItem('date');
      if (!storedDate || storedDate!== todayDate.toISOString().split('T')[0]) {
        generateTweet();
        localStorage.setItem('date', todayDate.toISOString().split('T')[0]);
      }
    }
  }, [user]);

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="flex items-center mb-3">
        <img
          src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=48&h=48"
          alt="Coach"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">Your Coach</h3>
          <p className="text-sm text-gray-500">@coach</p>
        </div>
      </div>
      <p className="text-gray-800 mb-3">
        {tweet}
      </p>
      <div className="flex items-center text-gray-500 text-sm">
        <span>Day {day}/365</span>
      </div>
    </div>
  );
}
