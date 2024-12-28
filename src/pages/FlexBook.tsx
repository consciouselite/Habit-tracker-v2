import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/navigation/BottomNav';
import { FlexPost } from '../components/flexbook/FlexPost';
import { GratitudeForm } from '../components/flexbook/GratitudeForm';
import { Plus } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Post = Database['public']['Tables']['flexbook_posts']['Row'] & {
  likes: number;
  comments: Array<{ id: string; text: string; created_at: string }>;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    user_id: '1',
    title: '30 Days Meditation Streak! 🧘‍♂️',
    image_url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1080&h=1080',
    caption: 'Finally hit my first big milestone with meditation. Feeling more centered and focused than ever!',
    created_at: new Date().toISOString(),
    likes: 42,
    comments: [
      { id: '1', text: 'Amazing achievement! Keep it up! 🎉', created_at: new Date().toISOString() }
    ]
  },
  {
    id: '2',
    user_id: '1',
    title: 'Reading Goal Achieved! 📚',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1080&h=1080',
    caption: 'Just finished my 12th book this year! Knowledge is power! 💪',
    created_at: new Date().toISOString(),
    likes: 38,
    comments: [
      { id: '2', text: 'What was your favorite book? 📖', created_at: new Date().toISOString() }
    ]
  }
];

export default function FlexBook() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);

  const handleNewPost = (post: Post) => {
    setPosts([post, ...posts]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">FlexBook</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <FlexPost key={post.id} post={post} />
          ))}
        </div>

        {showForm && (
          <GratitudeForm
            onSubmit={handleNewPost}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
      <BottomNav />
    </div>
  );
}
