import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { AICommandModal } from './components/common/AICommandModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OnboardingModal } from './components/common/OnboardingModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { AICoachView } from './components/views/AICoachView';
import { ChallengesView } from './components/views/ChallengesView';
import { ClientSimulatorView } from './components/views/ClientSimulatorView';
import { CreativeLabView } from './components/views/CreativeLabView';
import { DesignResearchView } from './components/views/DesignResearchView';
import { ProjectsView } from './components/views/ProjectsView';
import { PortfolioView } from './components/views/PortfolioView';
import { LearningView } from './components/views/LearningView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CommunityView } from './components/views/CommunityView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { DesignCritiqueStudio } from './components/views/DesignCritiqueStudio';
import { RoadmapView } from './components/views/RoadmapView';

const MainContent: React.FC = () => {
  const { activeSection } = useApp();

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'coach':
        return <AICoachView />;
      case 'challenges':
        return <ChallengesView />;
      case 'simulator':
        return <ClientSimulatorView />;
      case 'creative-lab':
        return <CreativeLabView />;
      case 'research':
        return <DesignResearchView />;
      case 'projects':
        return <ProjectsView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'learning':
        return <LearningView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'community':
        return <CommunityView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'critique':
        return <DesignCritiqueStudio />;
      case 'roadmap':
        return <RoadmapView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b0f17] text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopBar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Overlays */}
      <ToastContainer />
      <ConfirmationModal />
      <AICommandModal />
      <GlobalSearchModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
