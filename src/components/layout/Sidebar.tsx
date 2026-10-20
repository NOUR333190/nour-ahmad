import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Trophy,
  Users2,
  Sparkles,
  SearchCheck,
  FolderGit2,
  Image as ImageIcon,
  GraduationCap,
  BarChart3,
  Globe2,
  Bell,
  Settings,
  ScanEye,
  GitMerge,
  Flame,
  Zap,
  Crown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainSection } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    language,
    activeSection,
    setActiveSection,
    userProfile,
    notifications,
    setAiCommandOpen,
  } = useApp();

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems: Array<{
    id: MainSection;
    labelAr: string;
    labelEn: string;
    icon: React.ElementType;
    badge?: number | string;
    highlight?: boolean;
  }> = [
    { id: 'dashboard', labelAr: 'لوحة القيادة', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'coach', labelAr: 'الآرت ديركتور واستوديو الصور', labelEn: 'Art Director & Image Studio', icon: Crown, highlight: true },
    { id: 'critique', labelAr: 'نقد وتحليل التصاميم', labelEn: 'Design Critique', icon: ScanEye },
    { id: 'challenges', labelAr: 'محرك التحديات', labelEn: 'Challenges', icon: Trophy, badge: 'اليوم' },
    { id: 'simulator', labelAr: 'محاكي العملاء', labelEn: 'Client Simulator', icon: Users2 },
    { id: 'creative-lab', labelAr: 'مختبر الأفكار الإبداعي', labelEn: 'Creative Lab', icon: Sparkles },
    { id: 'research', labelAr: 'أبحاث واتجاهات التصميم', labelEn: 'Design Research', icon: SearchCheck },
    { id: 'projects', labelAr: 'المشاريع والنسخ (V1-Final)', labelEn: 'Projects', icon: FolderGit2 },
    { id: 'portfolio', labelAr: 'معرض الأعمال (Portfolio)', labelEn: 'Portfolio', icon: ImageIcon },
    { id: 'learning', labelAr: 'المركز التعليمي والمسارات', labelEn: 'Learning Center', icon: GraduationCap },
    { id: 'analytics', labelAr: 'تحليلات الأداء والمهارات', labelEn: 'Analytics', icon: BarChart3 },
    { id: 'community', labelAr: 'مجتمع المصممين', labelEn: 'Community', icon: Globe2 },
    { id: 'notifications', labelAr: 'الإشعارات والتنبيهات', labelEn: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { id: 'roadmap', labelAr: 'خارطة طريق التطوير', labelEn: 'Dev Roadmap', icon: GitMerge },
    { id: 'settings', labelAr: 'الإعدادات والملف الشخصي', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 bg-[#0d121f]/95 border-e border-slate-800/80 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                DesignForge
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {language === 'ar' ? 'مساحة العمل الإبداعية 2026+' : 'Next-Gen Creative Studio'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick AI Command trigger inside sidebar */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setAiCommandOpen(true)}
          className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900/80 hover:from-indigo-900/80 hover:to-indigo-950/90 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow-sm text-start"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">
                {language === 'ar' ? 'مركز أوامر AI' : 'AI Command'}
              </div>
              <div className="text-[10px] text-slate-400">
                {language === 'ar' ? 'اطلب فكرة أو نقد سريع' : 'Type prompt or ask idea'}
              </div>
            </div>
          </div>
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Progress Mini Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="p-3 rounded-xl bg-[#0f172a]/80 border border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {language === 'ar' ? `المستوى ${userProfile.level}` : `Level ${userProfile.level}`}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {userProfile.xp} XP
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{userProfile.streakDays} {language === 'ar' ? 'أيام' : 'days'}</span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((userProfile.xp / userProfile.nextLevelXp) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{language === 'ar' ? 'التقدم نحو المستوى التالي' : 'To Next Level'}</span>
            <span className="font-mono">{userProfile.nextLevelXp - userProfile.xp} XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
