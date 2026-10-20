import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { CreativeConcept } from '../../types';
import {
  Sparkles,
  Wand2,
  Loader2,
  Copy,
  Plus,
  FolderPlus,
  CheckCircle2,
  Palette,
  Type,
  Camera,
  Layers,
  ArrowRight,
  Film,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const CreativeLabView: React.FC = () => {
  const { language, activeProject, updateProject, showToast, addXP } = useApp();

  // Generator form inputs
  const [industry, setIndustry] = useState('Food & Beverage');
  const [platform, setPlatform] = useState('Instagram Feed (4:5)');
  const [goal, setGoal] = useState('إطلاق منتج فاخر وزيادة المبيعات بنسبة 30%');
  const [audience, setAudience] = useState('الشباب العصري وعشاق النمط الحياتي المتميز (20 - 35 سنة)');
  const [style, setStyle] = useState('Minimalist Neo-Editorial');
  const [mood, setMood] = useState('فخم، منعش، سينمائي وهادئ');
  const [product, setProduct] = useState('مشروب قهوة كولد برو مثلجة في زجاجة عنبرية');
  const [colorPreference, setColorPreference] = useState('أسود فحمي، كهرماني دافئ، وأبيض ناصع');
  const [difficulty, setDifficulty] = useState('Advanced');

  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<CreativeConcept[]>([]);
  const [conceptImages, setConceptImages] = useState<Record<number, string>>({});
  const [generatingConceptIdx, setGeneratingConceptIdx] = useState<number | null>(null);

  const handleGenerateConceptArtwork = async (prompt: string, idx: number) => {
    setGeneratingConceptIdx(idx);
    try {
      const res = await aiService.generateImage({
        prompt,
        aspectRatio: '1:1',
        stylePreset: 'luxury_minimal',
        language,
      });
      setConceptImages((prev) => ({ ...prev, [idx]: res.imageUrl }));
      addXP(120, 'توليد أصل بصري لمفهوم إبداعي');
      showToast(language === 'ar' ? 'تم توليد تصميم المفهوم بنجاح وبدون أي علامة مائية!' : 'Generated concept artwork watermark-free!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setGeneratingConceptIdx(null);
    }
  };

  const handleDownloadConceptImage = (imgUrl: string, idx: number) => {
    const fileName = `Concept_${idx + 1}_Noor_Artwork.png`;
    if (imgUrl.startsWith('data:image/')) {
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const a = document.createElement('a');
      a.href = `/api/image/download?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(fileName)}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    showToast(language === 'ar' ? 'تم بدء تحميل الصورة بجودة أصلية بدون علامة مائية' : 'Downloading watermark-free image', 'success');
  };

  const handleGenerateConcepts = async () => {
    setLoading(true);
    try {
      const generated = await aiService.generateCreativeConcepts({
        industry,
        platform,
        goal,
        audience,
        style,
        mood,
        product,
        colorPreference,
        difficulty,
        language,
      });

      setConcepts(generated);
      addXP(180, 'توليد مفاهيم إبداعية في المختبر');
      showToast(
        language === 'ar'
          ? `تم ابتكار ${generated.length} اتجاهات إبداعية بنجاح!`
          : `Generated ${generated.length} distinct creative directions!`,
        'success'
      );
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء توليد المفاهيم' : 'Failed to generate concepts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConceptToProject = (concept: CreativeConcept) => {
    if (!activeProject) {
      showToast(language === 'ar' ? 'لا يوجد مشروع نشط لحفظ المفهوم فيه' : 'No active project selected', 'warning');
      return;
    }

    const updatedNotes = [
      ...activeProject.aiNotes,
      `[مفهوم إبداعي معتمد: ${concept.conceptName}]: الفكرة الكبرى: ${concept.bigIdea} | الاستعارة البصرية: ${concept.visualMetaphor}`,
    ];

    updateProject(activeProject.id, { aiNotes: updatedNotes });
    showToast(
      language === 'ar'
        ? `تم حفظ المفهوم "${concept.conceptName}" بنجاح في مشروع: ${activeProject.title}`
        : `Saved "${concept.conceptName}" to project ${activeProject.title}`,
      'success'
    );
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    showToast(language === 'ar' ? 'تم نسخ موجه الصورة (AI Prompt) إلى الحافظة' : 'Copied prompt to clipboard', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'مختبر الابتكار وتوليد المفاهيم الإبداعية' : 'Creative Lab & Art Direction Engine'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'توليد أفكار واستعارات بصرية غير مكررة' : 'Synthesize Distinct Creative Directions & Visual Metaphors'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'حدد مدخلات حملتك واستخرج مفاهيم فنية متكاملة تتضمن التكوين، الطباعة، وموجهات توليد الصور بالذكاء الاصطناعي.'
              : 'Turn brief parameters into full-spectrum art direction blueprints with prompt formulas and motion hooks.'}
          </p>
        </div>
      </div>

      {/* Generator Control Panel */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <span>{language === 'ar' ? 'محددات التوجيه الفني والحملة' : 'Brief Parameters'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'القطاع التجاري (Industry):' : 'Industry:'}
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'المنصة والمقاس (Platform):' : 'Platform:'}
            </label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'المنتج أو الخدمة (Product):' : 'Product / Service:'}
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'الأسلوب الفني (Style):' : 'Visual Style:'}
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'المزاج والشعور العام (Mood):' : 'Mood & Tone:'}
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'تفضيل الألوان (Color Preference):' : 'Color Palette Hint:'}
            </label>
            <input
              type="text"
              value={colorPreference}
              onChange={(e) => setColorPreference(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'الهدف التسويقي الأساسي (Goal):' : 'Campaign Goal:'}
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'ar' ? 'الجمهور المستهدف (Audience):' : 'Target Audience:'}
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={handleGenerateConcepts}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{language === 'ar' ? 'توليد المفاهيم الإبداعية الآن' : 'Synthesize Concepts'}</span>
          </button>
        </div>
      </div>

      {/* Generated Concepts Cards */}
      {concepts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <span>{language === 'ar' ? `المفاهيم الإبداعية المولّدة (${concepts.length})` : `Generated Concepts (${concepts.length})`}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {activeProject
                ? language === 'ar'
                  ? `يمكنك الحفظ مباشرة في: ${activeProject.title}`
                  : `Save to active: ${activeProject.title}`
                : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {concepts.map((concept, idx) => (
              <div
                key={concept.id || idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all space-y-5 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {language === 'ar' ? `الاتجاه #${idx + 1}` : `Direction #${idx + 1}`}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        {concept.conceptName}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleSaveConceptToProject(concept)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                      title={language === 'ar' ? 'حفظ في المشروع' : 'Save to project'}
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-violet-400" />
                      <span>{language === 'ar' ? 'حفظ للمشروع' : 'Save'}</span>
                    </button>
                  </div>

                  {/* Big Idea & Metaphor */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-violet-400 block mb-0.5">
                        {language === 'ar' ? '💡 الفكرة الكبرى (The Big Idea):' : 'The Big Idea:'}
                      </span>
                      <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        {concept.bigIdea}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-sky-400 block mb-0.5">
                        {language === 'ar' ? '🔮 الاستعارة البصرية (Visual Metaphor):' : 'Visual Metaphor:'}
                      </span>
                      <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        {concept.visualMetaphor}
                      </p>
                    </div>
                  </div>

                  {/* Composition & Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-400 block">
                        {language === 'ar' ? 'التكوين البصري:' : 'Composition:'}
                      </span>
                      <p className="text-slate-300 leading-snug">{concept.composition}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-400 block">
                        {language === 'ar' ? 'لوحة الألوان المحددة:' : 'Color Palette:'}
                      </span>
                      <div className="flex gap-1.5 pt-1">
                        {concept.colorDirection?.map((c, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-lg shadow-inner ring-1 ring-white/10"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Typography & Photography */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'التيبوغرافيا:' : 'Typography:'}</span>
                      </span>
                      <p className="text-slate-300 leading-snug">{concept.typography}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'توجيه التصوير الفوتوغرافي:' : 'Photography:'}</span>
                      </span>
                      <p className="text-slate-300 leading-snug">{concept.photographyDirection}</p>
                    </div>
                  </div>

                  {/* Motion Concept if present */}
                  {concept.motionConcept && (
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'توجيه الحركة والميكرو-انيميشن:' : 'Motion Concept:'}</span>
                      </span>
                      <p className="text-slate-300">{concept.motionConcept}</p>
                    </div>
                  )}

                  {/* Image Prompt formula */}
                  <div className="p-3.5 rounded-2xl bg-[#080d1a] border border-indigo-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'موجه توليد الصورة (AI Image Prompt):' : 'AI Image Prompt Formula:'}</span>
                      </span>
                      <button
                        onClick={() => copyPrompt(concept.imagePrompt)}
                        className="text-[11px] text-indigo-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{language === 'ar' ? 'نسخ الموجه' : 'Copy Prompt'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] bg-black/40 p-2 rounded-lg leading-relaxed select-all">
                      {concept.imagePrompt}
                    </p>
                  </div>

                  {/* One-Click Watermark-Free Visual Generation */}
                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleGenerateConceptArtwork(concept.imagePrompt, idx)}
                      disabled={generatingConceptIdx === idx}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {generatingConceptIdx === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>
                        {conceptImages[idx]
                          ? language === 'ar' ? 'إعادة توليد تصميم بديل' : 'Re-generate Visual'
                          : language === 'ar' ? '🎨 توليد العمل الفني للمفهوم (بدون علامة مائية)' : 'Generate Clean Concept Artwork'}
                      </span>
                    </button>

                    {conceptImages[idx] && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 space-y-2 animate-in fade-in">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                          <img
                            src={conceptImages[idx]}
                            alt="Concept artwork"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold flex items-center gap-1 backdrop-blur-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>{language === 'ar' ? 'بدون علامة مائية' : 'No Watermark'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 px-1">
                          <span className="text-[10px] text-slate-400 font-mono">1024×1024 Clean HD</span>
                          <button
                            type="button"
                            onClick={() => handleDownloadConceptImage(conceptImages[idx], idx)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'تحميل الصورة' : 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer CTA recommendation */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {language === 'ar' ? 'دعوة اتخاذ الإجراء (CTA):' : 'Recommended CTA:'}{' '}
                    <strong className="text-white font-bold">{concept.cta}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
