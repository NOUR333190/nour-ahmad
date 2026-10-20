import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Zap,
  X,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export const AICommandModal: React.FC = () => {
  const {
    aiCommandOpen,
    setAiCommandOpen,
    language,
    activeProject,
    activeChallenge,
    setActiveSection,
    showToast,
    addNotification,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    content: string;
    palette?: string[];
    actionSuggestions?: string[];
  } | null>(null);

  if (!aiCommandOpen) return null;

  const quickPrompts = [
    'اعمل لي فكرة إعلان لمطعم',
    'هاتلي 3 أفكار لبراند ملابس',
    'اعمل Creative Direction',
    'اختار ألوان مناسبة',
    'اعمل Prompt للصورة',
    'ساعدني أتعامل مع العميل',
    'اعمل لي Brief لمشروع جديد',
    'ابحث عن اتجاهات التصميم الحالية',
  ];

  const handleExecute = async (cmdText?: string) => {
    const textToRun = cmdText || input;
    if (!textToRun.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const activeContext = {
        project: activeProject ? { title: activeProject.title, stage: activeProject.stage, client: activeProject.clientName } : null,
        challenge: activeChallenge ? { title: activeChallenge.title, category: activeChallenge.category } : null,
      };

      const res = await aiService.executeAICommand({
        command: textToRun,
        activeContext,
        language,
      });

      setResult(res);
      addNotification({
        title: language === 'ar' ? 'تم تنفيذ أمر AI الذكي' : 'AI Command Executed',
        description: res.title,
        type: 'saved_ai',
      });
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ في معالجة الأمر' : 'Error processing command', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(language === 'ar' ? 'تم نسخ التوجيه إلى الحافظة' : 'Copied to clipboard', 'success');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 md:pt-24 px-4 animate-in fade-in"
      onClick={() => setAiCommandOpen(false)}
    >
      <div
        className="bg-[#0f172a] rounded-3xl border border-indigo-500/30 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مركز الأوامر الذكي الموحد (AI Command Center)' : 'Universal AI Command Center'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {activeProject
                  ? language === 'ar'
                    ? `متصل بسياق المشروع الحالي: ${activeProject.title}`
                    : `Active Context: ${activeProject.title}`
                  : language === 'ar'
                  ? 'اكتب أي طلب إبداعي، اتجاه لوني، فكرة، أو صياغة موجه'
                  : 'Type any creative command, palette request, or prompt formula'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiCommandOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'اكتب أمرك هنا... (مثال: اعمل لي فكرة إعلان لمطعم أو اختار ألوان مناسبة)'
                  : 'Type command... (e.g. Give me 3 brand ideas or suggest a color palette)'
              }
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{language === 'ar' ? 'تنفيذ' : 'Run'}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick chip commands */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(p);
                  handleExecute(p);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-indigo-900/40 hover:text-indigo-300 text-slate-400 border border-slate-700/60 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-xs font-medium">
                {language === 'ar' ? 'الذكاء الاصطناعي يقوم بتحليل وتوليد الحل الإبداعي...' : 'AI is synthesizing creative direction...'}
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">{result.title}</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(result.content)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                </button>
              </div>

              {/* Palette if returned */}
              {result.palette && result.palette.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{language === 'ar' ? 'لوحة الألوان المقترحة' : 'Suggested Palette'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {result.palette.map((color, idx) => (
                      <div
                        key={idx}
                        onClick={() => copyToClipboard(color)}
                        className="group flex flex-col items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-indigo-500/50 transition-colors"
                      >
                        <div
                          className="w-full h-8 rounded-lg shadow-inner mb-1.5"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-slate-300 group-hover:text-indigo-400">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Body Content */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {result.content}
              </div>

              {/* Action Suggestions */}
              {result.actionSuggestions && result.actionSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'خطوات تنفيذية مقترحة:' : 'Suggested Next Actions:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.actionSuggestions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (action.includes('مختبر') || action.includes('Lab')) {
                            setActiveSection('creative-lab');
                          } else if (action.includes('نقد') || action.includes('Critique')) {
                            setActiveSection('critique');
                          } else if (action.includes('مشروع') || action.includes('Project')) {
                            setActiveSection('projects');
                          }
                          setAiCommandOpen(false);
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                      >
                        <span>{action}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !result && (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>{language === 'ar' ? 'اختر أمراً من الأعلى أو اكتب طلبك بحرية' : 'Pick a prompt or type your query above'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
