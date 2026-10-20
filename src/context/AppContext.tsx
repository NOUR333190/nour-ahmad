import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ThemeMode,
  MainSection,
  UserProfile,
  SkillItem,
  Achievement,
  Challenge,
  Project,
  PortfolioItem,
  NotificationItem,
  RoadmapItem,
} from '../types';
import { storageService } from '../services/storageService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  activeSection: MainSection;
  setActiveSection: (sec: MainSection) => void;
  userProfile: UserProfile;
  updateUserProfile: (p: Partial<UserProfile>) => void;
  addXP: (amount: number, reason?: string) => void;
  skills: SkillItem[];
  updateSkill: (id: string, delta: number) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  setActiveChallenge: (ch: Challenge | null) => void;
  completeChallenge: (id: string, score: number) => void;
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  addProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addProjectVersion: (
    projectId: string,
    versionData: { versionName: string; notes: string; imageUrl?: string; feedback?: string; score?: number }
  ) => void;
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'likes' | 'views'>) => void;
  togglePortfolioFeatured: (id: string) => void;
  togglePortfolioPublic: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  roadmap: RoadmapItem[];
  updateRoadmapStatus: (id: string, status: 'Completed' | 'In Progress' | 'Planned') => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  aiCommandOpen: boolean;
  setAiCommandOpen: (open: boolean) => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  confirmationModal: ConfirmationState | null;
  showConfirmation: (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => void;
  closeConfirmation: () => void;
  critiqueSampleImage: string | null;
  setCritiqueSampleImage: (img: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [activeSection, setActiveSection] = useState<MainSection>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [skills, setSkills] = useState<SkillItem[]>(() => storageService.getSkills());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [challenges, setChallenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(() => storageService.getChallenges()[0] || null);
  const [projects, setProjects] = useState<Project[]>(() => storageService.getProjects());
  const [activeProject, setActiveProject] = useState<Project | null>(() => storageService.getProjects()[0] || null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => storageService.getPortfolio());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.getNotifications());
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(() => storageService.getRoadmap());

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [aiCommandOpen, setAiCommandOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(!userProfile.isOnboarded);
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationState | null>(null);
  const [critiqueSampleImage, setCritiqueSampleImage] = useState<string | null>(null);

  // Sync RTL / HTML Lang and Dark class
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut for Cmd+K (AI Command) and Ctrl+P / / (Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setAiCommandOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(lang === 'ar' ? 'تم تحويل الواجهة إلى اللغة العربية' : 'Switched interface to English', 'info');
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...partial };
      storageService.saveUserProfile(updated);
      return updated;
    });
  };

  const addXP = (amount: number, reason?: string) => {
    setUserProfile((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.nextLevelXp;

      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        nextThreshold = Math.floor(prev.nextLevelXp * 1.3);
        showToast(
          language === 'ar'
            ? `🎉 ترقية مذهلة! وصلت إلى المستوى ${newLevel}`
            : `🎉 Level Up! You reached Level ${newLevel}!`,
          'success'
        );
        addNotification({
          title: language === 'ar' ? `ترقية إلى المستوى ${newLevel}!` : `Promoted to Level ${newLevel}!`,
          description: language === 'ar' ? `أحسنت! فتحت إمكانيات وتحديات أعلى بمجموع ${newXp} نقطة خبرة.` : `Unlocked higher difficulty challenges with ${newXp} XP.`,
          type: 'achievement',
          actionLink: 'analytics',
        });
      } else {
        showToast(`+${amount} XP ${reason ? `(${reason})` : ''}`, 'success');
      }

      const updated = {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextThreshold,
      };
      storageService.saveUserProfile(updated);
      return updated;
    });
  };

  const updateSkill = (id: string, delta: number) => {
    setSkills((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          const newLevel = Math.min(100, Math.max(0, s.level + delta));
          return { ...s, level: newLevel, recentGrowth: s.recentGrowth + delta };
        }
        return s;
      });
      storageService.saveSkills(updated);
      return updated;
    });
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id && !a.unlocked) {
          showToast(`🏆 إنجاز جديد: ${language === 'ar' ? a.titleAr : a.titleEn}`, 'success');
          addNotification({
            title: `تم فتح إنجاز: ${language === 'ar' ? a.titleAr : a.titleEn}`,
            description: language === 'ar' ? a.descAr : a.descEn,
            type: 'achievement',
            actionLink: 'analytics',
          });
          return { ...a, unlocked: true, progress: 100, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return a;
      });
      storageService.saveAchievements(updated);
      return updated;
    });
  };

  const completeChallenge = (id: string, score: number) => {
    setChallenges((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          return { ...c, completed: true };
        }
        return c;
      });
      storageService.saveChallenges(updated);
      return updated;
    });

    const targetCh = challenges.find((c) => c.id === id);
    const xp = targetCh?.xpReward || 300;
    addXP(xp, 'إكمال التحدي');

    // Update relevant skills
    updateSkill('sk-3', 2);
    updateSkill('sk-6', 3);

    addNotification({
      title: language === 'ar' ? 'تم إكمال التحدي بنجاح!' : 'Challenge Completed!',
      description: `${targetCh?.titleAr || 'تحدي تصميمي'} - التقييم العام: ${score}%`,
      type: 'challenge',
      actionLink: 'challenges',
    });
  };

  const addProject = (data: Partial<Project>): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: data.title || (language === 'ar' ? 'مشروع جديد' : 'New Project'),
      description: data.description || '',
      clientName: data.clientName || 'عميل تجريبي',
      industry: data.industry || 'Technology',
      stage: data.stage || 'Concept',
      progress: data.progress || 20,
      dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      category: data.category || 'Branding',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      brief: data.brief || {
        overview: 'مشروع تصميمي متكامل موجه للعلامة التجارية والجمهور المستهدف.',
        deliverables: ['التصميم الرئيسي', 'قوالب السوشيال ميديا'],
        audience: 'الجمهور التجاري العام',
      },
      tasks: data.tasks || [
        { id: `t-${Date.now()}-1`, title: 'تحديد لوحة الإلهام (Moodboard)', done: true },
        { id: `t-${Date.now()}-2`, title: 'بناء المسودة الأولية V1', done: false },
        { id: `t-${Date.now()}-3`, title: 'مراجعة الملاحظات مع محاكي العميل', done: false },
      ],
      references: data.references || [],
      versions: [
        {
          id: `v-${Date.now()}`,
          versionName: 'V1',
          createdAt: new Date().toISOString().split('T')[0],
          notes: 'الإصدار الأولي للمشروع',
          imageUrl: data.coverImage,
        },
      ],
      aiNotes: ['ابدأ بتحديد الكتلة المركزية وضبط التباين اللوني.'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      storageService.saveProjects(updated);
      return updated;
    });

    setActiveProject(newProject);
    showToast(language === 'ar' ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully', 'success');
    addXP(100, 'مشروع جديد');
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      storageService.saveProjects(updated);
      return updated;
    });
    if (activeProject?.id === id) {
      setActiveProject((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const duplicateProject = (id: string) => {
    const existing = projects.find((p) => p.id === id);
    if (!existing) return;
    const duplicated: Project = {
      ...existing,
      id: `proj-${Date.now()}`,
      title: `${existing.title} (نسخة)`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => {
      const updated = [duplicated, ...prev];
      storageService.saveProjects(updated);
      return updated;
    });
    showToast(language === 'ar' ? 'تم تكرار المشروع بنجاح' : 'Project duplicated', 'info');
  };

  const archiveProject = (id: string) => {
    updateProject(id, { isArchived: true });
    showToast(language === 'ar' ? 'تمت أرشفة المشروع' : 'Project archived', 'info');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      storageService.saveProjects(updated);
      return updated;
    });
    if (activeProject?.id === id) {
      setActiveProject(projects.find((p) => p.id !== id) || null);
    }
    showToast(language === 'ar' ? 'تم حذف المشروع' : 'Project deleted', 'info');
  };

  const addProjectVersion = (
    projectId: string,
    versionData: { versionName: string; notes: string; imageUrl?: string; feedback?: string; score?: number }
  ) => {
    const newVersion = {
      id: `ver-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...versionData,
    };
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === projectId) {
          const versions = [...p.versions, newVersion];
          return {
            ...p,
            versions,
            coverImage: versionData.imageUrl || p.coverImage,
            progress: Math.min(100, p.progress + 15),
          };
        }
        return p;
      });
      storageService.saveProjects(updated);
      return updated;
    });

    if (activeProject?.id === projectId) {
      setActiveProject((prev) =>
        prev
          ? {
              ...prev,
              versions: [...prev.versions, newVersion],
              coverImage: versionData.imageUrl || prev.coverImage,
              progress: Math.min(100, prev.progress + 15),
            }
          : null
      );
    }
    showToast(
      language === 'ar'
        ? `تم حفظ النسخة ${versionData.versionName} بنجاح`
        : `Version ${versionData.versionName} saved`,
      'success'
    );
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'likes' | 'views'>) => {
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      ...item,
      likes: 1,
      views: 12,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolio((prev) => {
      const updated = [newItem, ...prev];
      storageService.savePortfolio(updated);
      return updated;
    });
    showToast(language === 'ar' ? 'تم نشر العمل في معرض أعمالك' : 'Published to portfolio', 'success');
    addXP(150, 'نشر عمل بالمعرض');
  };

  const togglePortfolioFeatured = (id: string) => {
    setPortfolio((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
      storageService.savePortfolio(updated);
      return updated;
    });
  };

  const togglePortfolioPublic = (id: string) => {
    setPortfolio((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, isPublic: !item.isPublic } : item));
      storageService.savePortfolio(updated);
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      storageService.saveNotifications(updated);
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    storageService.saveNotifications([]);
    showToast(language === 'ar' ? 'تم مسح جميع الإشعارات' : 'Notifications cleared', 'info');
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: language === 'ar' ? 'الآن' : 'Just now',
      read: false,
      ...notif,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      storageService.saveNotifications(updated);
      return updated;
    });
  };

  const updateRoadmapStatus = (id: string, status: 'Completed' | 'In Progress' | 'Planned') => {
    setRoadmap((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      storageService.saveRoadmap(updated);
      return updated;
    });
    showToast(language === 'ar' ? 'تم تحديث حالة خارطة الطريق والمزامنة مع النظام' : 'Roadmap status updated & synced', 'info');
  };

  const showConfirmation = (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      onConfirm: () => {
        onConfirm();
        setConfirmationModal(null);
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        activeSection,
        setActiveSection,
        userProfile,
        updateUserProfile,
        addXP,
        skills,
        updateSkill,
        achievements,
        unlockAchievement,
        challenges,
        activeChallenge,
        setActiveChallenge,
        completeChallenge,
        projects,
        activeProject,
        setActiveProject,
        addProject,
        updateProject,
        duplicateProject,
        archiveProject,
        deleteProject,
        addProjectVersion,
        portfolio,
        addPortfolioItem,
        togglePortfolioFeatured,
        togglePortfolioPublic,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        roadmap,
        updateRoadmapStatus,
        toasts,
        showToast,
        removeToast,
        aiCommandOpen,
        setAiCommandOpen,
        globalSearchOpen,
        setGlobalSearchOpen,
        onboardingOpen,
        setOnboardingOpen,
        confirmationModal,
        showConfirmation,
        closeConfirmation,
        critiqueSampleImage,
        setCritiqueSampleImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
