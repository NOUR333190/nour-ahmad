import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { Challenge } from '../../types';
import {
  Trophy,
  Filter,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Palette,
  Type,
  Maximize2,
  Users2,
  Wand2,
  Loader2,
  Play,
  RotateCcw,
} from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const {
    language,
    challenges,
    activeChallenge,
    setActiveChallenge,
    completeChallenge,
    setActiveSection,
    setCritiqueSampleImage,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [durationFilter, setDurationFilter] = useState<string>('All');
  const [generating, setGenerating] = useState(false);

  // Timer State for active drill
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const categories = [
    'All',
    'Social Media',
    'Advertising',
    'Branding',
    'Product Design',
    'Medical',
    'Food',
    'Fashion',
    'Technology',
    'Real Estate',
    'E-commerce',
    'Automotive',
    'Entertainment',
    'Education',
    'Corporate',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const durations = ['All', '15', '30', '60', '90'];

  const filteredChallenges = challenges.filter((c) => {
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    if (durationFilter !== 'All' && String(c.durationMinutes) !== durationFilter) return false;
    return true;
  });

  const selectedChallenge = activeChallenge || challenges[0];

  useEffect(() => {
    if (selectedChallenge && timeLeft === null) {
      setTimeLeft(selectedChallenge.durationMinutes * 60);
    }
  }, [selectedChallenge]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      showToast(language === 'ar' ? 'انتهى وقت التحدي! حان وقت تسليم العمل ونقده' : 'Time is up! Submit for critique', 'warning');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleGenerateCustomChallenge = async () => {
    setGenerating(true);
    try {
      const generated = await aiService.generateChallenge({
        category: categoryFilter === 'All' ? 'Branding' : categoryFilter,
        difficulty: difficultyFilter === 'All' ? 'Intermediate' : difficultyFilter,
        durationMinutes: durationFilter === 'All' ? 30 : Number(durationFilter),
        language,
      });

      setActiveChallenge(generated);
      setTimeLeft(generated.durationMinutes * 60);
      setTimerRunning(false);
      showToast(language === 'ar' ? 'تم توليد تحدٍ واقعي جديد بالذكاء الاصطناعي!' : 'Generated fresh AI challenge!', 'success');
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء توليد التحدي' : 'Error generating challenge', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleFinishDrill = () => {
    if (!selectedChallenge) return;
    completeChallenge(selectedChallenge.id, 88);
    // Suggest immediate critique
    setCritiqueSampleImage('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80');
    showToast(
      language === 'ar'
        ? 'رائع! تم تسليم التحدي بنجاح، يمكنك الآن الانتقال للنقد الشامل'
        : 'Challenge completed! Jump to Critique Studio',
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Engine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>{language === 'ar' ? 'محرك التحديات التفاعلي' : 'Dynamic Challenge Engine'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'تحديات تصميمية واقعية لرفع الاحترافية' : 'Real-World Client & Speed Design Drills'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'تدرب في 14 قطاعاً تجارياً تحت ضغط الوقت والمواصفات القياسية'
              : 'Sharpen your speed, visual discipline, and client compliance across 14 industries'}
          </p>
        </div>

        <button
          onClick={handleGenerateCustomChallenge}
          disabled={generating}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto shrink-0"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span>{language === 'ar' ? 'توليد تحدٍ مخصص بـ AI' : 'Generate AI Challenge'}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="space-y-2.5 p-4 rounded-2xl bg-[#0b0f17] border border-slate-800/80">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] font-bold shrink-0">
            {language === 'ar' ? 'القطاع:' : 'Industry:'}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty and Duration */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-bold">
              {language === 'ar' ? 'المستوى:' : 'Difficulty:'}
            </span>
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-2.5 py-0.5 rounded-lg text-xs transition-colors ${
                  difficultyFilter === d
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-bold">
              {language === 'ar' ? 'المدة:' : 'Duration:'}
            </span>
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setDurationFilter(dur)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                  durationFilter === dur
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dur === 'All' ? dur : `${dur}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Challenge Details & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selected Challenge Brief & Drill Workspace (8 Cols) */}
        {selectedChallenge && (
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              {/* Header with Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedChallenge.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {selectedChallenge.difficulty}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{selectedChallenge.xpReward} XP
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    {selectedChallenge.title}
                  </h2>
                </div>

                {/* Drill Timer */}
                <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#0b0f17] border border-slate-800 self-start sm:self-auto">
                  <div className="text-end">
                    <div className="text-[10px] text-slate-400">
                      {language === 'ar' ? 'الوقت المتبقي' : 'Timer'}
                    </div>
                    <div className="text-lg font-mono font-bold text-amber-400">
                      {timeLeft !== null ? formatTimer(timeLeft) : '00:00'}
                    </div>
                  </div>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`p-2 rounded-xl text-white transition-all ${
                      timerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                    title={timerRunning ? 'إيقاف مؤقت' : 'بدء التوقيت'}
                  >
                    <Play className={`w-4 h-4 ${timerRunning ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setTimeLeft(selectedChallenge.durationMinutes * 60);
                      setTimerRunning(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    title="إعادة ضبط"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Client & Problem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'العميل والعلامة:' : 'Client & Brand:'}
                  </span>
                  <div className="text-xs font-bold text-white">
                    {selectedChallenge.client.name} — {selectedChallenge.client.brand}
                  </div>
                  <div className="text-[11px] text-indigo-400">{selectedChallenge.client.industry}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'المنصة والمقاسات:' : 'Platform & Dimensions:'}
                  </span>
                  <div className="text-xs font-bold text-white">{selectedChallenge.platform}</div>
                  <div className="text-[11px] font-mono text-slate-400">{selectedChallenge.dimensions}</div>
                </div>
              </div>

              {/* Objective & Problem */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-1">
                    {language === 'ar' ? 'الهدف التسويقي البصري:' : 'Visual Objective:'}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    {selectedChallenge.objective}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-1">
                    {language === 'ar' ? 'المشكلة المطلوب حلها:' : 'The Problem:'}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    {selectedChallenge.problem}
                  </p>
                </div>
              </div>

              {/* Visual & Typography Direction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Palette className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الاتجاه اللوني المقترح:' : 'Color Direction:'}</span>
                  </div>
                  <div className="flex gap-2">
                    {selectedChallenge.colorDirection.map((c, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="w-full h-8 rounded-lg shadow-inner mb-1" style={{ backgroundColor: c }} />
                        <span className="text-[9px] font-mono text-slate-400">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Type className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'التوجيه الطباعي:' : 'Typography Direction:'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    {selectedChallenge.typographyDirection}
                  </p>
                </div>
              </div>

              {/* Deliverables & Restrictions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300">
                    {language === 'ar' ? 'المخرجات المطلوبة (Deliverables):' : 'Deliverables:'}
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {selectedChallenge.deliverables.map((del, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'المحظورات والقيود:' : 'Restrictions:'}</span>
                  </h4>
                  <p className="text-xs text-rose-200/80 leading-relaxed bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/40">
                    {selectedChallenge.restrictions}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActiveSection('simulator');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <Users2 className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'ar' ? 'فتح في محاكي العميل' : 'Open in Client Simulator'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSection('critique');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-colors"
                  >
                    {language === 'ar' ? 'نقد التصميم المنجز' : 'Critique Output'}
                  </button>

                  <button
                    onClick={handleFinishDrill}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تسليم التحدي واعتماد النقاط' : 'Submit & Earn XP'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Challenges Feed / Explorer (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">
              {language === 'ar' ? 'قائمة التحديات المتاحة' : 'Available Drills'} ({filteredChallenges.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pe-1">
            {filteredChallenges.map((ch) => {
              const isSelected = selectedChallenge?.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveChallenge(ch);
                    setTimeLeft(ch.durationMinutes * 60);
                    setTimerRunning(false);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-indigo-400">{ch.category}</span>
                    <span className="font-mono text-emerald-400">+{ch.xpReward} XP</span>
                  </div>

                  <h3 className="text-xs font-bold line-clamp-2">{ch.title}</h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <span>⏱ {ch.durationMinutes}m • {ch.difficulty}</span>
                    {ch.completed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'ar' ? 'منجز' : 'Done'}
                      </span>
                    ) : (
                      <span className="text-slate-500">{language === 'ar' ? 'جاهز' : 'Ready'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
