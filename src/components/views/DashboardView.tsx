import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardCalendar } from '../dashboard/DashboardCalendar';
import {
  Trophy,
  Users2,
  Bot,
  ScanEye,
  SearchCheck,
  Sparkles,
  PlusCircle,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Clock,
  Sparkle,
  CheckCircle2,
  Calendar,
  Crown,
  Wand2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    language,
    userProfile,
    activeProject,
    challenges,
    skills,
    achievements,
    portfolio,
    setActiveSection,
    setActiveChallenge,
    addProject,
    showToast,
  } = useApp();

  const todayChallenge = challenges.find((c) => c.id === 'ch-today') || challenges[0];
  const recommendedChallenge = challenges.find((c) => c.id === 'ch-rec') || challenges[1];

  const quickActions = [
    {
      titleAr: 'ابدأ تحدي',
      titleEn: 'Start Challenge',
      descAr: 'تحدي اليوم السريع 30 دقيقة',
      icon: Trophy,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      action: () => {
        setActiveChallenge(todayChallenge);
        setActiveSection('challenges');
      },
    },
    {
      titleAr: 'عميل عشوائي',
      titleEn: 'Random Client',
      descAr: 'جلسة محاكاة واقعية وتفاوض',
      icon: Users2,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
      action: () => setActiveSection('simulator'),
    },
    {
      titleAr: 'توليد الصور بالبرومبت والريفرنس',
      titleEn: 'Prompt & Reference Studio',
      descAr: 'موديلات قوية: Nano Banana, ChatGPT DALL-E, Midjourney',
      icon: Wand2,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      action: () => setActiveSection('coach'),
    },
    {
      titleAr: 'شات بوت المصمم (ChatGPT)',
      titleEn: 'AI Design Chatbot',
      descAr: 'تحدث فوراً مع الذكاء الاصطناعي واستشر السنيور',
      icon: Bot,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      action: () => setActiveSection('coach'),
    },
    {
      titleAr: 'الآرت ديركتور (من الألف للياء)',
      titleEn: 'Senior Art Director',
      descAr: 'تفكيك البريف، كلمات البحث وفحص صح وغلط',
      icon: Crown,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300',
      action: () => setActiveSection('coach'),
    },
    {
      titleAr: 'نقد وتحليل التصاميم',
      titleEn: 'Critique Design',
      descAr: 'فحص التباين والتوازن وتوزيع العناصر',
      icon: ScanEye,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
      action: () => setActiveSection('critique'),
    },
    {
      titleAr: 'ابحث عن إلهام',
      titleEn: 'Design Inspiration',
      descAr: 'اتجاهات 2026 ومراجع الألوان',
      icon: SearchCheck,
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300',
      action: () => setActiveSection('research'),
    },
    {
      titleAr: 'أنشئ فكرة',
      titleEn: 'Generate Concept',
      descAr: 'استعارات بصرية وموجهات صور',
      icon: Sparkles,
      color: 'from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-300',
      action: () => setActiveSection('creative-lab'),
    },
    {
      titleAr: 'مشروع جديد',
      titleEn: 'New Project',
      descAr: 'بدء مساحة عمل وتتبع النسخ',
      icon: PlusCircle,
      color: 'from-slate-700/40 to-slate-800/40 border-slate-700 text-slate-200',
      action: () => {
        addProject({
          title: language === 'ar' ? 'مشروع هوية تجارية جديدة' : 'New Brand Identity',
          clientName: 'عميل جديد',
          category: 'Branding',
        });
        setActiveSection('projects');
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141b2d] via-[#11192e] to-[#0c1220] border border-slate-800/80 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkle className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'ar' ? 'الموجّه الذكي 2026+' : 'Smart Creative Hub 2026'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {language === 'ar'
                ? `مرحباً بعودتك، ${userProfile.name}!`
                : `Welcome back, ${userProfile.name}!`}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'لديك اليوم تحدي جديد لإطلاق حملة قهوة مختصة عبر انستغرام، وتوصية تدريبية لتعزيز التسلسل الهرمي البصري.'
                : 'You have a fresh Instagram campaign challenge ready today, plus tailored guidance on optical typographic hierarchy.'}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'ar' ? 'المستوى' : 'Level'}
              </div>
              <div className="text-lg md:text-xl font-black text-indigo-400 font-mono mt-0.5">
                {userProfile.level}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{userProfile.xp} XP</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'ar' ? 'سلسلة الأيام' : 'Streak'}
              </div>
              <div className="text-lg md:text-xl font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{userProfile.streakDays}</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">{language === 'ar' ? 'مستمر 🔥' : 'Active'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'ar' ? 'إنجاز الأسبوع' : 'Weekly Goal'}
              </div>
              <div className="text-lg md:text-xl font-black text-sky-400 font-mono mt-0.5">
                85%
              </div>
              <div className="text-[10px] text-slate-400">{language === 'ar' ? '4/5 تحديات' : '4/5 drills'}</div>
            </div>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -end-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200">
            {language === 'ar' ? 'إجراءات سريعة فورية' : 'Instant Quick Actions'}
          </h2>
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'وصول بنقرة واحدة' : 'One-click launch'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <button
                key={idx}
                onClick={qa.action}
                className={`p-3.5 rounded-2xl bg-gradient-to-b ${qa.color} border text-start transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between`}
              >
                <div className="p-2 rounded-xl bg-slate-900/80 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    {language === 'ar' ? qa.titleAr : qa.titleEn}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {language === 'ar' ? qa.descAr : qa.titleEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Grid: Active Project & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Project Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'ar' ? 'المشروع النشط الحالي' : 'Active In-Progress Project'}</span>
            </h2>
            <button
              onClick={() => setActiveSection('projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>{language === 'ar' ? 'إدارة المشاريع' : 'All Projects'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {activeProject ? (
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {activeProject.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {activeProject.clientName}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {activeProject.description}
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'المرحلة' : 'Stage'}</span>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                    {activeProject.stage}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">{language === 'ar' ? 'نسبة الإنجاز' : 'Completion'}</span>
                  <span className="text-indigo-400 font-mono font-bold">{activeProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${activeProject.progress}%` }}
                  />
                </div>
              </div>

              {/* Versions & Tasks preview */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'ar' ? 'الموعد النهائي:' : 'Due:'} {activeProject.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {activeProject.versions.length} {language === 'ar' ? 'نسخ (Versions)' : 'Versions'}
                  </span>
                  <button
                    onClick={() => setActiveSection('projects')}
                    className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold border border-indigo-500/40 transition-colors"
                  >
                    {language === 'ar' ? 'متابعة العمل' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-xs text-slate-500">
              {language === 'ar' ? 'لا يوجد مشروع نشط حالياً' : 'No active project'}
            </div>
          )}

          {/* AI Personalized Recommendation Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-indigo-300">
                {language === 'ar' ? 'توجيه DesignForge الذكي المخصص لك:' : 'DesignForge AI Recommendation:'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'بناءً على التحدي السابق، أظهرت مهارة استثنائية في تناغم الألوان (91%)، بينما يحتاج التباين التيبوغرافي في الخط العربي للمزيد من الدقة. خض التحدي اليومي لتعزيز نقاط ضعفك.'
                  : 'Based on your recent drills, your color harmony is soaring at 91%, but Arabic typographical hierarchy could use tighter contrast. Take today’s challenge to level up!'}
              </p>
            </div>
          </div>
        </div>

        {/* Challenges & Daily Drills (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'تحدي اليوم والترشيحات' : "Today's Challenges"}</span>
            </h2>
            <button
              onClick={() => setActiveSection('challenges')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {language === 'ar' ? 'استعراض الكل (14)' : 'Explore All'}
            </button>
          </div>

          {/* Today's Challenge Card */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-amber-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {language === 'ar' ? 'تحدي اليوم الرئيسي' : "Today's Pick"}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                +{todayChallenge.xpReward} XP
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{todayChallenge.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {todayChallenge.objective}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span>⏱ {todayChallenge.durationMinutes} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                <span>• {todayChallenge.difficulty}</span>
              </div>
              <button
                onClick={() => {
                  setActiveChallenge(todayChallenge);
                  setActiveSection('challenges');
                }}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
              >
                {language === 'ar' ? 'ابدأ الآن' : 'Start'}
              </button>
            </div>
          </div>

          {/* Recommended Challenge Card */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {language === 'ar' ? 'تحدي مقترح لمعرضك' : 'Portfolio Challenge'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                +{recommendedChallenge.xpReward} XP
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{recommendedChallenge.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {recommendedChallenge.objective}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span>⏱ {recommendedChallenge.durationMinutes} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                <span>• {recommendedChallenge.category}</span>
              </div>
              <button
                onClick={() => {
                  setActiveChallenge(recommendedChallenge);
                  setActiveSection('challenges');
                }}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all"
              >
                {language === 'ar' ? 'خوض التحدي' : 'Take Drill'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section: Project Deadlines & Scheduled Training */}
      <DashboardCalendar />

      {/* Skills Matrix & Achievements Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skills Radar / Progress (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مؤشرات تطور المهارات التصميمية' : 'Skill Progress Metrics'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ar' ? 'محسوبة بدقة بناءً على جودة التصاميم والتحديات المنجزة' : 'Calculated from evaluated challenge outputs'}
              </p>
            </div>
            <button
              onClick={() => setActiveSection('analytics')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {language === 'ar' ? 'عرض الرادار الكامل' : 'Full Analytics'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {skills.slice(0, 6).map((sk) => (
              <div key={sk.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    {language === 'ar' ? sk.nameAr : sk.nameEn}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-indigo-400 font-bold">{sk.level}%</span>
                    <span className="text-[10px] text-emerald-400 font-medium">+{sk.recentGrowth}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${sk.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Achievements (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'الإنجازات والأوسمة' : 'Achievements'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {achievements.filter((a) => a.unlocked).length} / {achievements.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {achievements.slice(0, 3).map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                  ach.unlocked
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {language === 'ar' ? ach.titleAr : ach.titleEn}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {language === 'ar' ? ach.descAr : ach.descEn}
                  </p>
                </div>
                {ach.unlocked && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
