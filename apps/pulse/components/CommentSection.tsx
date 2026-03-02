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
        <div className="mt-12 bg-[#020617] rounded-[24px] border border-indigo-500/20 shadow-2xl p-6 sm:p-8">
            {/* Header: Styled with the Pulse branding vibe */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white leading-none tracking-tight">Discussion</h3>
                    <p className="text-sm text-slate-400 mt-1">{comments.length} community thoughts</p>
                </div>
            </div>

            {/* Comment Form: Deep Navy with Purple Glow focus */}
            <form onSubmit={handleSubmit} className="mb-10 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-500/30 rounded-[20px] blur-md opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the conversation..."
                        className="w-full p-10 rounded-[18px] border border-white/10 focus:border-indigo-500/50 focus:ring-0 outline-none resize-none bg-[#0b102a] text-slate-200 placeholder:text-slate-500 min-h-32 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all"
                    >
                        <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length === 0 ? (
                    
                        <p className="text-slate-500 text-sm italic">Be the first to share your perspective!</p>
                    
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-400">
                            {/* Avatar: Matches the vibrant category button gradient */}
                            <div className="shrink-0">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/10 border border-white/10">
                                    {comment.userName.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-slate-200 text-[15px] group-hover:text-cyan-400 transition-colors">{comment.userName}</span>
                                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/5">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <div className="p-4 rounded-[20px] rounded-tl-none bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-all">
                                    <p className="text-slate-300 text-[14px] leading-relaxed whitespace-pre-wrap">
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