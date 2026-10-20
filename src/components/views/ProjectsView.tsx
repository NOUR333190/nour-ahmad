import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectVersion } from '../../types';
import {
  FolderGit2,
  Plus,
  Copy,
  Archive,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  GitBranch,
  Layers,
  ArrowRight,
  ExternalLink,
  Upload,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    language,
    projects,
    activeProject,
    setActiveProject,
    addProject,
    updateProject,
    duplicateProject,
    archiveProject,
    deleteProject,
    addProjectVersion,
    showConfirmation,
    showToast,
  } = useApp();

  const [newVersionName, setNewVersionName] = useState('V3');
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [showAddVersionModal, setShowAddVersionModal] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);

  const stages: Array<Project['stage']> = [
    'Research',
    'Strategy',
    'Concept',
    'Design',
    'Review',
    'Revision',
    'Final',
  ];

  const currentProject = activeProject || projects[0];

  const displayedProjects = projects.filter((p) => (filterArchived ? p.isArchived : !p.isArchived));

  const handleToggleTask = (taskId: string) => {
    if (!currentProject) return;
    const updatedTasks = currentProject.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    const completedCount = updatedTasks.filter((t) => t.done).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);
    updateProject(currentProject.id, { tasks: updatedTasks, progress });
    showToast(language === 'ar' ? 'تم تحديث حالة المهمة' : 'Task updated', 'info');
  };

  const handleAddTask = () => {
    if (!currentProject) return;
    const title = prompt(language === 'ar' ? 'عنوان المهمة الجديدة:' : 'New Task Title:');
    if (title && title.trim()) {
      const newTask = { id: `t-${Date.now()}`, title: title.trim(), done: false };
      const updatedTasks = [...currentProject.tasks, newTask];
      updateProject(currentProject.id, { tasks: updatedTasks });
      showToast(language === 'ar' ? 'تمت إضافة المهمة' : 'Task added', 'success');
    }
  };

  const handleCreateNewVersion = () => {
    if (!currentProject) return;
    addProjectVersion(currentProject.id, {
      versionName: newVersionName || `V${currentProject.versions.length + 1}`,
      notes: newVersionNotes || 'تحديث التصميم وتعديل العناصر',
      imageUrl: currentProject.coverImage,
      score: 90,
    });
    setNewVersionNotes('');
    setShowAddVersionModal(false);
  };

  const handleRename = (project: Project) => {
    const newTitle = prompt(language === 'ar' ? 'الاسم الجديد للمشروع:' : 'New project title:', project.title);
    if (newTitle && newTitle.trim()) {
      updateProject(project.id, { title: newTitle.trim() });
      showToast(language === 'ar' ? 'تم تعديل اسم المشروع' : 'Project renamed', 'success');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'مساحة إدارة المشاريع وإصدارات التصميم' : 'Project Workspace & Version Control'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {language === 'ar' ? 'تتبع مراحل العمل، المهام، والإصدارات (V1 - Final)' : 'Multi-Stage Project Tracking & Version History'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'إدارة محكمة لدورة حياة التصميم: من البحث والمفهوم حتى جولات مراجعة العميل والتسليم النهائي.'
              : 'Structured project architecture with briefs, tasks, client notes, and version comparisons.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFilterArchived(!filterArchived)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-medium transition-colors ${
              filterArchived
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'الأرشيف' : 'Archived'}
          </button>

          <button
            onClick={() =>
              addProject({
                title: language === 'ar' ? 'مشروع تصميم جديد' : 'New Design Project',
                clientName: 'عميل جديد',
                stage: 'Research',
              })
            }
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {/* Projects List Carousel/Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {displayedProjects.map((proj) => {
          const isSelected = currentProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className={`p-4 rounded-3xl border min-w-[280px] max-w-[320px] cursor-pointer transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-indigo-400 text-[11px]">{proj.category}</span>
                <span className="font-mono text-slate-400 text-[10px]">{proj.dueDate}</span>
              </div>
              <h3 className="text-xs font-bold text-white truncate">{proj.title}</h3>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{proj.clientName}</div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  {proj.stage}
                </span>
                <span className="text-emerald-400 font-mono font-bold">{proj.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Full Workspace */}
      {currentProject && (
        <div className="space-y-6">
          {/* Project Top Action Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {currentProject.category}
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'العميل:' : 'Client:'} <strong className="text-slate-200">{currentProject.clientName}</strong>
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>{currentProject.title}</span>
                <button
                  onClick={() => handleRename(currentProject)}
                  className="p-1 text-slate-500 hover:text-white"
                  title="تعديل الاسم"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </h2>
            </div>

            {/* Actions: Duplicate, Archive, Delete */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => duplicateProject(currentProject.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                title="تكرار المشروع"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'نسخ' : 'Duplicate'}</span>
              </button>

              <button
                onClick={() => archiveProject(currentProject.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                title="أرشفة"
              >
                <Archive className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'أرشفة' : 'Archive'}</span>
              </button>

              <button
                onClick={() => {
                  showConfirmation(
                    language === 'ar' ? 'حذف المشروع نهائياً' : 'Delete Project Permanently',
                    language === 'ar'
                      ? `هل أنت متأكد من رغبتك في حذف مشروع "${currentProject.title}" وكل إصداراته؟ لا يمكن التراجع.`
                      : `Are you sure you want to permanently delete "${currentProject.title}"?`,
                    () => deleteProject(currentProject.id)
                  );
                }}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-1.5 transition-colors"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>

          {/* Project Stage Stepper */}
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-slate-800/80">
            <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs pb-1">
              {stages.map((st, i) => {
                const isCurrent = currentProject.stage === st;
                return (
                  <button
                    key={st}
                    onClick={() => updateProject(currentProject.id, { stage: st })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white bg-slate-900/60'
                    }`}
                  >
                    <span>{i + 1}.</span>
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid: Brief & Tasks & Versions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Brief & Tasks (6 Cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Brief Box */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'ar' ? 'موجز المشروع (Project Brief):' : 'Project Brief:'}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  {currentProject.brief?.overview}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'المخرجات المتفق عليها:' : 'Target Deliverables:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.brief?.deliverables?.map((d, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'قائمة مهام المشروع' : 'Milestones & Tasks'}</span>
                  </h3>
                  <button
                    onClick={handleAddTask}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة مهمة' : 'Add Task'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {currentProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        task.done
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 line-through'
                          : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => {}}
                          className="rounded accent-emerald-500 cursor-pointer"
                        />
                        <span>{task.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Version Control System (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">
                      {language === 'ar' ? 'سجل النسخ المتعددة (Version History)' : 'Version History (V1-Final)'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddVersionModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حفظ نسخة جديدة' : 'New Version'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  {language === 'ar'
                    ? 'احتفظ بجميع مسودات V1, V2, V3 والنسخة النهائية Final مع ملاحظات العميل ونتائج التحليل الفني.'
                    : 'Compare design iterations, version notes, client comments, and historical scores.'}
                </p>

                {/* Versions Timeline */}
                <div className="space-y-3 pt-2">
                  {currentProject.versions.map((ver, idx) => (
                    <div
                      key={ver.id || idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {ver.versionName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{ver.createdAt}</span>
                        </div>
                        {ver.score && (
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            Score: {ver.score}%
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{ver.notes}</p>

                      {ver.feedback && (
                        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                          <strong className="block text-[10px] text-amber-400 uppercase">
                            {language === 'ar' ? 'ملاحظات العميل على هذه النسخة:' : 'Client Feedback on this version:'}
                          </strong>
                          {ver.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Version Dialog */}
      {showAddVersionModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowAddVersionModal(false)}
        >
          <div
            className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-white">
              {language === 'ar' ? 'حفظ إصدار جديد للتصميم' : 'Save Design Iteration'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'اسم النسخة (مثال: V2, V3, Final):' : 'Version Label (e.g. V2, Final):'}
                </label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'ملاحظات التعديل والتغييرات المنفذة:' : 'Iteration Notes & Changelog:'}
                </label>
                <textarea
                  rows={3}
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'تعديل تباين الشعار وتوسيع المساحة السلبية...' : 'Adjusted contrast and margins...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddVersionModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateNewVersion}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                {language === 'ar' ? 'حفظ الإصدار' : 'Save Version'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
