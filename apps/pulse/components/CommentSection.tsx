'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { subscribeToComments, addComment, type Comment } from '@/lib/analytics';

interface CommentSectionProps {
    articleUrl: string;
}

export default function CommentSection({ articleUrl }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToComments(articleUrl, (updatedComments) => {
            setComments(updatedComments);
        });
        return () => unsubscribe();
    }, [articleUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(articleUrl, newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 bg-[#F9F7F2]   border border-white/10 shadow-2xl p-6 sm:p-8">
            {/* Header: Styled with the Brown Editorial vibe */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#A66152] flex items-center justify-center">
                    {/* Fixed blue icon: now terracotta to match theme */}
                    <MessageSquare className="w-5 h-5 text-[#A66152]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#A66152] leading-none tracking-tight">Discussion</h3>
                    <p className="text-sm text-[#F9F7F2]/60 mt-1">{comments.length} community thoughts</p>
                </div>
            </div>

            {/* Comment Form: Deep Chocolate with Terracotta Focus */}
            <form onSubmit={handleSubmit} className="mb-10 relative group">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the conversation..."
                        className="w-full p-6 rounded-[18px] border border-white/10 focus:border-[#A66152] focus:ring-0 outline-none resize-none bg-[#5C3A31] text-[#F9F7F2] placeholder:text-white/10/30 min-h-32 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute bottom-4 right-4 bg-white hover:bg-[#8A4B3F] text-[#A66152] p-3 rounded-xl shadow-lg shadow-black/20 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all"
                    >
                        <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length === 0 ? (
                    <p className="text-[#8A4B3F] text-sm italic">Be the first to share your perspective!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-400">
                            {/* Avatar: Swapped blue gradient for Brown/Terracotta theme */}
                            <div className="shrink-0">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8A4B3F] via-[#A66152] to-[#5C3A31] flex items-center justify-center text-[#F9F7F2] font-bold text-sm shadow-lg border border-white/10">
                                    {comment.userName.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-[#F9F7F2] text-[15px] group-hover:text-[#A66152] transition-colors">
                                        {comment.userName}
                                    </span>
                                    {/* Fixed blue metadata: now muted white/50% */}
                                    <span className="text-[10px] font-bold text-[#F9F7F2]/50 bg-[#A66152] px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/5">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <div className="p-4 rounded-[20px] rounded-tl-none bg-[#A66152]  border border-white/5 group-hover:border-white/10 transition-all">
                                    <p className="text-[#F9F7F2]/80 text-[14px] leading-relaxed whitespace-pre-wrap">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}