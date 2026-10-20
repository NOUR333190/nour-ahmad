import React, { useState } from 'react';
import {
  Search,
  Zap,
  Bell,
  Sun,
  Moon,
  Languages,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveSection,
    setAiCommandOpen,
    setGlobalSearchOpen,
    userProfile,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-18 px-4 md:px-8 border-b border-slate-800/80 bg-[#0d121f]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>
              {language === 'ar'
                ? 'ابحث في المشاريع، التحديات، الأبحاث، أو المحادثات...'
                : 'Search projects, challenges, research, ideas...'}
            </span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘F
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Universal AI Command trigger button */}
        <button
          onClick={() => setAiCommandOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 via-sky-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95"
          title={language === 'ar' ? 'افتح مركز أوامر الذكاء الاصطناعي (Cmd+K)' : 'Open AI Command Center (Cmd+K)'}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'أمر AI' : 'AI Command'}
          </span>
          <kbd className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
            ⌘K
          </kbd>
        </button>

        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
          title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono uppercase font-bold text-[11px]">
            {language === 'ar' ? 'EN' : 'العربية'}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          title={language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Notifications dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 relative transition-colors"
            title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {language === 'ar' ? 'الإشعارات الحديثة' : 'Recent Notifications'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                      {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  {language === 'ar' ? 'مسح الكل' : 'Clear all'}
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    {language === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionLink) {
                          setActiveSection(n.actionLink);
                          setNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/40 text-slate-400'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                      } hover:bg-slate-800/60`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-slate-200">
                          {n.title}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {n.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActiveSection('notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'عرض مركز الإشعارات بالكامل' : 'View all notifications'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 pe-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
            />
            <div className="hidden sm:block text-start">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-indigo-400 font-medium leading-tight">
                {language === 'ar' ? `المستوى ${userProfile.level}` : `Level ${userProfile.level}`}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute end-0 mt-2 w-56 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <div className="text-xs font-bold text-white">{userProfile.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{userProfile.title}</div>
              </div>

              <button
                onClick={() => {
                  setActiveSection('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {language === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
              </button>
              <button
                onClick={() => {
                  setActiveSection('portfolio');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {language === 'ar' ? 'معرض أعمالي (Portfolio)' : 'My Portfolio'}
              </button>
              <button
                onClick={() => {
                  setActiveSection('analytics');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-start px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {language === 'ar' ? 'سجل المهارات ونقاط XP' : 'Skills & XP Progress'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
