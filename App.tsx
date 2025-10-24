import { useState } from 'react';

console.log('App.tsx loaded');

// Import types
import { Screen, ProfileBlock, Job, Application } from './types';

// Import components
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/screens/Dashboard';
import { ProfileBlocks } from './components/screens/ProfileBlocks';
import { ApplicationBuilder } from './components/screens/ApplicationBuilder';
import { Privacy } from './components/screens/Privacy';
import { Tracker } from './components/screens/Tracker';
import { Extension } from './components/screens/Extension';
import { Toaster } from './components/ui/sonner';
import { profileBlocks as initialProfileBlocks, jobs as initialJobs, applications as initialApplications } from './data/mockData';

export default function App() {
  console.log('App component rendering');
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [profileBlocks, setProfileBlocks] = useState<ProfileBlock[]>(initialProfileBlocks);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobs[0]?.id || '');
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [auditTrail, setAuditTrail] = useState<Array<{ date: string; action: string; details: string }>>([
    { date: '2025-10-21 14:30', action: 'Profile block edited', details: 'Work Experience updated' },
    { date: '2025-10-21 10:15', action: 'Application submitted', details: 'Stripe - Senior Backend Engineer' },
    { date: '2025-10-20 16:45', action: 'AI suggestion accepted', details: 'Added microservices keyword' },
    { date: '2025-10-20 09:00', action: 'Data export', details: 'Full profile exported as JSON' },
  ]);

  const addApplication = (application: Application) => {
    setApplications(prev => [application, ...prev]);
  };

  const addAuditEvent = (action: string, details: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAuditTrail(prev => [{ date: dateStr, action, details }, ...prev]);
  };

  const updateProfileBlock = (blockId: string, updates: Partial<ProfileBlock>) => {
    setProfileBlocks(blocks =>
      blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const updateJobMatchScore = (jobId: string, scoreDelta: number) => {
    setJobs(currentJobs =>
      currentJobs.map(job =>
        job.id === jobId
          ? { ...job, matchScore: Math.min(100, job.matchScore + scoreDelta) }
          : job
      )
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} auditTrail={auditTrail} />;
      case 'profile':
        return <ProfileBlocks profileBlocks={profileBlocks} setProfileBlocks={setProfileBlocks} onAddAuditEvent={addAuditEvent} />;
      case 'application-builder':
        return (
          <ApplicationBuilder
            jobs={jobs}
            setJobs={setJobs}
            profileBlocks={profileBlocks}
            onUpdateBlock={updateProfileBlock}
            onUpdateMatchScore={updateJobMatchScore}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            onAddAuditEvent={addAuditEvent}
          />
        );
      case 'privacy':
        return <Privacy auditTrail={auditTrail} onAddAuditEvent={addAuditEvent} />;
      case 'tracker':
        return <Tracker applications={applications} profileBlocks={profileBlocks} />;
      case 'extension':
        return <Extension onAddApplication={addApplication} onAddAuditEvent={addAuditEvent} />;
      default:
        return <div className="p-8 text-center">Screen: {currentScreen}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      {renderScreen()}
      <Toaster />
    </div>
  );
}
