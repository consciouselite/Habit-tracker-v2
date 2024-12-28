import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Post = Database['public']['Tables']['flexbook_posts']['Row'] & {
  likes: number;
  comments: Array<{ id: string; text: string; created_at: string }>;
};

type FlexPostProps = {
  post: Post;
};

export function FlexPost({ post }: FlexPostProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.caption,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Add comment logic here
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="font-bold text-gray-900">{post.title}</h2>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-500">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full aspect-square object-cover"
      />

      {/* Actions */}
      <div className="flex items-center space-x-4 p-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            liked ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
          <span>{post.likes + (liked ? 1 : 0)}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-500"
        >
          <MessageCircle className="h-6 w-6" />
          <span>{post.comments.length}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 text-gray-500"
        >
          <Share2 className="h-6 w-6" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-gray-800">{post.caption}</p>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t px-4 py-3">
          <div className="space-y-3 mb-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="text-sm">
                <p className="text-gray-800">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
