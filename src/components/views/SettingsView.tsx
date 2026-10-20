import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';
import {
  Settings,
  User,
  Palette,
  Languages,
  Bell,
  Sparkles,
  Shield,
  Database,
  Link2,
  CheckCircle2,
  RotateCcw,
  Sun,
  Moon,
  Trash2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    userProfile,
    updateUserProfile,
    showConfirmation,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'ai' | 'notifications' | 'data'>('profile');

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [primaryField, setPrimaryField] = useState(userProfile.primaryField);
  const [availableHours, setAvailableHours] = useState(userProfile.availableHoursPerWeek);

  // Notification prefs
  const [notifyChallenges, setNotifyChallenges] = useState(true);
  const [notifyRevisions, setNotifyRevisions] = useState(true);
  const [notifyAchievements, setNotifyAchievements] = useState(true);

  // AI preferences
  const [aiCritiqueDepth, setAiCritiqueDepth] = useState<'direct' | 'comprehensive' | 'pedagogical'>('comprehensive');
  const [clientDifficultyBias, setClientDifficultyBias] = useState<'realistic' | 'hard' | 'mentor'>('realistic');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      title,
      primaryField,
      availableHoursPerWeek: availableHours,
    });
    showToast(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully', 'success');
  };

  const handleResetData = () => {
    showConfirmation(
      language === 'ar' ? 'إعادة ضبط بيانات التطبيق' : 'Reset All Local Data',
      language === 'ar'
        ? 'هل أنت متأكد من رغبتك في حذف كافة التعديلات والمشاريع والعودة للحالة الأولية؟'
        : 'Are you sure you want to reset all data to default mock records?',
      () => {
        storageService.resetAllData();
        window.location.reload();
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>{language === 'ar' ? 'الإعدادات وتفضيلات مساحة العمل' : 'Workspace & Account Preferences'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'تخصيص الحساب، الذكاء الاصطناعي، والمظهر' : 'Configure Profile, AI Model Behavior & Display'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'إدارة اللغة، المظهر الداكن/الفاتح، وتفضيلات عمق نقد الذكاء الاصطناعي.'
              : 'Tune UI theme, bilingual architecture, critique depth, and client persona behaviors.'}
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs (3 Cols) */}
        <div className="lg:col-span-3 space-y-1.5">
          {[
            { id: 'profile', labelAr: 'الملف الشخصي والحساب', labelEn: 'Profile & Account', icon: User },
            { id: 'appearance', labelAr: 'المظهر واللغة', labelEn: 'Appearance & Language', icon: Palette },
            { id: 'ai', labelAr: 'تفضيلات الذكاء الاصطناعي', labelEn: 'AI Preferences', icon: Sparkles },
            { id: 'notifications', labelAr: 'الإشعارات والتنبيهات', labelEn: 'Notifications', icon: Bell },
            { id: 'data', labelAr: 'البيانات والخصوصية', labelEn: 'Data & Privacy', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box (9 Cols) */}
        <div className="lg:col-span-9 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                {language === 'ar' ? 'معلومات المصمم والملف المهني' : 'Designer Profile Information'}
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{userProfile.name}</div>
                  <div className="text-[11px] text-slate-400">{userProfile.title}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Level {userProfile.level} • {userProfile.xp} XP
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {language === 'ar' ? 'المسمى المهني:' : 'Professional Title:'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {language === 'ar' ? 'المجال الإبداعي الرئيسي:' : 'Primary Discipline:'}
                  </label>
                  <input
                    type="text"
                    value={primaryField}
                    onChange={(e) => setPrimaryField(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {language === 'ar' ? 'ساعات التدريب الأسبوعية المستهدفة:' : 'Target Weekly Hours:'}
                  </label>
                  <input
                    type="number"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Appearance & Language Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                {language === 'ar' ? 'المظهر واللغة ونظام العرض' : 'Appearance & Localization'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    {language === 'ar' ? 'المظهر البصري (Theme Mode):' : 'Theme Mode:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                        theme === 'dark'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <div className="text-start">
                        <div className="text-xs font-bold">{language === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}</div>
                        <span className="text-[10px] text-slate-400">Dark-first 2026+</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                        theme === 'light'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-400" />
                      <div className="text-start">
                        <div className="text-xs font-bold">{language === 'ar' ? 'الوضع الفاتح' : 'Light Mode'}</div>
                        <span className="text-[10px] text-slate-400">High contrast clean</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    {language === 'ar' ? 'لغة الواجهة والبنية التحتية:' : 'Interface Language:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      onClick={() => setLanguage('ar')}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                        language === 'ar'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Languages className="w-5 h-5 text-indigo-400" />
                      <div className="text-start">
                        <div className="text-xs font-bold">العربية (RTL الأساسية)</div>
                        <span className="text-[10px] text-slate-400">مخصصة للمصمم العربي</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                        language === 'en'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Languages className="w-5 h-5 text-indigo-400" />
                      <div className="text-start">
                        <div className="text-xs font-bold">English (LTR Ready)</div>
                        <span className="text-[10px] text-slate-400">Global studio standard</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Preferences Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                {language === 'ar' ? 'سلوك ونماذج الذكاء الاصطناعي الإبداعي' : 'AI Behavior & Critique Depth'}
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-200 font-bold block mb-2">
                    {language === 'ar' ? 'عمق وأسلوب نقد التصاميم (Critique Rigor):' : 'Critique Style:'}
                  </label>
                  <div className="space-y-2 max-w-lg">
                    {[
                      { id: 'direct', labelAr: 'مباشر وحاسم (Agency Director)', descAr: 'نقد موجز بدون مقدمات يركز على المشكلات الحرجة أولاً.' },
                      { id: 'comprehensive', labelAr: 'شامل وتحليلي متوازن (Recommended)', descAr: 'تغطية متوازنة لـ 8 أبعاد بصرية مع خطة تعديلات دقيقة.' },
                      { id: 'pedagogical', labelAr: 'تعليمي وإرشادي (Senior Mentor)', descAr: 'شرح أسباب كل قرار فني وتزويد المراجع الأكاديمية.' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAiCritiqueDepth(opt.id as any)}
                        className={`w-full p-3.5 rounded-2xl border text-start transition-all ${
                          aiCritiqueDepth === opt.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-xs">{opt.labelAr}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{opt.descAr}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <label className="text-slate-200 font-bold block mb-2">
                    {language === 'ar' ? 'نموذج توليد الذكاء الاصطناعي الافتراضي:' : 'Default Gemini Model:'}
                  </label>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs max-w-lg">
                    <div>
                      <span className="font-bold text-white font-mono">gemini-3.8-flash</span>
                      <p className="text-[10px] text-slate-400">{language === 'ar' ? 'النموذج الأسرع والأكثر اتزاناً للمهام الإبداعية المعقدة' : 'Flagship multi-modal model'}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                {language === 'ar' ? 'تفضيلات التنبيهات والإشعارات' : 'Notification Preferences'}
              </h2>

              <div className="space-y-3 text-xs">
                {[
                  { title: language === 'ar' ? 'تنبيهات التحديات اليومية والسرعة' : 'Daily Challenges', state: notifyChallenges, setState: setNotifyChallenges },
                  { title: language === 'ar' ? 'إشعارات ردود وجولات تعديل العميل' : 'Client Revisions', state: notifyRevisions, setState: setNotifyRevisions },
                  { title: language === 'ar' ? 'إشعارات فتح الأوسمة والترقيات' : 'Achievements & XP Unlocks', state: notifyAchievements, setState: setNotifyAchievements },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between max-w-lg"
                  >
                    <span className="font-semibold text-slate-200">{item.title}</span>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setState(e.target.checked)}
                      className="rounded accent-indigo-500 cursor-pointer w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                {language === 'ar' ? 'البيانات والتخزين والخصوصية' : 'Data & Privacy'}
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                  <p>
                    {language === 'ar'
                      ? 'جميع مشاريعك، تصاميمك، جلسات محاكاة العميل، ومحادثات المرشد مخزنة محلياً داخل بيئة عملك الخاصة بأعلى معايير الأمان، ولا يتم مشاركة أي ملفات غير منشورة في المعرض العام.'
                      : 'All drafts, client simulator logs, and conversations are safely sandboxed locally.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4 max-w-lg">
                  <div>
                    <h4 className="font-bold text-rose-300">
                      {language === 'ar' ? 'إعادة ضبط البيانات واستعادة الافتراضي' : 'Reset Workspace Data'}
                    </h4>
                    <p className="text-[11px] text-rose-200/80">
                      {language === 'ar' ? 'حذف كافة السجلات والمشاريع وإعادة التهيئة' : 'Wipe local storage and restart mock state'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
