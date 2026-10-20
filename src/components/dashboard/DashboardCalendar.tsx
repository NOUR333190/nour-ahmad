import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';
import { ScheduledEvent, Project } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Briefcase,
  Trophy,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  X,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface DashboardCalendarProps {
  className?: string;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ className = '' }) => {
  const {
    language,
    projects,
    setActiveProject,
    setActiveSection,
    challenges,
    setActiveChallenge,
    showToast,
  } = useApp();

  // Current anchor date (October 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-01');
  const [filterType, setFilterType] = useState<'all' | 'projects' | 'trainings'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load custom scheduled events from storage
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>(() =>
    storageService.getScheduledEvents()
  );

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ScheduledEvent['type']>('training_drill');
  const [newDate, setNewDate] = useState('2026-10-01');
  const [newTime, setNewTime] = useState('14:00');
  const [newCategory, setNewCategory] = useState('Branding');
  const [newDuration, setNewDuration] = useState('30');
  const [newDescription, setNewDescription] = useState('');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDateStr('2026-10-01');
  };

  // Convert project due dates into calendar events dynamically
  const projectEvents = useMemo<ScheduledEvent[]>(() => {
    return projects
      .filter((p) => p.dueDate && !p.isArchived)
      .map((p) => ({
        id: `proj-event-${p.id}`,
        title: language === 'ar' ? `تسليم: ${p.title}` : `Due: ${p.title}`,
        titleAr: `تسليم: ${p.title}`,
        type: 'project_deadline' as const,
        date: p.dueDate,
        time: '18:00',
        category: p.category,
        relatedId: p.id,
        status: p.progress < 70 ? ('urgent' as const) : ('upcoming' as const),
        description:
          language === 'ar'
            ? `المشروع مع ${p.clientName} — الإنجاز الحالي ${p.progress}%`
            : `Client ${p.clientName} — Progress ${p.progress}%`,
      }));
  }, [projects, language]);

  // Combine and deduplicate events
  const allEvents = useMemo(() => {
    const list = [...scheduledEvents];
    // Add projects that aren't already represented by relatedId
    projectEvents.forEach((pe) => {
      const alreadyExists = list.some((e) => e.relatedId === pe.relatedId && e.date === pe.date);
      if (!alreadyExists) {
        list.push(pe);
      }
    });
    return list;
  }, [scheduledEvents, projectEvents]);

  // Filter events according to active filter
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return allEvents;
    if (filterType === 'projects') {
      return allEvents.filter((e) => e.type === 'project_deadline');
    }
    return allEvents.filter((e) => e.type !== 'project_deadline');
  }, [allEvents, filterType]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: ScheduledEvent[];
    }> = [];

    // Prepend previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-01',
        events: dayEvents,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dateStr === '2026-10-01',
        events: dayEvents,
      });
    }

    // Append next month days to complete 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-01',
        events: dayEvents,
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredEvents]);

  // Selected date events
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.date === selectedDateStr);
  }, [filteredEvents, selectedDateStr]);

  // Next upcoming 4 events chronologically
  const upcomingEvents = useMemo(() => {
    return [...filteredEvents]
      .filter((e) => e.date >= '2026-10-01')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
  }, [filteredEvents]);

  // Handle adding new custom scheduled event
  const handleSaveNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast(language === 'ar' ? 'يرجى كتابة عنوان للموعد أو التدريب' : 'Please enter an event title', 'warning');
      return;
    }

    const newEvent: ScheduledEvent = {
      id: `custom-event-${Date.now()}`,
      title: newTitle.trim(),
      titleAr: newTitle.trim(),
      type: newType,
      date: newDate,
      time: newTime,
      durationMinutes: Number(newDuration) || 30,
      category: newCategory,
      status: 'upcoming',
      description: newDescription.trim() || undefined,
    };

    const updated = [...scheduledEvents, newEvent];
    setScheduledEvents(updated);
    storageService.saveScheduledEvents(updated);

    showToast(
      language === 'ar' ? 'تمت إضافة الموعد إلى جدولك بنجاح' : 'Scheduled event added successfully',
      'success'
    );

    setIsModalOpen(false);
    setSelectedDateStr(newDate);
    setNewTitle('');
    setNewDescription('');
  };

  // Handle deleting a custom event
  const handleDeleteEvent = (id: string) => {
    const updated = scheduledEvents.filter((e) => e.id !== id);
    setScheduledEvents(updated);
    storageService.saveScheduledEvents(updated);
    showToast(language === 'ar' ? 'تم حذف الموعد' : 'Event removed', 'info');
  };

  // Month and Weekday formatting
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = language === 'ar' ? monthNamesAr[currentMonth] : monthNamesEn[currentMonth];

  const weekDaysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = language === 'ar' ? weekDaysAr : weekDaysEn;

  // Format date readable
  const formatReadableDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const mName = language === 'ar' ? monthNamesAr[m] : monthNamesEn[m];
        return `${d} ${mName} ${y}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // Calculate days difference from 2026-10-01
  const getRelativeDaysText = (dateStr: string) => {
    if (dateStr === '2026-10-01') return language === 'ar' ? 'اليوم' : 'Today';
    if (dateStr === '2026-10-02') return language === 'ar' ? 'غداً' : 'Tomorrow';
    const day = parseInt(dateStr.split('-')[2], 10);
    const diff = day - 1;
    if (diff > 0) {
      return language === 'ar' ? `خلال ${diff} أيام` : `In ${diff} days`;
    }
    return dateStr;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Calendar Header Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {language === 'ar' ? 'تقويم المواعيد والتدريبات' : 'Design Deadlines & Drills Schedule'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'عرض المواعيد النهائية للمشاريع النشطة والتدريبات التصميمية المجدولة للمصمم'
                : 'Interactive timeline for project deliveries and scheduled creative drills'}
            </p>
          </div>

          {/* Header Controls: Filters + Add Button */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter segmented control */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('projects')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  filterType === 'projects'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{language === 'ar' ? 'المشاريع' : 'Projects'}</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('trainings')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  filterType === 'trainings'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{language === 'ar' ? 'التدريبات' : 'Drills'}</span>
              </button>
            </div>

            {/* Schedule New Event button */}
            <button
              type="button"
              onClick={() => {
                setNewDate(selectedDateStr || '2026-10-01');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'جدولة تدريب / موعد' : 'Schedule Event'}</span>
            </button>
          </div>
        </div>

        {/* Month Navigation & Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={language === 'ar' ? 'الشهر السابق' : 'Previous Month'}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            </button>
            <span className="text-sm font-bold text-white px-2 font-mono">
              {currentMonthName} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={language === 'ar' ? 'الشهر التالي' : 'Next Month'}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
            </button>

            <button
              type="button"
              onClick={handleJumpToday}
              className="ms-2 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700/60 transition-colors"
            >
              {language === 'ar' ? 'اليوم' : 'Today'}
            </button>
          </div>

          {/* Quick Legend Indicators */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{language === 'ar' ? 'مواعيد تسليم المشاريع' : 'Project Deadlines'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{language === 'ar' ? 'تمارين وتحديات' : 'Training Drills'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>{language === 'ar' ? 'ورش عمل ومراجعات' : 'Masterclasses'}</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid + Details Side/Bottom layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Monthly Matrix (7 cols on Desktop) */}
          <div className="lg:col-span-7 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-3 sm:p-4">
            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((dayName, idx) => (
                <div
                  key={idx}
                  className="py-1.5 text-[11px] font-semibold text-slate-400 tracking-wide"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDateStr;
                const hasProjects = cell.events.some((e) => e.type === 'project_deadline');
                const hasTrainings = cell.events.some(
                  (e) => e.type === 'training_drill' || e.type === 'masterclass' || e.type === 'client_review'
                );

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[52px] sm:min-h-[64px] p-1.5 rounded-xl border text-start transition-all relative flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                        : cell.isCurrentMonth
                        ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700'
                        : 'bg-slate-950/20 border-slate-900/40 opacity-30 hover:opacity-60'
                    }`}
                  >
                    {/* Day number & Today badge */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-mono font-bold tabular-nums ${
                          isSelected
                            ? 'text-indigo-300'
                            : cell.isToday
                            ? 'text-amber-400'
                            : cell.isCurrentMonth
                            ? 'text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                      {cell.isToday && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          {language === 'ar' ? 'اليوم' : 'Now'}
                        </span>
                      )}
                    </div>

                    {/* Event indicators dots/chips */}
                    {cell.events.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {hasProjects && (
                          <span
                            className="w-2 h-2 rounded-full bg-sky-400 shrink-0"
                            title={language === 'ar' ? 'موعد نهائي لمشروع' : 'Project Deadline'}
                          />
                        )}
                        {hasTrainings && (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                            title={language === 'ar' ? 'تدريب تصميم مجدول' : 'Scheduled Drill'}
                          />
                        )}
                        {cell.events.length > 2 && (
                          <span className="text-[9px] font-mono text-slate-400 leading-none">
                            +{cell.events.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details & Action Panel (5 cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Selected Date Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                      {language === 'ar' ? 'جدول اليوم المحدد' : 'Selected Date Schedule'}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {formatReadableDate(selectedDateStr)}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                    {selectedDayEvents.length} {language === 'ar' ? 'مهام' : 'items'}
                  </span>
                </div>

                {/* Events List for Selected Day */}
                <div className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pe-1">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((evt) => {
                      const isProject = evt.type === 'project_deadline';
                      return (
                        <div
                          key={evt.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isProject
                              ? 'bg-sky-950/20 border-sky-500/30'
                              : evt.type === 'masterclass'
                              ? 'bg-indigo-950/20 border-indigo-500/30'
                              : 'bg-amber-950/20 border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                <span className="font-semibold text-slate-300">
                                  {isProject
                                    ? language === 'ar' ? 'تسليم مشروع' : 'Project Deadline'
                                    : evt.type === 'masterclass'
                                    ? language === 'ar' ? 'ورشة عمل' : 'Masterclass'
                                    : language === 'ar' ? 'تمرين تدريبي' : 'Creative Drill'}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{evt.category}</span>
                                {evt.time && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-mono">{evt.time}</span>
                                  </>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-white leading-snug">
                                {language === 'ar' ? (evt.titleAr || evt.title) : evt.title}
                              </h4>
                              {evt.description && (
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                  {evt.description}
                                </p>
                              )}
                            </div>

                            {/* Quick Action Button */}
                            <div className="shrink-0 flex items-center gap-1">
                              {isProject && evt.relatedId ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const proj = projects.find((p) => p.id === evt.relatedId);
                                    if (proj) setActiveProject(proj);
                                    setActiveSection('projects');
                                  }}
                                  className="p-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 transition-colors"
                                  title={language === 'ar' ? 'فتح المشروع' : 'Open Project'}
                                >
                                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                </button>
                              ) : evt.relatedId && evt.relatedId.startsWith('ch-') ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const challenge = challenges.find((c) => c.id === evt.relatedId);
                                    if (challenge) setActiveChallenge(challenge);
                                    setActiveSection('challenges');
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 transition-colors"
                                  title={language === 'ar' ? 'بدء التحدي' : 'Start Drill'}
                                >
                                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                </button>
                              ) : evt.relatedId && evt.relatedId.startsWith('les-') ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveSection('learning')}
                                  className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 transition-colors"
                                  title={language === 'ar' ? 'عرض الدرس' : 'View Lesson'}
                                >
                                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                </button>
                              ) : null}

                              {/* Allow delete if custom created */}
                              {evt.id.startsWith('custom-event-') && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvent(evt.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                                  title={language === 'ar' ? 'حذف الموعد' : 'Delete'}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        {language === 'ar'
                          ? 'لا توجد مواعيد نهائية أو تدريبات مسجلة لهذا اليوم.'
                          : 'No scheduled deadlines or drills for this date.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setNewDate(selectedDateStr);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{language === 'ar' ? 'جدولة تدريب لهذا اليوم' : 'Add Drill for this day'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  {language === 'ar' ? 'نصيحة اليوم:' : 'Daily Tip:'}
                </span>
                <span className="text-slate-300 text-[11px] truncate max-w-[200px]">
                  {language === 'ar' ? 'خصص 30 دقيقة يومياً لصقل التيبوغرافيا' : 'Dedicate 30m daily for typography'}
                </span>
              </div>
            </div>

            {/* Upcoming Feed Mini-List */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'ar' ? 'المواعيد والتدريبات القادمة' : 'Next in Pipeline'}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'ar' ? 'ترتيب زمني' : 'Upcoming'}
                </span>
              </div>

              <div className="space-y-1.5">
                {upcomingEvents.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setSelectedDateStr(evt.date)}
                    className="w-full text-start p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700 transition-colors flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                        {language === 'ar' ? (evt.titleAr || evt.title) : evt.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{formatReadableDate(evt.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.category}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono">
                      {getRelativeDaysText(evt.date)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Schedule New Event / Drill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {language === 'ar' ? 'جدولة تدريب أو موعد نهائي جديد' : 'Schedule New Drill or Deadline'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {language === 'ar' ? 'عنوان التدريب أو المهمة' : 'Title / Task Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'ar'
                      ? 'مثال: تمرين تصميم بوستر هوية بصرية أو تسليم الشعار'
                      : 'e.g. Poster typography drill or client review'
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'نوع النشاط' : 'Event Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ScheduledEvent['type'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="training_drill">{language === 'ar' ? 'تمرين تدريبي' : 'Training Drill'}</option>
                    <option value="project_deadline">{language === 'ar' ? 'موعد تسليم مشروع' : 'Project Deadline'}</option>
                    <option value="masterclass">{language === 'ar' ? 'ورشة عمل فنية' : 'Masterclass'}</option>
                    <option value="client_review">{language === 'ar' ? 'مراجعة مع العميل' : 'Client Review'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'المجال الفني' : 'Design Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Branding">{language === 'ar' ? 'هوية بصرية (Branding)' : 'Branding'}</option>
                    <option value="Typography">{language === 'ar' ? 'تيبوغرافيا وخط عربي' : 'Typography'}</option>
                    <option value="Social Media">{language === 'ar' ? 'سوشيال ميديا وإعلانات' : 'Social Media'}</option>
                    <option value="Advertising">{language === 'ar' ? 'إعلانات وحملات تجارية' : 'Advertising'}</option>
                    <option value="UI/UX">{language === 'ar' ? 'واجهات وتجربة مستخدم' : 'UI/UX'}</option>
                    <option value="Packaging">{language === 'ar' ? 'تغليف ومنتجات' : 'Packaging'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'المدة (دقيقة)' : 'Duration (min)'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="240"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {language === 'ar' ? 'ملاحظات إضافية أو مخرجات متوقعة' : 'Notes / Expected Deliverable'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: التركيز على التباين البصري وإرسال نسختين للاعتماد'
                      : 'e.g. Focus on color balance and send preview'
                  }
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                >
                  {language === 'ar' ? 'حفظ وإضافة للتقويم' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
