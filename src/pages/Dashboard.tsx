import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/navigation/BottomNav';
import { CoachTweet } from '../components/dashboard/CoachTweet';
import { VisionBoard } from '../components/dashboard/VisionBoard';
import { HabitsMatrix } from '../components/dashboard/HabitsMatrix';
import { TransformationTimeline } from '../components/dashboard/TransformationTimeline';

export default function Dashboard() {
  const { user } = useAuth();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.email}'s Dashboard 👋
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
