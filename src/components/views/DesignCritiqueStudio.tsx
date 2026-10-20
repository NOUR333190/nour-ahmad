import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { CritiqueResult, CoachMessage } from '../../types';
import {
  ScanEye,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Compass,
  FileCheck2,
  Image as ImageIcon,
  Video,
  Play,
  ArrowRight,
  Send,
  MessageSquare,
  Wand2,
  Sliders,
  Layers,
  ChevronRight,
  Maximize2,
  Check,
  ExternalLink,
} from 'lucide-react';

export const DesignCritiqueStudio: React.FC = () => {
  const {
    language,
    critiqueSampleImage,
    activeProject,
    updateProject,
    showToast,
    addXP,
    updateSkill,
    setActiveSection,
  } = useApp();

  // Media state: image or video
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaPreview, setMediaPreview] = useState<string | null>(
    critiqueSampleImage ||
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'
  );
  const [mediaMimeType, setMediaMimeType] = useState<string>('image/jpeg');
  const [mediaFileName, setMediaFileName] = useState<string>('sample-luxury-mockup.jpg');

  // Critique configuration
  const [designGoal, setDesignGoal] = useState('إعلان سوشيال ميديا وحملة إطلاق لمنتج فاخر');
  const [targetAudience, setTargetAudience] = useState('جمهور خليجي يبحث عن الفخامة والأناقة الهادئة');
  const [loading, setLoading] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null);

  // Active view tab inside Critique Studio: 'diagnostic' | 'coach_chat'
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'coach_chat'>('diagnostic');

  // Integrated AI Coach Live Chat inside Critique
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      id: 'critique-coach-welcome',
      role: 'assistant',
      content:
        language === 'ar'
          ? 'مرحباً يا نور! أنا معك كآرت ديركتور داخل استوديو النقد. ارفع مسودة تصميمك أو فيديو موشن وسأحلل لك بدقة التباين، التوازن، وتوزيع العناصر، ويمكنك سؤالي عن أي تفصيلة لتعديلها فوراً.'
          : 'Welcome Noor! I am your Art Director in the Critique Studio. Upload your design draft or motion video and I will dissect contrast, balance, and element distribution with senior precision.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachChatLoading, setCoachChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Preset sample designs
  const samplePresets = [
    {
      titleAr: 'إعلان عطر فاخر (Branding)',
      titleEn: 'Luxury Perfume Ad',
      url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      type: 'image' as const,
      mime: 'image/jpeg',
      goal: 'إعلان سوشيال ميديا لإطلاق عطر حصري ذو طابع راقٍ وهادئ',
      audience: 'الشباب المهتمون بالعطور الفاخرة ونمط الحياة الأنيق',
    },
    {
      titleAr: 'بوستر سيارة كهربائية (Automotive)',
      titleEn: 'EV Car Poster',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      type: 'image' as const,
      mime: 'image/jpeg',
      goal: 'بوستر ترويجي لحملة إطلاق سيارة كهربائية فائقة الأداء',
      audience: 'رواد الأعمال ومحبو التقنيات المستدامة المتطورة',
    },
    {
      titleAr: 'غلاف مجلة تحريرية (Editorial)',
      titleEn: 'Editorial Cover',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      type: 'image' as const,
      mime: 'image/jpeg',
      goal: 'غلاف مجلة أزياء معاصرة يبرز التيبوغرافيا والتباين الحاد',
      audience: 'عشاق الموضة والتصميم التحريري العالمي',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      const detectedType = isVid ? 'video' : 'image';
      setMediaType(detectedType);
      setMediaMimeType(file.type || (isVid ? 'video/mp4' : 'image/jpeg'));
      setMediaFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
        setCritiqueResult(null);
        showToast(
          language === 'ar'
            ? `تم تحميل ${isVid ? 'الفيديو' : 'التصميم'} بنجاح للمختبر!`
            : `Loaded ${isVid ? 'video' : 'image'} successfully!`,
          'info'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunCritique = async () => {
    if (!mediaPreview) {
      showToast(language === 'ar' ? 'يرجى رفع تصميم أو فيديو أولاً' : 'Please upload media first', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.analyzeDesign({
        imageData: mediaPreview,
        mediaData: mediaPreview,
        mediaType,
        imageMimeType: mediaMimeType,
        mediaMimeType,
        designGoal,
        targetAudience,
        projectBrief: activeProject?.brief?.overview,
        language,
      });

      setCritiqueResult(result);
      addXP(150, 'نقد التصميم وتحديد الملاحظات');
      updateSkill('sk-3', 2);
      updateSkill('sk-1', 2);

      // Auto-append coach insight message into chat
      const coachFeedbackMsg: CoachMessage = {
        id: `critique-insight-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'ar'
            ? `أنهيت التحليل الفني لتصميمك بنتيجة ${result.overallScore}%!
أهم ما رصدته:
• التباين: ${result.contrastAnalysis?.verdict || 'جيد مع حاجة لرفع تباين النصوص'} (${result.contrastAnalysis?.score || result.dimensionsScore.contrast}%)
• التوازن: ${result.balanceAnalysis?.verdict || 'متزن بصرياً'} (${result.balanceAnalysis?.score || result.dimensionsScore.composition}%)
• توزيع العناصر: ${result.distributionAnalysis?.verdict || 'يحتاج مساحات تنفس إضافية'} (${result.distributionAnalysis?.score || result.dimensionsScore.spacing}%)

نصيحتي الفورية لك: ${result.recommendedChanges[0] || 'اضبط الهوامش ونسبة التباين'}.`
            : `Critique completed with ${result.overallScore}% score! Key observation on Contrast (${result.dimensionsScore.contrast}%) and Balance (${result.dimensionsScore.composition}%). Immediate fix: ${result.recommendedChanges[0]}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCoachMessages((prev) => [...prev, coachFeedbackMsg]);

      showToast(
        language === 'ar'
          ? `تم إنجاز التحليل الفني الشامل! التقييم العام: ${result.overallScore}%`
          : `Critique completed! Overall score: ${result.overallScore}%`,
        'success'
      );
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر إتمام التحليل الفني' : 'Critique failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCoachMessage = async () => {
    if (!coachInput.trim() || coachChatLoading) return;

    const userMsg: CoachMessage = {
      id: `critique-user-${Date.now()}`,
      role: 'user',
      content: coachInput.trim(),
      attachmentUrl: mediaPreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCoachMessages((prev) => [...prev, userMsg]);
    setCoachInput('');
    setCoachChatLoading(true);

    try {
      const reply = await aiService.answerDesignQuestion({
        messages: [
          ...coachMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachmentUrl: m.attachmentUrl,
          })),
          {
            role: 'user',
            content: userMsg.content,
            attachmentUrl: mediaPreview || undefined,
          },
        ],
        context: {
          designGoal,
          targetAudience,
          critiqueScore: critiqueResult?.overallScore,
          activeProject: activeProject?.title,
          contrastScore: critiqueResult?.contrastAnalysis?.score,
          balanceScore: critiqueResult?.balanceAnalysis?.score,
          distributionScore: critiqueResult?.distributionAnalysis?.score,
        },
        persona: 'strict_art_director',
        model: 'gemini-3.8-flash',
        language,
      });

      const assistantMsg: CoachMessage = {
        id: `critique-assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCoachMessages((prev) => [...prev, assistantMsg]);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر الحصول على رد السنيور' : 'Coach response failed', 'error');
    } finally {
      setCoachChatLoading(false);
    }
  };

  const handleCreateRevisionPlan = () => {
    if (!critiqueResult || !activeProject) {
      showToast(
        language === 'ar'
          ? 'يرجى ربط المشروع أولاً لحفظ خطة التعديلات'
          : 'No active project selected to attach plan to',
        'warning'
      );
      return;
    }

    const newTasks = critiqueResult.recommendedChanges.map((rec, i) => ({
      id: `task-rev-${Date.now()}-${i}`,
      title: rec,
      done: false,
    }));

    updateProject(activeProject.id, {
      tasks: [...activeProject.tasks, ...newTasks],
      stage: 'Revision',
    });

    showToast(
      language === 'ar'
        ? `تم إنشاء خطة التعديلات (${newTasks.length} مهام) ونقل المشروع لمرحلة Revision`
        : `Created revision plan with ${newTasks.length} tasks`,
      'success'
    );
  };

  const quickCoachPrompts = [
    {
      labelAr: '🔍 إزاي أصلح التباين هنا؟',
      labelEn: 'How to fix contrast?',
      prompt: 'بص على التصميم المرفوع، قولي بالمللي إزاي أصلح تباين النصوص والعناصر بدون ما أبوظ الهوية البصرية؟',
    },
    {
      labelAr: '⚖️ هل توزيع الكتل متزن؟',
      labelEn: 'Is visual balance solid?',
      prompt: 'حلل لي مركز الثقل البصري في التصميم: هل فيه ميل لجهة معينة؟ وكيف أحقق توازناً لا متماثلاً راقياً؟',
    },
    {
      labelAr: '📐 اقترح هوامش تنفس ومساحات سلبية',
      labelEn: 'Recommend negative space',
      prompt: 'ما هي التعديلات الدقيقة بالبيكسل لهوامش الأمان والمساحات السلبية حول العنوان وزر الإجراء؟',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Header & Context Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ScanEye className="w-4 h-4" />
            <span>{language === 'ar' ? 'مختبر نقد وتحليل التصاميم الفني المتقدم' : 'Design Critique Studio'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar'
              ? 'تحليل دقيق للثالوث البصري: التباين، التوازن، وتوزيع العناصر'
              : 'Precision Visual Diagnostics: Contrast, Balance & Layout Hierarchy'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'ارفع مسودة تصميمك أو فيديو موشن واحصل على فحص موضوعي من الآرت ديركتور مع تشخيص رقمي ومحادثة تفاعلية فورية.'
              : 'Upload design draft or motion video for senior art director audit across contrast, optical balance, and breathing margins.'}
          </p>
        </div>

        {/* Action switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'diagnostic'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تقرير التشخيص الفني' : 'Visual Diagnostics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('coach_chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'coach_chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'محادثة الآرت ديركتور' : 'Live Art Director'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Upload, Canvas, & Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                {mediaType === 'video' ? <Video className="w-4 h-4 text-sky-400" /> : <ImageIcon className="w-4 h-4 text-emerald-400" />}
                <span>{language === 'ar' ? 'معاينة العمل (صورة / فيديو)' : 'Design Work Preview'}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-500/30"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'رفع ملف' : 'Upload File'}</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Preview Box */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group flex items-center justify-center">
              {mediaPreview ? (
                mediaType === 'video' ? (
                  <video
                    src={mediaPreview}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <>
                    <img
                      src={mediaPreview}
                      alt="Design to critique"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تغيير الصورة أو الفيديو' : 'Change Media'}</span>
                    </div>
                  </>
                )
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center p-6 space-y-2 text-slate-500 cursor-pointer"
                >
                  <ImageIcon className="w-10 h-10 mx-auto" />
                  <p className="text-xs font-medium">
                    {language === 'ar'
                      ? 'انقر لرفع تصميمك (PNG, JPG, WebP) أو فيديو موشن (MP4, WebM)'
                      : 'Click to upload your image or motion reel'}
                  </p>
                </div>
              )}

              {/* Tag for media type */}
              <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                {mediaType.toUpperCase()}
              </div>
            </div>

            {/* Sample Presets Quick Loader */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {language === 'ar' ? 'أو جرب نماذج جاهزة للاختبار:' : 'Or test with sample presets:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMediaType(preset.type);
                      setMediaPreview(preset.url);
                      setMediaMimeType(preset.mime);
                      setDesignGoal(preset.goal);
                      setTargetAudience(preset.audience);
                      setCritiqueResult(null);
                      showToast(language === 'ar' ? `تم تحميل: ${preset.titleAr}` : `Loaded ${preset.titleEn}`, 'info');
                    }}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-medium text-start transition-all truncate"
                  >
                    {language === 'ar' ? preset.titleAr : preset.titleEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal & Audience Inputs */}
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'الهدف البصري والتسويقي:' : 'Design Objective:'}
                </label>
                <input
                  type="text"
                  value={designGoal}
                  onChange={(e) => setDesignGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'الجمهور المستهدف:' : 'Target Demographic:'}
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Run Diagnostic Button */}
            <button
              onClick={handleRunCritique}
              disabled={loading || !mediaPreview}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanEye className="w-4 h-4" />}
              <span>
                {language === 'ar'
                  ? 'تشغيل فحص التباين، التوازن، وتوزيع العناصر'
                  : 'Execute Precision Visual Critique'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Report OR Live Art Director Chat (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'diagnostic' ? (
            critiqueResult ? (
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 animate-in fade-in">
                {/* Overall Verdict Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b0f17] border border-slate-800">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'مؤشر الجاهزية التجارية والاتزان البصري' : 'Commercial Readiness Index'}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {language === 'ar' ? 'حكم الآرت ديركتور الفني' : 'Art Director Verdict'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{critiqueResult.summary}</p>
                  </div>
                  <div className="text-center sm:text-end shrink-0">
                    <div className="text-4xl font-black font-mono text-emerald-400">
                      {critiqueResult.overallScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'ar' ? 'تقييم معلل بالمعايير' : 'Calibrated Rating'}
                    </span>
                  </div>
                </div>

                {/* THE GOLDEN VISUAL TRIAD: Contrast, Balance, Distribution */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'ar' ? 'تشخيص الثالوث البصري الذهبي (The Visual Triad):' : 'The Visual Triad Diagnostics:'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 1. CONTRAST */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300">
                          {language === 'ar' ? '1. التباين البصري' : '1. Contrast'}
                        </span>
                        <span className="text-sm font-mono font-bold text-indigo-400">
                          {critiqueResult.contrastAnalysis?.score || critiqueResult.dimensionsScore.contrast}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {critiqueResult.contrastAnalysis?.details ||
                          (language === 'ar'
                            ? 'مدى وضوح نصوص العناوين والأزرار أمام الخلفيات وتفادي بهتان الألوان.'
                            : 'Text-to-background contrast and luminance clarity.')}
                      </p>
                      {critiqueResult.contrastAnalysis?.actionableTweak && (
                        <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-200">
                          <strong className="block text-indigo-400 mb-0.5">
                            {language === 'ar' ? 'الحل الفني المباشر:' : 'Senior Fix:'}
                          </strong>
                          {critiqueResult.contrastAnalysis.actionableTweak}
                        </div>
                      )}
                    </div>

                    {/* 2. BALANCE */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-300">
                          {language === 'ar' ? '2. التوازن والوزن' : '2. Balance'}
                        </span>
                        <span className="text-sm font-mono font-bold text-teal-400">
                          {critiqueResult.balanceAnalysis?.score || critiqueResult.dimensionsScore.composition}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {critiqueResult.balanceAnalysis?.details ||
                          (language === 'ar'
                            ? 'توزيع الكتل البصرية حول نقطة الارتكاز المركزية وتفادي ميل المشهد لجانب واحد.'
                            : 'Optical weight distribution and gravitational balance across the frame.')}
                      </p>
                      {critiqueResult.balanceAnalysis?.actionableTweak && (
                        <div className="p-2 rounded-xl bg-teal-950/30 border border-teal-500/20 text-[10px] text-teal-200">
                          <strong className="block text-teal-400 mb-0.5">
                            {language === 'ar' ? 'الحل الفني المباشر:' : 'Senior Fix:'}
                          </strong>
                          {critiqueResult.balanceAnalysis.actionableTweak}
                        </div>
                      )}
                    </div>

                    {/* 3. DISTRIBUTION & MARGINS */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">
                          {language === 'ar' ? '3. توزيع العناصر' : '3. Distribution'}
                        </span>
                        <span className="text-sm font-mono font-bold text-amber-400">
                          {critiqueResult.distributionAnalysis?.score || critiqueResult.dimensionsScore.spacing}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {critiqueResult.distributionAnalysis?.details ||
                          (language === 'ar'
                            ? 'المسافات السلبية وهوامش الأمان المحيطية لمنع التزاحم وسهولة قراءة المسار البصري.'
                            : 'Negative space, edge margins, and hierarchical layout distribution.')}
                      </p>
                      {critiqueResult.distributionAnalysis?.actionableTweak && (
                        <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[10px] text-amber-200">
                          <strong className="block text-amber-400 mb-0.5">
                            {language === 'ar' ? 'الحل الفني المباشر:' : 'Senior Fix:'}
                          </strong>
                          {critiqueResult.distributionAnalysis.actionableTweak}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Motion Analysis if Media is Video */}
                {mediaType === 'video' && critiqueResult.videoMotionAnalysis && (
                  <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تحليل حركة الفيديو والإيقاع (Motion Dynamics):' : 'Motion Dynamics Analysis:'}</span>
                      </h4>
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {critiqueResult.videoMotionAnalysis.pacingScore}%
                      </span>
                    </div>
                    <p className="text-xs text-sky-200/90 leading-relaxed">
                      {critiqueResult.videoMotionAnalysis.pacingVerdict} — {critiqueResult.videoMotionAnalysis.kineticTypography}
                    </p>
                    {critiqueResult.videoMotionAnalysis.timingFixes && critiqueResult.videoMotionAnalysis.timingFixes.length > 0 && (
                      <ul className="text-xs text-sky-300 space-y-1 pt-1">
                        {critiqueResult.videoMotionAnalysis.timingFixes.map((tf, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span>•</span>
                            <span>{tf}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'نقاط القوة البصرية (Strengths):' : 'Strengths:'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-200/90">
                      {critiqueResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'نقاط الضعف (Weaknesses):' : 'Weaknesses:'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-200/90">
                      {critiqueResult.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Critical Issues if present */}
                {critiqueResult.criticalIssues && critiqueResult.criticalIssues.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 text-xs space-y-1 text-rose-200">
                    <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'أخطاء حرجة يجب معالجتها فوراً:' : 'Critical Flaws:'}</span>
                    </h4>
                    <ul className="space-y-1 text-xs">
                      {critiqueResult.criticalIssues.map((ci, i) => (
                        <li key={i}>• {ci}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Changes */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-300">
                    {language === 'ar' ? 'التعديلات المقترحة للوصول إلى الاحتراف التام:' : 'Actionable Senior Tweaks:'}
                  </h4>
                  <div className="space-y-1.5">
                    {critiqueResult.recommendedChanges.map((rec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternative Direction */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-violet-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الاتجاه البصري البديل (Alternative Creative Direction):' : 'Alternative Creative Direction:'}</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed italic">{critiqueResult.alternativeDirection}</p>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunCritique}
                      disabled={loading}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إعادة الفحص' : 'Analyze Again'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('coach_chat')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'ناقش التعديلات مع السنيور' : 'Discuss with Senior'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCreateRevisionPlan}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'حفظ خطة التعديلات للمشروع' : 'Save Revision Plan'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 text-slate-500 min-h-[460px]">
                <ScanEye className="w-12 h-12 text-slate-600" />
                <div className="text-sm font-bold text-slate-400">
                  {language === 'ar' ? 'المختبر بانتظار تشغيل التحليل الفني' : 'Awaiting critique trigger'}
                </div>
                <p className="text-xs max-w-sm">
                  {language === 'ar'
                    ? 'ارفع تصميمك أو فيديو موشن أو اختر أحد النماذج الجاهزة، ثم اضغط "تشغيل فحص التباين، التوازن، وتوزيع العناصر" لعرض التشخيص الفني الشامل.'
                    : 'Upload your graphic work or motion reel and click Execute Critique for precision diagnostic feedback.'}
                </p>
              </div>
            )
          ) : (
            /* Live Art Director Coach Chat Tab */
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col h-[650px] animate-in fade-in">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {language === 'ar' ? 'الآرت ديركتور المباشر (Art Director Co-Pilot)' : 'Senior Art Director'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === 'ar'
                        ? 'توجيه دقيق، حلول فورية للتباين والتوازن وتوزيع المساحات'
                        : 'Calibrated design guidance on your active upload'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('diagnostic')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                >
                  <span>{language === 'ar' ? 'عرض التقرير' : 'View Report'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
                {coachMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {coachChatLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-indigo-300 w-fit">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{language === 'ar' ? 'الآرت ديركتور يحلل السؤال ويكتب التوجيه...' : 'Art Director is evaluating...'}</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Questions Chips */}
              <div className="pt-2 pb-3 flex flex-wrap gap-1.5 shrink-0">
                {quickCoachPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCoachInput(qp.prompt);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 transition-colors"
                  >
                    {language === 'ar' ? qp.labelAr : qp.labelEn}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendCoachMessage();
                  }}
                  placeholder={
                    language === 'ar'
                      ? 'اسأل الآرت ديركتور: إزاي أصلح التباين؟ اقترح كتل بديلة...'
                      : 'Ask Art Director: How to fix contrast? Suggest layouts...'
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendCoachMessage}
                  disabled={coachChatLoading || !coachInput.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
