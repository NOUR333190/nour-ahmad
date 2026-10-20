import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  Clock,
  Briefcase,
  Trophy,
  CheckCircle2,
  Sparkles,
  Zap,
  Bot,
  Layers,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { language, userProfile, skills, achievements, challenges, projects, portfolio } = useApp();

  const completedChallenges = challenges.filter((c) => c.completed).length;
  const completedProjects = projects.filter((p) => p.stage === 'Final' || p.progress === 100).length;
  const totalPortfolioItems = portfolio.length;

  const weeklyActivityDays = [
    { dayAr: 'الأحد', dayEn: 'Sun', hours: 2.2, drills: 2 },
    { dayAr: 'الإثنين', dayEn: 'Mon', hours: 3.5, drills: 3 },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', hours: 1.8, drills: 1 },
    { dayAr: 'الأربعاء', dayEn: 'Wed', hours: 4.1, drills: 4 },
    { dayAr: 'الخميس', dayEn: 'Thu', hours: 2.9, drills: 2 },
    { dayAr: 'الجمعة', dayEn: 'Fri', hours: 1.2, drills: 1 },
    { dayAr: 'السبت', dayEn: 'Sat', hours: 3.8, drills: 3 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'ar' ? 'لوحة تحليلات الأداء ومصفوفة المهارات' : 'Performance Analytics & Skill Radar'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'متابعة النمو الإبداعي ونقاط الخبرة المحققة' : 'Creative Mastery, XP Velocity & Skill Growth'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'مؤشرات دقيقة مبنية على الأداء الفعلي في التحديات، جولات التعديل، ونشر دراسات الحالة.'
              : 'Verifiable progression calculated from completed drills, client approvals, and portfolio benchmarks.'}
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'تحديات منجزة' : 'Drills Done'}</span>
          </div>
          <div className="text-xl font-black font-mono text-white">{completedChallenges}</div>
          <div className="text-[10px] text-emerald-400 font-medium">+2 {language === 'ar' ? 'هذا الأسبوع' : 'this week'}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? 'مشاريع نشطة' : 'Projects'}</span>
          </div>
          <div className="text-xl font-black font-mono text-white">{projects.length}</div>
          <div className="text-[10px] text-sky-400 font-medium">{completedProjects} {language === 'ar' ? 'معتمد نهائياً' : 'finalized'}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'أعمال المعرض' : 'Case Studies'}</span>
          </div>
          <div className="text-xl font-black font-mono text-white">{totalPortfolioItems}</div>
          <div className="text-[10px] text-slate-400 font-medium">{language === 'ar' ? 'معتمدة تجارياً' : 'published'}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'ar' ? 'وقت التدريب' : 'Time Trained'}</span>
          </div>
          <div className="text-xl font-black font-mono text-white">19.5h</div>
          <div className="text-[10px] text-emerald-400 font-medium">+3.5h {language === 'ar' ? 'عن المعدل' : 'above avg'}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'سلسلة الأيام' : 'Active Streak'}</span>
          </div>
          <div className="text-xl font-black font-mono text-amber-400">{userProfile.streakDays}</div>
          <div className="text-[10px] text-slate-400 font-medium">{language === 'ar' ? 'أيام متتالية' : 'days streak'}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'ar' ? 'مجموع XP' : 'Total XP'}</span>
          </div>
          <div className="text-xl font-black font-mono text-indigo-300">{userProfile.xp}</div>
          <div className="text-[10px] text-indigo-400 font-medium">Lvl {userProfile.level}</div>
        </div>
      </div>

      {/* AI Performance Insight Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0b0f17] border border-indigo-500/30 flex items-start gap-4 shadow-lg">
        <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-indigo-300">
            {language === 'ar' ? 'التحليل الاستدلالي للذكاء الاصطناعي (AI Diagnostic Insight):' : 'AI Diagnostic Insight:'}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {language === 'ar'
              ? 'تطورك في التكوين البصري وتناغم الألوان يتسارع بنسبة 18% مقارنة بالشهر السابق. متوسط وقت اتخاذ القرارات التيبوغرافية في التحديات انخفض من 14 دقيقة إلى 8 دقائق، مما يعكس نضجاً ملحوظاً في اختيار أوزان الخطوط العربية.'
              : 'You are improving 18% faster in composition than typography. Your average font pairing decision time dropped from 14m to 8m, indicating solid optical maturity.'}
          </p>
        </div>
      </div>

      {/* Skills Matrix System & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* All 10 Tracked Skills (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مصفوفة المهارات العشر التخصصية' : 'The 10 Core Design Competencies'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'ar' ? 'تُحسب تلقائياً من تقييمات التحديات ونقد التصاميم' : 'Dynamically calibrated from drill verdicts'}
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold">10 Tracked</span>
          </div>

          <div className="space-y-3 pt-1">
            {skills.map((sk) => (
              <div key={sk.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {sk.category}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {language === 'ar' ? sk.nameAr : sk.nameEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-indigo-400 font-bold">{sk.level}%</span>
                    <span className="text-[10px] text-emerald-400 font-medium">+{sk.recentGrowth}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${sk.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity & Charts (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weekly Bar Graph */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'النشاط الأسبوعي (ساعات التدريب)' : 'Weekly Training Hours'}
              </h3>
              <span className="text-xs font-mono text-slate-400">19.5 hrs</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
              {weeklyActivityDays.map((item, idx) => {
                const heightPercent = Math.round((item.hours / 4.5) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.hours}h
                    </div>
                    <div className="w-full bg-slate-800 rounded-t-xl overflow-hidden h-32 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {language === 'ar' ? item.dayAr : item.dayEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Summary Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'سجل الأوسمة المفتوحة' : 'Unlocked Badges'}</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length}
              </span>
            </div>

            <div className="space-y-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    ach.unlocked
                      ? 'bg-amber-950/20 border-amber-500/30 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {language === 'ar' ? ach.titleAr : ach.titleEn}
                      </div>
                      <div className="text-[10px] text-slate-400">{ach.requirement}</div>
                    </div>
                  </div>

                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">{ach.progress}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
