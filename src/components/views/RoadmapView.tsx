import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitMerge,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { language, roadmap, updateRoadmapStatus, showToast } = useApp();

  const statuses: Array<'Completed' | 'In Progress' | 'Planned'> = [
    'Completed',
    'In Progress',
    'Planned',
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <GitMerge className="w-4 h-4" />
            <span>{language === 'ar' ? 'خارطة طريق تطوير المنصة (Development Roadmap)' : 'Official Development Roadmap'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'مراحل التوسع والتحديثات المستقبلية لـ DesignForge AI' : 'Strategic Release Phases & Feature Lifecycle'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'تتبع حي لمراحل الإطلاق من النواة الأساسية وصولاً إلى بيئة العمل التعاونية وسوق المحترفين العالمي.'
              : 'Interactive release timeline synced with our project management backend. Toggle phase statuses to track engineering milestones.'}
          </p>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ar'
              ? 'نظام المزامنة التلقائية مع لوحة إدارة المشاريع نشط ومحدث حتى 2026+'
              : 'Project management sync pipeline is active & verified.'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-400">Status: Real-Time Synced</span>
      </div>

      {/* Roadmap Timeline Cards */}
      <div className="space-y-6">
        {roadmap.map((phase) => {
          let badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
          if (phase.status === 'Completed') {
            badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          } else if (phase.status === 'In Progress') {
            badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          } else if (phase.status === 'Planned') {
            badgeClass = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
          }

          return (
            <div
              key={phase.id}
              className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 hover:border-indigo-500/30 transition-all shadow-md"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400 font-mono">
                      {phase.phase}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">• {phase.targetQuarter}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white">{phase.title}</h3>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => updateRoadmapStatus(phase.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        phase.status === st
                          ? st === 'Completed'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : st === 'In Progress'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {phase.description}
              </p>

              {/* Feature Items List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'الميزات والوحدات المشمولة في هذه المرحلة:' : 'Included Modules & Architectural Features:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {phase.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5 text-slate-200"
                    >
                      {phase.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : phase.status === 'In Progress' ? (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
