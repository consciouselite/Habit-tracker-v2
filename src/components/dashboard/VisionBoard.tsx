import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Goal = Database['public']['Tables']['goals']['Row'];

const GOAL_IMAGES = [
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&h=250',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&h=250',
  'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=400&h=250',
];

export function VisionBoard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchGoals() {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id);
      if (data) setGoals(data);
    }
    fetchGoals();
  }, [user]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % goals.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + goals.length) % goals.length);
  };

  if (!goals.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Vision Board</h2>
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {goals.map((goal, index) => (
              <div
                key={goal.id}
                className="w-full flex-shrink-0"
              >
                <div className="relative">
                  <img
                    src={GOAL_IMAGES[index % GOAL_IMAGES.length]}
                    alt={goal.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-sm text-gray-200">{goal.importance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
