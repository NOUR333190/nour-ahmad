import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { clientProfiles } from '../../data/mockData';
import { ClientProfile } from '../../types';
import {
  Users2,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  FileCheck,
  RefreshCw,
  Coins,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';

export const ClientSimulatorView: React.FC = () => {
  const { language, addXP, updateSkill, showToast, addNotification } = useApp();

  const [selectedClient, setSelectedClient] = useState<ClientProfile>(clientProfiles[0]);
  const [stage, setStage] = useState<'brief' | 'concept' | 'design' | 'review' | 'revision' | 'approval' | 'final'>('brief');
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'client' | 'designer' | 'system';
    text: string;
    decision?: string;
    revisionNotes?: string[];
  }>>([
    {
      id: 'm1',
      sender: 'client',
      text: selectedClient.brandIdentityBrief,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisionsCount, setRevisionsCount] = useState(0);

  const stages: Array<{ id: typeof stage; labelAr: string; labelEn: string }> = [
    { id: 'brief', labelAr: '1. استلام الموجز', labelEn: '1. Brief' },
    { id: 'concept', labelAr: '2. تقديم المفهوم', labelEn: '2. Concept' },
    { id: 'design', labelAr: '3. التصميم الأولي', labelEn: '3. Design' },
    { id: 'review', labelAr: '4. مراجعة العميل', labelEn: '4. Review' },
    { id: 'revision', labelAr: '5. جولة التعديلات', labelEn: '5. Revision' },
    { id: 'approval', labelAr: '6. الاعتماد', labelEn: '6. Approval' },
    { id: 'final', labelAr: '7. التسليم النهائي', labelEn: '7. Delivery' },
  ];

  const handleSelectClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setStage('brief');
    setRevisionsCount(0);
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'client',
        text: client.brandIdentityBrief,
      },
    ]);
  };

  const handleDesignerAction = async (actionType: string, customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() && !actionType) return;

    const userMsg = {
      id: `des-${Date.now()}`,
      sender: 'designer' as const,
      text: textToSend || (language === 'ar' ? `تم إرسال مخرجات مرحلة: ${stage}` : `Submitting outputs for stage: ${stage}`),
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiService.simulateClient({
        clientProfile: selectedClient,
        conversationHistory: newMsgs,
        currentAction: actionType,
        designerMessage: userMsg.text,
        language,
      });

      const clientReplyMsg = {
        id: `cli-${Date.now() + 1}`,
        sender: 'client' as const,
        text: response.reply,
        decision: response.decision,
        revisionNotes: response.revisionNotes,
      };

      setMessages((prev) => [...prev, clientReplyMsg]);

      // Progress workflow logic
      if (response.decision === 'request_revision') {
        setRevisionsCount((c) => c + 1);
        setStage('revision');
        showToast(language === 'ar' ? 'العميل طلب تعديلات محددة على العمل' : 'Client requested revisions', 'warning');
      } else if (response.decision === 'approve_concept' || response.decision === 'final_approval') {
        if (stage === 'final' || response.decision === 'final_approval') {
          setStage('final');
          addXP(450, 'اعتماد العميل النهائي');
          updateSkill('sk-8', 5); // Client management
          addNotification({
            title: language === 'ar' ? 'تهانينا! اعتماد نهائي من العميل' : 'Final Sign-off Received!',
            description: `${selectedClient.name} اعتمد تسليم المشروع بالكامل دون ملاحظات إضافية.`,
            type: 'achievement',
          });
          showToast(language === 'ar' ? '🎉 تم الحصول على الاعتماد النهائي والميزانية كاملة!' : '🎉 Final sign-off received!', 'success');
        } else {
          setStage('approval');
          showToast(language === 'ar' ? 'وافق العميل على المفهوم بنجاح!' : 'Concept approved!', 'success');
        }
      } else if (stage === 'brief') {
        setStage('concept');
      } else if (stage === 'concept') {
        setStage('design');
      } else if (stage === 'design') {
        setStage('review');
      }
    } catch (err: any) {
      showToast(language === 'ar' ? 'تعذر محاكاة رد العميل' : 'Simulation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (personality: string) => {
    switch (personality) {
      case 'Demanding':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'Friendly':
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'Minimalist':
        return <Meh className="w-4 h-4 text-sky-400" />;
      default:
        return <Users2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'محاكي تفاوض واعتماد العملاء الذكي' : 'AI Client Simulator'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'تدرب على كسب ثقة أصعب العملاء واقعياً' : 'Simulate Demanding Real-World Client Dynamics'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'العميل يتصرف بذكاء وفق شخصيته: يطلب تعديلات، يرفض الأفكار النمطية، أو يعتمد عند الإقناع المنطقي.'
              : 'Clients react realistically to your work, budget boundaries, and creative rationale.'}
          </p>
        </div>

        {/* Client Picker Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 self-start md:self-auto">
          {clientProfiles.map((cp) => (
            <button
              key={cp.id}
              onClick={() => handleSelectClient(cp)}
              className={`p-1.5 pe-3 rounded-2xl border flex items-center gap-2 transition-all ${
                selectedClient.id === cp.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <img src={cp.avatar} alt={cp.name} className="w-7 h-7 rounded-xl object-cover ring-1 ring-slate-700" />
              <div className="text-start">
                <div className="text-xs font-bold leading-tight">{cp.name}</div>
                <div className="text-[10px] text-slate-500">{cp.personality}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Stage Tracker */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 text-xs">
          {stages.map((st, i) => {
            const isCurrent = stage === st.id;
            const isPassed = stages.findIndex((x) => x.id === stage) > i;
            return (
              <div
                key={st.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : isPassed
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'text-slate-500 bg-slate-950/40'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                <span>{language === 'ar' ? st.labelAr : st.labelEn}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client Profile Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={selectedClient.avatar}
                alt={selectedClient.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{selectedClient.name}</h3>
                <div className="text-xs text-indigo-400 font-medium">{selectedClient.role}</div>
                <div className="text-[11px] text-slate-400">{selectedClient.company}</div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'الشخصية السلوكية:' : 'Personality:'}</span>
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  {getMoodIcon(selectedClient.personality)}
                  {selectedClient.personality}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'الميزانية المتوقعة:' : 'Budget:'}</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  {selectedClient.budget}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'جولات التعديل الحالية:' : 'Revision Count:'}</span>
                <span className="font-mono font-bold text-rose-400">{revisionsCount} / 3</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {language === 'ar' ? 'موجز هوية العميل' : 'Identity Brief'}
              </span>
              <p className="text-slate-300 leading-relaxed italic text-[11px]">
                "{selectedClient.brandIdentityBrief}"
              </p>
            </div>
          </div>
        </div>

        {/* Conversation & Action Simulation Box (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-[600px] bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="p-4 px-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">
                {language === 'ar' ? `جلسة تفاوض مع ${selectedClient.name}` : `Negotiation Room with ${selectedClient.name}`}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {language === 'ar' ? 'المرحلة:' : 'Current Phase:'} <strong className="text-indigo-400 uppercase">{stage}</strong>
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((m) => {
              const isClient = m.sender === 'client';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-2xl ${isClient ? '' : 'ms-auto flex-row-reverse'}`}
                >
                  {isClient ? (
                    <img
                      src={selectedClient.avatar}
                      alt="client"
                      className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      أنت
                    </div>
                  )}

                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                        isClient
                          ? 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                          : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>

                    {m.revisionNotes && m.revisionNotes.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                        <span className="font-bold block text-[11px]">
                          {language === 'ar' ? '📌 بنود التعديل المطلوبة بدقة:' : 'Requested Revision Items:'}
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300">
                          {m.revisionNotes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-md">
                <img
                  src={selectedClient.avatar}
                  alt="client"
                  className="w-8 h-8 rounded-xl object-cover shrink-0"
                />
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>{language === 'ar' ? 'العميل يراجع ويدرس مقترحك...' : 'Client is evaluating...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Workflow Action Buttons */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => handleDesignerAction('submit_concept', language === 'ar' ? 'أرفقت لك 3 اتجاهات إبداعية تجمع بين روح العصر وهوية علامتكم الفاخرة.' : 'Attached 3 refined creative directions matching your goals.')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-900/30 text-slate-200 hover:text-indigo-300 border border-slate-800 shrink-0 transition-colors"
            >
              {language === 'ar' ? '📤 إرسال مفاهيم التصميم' : 'Submit Concepts'}
            </button>
            <button
              onClick={() => handleDesignerAction('ask_clarification', language === 'ar' ? 'هل تفضلون تركيز المساحة الإعلانية على العرض السعري أم على سرد قصة المنتج؟' : 'Should we prioritize the promotional CTA or product storytelling?')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-900/30 text-slate-200 hover:text-indigo-300 border border-slate-800 shrink-0 transition-colors"
            >
              {language === 'ar' ? '❓ طلب توضيح فني' : 'Ask Question'}
            </button>
            <button
              onClick={() => handleDesignerAction('send_revision', language === 'ar' ? 'قمت بتنفيذ جميع ملاحظاتكم: عززت تباين الشعار بنسبة 25% وضبطت درجات الألوان.' : 'Implemented all notes: boosted logo contrast by 25% and balanced the palette.')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-900/30 text-slate-200 hover:text-indigo-300 border border-slate-800 shrink-0 transition-colors"
            >
              {language === 'ar' ? '✨ إرسال التعديلات V2' : 'Send Revisions'}
            </button>
            <button
              onClick={() => handleDesignerAction('negotiate_deadline', language === 'ar' ? 'لضمان جودة استثنائية للملفات المطبوعة، نقترح تمديد موعد التسليم 24 ساعة إضافية.' : 'To ensure immaculate print production quality, we request a 24-hour extension.')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-900/30 text-slate-200 hover:text-indigo-300 border border-slate-800 shrink-0 transition-colors"
            >
              {language === 'ar' ? '⏳ تفاوض على الموعد' : 'Negotiate Deadline'}
            </button>
          </div>

          {/* Designer Custom Input Bar */}
          <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleDesignerAction('custom_message');
                }
              }}
              placeholder={
                language === 'ar'
                  ? 'اكتب ردك للعميل لإقناعه بالقرارات الفنية أو تبرير اختيار الخط...'
                  : 'Write your strategic response to the client...'
              }
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleDesignerAction('custom_message')}
              disabled={loading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
