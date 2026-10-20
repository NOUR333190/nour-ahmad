import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  Trophy,
  Users2,
  FolderGit2,
  MoreHorizontal,
  Sparkles,
  ScanEye,
  SearchCheck,
  GraduationCap,
  BarChart3,
  Settings,
  GitMerge,
  Globe2,
  Crown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainSection } from '../../types';

export const MobileNav: React.FC = () => {
  const { language, activeSection, setActiveSection, setAiCommandOpen } = useApp();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainTabs: Array<{ id: MainSection; labelAr: string; labelEn: string; icon: React.ElementType }> = [
    { id: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Home', icon: LayoutDashboard },
    { id: 'coach', labelAr: 'الآرت ديركتور', labelEn: 'Art Director', icon: Crown },
    { id: 'challenges', labelAr: 'التحديات', labelEn: 'Challenges', icon: Trophy },
    { id: 'simulator', labelAr: 'العميل', labelEn: 'Client', icon: Users2 },
    { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', icon: FolderGit2 },
  ];

  const moreItems: Array<{ id: MainSection; labelAr: string; labelEn: string; icon: React.ElementType }> = [
    { id: 'critique', labelAr: 'نقد وتحليل التصاميم', labelEn: 'Design Critique', icon: ScanEye },
    { id: 'creative-lab', labelAr: 'مختبر الأفكار الإبداعي', labelEn: 'Creative Lab', icon: Sparkles },
    { id: 'research', labelAr: 'أبحاث واتجاهات التصميم', labelEn: 'Design Research', icon: SearchCheck },
    { id: 'portfolio', labelAr: 'معرض الأعمال', labelEn: 'Portfolio', icon: FolderGit2 },
    { id: 'learning', labelAr: 'المركز التعليمي', labelEn: 'Learning Center', icon: GraduationCap },
    { id: 'analytics', labelAr: 'التحليلات والرادار', labelEn: 'Analytics', icon: BarChart3 },
    { id: 'community', labelAr: 'المجتمع', labelEn: 'Community', icon: Globe2 },
    { id: 'roadmap', labelAr: 'خارطة طريق التطوير', labelEn: 'Dev Roadmap', icon: GitMerge },
    { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* More Modal on Mobile */}
      {moreMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end lg:hidden animate-in fade-in"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            className="bg-[#0f172a] rounded-t-3xl border-t border-slate-800 p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white">
                {language === 'ar' ? 'جميع الأقسام والأدوات' : 'All Modules & Tools'}
              </span>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  setAiCommandOpen(true);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
              >
                {language === 'ar' ? 'أمر AI سريع' : 'Quick AI'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1 text-indigo-400" />
                    <span className="text-[11px] font-medium leading-tight">
                      {language === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 start-0 end-0 h-16 bg-[#0d121f]/95 border-t border-slate-800/80 backdrop-blur-xl z-40 flex items-center justify-around px-2 lg:hidden">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-full relative transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-indigo-500 rounded-b-full shadow-sm shadow-indigo-500" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreMenuOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-full text-slate-400 hover:text-slate-200"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">
            {language === 'ar' ? 'المزيد' : 'More'}
          </span>
        </button>
      </nav>
    </>
  );
};
