export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';

export type MainSection =
  | 'dashboard'
  | 'coach'
  | 'challenges'
  | 'simulator'
  | 'creative-lab'
  | 'research'
  | 'projects'
  | 'portfolio'
  | 'learning'
  | 'analytics'
  | 'community'
  | 'notifications'
  | 'settings'
  | 'critique'
  | 'roadmap';

export interface ScheduledEvent {
  id: string;
  title: string;
  titleAr?: string;
  type: 'project_deadline' | 'training_drill' | 'client_review' | 'masterclass';
  date: string; // YYYY-MM-DD
  time?: string;
  durationMinutes?: number;
  category: string;
  relatedId?: string; // projectId, challengeId, or lessonId
  status?: 'upcoming' | 'completed' | 'urgent';
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'lead';
  primaryField: string;
  favoriteTools: string[];
  goals: string[];
  availableHoursPerWeek: number;
  preferredDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  isOnboarded: boolean;
}

export interface SkillItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  level: number; // 0 - 100
  recentGrowth: number; // e.g. +8%
  icon: string;
}

export interface Achievement {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  requirement: string;
  icon: string;
  category: 'projects' | 'challenges' | 'streak' | 'skills' | 'community';
  progress: number; // 0 - 100
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  avatar: string;
  personality: 'Direct' | 'Friendly' | 'Demanding' | 'Minimalist' | 'Traditional' | 'Experimental' | 'Corporate';
  personalityLabelAr: string;
  budget: 'Low' | 'Medium' | 'High' | 'Enterprise';
  patienceLevel: number; // 1 to 5
  brandIdentityBrief: string;
}

export interface ClientSimulatorState {
  client: ClientProfile;
  stage: 'brief' | 'concept' | 'design' | 'review' | 'revision' | 'approval' | 'final';
  messages: Array<{
    id: string;
    sender: 'client' | 'designer' | 'system';
    text: string;
    timestamp: string;
    decision?: 'request_revision' | 'approve_concept' | 'request_alternative' | 'ask_clarification' | 'final_approval';
    revisionNotes?: string[];
  }>;
  revisionCount: number;
  isCompleted: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  titleAr: string;
  category:
    | 'Social Media'
    | 'Advertising'
    | 'Branding'
    | 'Product Design'
    | 'Medical'
    | 'Food'
    | 'Fashion'
    | 'Technology'
    | 'Real Estate'
    | 'E-commerce'
    | 'Automotive'
    | 'Entertainment'
    | 'Education'
    | 'Corporate';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  durationMinutes: 15 | 30 | 60 | 90;
  type: 'Real Client Simulation' | 'Portfolio Challenge' | 'Speed Drill';
  xpReward: number;
  client: {
    name: string;
    brand: string;
    industry: string;
    avatar?: string;
  };
  objective: string;
  problem: string;
  targetAudience: string;
  platform: string;
  dimensions: string;
  deliverables: string[];
  visualDirection: string;
  colorDirection: string[];
  typographyDirection: string;
  requiredElements: string[];
  restrictions: string;
  deadlineMinutes: number;
  expectedOutcome: string;
  designTips: string[];
  completed?: boolean;
}

export interface ProjectVersion {
  id: string;
  versionName: string; // e.g. "V1", "V2", "Final"
  createdAt: string;
  notes: string;
  imageUrl?: string;
  feedback?: string;
  aiCritiqueSummary?: string;
  score?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  industry: string;
  stage: 'Research' | 'Strategy' | 'Concept' | 'Design' | 'Review' | 'Revision' | 'Final';
  progress: number; // 0 - 100
  dueDate: string;
  category: string;
  coverImage?: string;
  brief: {
    overview: string;
    deliverables: string[];
    audience: string;
    competitors?: string[];
  };
  tasks: Array<{
    id: string;
    title: string;
    done: boolean;
  }>;
  references: string[];
  versions: ProjectVersion[];
  aiNotes: string[];
  createdAt: string;
  isArchived?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Branding' | 'Social Media' | 'Advertising' | 'UI' | 'Product' | 'Motion' | 'Other';
  coverImage: string;
  description: string;
  problem: string;
  strategy: string;
  process: string;
  finalDesignUrl: string;
  toolsUsed: string[];
  clientSimulationName?: string;
  aiInsights: string;
  isPublic: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  createdAt: string;
}

export interface VisualTriadDiagnostic {
  score: number;
  verdict: string;
  verdictAr?: string;
  details: string;
  detailsAr?: string;
  checklist: Array<{ item: string; itemAr?: string; status: 'pass' | 'warning' | 'fail' }>;
  actionableTweak: string;
  actionableTweakAr?: string;
}

