import { useAuth } from '../../contexts/AuthContext';

type CoachTweetProps = {
  day: number;
};

export function CoachTweet({ day }: CoachTweetProps) {
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
        "Believe in the power of small habits. Consistency is key to unlocking your potential. #AtomicHabits #2025Goals"
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
