import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type CoachTweetProps = {
  day: number;
};

export function CoachTweet({ day }: CoachTweetProps) {
  const [tweet, setTweet] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return { goals: '', vision: '' };
      }
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('goals, vision, firstName')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile data:', profileError);
          return { goals: '', vision: '', firstName: '' };
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
          return { goals: profileData.goals, vision: profileData.vision, firstName: profileData.firstName, streak: 0 };
        }

        return { goals: profileData.goals, vision: profileData.vision, firstName: profileData.firstName, streak: streakData.streak };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return { goals: '', vision: '', firstName: '', streak: 0 };
      }
    };

    const generateTweet = async () => {
      const userData = await fetchUserData();
      const geminiApiKey = 'AIzaSyAigFtUTFDG91r2Z8daT09qGCUMYtzl94w';
      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
      const prompt = `Generate a short, supportive and relatable tweet for ${userData.firstName} on this ${dayOfWeek} based on their goals: ${userData.goals}, vision: ${userData.vision}, and current habit streak of ${userData.streak} days. The tweet should not include emojis or hashtags.`;

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
      } catch (error) {
        console.error('Error generating tweet:', error);
        setTweet('Failed to generate tweet.');
      }
    };

    generateTweet();
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
        <span className="mx-2">•</span>
        <span>❤️ 1.2k</span>
        <span className="mx-2">•</span>
        <span>🔄 345</span>
      </div>
    </div>
  );
}
