import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioItem } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  Heart,
  Share2,
  Lock,
  Globe,
  Star,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const {
    language,
    portfolio,
    addPortfolioItem,
    togglePortfolioFeatured,
    togglePortfolioPublic,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(portfolio[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Case Study fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioItem['category']>('Branding');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [strategy, setStrategy] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');

  const categories = ['All', 'Branding', 'Social Media', 'Advertising', 'UI', 'Product', 'Motion', 'Other'];

  const filteredPortfolio = portfolio.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    return true;
  });

  const handleShare = (item: PortfolioItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'ar' ? 'تم نسخ رابط العمل لمشاركته مع العملاء' : 'Share link copied to clipboard', 'success');
    }
  };

  const handlePublishCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPortfolioItem({
      title,
      category,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description,
      problem,
      strategy,
      process: 'بحث بصري متعمق -> استكشاف التيبوغرافيا -> محاكاة ردود العميل -> النقد الفني والاعتماد.',
      finalDesignUrl: coverImage,
      toolsUsed: ['Figma', 'Illustrator', 'DesignForge AI'],
      aiInsights: 'حقق التصميم نسبة تباين 92% وتوزيعاً متوازناً للكتل البصرية.',
      isPublic: true,
      isFeatured: false,
    });

    setTitle('');
    setDescription('');
    setProblem('');
    setStrategy('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>{language === 'ar' ? 'معرض الأعمال الاحترافي (Portfolio & Case Studies)' : 'Executive Creative Portfolio'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'عرض دراسات الحالة التجارية المكتملة' : 'Case Studies, Strategy & Production Outputs'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'وثّق أعمالك باستراتيجية شاملة تشمل المشكلة، الحل، الأدوات، ورؤى الذكاء الاصطناعي لإبهار العملاء.'
              : 'Showcase complete case studies with strategic problem-solving, process documentation, and AI metrics.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة دراسة حالة جديدة' : 'Add Case Study'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 overflow-hidden cursor-pointer transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3 start-3 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/30 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{language === 'ar' ? 'مميز' : 'Featured'}</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 end-3 flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePortfolioPublic(item.id);
                    }}
                    className={`p-1.5 rounded-lg backdrop-blur-md text-xs transition-colors ${
                      item.isPublic ? 'bg-black/60 text-emerald-400' : 'bg-black/60 text-slate-400'
                    }`}
                    title={item.isPublic ? 'عام (Public)' : 'خاص (Private)'}
                  >
                    {item.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePortfolioFeatured(item.id);
                    }}
                    className={`p-1.5 rounded-lg backdrop-blur-md text-xs transition-colors ${
                      item.isFeatured ? 'bg-amber-500/20 text-amber-400' : 'bg-black/60 text-slate-400'
                    }`}
                    title="تمييز العمل"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Footer with Views, Likes, Share */}
            <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono">{item.views}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-mono">{item.likes}</span>
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(item);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="مشاركة العمل"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedItem.category}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white mt-1">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={selectedItem.finalDesignUrl || selectedItem.coverImage}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Strategic Breakdown */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-indigo-400 mb-1">
                  {language === 'ar' ? 'التحدي والمشكلة التجارية:' : 'Problem Statement:'}
                </h4>
                <p className="text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedItem.problem}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sky-400 mb-1">
                  {language === 'ar' ? 'الاستراتيجية والحل الإبداعي:' : 'Creative Strategy:'}
                </h4>
                <p className="text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedItem.strategy}
                </p>
              </div>

              {selectedItem.aiInsights && (
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'رؤى الذكاء الاصطناعي التحليلية:' : 'AI Diagnostic Insights:'}</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">{selectedItem.aiInsights}</p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-400 mb-1">
                  {language === 'ar' ? 'الأدوات المستخدمة:' : 'Tools Used:'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.toolsUsed?.map((tool, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Case Study Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-white">
              {language === 'ar' ? 'إضافة دراسة حالة لمعرض أعمالك' : 'Publish New Case Study'}
            </h3>

            <form onSubmit={handlePublishCaseStudy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'عنوان العمل:' : 'Project Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'القطاع:' : 'Category:'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'رابط صورة الغلاف أو التصميم:' : 'Cover Image URL:'}
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'الوصف العام:' : 'Overview Description:'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'المشكلة والحل الاستراتيجي:' : 'Strategic Solution:'}
                </label>
                <textarea
                  rows={2}
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {language === 'ar' ? 'نشر في المعرض' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
