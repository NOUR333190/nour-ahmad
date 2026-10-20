import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, ArrowRight, Wand2, Compass } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, userProfile, updateUserProfile, language, showToast, addXP } = useApp();

  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel || 'intermediate');
  const [primaryField, setPrimaryField] = useState(userProfile.primaryField || 'Branding & Social Media');
  const [favoriteTools, setFavoriteTools] = useState<string[]>(userProfile.favoriteTools || ['Figma', 'Illustrator']);
  const [goals, setGoals] = useState<string[]>(userProfile.goals || ['إتقان التوجيه الفني المتكامل']);
  const [availableHours, setAvailableHours] = useState(userProfile.availableHoursPerWeek || 10);
  const [preferredDifficulty, setPreferredDifficulty] = useState(userProfile.preferredDifficulty || 'Advanced');

  if (!onboardingOpen) return null;

  const toggleTool = (tool: string) => {
    setFavoriteTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const handleFinish = () => {
    updateUserProfile({
      experienceLevel,
      primaryField,
      favoriteTools,
      goals,
      availableHoursPerWeek: availableHours,
      preferredDifficulty,
      isOnboarded: true,
    });
    setOnboardingOpen(false);
    addXP(200, 'إكمال التهيئة الأولية');
    showToast(language === 'ar' ? 'مرحباً بك في DesignForge AI! تم تخصيص تجربتك' : 'Welcome to DesignForge AI! Workspace customized', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0f172a] rounded-3xl border border-indigo-500/40 w-full max-w-xl shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-[1px]">
              <div className="w-full h-full bg-[#0b0f17] rounded-[11px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'تهيئة مساحة العمل الإبداعية' : 'Creative Workspace Onboarding'}
              </h2>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-indigo-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Experience & Field */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                {language === 'ar' ? 'ما هو مستوى خبرتك الحالي في التصميم؟' : 'What is your current design experience level?'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'beginner', labelAr: 'مبتدئ (طالب / هاوٍ)', labelEn: 'Beginner' },
                  { id: 'intermediate', labelAr: 'متوسط (1 - 3 سنوات)', labelEn: 'Intermediate' },
                  { id: 'advanced', labelAr: 'متقدم (مستقل / وكالة)', labelEn: 'Advanced' },
                  { id: 'lead', labelAr: 'مخرج فني / Lead Designer', labelEn: 'Lead / Art Director' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id as any)}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      experienceLevel === lvl.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{language === 'ar' ? lvl.labelAr : lvl.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                {language === 'ar' ? 'ما هو مجالك التصميمي الأساسي؟' : 'What is your primary design focus?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Branding & Identity',
                  'Social Media & Ads',
                  'UI / UX & Web',
                  'Advertising Campaigns',
                  'Product & Packaging',
                  'Motion Graphics',
                ].map((f) => (
                  <button
                    key={f}
                    onClick={() => setPrimaryField(f)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      primaryField === f
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs">{f}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tools & Goals */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                {language === 'ar' ? 'ما هي الأدوات والبرامج التي تستخدمها؟' : 'Which tools do you regularly use?'}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'Adobe Illustrator', 'Photoshop', 'Midjourney', 'After Effects', 'Blender', 'Cinema 4D', 'InDesign'].map((tool) => {
                  const selected = favoriteTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                {language === 'ar' ? 'أهدافك التدريبية الرئيسية في المنصة:' : 'Your core training objectives:'}
              </label>
              <div className="space-y-2">
                {[
                  'إتقان التوجيه الفني المتكامل (Art Direction)',
                  'التعامل والرد الاحترافي على العملاء الصعبين',
                  'تسريع وقت استخراج الأفكار الإبداعية والاستعارات',
                  'بناء معرض أعمال (Portfolio) يفرض الاحترام التجاري',
                  'دمج الذكاء الاصطناعي في سير العمل اليومي',
                ].map((g) => {
                  const selected = goals.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className={`w-full p-2.5 rounded-xl border text-start text-xs flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-medium'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{g}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Training Rhythm & Preferred Difficulty */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200">
                  {language === 'ar' ? 'الوقت المتاح للتدريب أسبوعياً:' : 'Available training time per week:'}
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {availableHours} {language === 'ar' ? 'ساعات / أسبوع' : 'hours / week'}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="2"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                {language === 'ar' ? 'مستوى صعوبة التحديات المفضل:' : 'Preferred challenge difficulty:'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'Beginner', labelAr: 'مبتدئ (15 دقيقة)', labelEn: 'Beginner (15m)' },
                  { id: 'Intermediate', labelAr: 'متوسط (30 دقيقة)', labelEn: 'Intermediate (30m)' },
                  { id: 'Advanced', labelAr: 'متقدم (60 دقيقة)', labelEn: 'Advanced (60m)' },
                  { id: 'Professional', labelAr: 'محترف / محاكاة عميل حقيقي', labelEn: 'Professional Simulation' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setPreferredDifficulty(d.id as any)}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      preferredDifficulty === d.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{language === 'ar' ? d.labelAr : d.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              {language === 'ar' ? 'السابق' : 'Back'}
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Wand2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'ابدأ مساحة العمل المخصصة' : 'Launch Personalized Workspace'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
