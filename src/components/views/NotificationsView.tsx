import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Trash2,
  CheckCircle2,
  Trophy,
  Award,
  Lightbulb,
  Clock,
  MessageSquare,
  Bot,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { MainSection } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    language,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveSection,
    showToast,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-sky-400" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-400" />;
      case 'revision':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'saved_ai':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'learning':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleAction = (n: any) => {
    markNotificationRead(n.id);
    if (n.actionLink) {
      setActiveSection(n.actionLink as MainSection);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>{language === 'ar' ? 'مركز التنبيهات والإشعارات الفورية' : 'Activity & Notification Hub'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'سجل أحداث التحديات، التعديلات، والأوسمة' : 'Challenge Milestones, Client Actions & Learning Alerts'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'متابعة حية لكل ما يستجد في مشاريعك وتطور مستواك الإبداعي.'
              : 'Real-time timeline of project deadlines, client feedback notes, and unlocked achievements.'}
          </p>
        </div>

        <button
          onClick={clearNotifications}
          disabled={notifications.length === 0}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'مسح جميع الإشعارات' : 'Clear All'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', labelAr: 'الكل', labelEn: 'All' },
          { id: 'challenge', labelAr: 'التحديات', labelEn: 'Challenges' },
          { id: 'achievement', labelAr: 'الأوسمة والإنجازات', labelEn: 'Achievements' },
          { id: 'learning', labelAr: 'التعلم', labelEn: 'Learning' },
          { id: 'saved_ai', labelAr: 'أوامر AI', labelEn: 'AI Commands' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              filterType === f.id
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? f.labelAr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-2 text-slate-500">
            <Bell className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-xs">{language === 'ar' ? 'لا توجد إشعارات تطابق التصفية الحالية' : 'No notifications in this category'}</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleAction(n)}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.read
                  ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                  : 'bg-indigo-950/20 border-indigo-500/40 text-slate-200 shadow-sm'
              } hover:bg-slate-800/60`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs md:text-sm font-bold text-white">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.description}</p>
                  <span className="text-[10px] text-slate-500 font-mono block mt-2">{n.timestamp}</span>
                </div>
              </div>

              {n.actionLink && (
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold shrink-0 mt-1">
                  <span>{language === 'ar' ? 'فتح' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
