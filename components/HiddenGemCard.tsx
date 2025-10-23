'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { HiddenGem, GemComment, Profile } from '@/utils/types';
import { formatDistanceToNow } from 'date-fns';

interface HiddenGemCardProps {
  gem: HiddenGem;
  currentUserId?: string;
  onUpvoteChange?: () => void;
}

export default function HiddenGemCard({ gem, currentUserId, onUpvoteChange }: HiddenGemCardProps) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(gem.upvotes);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<GemComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      checkUpvoteStatus();
    }
    loadComments();

    const channel = supabase
      .channel(`gem_comments_${gem.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gem_comments',
          filter: `gem_id=eq.${gem.id}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gem.id, currentUserId]);

  const checkUpvoteStatus = async () => {
    if (!currentUserId) return;

    const { data } = await supabase
      .from('gem_upvotes')
      .select('id')
      .eq('gem_id', gem.id)
      .eq('user_id', currentUserId)
      .maybeSingle();

    setHasUpvoted(!!data);
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('gem_comments')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('gem_id', gem.id)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data as GemComment[]);
    }
  };

  const handleUpvote = async () => {
    if (!currentUserId) return;

    if (hasUpvoted) {
      await supabase.from('gem_upvotes').delete().eq('gem_id', gem.id).eq('user_id', currentUserId);
      await supabase.rpc('decrement_gem_upvotes', { gem_uuid: gem.id });
      setUpvoteCount(upvoteCount - 1);
      setHasUpvoted(false);
    } else {
      await supabase.from('gem_upvotes').insert({ gem_id: gem.id, user_id: currentUserId });
      await supabase.rpc('increment_gem_upvotes', { gem_uuid: gem.id });
      await supabase.rpc('award_xp', { user_uuid: currentUserId, xp_amount: 5 });
      setUpvoteCount(upvoteCount + 1);
      setHasUpvoted(true);
    }

    if (onUpvoteChange) {
      onUpvoteChange();
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await supabase.from('gem_comments').insert({
      gem_id: gem.id,
      user_id: currentUserId,
      text: newComment.trim(),
    });

    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {gem.image_url && (
          <div className="relative h-48 w-full">
            <img
              src={gem.image_url}
              alt={gem.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-400 to-mint-400 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-md">
              <Sparkles className="w-4 h-4" />
              Hidden Gem
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{gem.name}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-3">{gem.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span>
            {gem.latitude.toFixed(4)}, {gem.longitude.toFixed(4)}
          </span>
        </div>
        {gem.profiles && (
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={gem.profiles.avatar_url} />
              <AvatarFallback>{gem.profiles.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">by {gem.profiles.username}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col items-stretch gap-3">
        <div className="flex gap-2">
          <Button
            variant={hasUpvoted ? 'default' : 'outline'}
            size="sm"
            onClick={handleUpvote}
            disabled={!currentUserId}
            className={hasUpvoted ? 'bg-gradient-to-r from-teal-500 to-mint-500' : ''}
          >
            <Heart className={`w-4 h-4 mr-1 ${hasUpvoted ? 'fill-current' : ''}`} />
            {upvoteCount}
          </Button>
          <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen} className="flex-1">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle className="w-4 h-4 mr-1" />
                {comments.length} Comments
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={comment.profiles?.avatar_url} />
                          <AvatarFallback>
                            {comment.profiles?.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-800">
                              {comment.profiles?.username}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(comment.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {currentUserId && (
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-sm"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-gradient-to-r from-teal-500 to-mint-500"
                  >
                    Post
                  </Button>
                </form>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardFooter>
    </Card>
  );
}
