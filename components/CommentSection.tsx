'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Comment = {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
};

type CommentSectionProps = {
  pinId: string;
};

export default function CommentSection({ pinId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [pinId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('pin_id', pinId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          pin_id: pinId,
          content: newComment.trim(),
          author_name: authorName.trim() || 'Anonymous',
        })
        .select()
        .single();

      if (error) throw error;

      setComments([data, ...comments]);
      setNewComment('');
      setShowForm(false);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={24} className="animate-spin text-[#C46C24]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle size={20} className="text-[#C46C24]" />
          Comments ({comments.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-[#C46C24] hover:text-[#A05A1D] font-medium"
          >
            Add Comment
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition text-sm"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this place..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition resize-none text-sm"
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C46C24] text-white rounded-lg text-sm font-medium hover:bg-[#A05A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Post
            </button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No comments yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">
                  {comment.author_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
