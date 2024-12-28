import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/navigation/BottomNav';
import { CoachTweet } from '../components/dashboard/CoachTweet';
import { VisionBoard } from '../components/dashboard/VisionBoard';
import { HabitsMatrix } from '../components/dashboard/HabitsMatrix';
import { TransformationTimeline } from '../components/dashboard/TransformationTimeline';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [dayOfYear, setDayOfYear] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userName = await supabase
       .from('profiles')
       .select('first_name, last_name')
       .eq('id', user.id)
       .single();
      if (!userName || !userName.data) return;
      setFullName(`${userName.data.first_name} ${userName.data.last_name}`);
      setDayOfYear(Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000));
      setLoaded(true);
    };
    fetchUserData();
  }, [user]);

  if (!loaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {fullName}'s Dashboard 👋
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to your personalized habit transformation journey.
        </p>

        <CoachTweet day={dayOfYear} />
        <VisionBoard />
        <HabitsMatrix />
        <TransformationTimeline />
      </div>
      <BottomNav />
    </div>
  );
}
