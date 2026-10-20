import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialLearningLessons } from '../../data/mockData';
import { LearningLesson } from '../../types';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Trophy,
  ArrowRight,
  Flame,
  Lightbulb,
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const { language, skills, showToast, addXP, updateSkill } = useApp();

  const [lessons, setLessons] = useState<LearningLesson[]>(initialLearningLessons);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(lessons[0] || null);

  const categories = [
    'All',
    'Graphic Design',
    'Typography',
    'Color Theory',
    'Composition',
    'Branding',
    'Advertising',
    'Motion Graphics',
    'Creative Direction',
    'Client Management',
    'AI for Designers',
  ];

  // Weakest skill recommendation
  const sortedSkills = [...skills].sort((a, b) => a.level - b.level);
  const weakestSkill = sortedSkills[0];

  const filteredLessons = lessons.filter((l) => {
    if (activeCategory !== 'All' && l.category !== activeCategory) return false;
    return true;
  });

  const handleCompleteLesson = (lesson: LearningLesson) => {
    const updated = lessons.map((l) => (l.id === lesson.id ? { ...l, completed: true } : l));
    setLessons(updated);
    if (selectedLesson?.id === lesson.id) {
      setSelectedLesson({ ...selectedLesson, completed: true });
    }
    addXP(lesson.xp, 'إكمال درس تدريبي');
    updateSkill('sk-1', 2);
    updateSkill('sk-3', 2);
    showToast(language === 'ar' ? `تهانينا! أكملت الدرس وحصلت على +${lesson.xp} XP` : `Lesson finished! +${lesson.xp} XP`, 'success');
  };

  const toggleSaveLesson = (lesson: LearningLesson) => {
    const updated = lessons.map((l) => (l.id === lesson.id ? { ...l, saved: !l.saved } : l));
    setLessons(updated);
    if (selectedLesson?.id === lesson.id) {
      setSelectedLesson({ ...selectedLesson, saved: !selectedLesson.saved });
    }
    showToast(language === 'ar' ? 'تم تحديث حفظ الدرس' : 'Lesson bookmark updated', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>{language === 'ar' ? 'المركز التعليمي ومسارات الصقل الفني' : 'Learning Center & Masterclasses'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'دروس تطبيقية مبنية على سيكولوجيا واستراتيجيات التصميم' : 'Applied Masterclasses & Creative Direction Curriculum'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'تطوير منهجي يجمع بين أساسيات الخط، التكوين، سيكولوجيا الألوان، وإدارة متطلبات العملاء الحقيقية.'
              : 'Structured micro-learning modules linked directly to your skills radar and challenge benchmarks.'}
          </p>
        </div>
      </div>

      {/* Weak Skill Adaptive Callout */}
      {weakestSkill && (
        <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0c1220] border border-indigo-500/30 flex items-start gap-4 shadow-md">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 shrink-0">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-300">
              {language === 'ar' ? 'توصية تعليمية ذكية مخصصة لمهاراتك:' : 'Adaptive Skill Recommendation:'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ar'
                ? `لاحظنا أن مقياس "${weakestSkill.nameAr}" يقف عند (${weakestSkill.level}%). نوصي بدراسة الدروس أدناه لتسريع وتيرة نموك الفني ونيل الاعتمادات المتقدمة.`
                : `Your "${weakestSkill.nameEn}" index is at (${weakestSkill.level}%). Taking the masterclasses below will accelerate your mastery.`}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lessons List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>{language === 'ar' ? `الدروس المتاحة (${filteredLessons.length})` : `Lessons (${filteredLessons.length})`}</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pe-1">
            {filteredLessons.map((les) => {
              const isSelected = selectedLesson?.id === les.id;
              return (
                <div
                  key={les.id}
                  onClick={() => setSelectedLesson(les)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-indigo-400">{les.category}</span>
                    <span className="font-mono text-emerald-400">+{les.xp} XP</span>
                  </div>

                  <h3 className="text-xs font-bold line-clamp-2 leading-snug">
                    {language === 'ar' ? les.titleAr : les.titleEn}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {language === 'ar' ? les.summaryAr : les.summaryEn}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {les.durationMin} {language === 'ar' ? 'دقيقة' : 'min'} • {les.level}
                    </span>

                    {les.completed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'ar' ? 'مكتمل' : 'Done'}
                      </span>
                    ) : (
                      <span className="text-slate-500">{language === 'ar' ? 'ابدأ' : 'Start'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Lesson Reader (7 Cols) */}
        {selectedLesson && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedLesson.category}
                    </span>
                    <span className="text-xs text-slate-400">⏱ {selectedLesson.durationMin} min</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{selectedLesson.xp} XP</span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-white">
                    {language === 'ar' ? selectedLesson.titleAr : selectedLesson.titleEn}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveLesson(selectedLesson)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {selectedLesson.saved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Lesson Content Body */}
              <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-5 rounded-2xl border border-slate-800 font-sans">
                {language === 'ar' ? selectedLesson.contentAr : selectedLesson.contentEn}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-xs">
                <span className="font-bold text-indigo-300 block">
                  {language === 'ar' ? '🔑 خلاصات المخرج الفني (Key Takeaways):' : 'Key Takeaways:'}
                </span>
                <ul className="space-y-1 text-slate-300">
                  {selectedLesson.keyTakeaways?.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practice Exercise Brief */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-amber-400 block">
                  {language === 'ar' ? '🎯 تمرين التحدي التطبيقي:' : 'Action Exercise Drill:'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedLesson.exerciseBrief}
                </p>
              </div>

              {/* Completion Action */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {selectedLesson.completed
                    ? language === 'ar'
                      ? 'لقد أنهيت هذا الدرس بنجاح'
                      : 'Completed'
                    : language === 'ar'
                    ? 'أنهِ القراءة والتطبيق لاعتماد النقاط'
                    : 'Finish reading to record completion'}
                </span>

                <button
                  onClick={() => handleCompleteLesson(selectedLesson)}
                  disabled={selectedLesson.completed}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    selectedLesson.completed
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedLesson.completed
                      ? language === 'ar'
                        ? 'تم إكمال الدرس'
                        : 'Completed'
                      : language === 'ar'
                      ? 'تم تطبيق الدرس (+XP)'
                      : 'Mark Completed'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
