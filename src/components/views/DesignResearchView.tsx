import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { ResearchItem } from '../../types';
import {
  SearchCheck,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FolderPlus,
  Bot,
  Loader2,
  Calendar,
  Flame,
  ArrowRight,
  Palette,
  CheckCircle2,
} from 'lucide-react';

export const DesignResearchView: React.FC = () => {
  const { language, activeProject, updateProject, setActiveSection, showToast, addXP } = useApp();

  const [researchList, setResearchList] = useState<ResearchItem[]>(() => storageService.getResearch());
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(researchList[0] || null);

  const topics = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'trends', labelAr: 'اتجاهات 2026', labelEn: '2026 Trends' },
    { id: 'typography', labelAr: 'التيبوغرافيا', labelEn: 'Typography' },
    { id: 'color', labelAr: 'تناغم الألوان', labelEn: 'Color Palettes' },
    { id: 'branding', labelAr: 'الهويات البصرية', labelEn: 'Branding Styles' },
    { id: 'references', labelAr: 'المراجع البصرية', labelEn: 'References' },
  ];

  const filteredResearch = researchList.filter((item) => {
    if (selectedTopic !== 'all' && item.category !== selectedTopic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRunAiResearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await aiService.fetchResearch({
        query: searchQuery,
        topic: selectedTopic !== 'all' ? selectedTopic : 'Design Trends',
        language,
      });

      const newItem: ResearchItem = {
        id: `res-${Date.now()}`,
        title: result.title || searchQuery,
        category: (selectedTopic === 'all' ? 'trends' : selectedTopic) as any,
        summary: result.overview || 'تحليل بحثي معمق لأحدث اتجاهات التصميم.',
        industry: 'All Industries',
        style: 'Modern Contemporary',
        tags: [searchQuery, 'AI Research', '2026'],
        content: `${result.overview}\n\nنصيحة الخطوط: ${result.typographyAdvice || ''}\n\nمراجع معتمدة:\n${(result.factualReferences || []).map((r: string) => `- ${r}`).join('\n')}`,
        palette: result.paletteRecommendations?.[0]?.colors || ['#0B0F19', '#6366F1', '#38BDF8'],
        isAiGenerated: true,
        popularity: 90,
        date: new Date().toISOString().split('T')[0],
      };

      const updated = [newItem, ...researchList];
      setResearchList(updated);
      storageService.saveResearch(updated);
      setSelectedItem(newItem);
      addXP(120, 'إجراء بحث تصميمي');
      showToast(language === 'ar' ? 'تم توليد البحث وتوثيق المراجع' : 'Research synthesized and documented', 'success');
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء إجراء البحث' : 'Research failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (item: ResearchItem) => {
    const updated = researchList.map((r) => (r.id === item.id ? { ...r, saved: !r.saved } : r));
    setResearchList(updated);
    storageService.saveResearch(updated);
    if (selectedItem?.id === item.id) {
      setSelectedItem({ ...selectedItem, saved: !selectedItem.saved });
    }
    showToast(language === 'ar' ? 'تم تحديث حفظ المرجع' : 'Bookmark updated', 'info');
  };

  const handleAddToProject = (item: ResearchItem) => {
    if (!activeProject) {
      showToast(language === 'ar' ? 'يرجى تحديد مشروع نشط أولاً' : 'Select an active project first', 'warning');
      return;
    }

    const updatedNotes = [...activeProject.aiNotes, `[مرجع بحثي: ${item.title}]: ${item.summary}`];
    updateProject(activeProject.id, { aiNotes: updatedNotes });
    showToast(
      language === 'ar'
        ? `تم ربط المرجع بمشروع: ${activeProject.title}`
        : `Added reference to project ${activeProject.title}`,
      'success'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider mb-1">
            <SearchCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'مستودع أبحاث واتجاهات التصميم' : 'Design Research & Trend Intelligence'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'قاعدة بيانات التوجهات البصرية لعام 2026' : 'Visual Trends, Typography Standards & Color Science'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'تصفح أبحاث معتمدة من كبرى بيوت التصميم أو اسأل الذكاء الاصطناعي لإنشاء تقرير فني مدعم بالمراجع.'
              : 'Verified design science and generative trend synthesis with clear distinction between facts and predictions.'}
          </p>
        </div>
      </div>

      {/* Search and Query Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 start-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunAiResearch();
            }}
            placeholder={
              language === 'ar'
                ? 'ابحث في الأبحاث أو اطلب تحليلاً (مثال: اتجاهات التيبوغرافيا في الخليج، ألوان الفنتك...)'
                : 'Search or request research (e.g. Arab typography trends, FinTech color science...)'
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          onClick={handleRunAiResearch}
          disabled={loading || !searchQuery.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{language === 'ar' ? 'بحث وتوليد ذكي' : 'Synthesize Research'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              selectedTopic === t.id
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? t.labelAr : t.labelEn}
          </button>
        ))}
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Research Feed List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-white block">
            {language === 'ar' ? `المقالات والتقارير المتاحة (${filteredResearch.length})` : `Reports (${filteredResearch.length})`}
          </span>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pe-1">
            {filteredResearch.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-pink-400">{item.style}</span>
                    <div className="flex items-center gap-1.5">
                      {item.isAiGenerated ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {language === 'ar' ? 'توليد AI' : 'AI Gen'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {language === 'ar' ? 'موثّق' : 'Verified'}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold line-clamp-2 leading-snug">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/60 font-mono">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Flame className="w-3 h-3" />
                      {item.popularity}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Research Inspector (7 Cols) */}
        {selectedItem && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
              {/* Badge & Title */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {selectedItem.category}
                    </span>
                    <span className="text-xs text-slate-400">{selectedItem.industry}</span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-white">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSave(selectedItem)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                    title="حفظ البحث"
                  >
                    {selectedItem.saved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleAddToProject(selectedItem)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
                    title="إضافة للمشروع النشط"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Factual vs AI Tag notice */}
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  selectedItem.isAiGenerated
                    ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {selectedItem.isAiGenerated
                    ? language === 'ar'
                      ? 'تم توليد هذا التقرير عبر استقراء نماذج الذكاء الاصطناعي لاتجاهات السوق المعاصرة.'
                      : 'Synthesized via AI predictive market modeling.'
                    : language === 'ar'
                    ? 'بحث توثيقي خاضع لمعايير الأكاديميات الدولية للتصميم والطباعة (AIGA, TDC).'
                    : 'Verified empirical design research validated by international design bodies.'}
                </span>
              </div>

              {/* Content Body */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {selectedItem.content}
              </div>

              {/* Palette Recommendation if present */}
              {selectedItem.palette && selectedItem.palette.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Palette className="w-3.5 h-3.5 text-pink-400" />
                    <span>{language === 'ar' ? 'لوحة الألوان المستخرجة:' : 'Associated Color Palette:'}</span>
                  </div>
                  <div className="flex gap-2">
                    {selectedItem.palette.map((hex, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="w-full h-8 rounded-lg mb-1 shadow-inner" style={{ backgroundColor: hex }} />
                        <span className="text-[10px] font-mono text-slate-400">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedItem.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveSection('coach');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>{language === 'ar' ? 'اسأل المرشد عن هذا الاتجاه' : 'Ask AI Coach About This'}</span>
                </button>

                <button
                  onClick={() => handleAddToProject(selectedItem)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إضافة إلى مشروعي الحالي' : 'Add to Current Project'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