export interface CritiqueResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  criticalIssues: string[];
  recommendedChanges: string[];
  alternativeDirection: string;
  professionalNotes: string;
  dimensionsScore: {
    composition: number;
    hierarchy: number;
    typography: number;
    colorHarmony: number;
    contrast: number;
    spacing: number;
    branding: number;
    ctaPower: number;
  };
  contrastAnalysis?: VisualTriadDiagnostic;
  balanceAnalysis?: VisualTriadDiagnostic;
  distributionAnalysis?: VisualTriadDiagnostic;
  videoMotionAnalysis?: {
    pacingScore: number;
    pacingVerdict: string;
    kineticTypography: string;
    hookEffectiveness: string;
    timingFixes: string[];
  };
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  analyzedAt?: string;
  imageUrl?: string;
}

export interface CreativeConcept {
  id: string;
  conceptName: string;
  bigIdea: string;
  visualMetaphor: string;
  composition: string;
  colorDirection: string[];
  typography: string;
  photographyDirection: string;
  graphicElements: string[];
  cta: string;
  imagePrompt: string;
  motionConcept?: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentUrl?: string;
  quickActionUsed?: string;
  saved?: boolean;
}

export type CoachPersona =
  | 'chatgpt_style'
  | 'strict_art_director'
  | 'senior_mentor'
  | 'brand_strategist'
  | 'claude_creative';

export type GeminiModelId =
  | 'chatgpt-4o'
  | 'gemini-2.5-flash'
  | 'gemini-3.8-flash'
  | 'gemini-4-argon'
  | 'gemini-3.1-flash-lite'
  | 'claude-3.5-sonnet';

export interface ArtDirectionAnalysis {
  coreProblem: string;
  audiencePsychology: string;
  toneOfVoice: string[];
  moodboardKeywords: Array<{
    platform: string;
    query: string;
    rationale: string;
  }>;
  creativeDirections: Array<{
    name: string;
    bigIdea: string;
    visualMetaphor: string;
    focalElement: string;
  }>;
  typographySystem: {
    arabicHeadline: string;
    arabicBody: string;
    latinPairing: string;
    ratioNotes: string;
  };
  colorPalette: Array<{
    hex: string;
    role: string;
    percentage: string;
  }>;
  dosAndDonts: {
    do: string[];
    dont: string[];
  };
  aiImagePrompt: string;
  executionSteps: Array<{
    step: number;
    title: string;
    description: string;
    deliverable: string;
  }>;
}

export interface ArtDirectorCritique {
  verdict: 'Approved' | 'Needs Revision' | 'Major Flaws';
  verdictLabel: string;
  score: number;
  contrastScore?: number;
  balanceScore?: number;
  distributionScore?: number;
  mediaType?: 'image' | 'video';
  motionVerdict?: string;
  whatIsRight: string[];
  whatIsWrong: string[];
  seniorFixes: Array<{
    problem: string;
    exactFix: string;
    rule: string;
  }>;
  nextImmediateAction: string;
}

export interface GeneratedVideoResult {
  operationName: string;
  videoUrl?: string;
  status: 'generating' | 'ready' | 'failed';
  error?: string;
}

export interface CoachConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: CoachMessage[];
  contextProjectId?: string;
  persona?: CoachPersona;
  model?: GeminiModelId;
}

export interface LearningLesson {
  id: string;
  titleAr: string;
  titleEn: string;
  category:
    | 'Graphic Design'
    | 'Typography'
    | 'Color Theory'
    | 'Composition'
    | 'Branding'
    | 'Advertising'
    | 'Motion Graphics'
    | 'Creative Direction'
    | 'Client Management'
    | 'AI for Designers';
  durationMin: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  keyTakeaways: string[];
  exerciseBrief: string;
  completed: boolean;
  saved: boolean;
  xp: number;
}

export interface ResearchItem {
  id: string;
  title: string;
  category: 'trends' | 'typography' | 'color' | 'branding' | 'advertising' | 'references';
  summary: string;
  industry: string;
  style: string;
  tags: string[];
  content: string;
  palette?: string[];
  isAiGenerated: boolean;
  saved?: boolean;
  popularity: number;
  date: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  timeAgo: string;
  critiqueHighlights: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'achievement' | 'recommendation' | 'deadline' | 'revision' | 'saved_ai' | 'learning';
  timestamp: string;
  read: boolean;
  actionLink?: MainSection;
}

export interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  items: string[];
  targetQuarter: string;
}
