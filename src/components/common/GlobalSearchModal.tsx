import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  FolderGit2,
  Trophy,
  ImageIcon,
  SearchCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MainSection } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    language,
    projects,
    challenges,
    portfolio,
    setActiveSection,
    setActiveProject,
    setActiveChallenge,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'projects' | 'challenges' | 'portfolio' | 'learning'>('all');

  if (!globalSearchOpen) return null;

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      category: string;
      type: 'project' | 'challenge' | 'portfolio' | 'learning';
      targetSection: MainSection;
      item: any;
    }> = [];

    // Projects
    if (activeFilter === 'all' || activeFilter === 'projects') {
      projects.forEach((p) => {
        if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.industry.toLowerCase().includes(q)) {
          results.push({
            id: p.id,
            title: p.title,
            category: p.category,
            type: 'project',
            targetSection: 'projects',
            item: p,
          });
        }
      });
    }

    // Challenges
    if (activeFilter === 'all' || activeFilter === 'challenges') {
      challenges.forEach((c) => {
        if (c.title.toLowerCase().includes(q) || c.objective.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
          results.push({
            id: c.id,
            title: c.title,
            category: c.category,
            type: 'challenge',
            targetSection: 'challenges',
            item: c,
          });
        }
      });
    }

    // Portfolio
    if (activeFilter === 'all' || activeFilter === 'portfolio') {
      portfolio.forEach((item) => {
        if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) {
          results.push({
            id: item.id,
            title: item.title,
            category: item.category,
            type: 'portfolio',
            targetSection: 'portfolio',
            item: item,
          });
        }
      });
    }

    return results;
  }, [query, activeFilter, projects, challenges, portfolio]);

  const handleSelectResult = (res: any) => {
    setActiveSection(res.targetSection);
    if (res.type === 'project') {
      setActiveProject(res.item);
    } else if (res.type === 'challenge') {
      setActiveChallenge(res.item);
    }
    setGlobalSearchOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 md:pt-24 px-4 animate-in fade-in"
      onClick={() => setGlobalSearchOpen(false)}
    >
      <div
        className="bg-[#0f172a] rounded-3xl border border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث بالاسم، القطاع، التحدي، المهارة، أو الكلمات المفتاحية...'
                : 'Search by keyword, project, client, or category...'
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-md text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/80 bg-slate-900/40 overflow-x-auto text-xs">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects' },
            { id: 'challenges', labelAr: 'التحديات', labelEn: 'Challenges' },
            { id: 'portfolio', labelAr: 'المعرض', labelEn: 'Portfolio' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                activeFilter === f.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? f.labelAr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'اكتب للبحث الفوري في المشاريع، التحديات، وأعمال المعرض'
                  : 'Type to instantly search projects, challenges, and portfolio pieces'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Branding', 'Food', 'نماء', 'Sora', 'Medical', 'انستغرام'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 hover:text-indigo-300"
                  >
                    #{term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {language === 'ar' ? `لم يتم العثور على نتائج مطابقة لـ "${query}"` : `No matching results for "${query}"`}
            </div>
          ) : (
            searchResults.map((res) => {
              let Icon = FolderGit2;
              let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

              if (res.type === 'challenge') {
                Icon = Trophy;
                badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              } else if (res.type === 'portfolio') {
                Icon = ImageIcon;
                badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              }

              return (
                <div
                  key={`${res.type}-${res.id}`}
                  onClick={() => handleSelectResult(res)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {res.title}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border mt-1 inline-block ${badgeColor}`}>
                        {res.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 rtl:rotate-180 transition-transform" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
