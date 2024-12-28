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
        const { data, error } = await supabase
          .from('profiles')
          .select('goals, vision')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return { goals: '', vision: '' };
        }
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return { goals: '', vision: '' };
      }
    };

    const generateTweet = async () => {
      const userData = await fetchUserData();
      const geminiApiKey = 'AIzaSyAigFtUTFDG91r2Z8daT09qGCUMYtzl94w'; // Replace with your actual API key
      const prompt = `Generate a motivational tweet based on the following user goals: ${userData.goals} and vision: ${userData.vision}.`;

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
