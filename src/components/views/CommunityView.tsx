import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialCommunityPosts } from '../../data/mockData';
import { CommunityPost } from '../../types';
import {
  Globe2,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Plus,
  Send,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { language, userProfile, showToast, addXP } = useApp();

  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          const likes = hasLiked ? p.likes + 1 : p.likes - 1;
          return { ...p, hasLiked, likes };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    addXP(40, 'مشاركة نقد بنّاء في المجتمع');
    showToast(language === 'ar' ? 'تم نشر نقدك البنّاء في المجتمع' : 'Critique submitted to community', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Globe2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'مجتمع المصممين وتبادل النقد البنّاء' : 'Peer Design Community & Feedback Exchange'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'شارك أعمالك واحصل على تقييمات الزملاء والمحترفين' : 'Peer Critiques, Trending Works & Community Drills'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'بيئة مهنية خالصة لتبادل التوجيه الفني البنّاء وتطوير الذائقة البصرية المشتركة.'
              : 'Constructive creative feedback loops between ambitious visual designers and art directors.'}
          </p>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Author Header */}
              <div className="p-4 px-5 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-indigo-500/30"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">{post.authorName}</h3>
                    <p className="text-[10px] text-slate-400">{post.authorTitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{post.timeAgo}</span>
              </div>

              {/* Image Preview */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 start-3 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h4 className="text-sm font-bold text-white leading-snug">{post.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{post.description}</p>

                {/* Critique Highlights */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {language === 'ar' ? 'أبرز نقاط النقد الفني للعمل:' : 'Peer Feedback Highlights:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.critiqueHighlights.map((ch, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-950/40 text-indigo-200 border border-indigo-500/20"
                      >
                        ✓ {ch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-slate-500">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interaction Footer */}
            <div className="p-4 px-5 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.hasLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                    <span className="font-mono">{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span className="font-mono">{post.commentsCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied', 'success');
                  }}
                  className="hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Add Comment input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                  placeholder={
                    language === 'ar'
                      ? 'أضف نقدك البنّاء للمصمم (تكوين، ألوان، خطوط)...'
                      : 'Add constructive peer critique...'
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
