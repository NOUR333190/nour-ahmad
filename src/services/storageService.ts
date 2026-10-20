import {
  UserProfile,
  SkillItem,
  Achievement,
  Challenge,
  Project,
  PortfolioItem,
  LearningLesson,
  ResearchItem,
  CommunityPost,
  NotificationItem,
  RoadmapItem,
  CoachConversation,
  ScheduledEvent,
} from '../types';
import {
  initialUserProfile,
  initialSkills,
  initialAchievements,
  initialChallenges,
  initialProjects,
  initialPortfolio,
  initialLearningLessons,
  initialResearch,
  initialCommunityPosts,
  initialNotifications,
  initialRoadmap,
  initialScheduledEvents,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'designforge_user_profile',
  SKILLS: 'designforge_skills',
  ACHIEVEMENTS: 'designforge_achievements',
  CHALLENGES: 'designforge_challenges',
  PROJECTS: 'designforge_projects',
  PORTFOLIO: 'designforge_portfolio',
  LESSONS: 'designforge_lessons',
  RESEARCH: 'designforge_research',
  COMMUNITY: 'designforge_community',
  NOTIFICATIONS: 'designforge_notifications',
  ROADMAP: 'designforge_roadmap',
  CONVERSATIONS: 'designforge_conversations',
  SCHEDULED_EVENTS: 'designforge_scheduled_events',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const storageService = {
  getUserProfile: (): UserProfile => {
    const profile = getItem(STORAGE_KEYS.USER_PROFILE, initialUserProfile);
    if (!profile.name || profile.name === 'عمر التميمي' || profile.name === 'عمر') {
      profile.name = 'نور';
      setItem(STORAGE_KEYS.USER_PROFILE, profile);
    }
    return profile;
  },
  saveUserProfile: (profile: UserProfile): void => setItem(STORAGE_KEYS.USER_PROFILE, profile),

  getSkills: (): SkillItem[] => getItem(STORAGE_KEYS.SKILLS, initialSkills),
  saveSkills: (skills: SkillItem[]): void => setItem(STORAGE_KEYS.SKILLS, skills),

  getAchievements: (): Achievement[] => getItem(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements),
  saveAchievements: (achievements: Achievement[]): void => setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements),

  getChallenges: (): Challenge[] => getItem(STORAGE_KEYS.CHALLENGES, initialChallenges),
  saveChallenges: (challenges: Challenge[]): void => setItem(STORAGE_KEYS.CHALLENGES, challenges),

  getProjects: (): Project[] => getItem(STORAGE_KEYS.PROJECTS, initialProjects),
  saveProjects: (projects: Project[]): void => setItem(STORAGE_KEYS.PROJECTS, projects),

  getPortfolio: (): PortfolioItem[] => getItem(STORAGE_KEYS.PORTFOLIO, initialPortfolio),
  savePortfolio: (items: PortfolioItem[]): void => setItem(STORAGE_KEYS.PORTFOLIO, items),

  getLessons: (): LearningLesson[] => getItem(STORAGE_KEYS.LESSONS, initialLearningLessons),
  saveLessons: (lessons: LearningLesson[]): void => setItem(STORAGE_KEYS.LESSONS, lessons),

  getResearch: (): ResearchItem[] => getItem(STORAGE_KEYS.RESEARCH, initialResearch),
  saveResearch: (items: ResearchItem[]): void => setItem(STORAGE_KEYS.RESEARCH, items),

  getCommunity: (): CommunityPost[] => getItem(STORAGE_KEYS.COMMUNITY, initialCommunityPosts),
  saveCommunity: (posts: CommunityPost[]): void => setItem(STORAGE_KEYS.COMMUNITY, posts),

  getNotifications: (): NotificationItem[] => getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
  saveNotifications: (notifs: NotificationItem[]): void => setItem(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getRoadmap: (): RoadmapItem[] => getItem(STORAGE_KEYS.ROADMAP, initialRoadmap),
  saveRoadmap: (roadmap: RoadmapItem[]): void => setItem(STORAGE_KEYS.ROADMAP, roadmap),

  getConversations: (): CoachConversation[] => getItem(STORAGE_KEYS.CONVERSATIONS, [
    {
      id: 'conv-1',
      title: 'استشارة توزيع المساحة السلبية والتسلسل الهرمي',
      createdAt: '2026-09-29',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'كيف أوازن بين رغبة العميل في إبراز الشعار دون تشويه راحة العين في تصميم السوشيال ميديا؟',
          timestamp: '10:30 ص',
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'أهلاً بك يا فنان! القاعدة الذهبية هنا: لا تنافس الشعار مع العنوان في نفس خط البصر. امنح الشعار مساحة سالبة عازلة (Padding) بنسبة 20%، واستخدم التباين في خلفيته بدلاً من مضاعفة حجمه.',
          timestamp: '10:31 ص',
          saved: true,
        },
      ],
    },
  ]),
  saveConversations: (convs: CoachConversation[]): void => setItem(STORAGE_KEYS.CONVERSATIONS, convs),

  getScheduledEvents: (): ScheduledEvent[] => getItem(STORAGE_KEYS.SCHEDULED_EVENTS, initialScheduledEvents),
  saveScheduledEvents: (events: ScheduledEvent[]): void => setItem(STORAGE_KEYS.SCHEDULED_EVENTS, events),

  resetAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
