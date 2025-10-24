import { useState } from 'react';
import { aiSuggestions } from '../../data/mockData';
import { Job, AISuggestion, ProfileBlock } from '../../types';
import { AISuggestionCard } from '../AISuggestionCard';
import { BlockCard } from '../BlockCard';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Plus, Link2, Loader2, TrendingUp, FileText, Star, Info, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ApplicationBuilderProps {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  profileBlocks: ProfileBlock[];
  onUpdateBlock: (blockId: string, updates: Partial<ProfileBlock>) => void;
  onUpdateMatchScore: (jobId: string, scoreDelta: number) => void;
  selectedJobId: string;
  setSelectedJobId: (jobId: string) => void;
  onAddAuditEvent: (action: string, details: string) => void;
}

// Mock function to simulate fetching and parsing job data from URL
const parseJobFromUrl = (url: string): Partial<Job> => {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('linkedin') || urlLower.includes('greenhouse') || urlLower.includes('lever')) {
    return {
      company: 'TechCorp',
      title: 'Software Engineer',
      posting: `We're looking for a talented Software Engineer to join our team.

Requirements:
- 3+ years experience in software development
- Proficiency in JavaScript/TypeScript and React
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong problem-solving skills
- Team player with excellent communication

Responsibilities:
- Build and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews`,
      keywords: ['JavaScript', 'TypeScript', 'React', 'cloud platforms', 'AWS'],
    };
  }
  
  return {
    company: 'Unknown Company',
    title: 'Position',
    posting: 'Job description will be extracted from the URL.',
    keywords: ['software', 'engineering'],
  };
};

export function ApplicationBuilder({ 
  jobs, 
  setJobs, 
  profileBlocks, 
  onUpdateBlock, 
  onUpdateMatchScore, 
  selectedJobId, 
  setSelectedJobId,
  onAddAuditEvent
}: ApplicationBuilderProps) {
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  
  // Safety check - if no jobs exist, return early with a message
  if (!selectedJob) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <h3 className="mb-2">No jobs available</h3>
          <p className="text-gray-600">Please add a job to get started.</p>
        </div>
      </div>
    );
  }
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(aiSuggestions.slice(0, 3));
  const [showJobReasoning, setShowJobReasoning] = useState(false);
  const [showAssemblyReasoning, setShowAssemblyReasoning] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [manualJobData, setManualJobData] = useState({
    company: '',
    title: '',
    posting: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScoreIncrease, setMatchScoreIncrease] = useState<number | null>(null);
  const [recentlyUpdatedBlocks, setRecentlyUpdatedBlocks] = useState<string[]>([]);
  const [recentlyUpdatedBlockIds, setRecentlyUpdatedBlockIds] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // Assembly state
  const [selectedBlocks, setSelectedBlocks] = useState<ProfileBlock[]>([
    profileBlocks[0], // work-1
    profileBlocks[2], // edu-1
  ]);
  const [draggedBlock, setDraggedBlock] = useState<ProfileBlock | null>(null);
  const aiSuggestedBlocks = ['work-1', 'work-2', 'skills-1', 'leadership-1'];
  const totalChars = selectedBlocks.reduce((sum, block) => sum + block.content.length, 0);
  const maxChars = 2000;

  const handleAccept = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion) return;

    let updatedBlockTitle = '';

    if (suggestion.blockId && suggestion.suggestedValue) {
      const block = profileBlocks.find(b => b.id === suggestion.blockId);
      if (block) {
        onUpdateBlock(suggestion.blockId, {
          content: suggestion.suggestedValue,
        });
        updatedBlockTitle = block.title;
        
        // Track updated blocks by both title and ID
        setRecentlyUpdatedBlocks(prev => [...prev, block.title]);
        setRecentlyUpdatedBlockIds(prev => [...prev, suggestion.blockId!]);
        
        setTimeout(() => {
          setRecentlyUpdatedBlocks(prev => prev.filter(t => t !== block.title));
          setRecentlyUpdatedBlockIds(prev => prev.filter(id => id !== suggestion.blockId));
        }, 3000);
      }
    }

    let scoreIncrease = 0;
    switch (suggestion.type) {
      case 'quantify':
        scoreIncrease = 3;
        break;
      case 'add':
        scoreIncrease = 5;
        break;
      case 'emphasize':
        scoreIncrease = 4;
        break;
      case 'edit':
        scoreIncrease = 2;
        break;
    }

    onUpdateMatchScore(selectedJob.id, scoreIncrease);
    setMatchScoreIncrease(scoreIncrease);
    setTimeout(() => setMatchScoreIncrease(null), 2000);

    // Log to audit trail
    onAddAuditEvent(
      'AI suggestion accepted',
      `${suggestion.title} - ${updatedBlockTitle || 'Profile updated'}`
    );

    setSuggestions(suggestions.filter(s => s.id !== id));

    const message = updatedBlockTitle 
      ? `"${updatedBlockTitle}" updated! Match score +${scoreIncrease}%`
      : `Profile updated! Match score increased by ${scoreIncrease}%`;
    
    toast.success(message, {
      duration: 3000,
      icon: '✨',
    });
  };

  const handleReject = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      onAddAuditEvent(
        'AI suggestion rejected',
        `${suggestion.title} - Suggestion dismissed`
      );
    }
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSaveTemplate = () => {
    // Log to audit trail
    onAddAuditEvent(
      'Template saved',
      `Application template for ${selectedJob.company} - ${selectedJob.title}`
    );
    
    toast.success('Template saved!', {
      description: `Application template for ${selectedJob.company} - ${selectedJob.title} has been saved.`,
      duration: 3000,
    });
  };

  const handleAnalyzeUrl = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a job URL');
      return;
    }

    // Show prototype limitation message
    toast.info('Prototype Demo', {
      description: 'URL fetching is not available in this prototype. This would retrieve and analyze the job posting in a production version.',
      duration: 5000,
    });

    setIsAnalyzing(true);

    setTimeout(() => {
      const parsedData = parseJobFromUrl(jobUrl);
      
      const commonKeywords = ['experience', 'skills', 'team', 'development', 'engineering'];
      const extractedKeywords = parsedData.posting
        ?.split(/\W+/)
        .filter(word => word.length > 4 && !commonKeywords.includes(word.toLowerCase()))
        .slice(0, 8) || [];

      const uniqueKeywords = [...new Set([...(parsedData.keywords || []), ...extractedKeywords])].slice(0, 10);
      const matchScore = Math.floor(Math.random() * 30) + 60;

      const newJob: Job = {
        id: `job-${Date.now()}`,
        company: parsedData.company || 'Unknown Company',
        title: parsedData.title || 'Position',
        posting: parsedData.posting || '',
        keywords: uniqueKeywords,
        matchScore,
        strongMatches: [
          'Relevant technical skills',
          'Experience level alignment',
          'Industry background',
        ],
        gaps: [
          'Some specific tools not highlighted',
          'Consider adding relevant certifications',
        ],
      };

      setJobs([newJob, ...jobs]);
      setSelectedJobId(newJob.id);
      setIsAddDialogOpen(false);
      setJobUrl('');
      setIsAnalyzing(false);
      
      // Log to audit trail
      onAddAuditEvent(
        'Job posting added',
        `${newJob.company} - ${newJob.title} (via URL)`
      );
      
      toast.success('Mock job analyzed successfully!');
    }, 2000);
  };

  const handleAddManualJob = () => {
    if (!manualJobData.company.trim() || !manualJobData.title.trim() || !manualJobData.posting.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const commonKeywords = ['experience', 'skills', 'team', 'development', 'engineering', 'strong', 'excellent'];
    const extractedKeywords = manualJobData.posting
      .split(/\W+/)
      .filter(word => word.length > 4 && !commonKeywords.includes(word.toLowerCase()))
      .slice(0, 10);

    const uniqueKeywords = [...new Set(extractedKeywords)];
    const matchScore = Math.floor(Math.random() * 30) + 60;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      company: manualJobData.company,
      title: manualJobData.title,
      posting: manualJobData.posting,
      keywords: uniqueKeywords,
      matchScore,
      strongMatches: [
        'Relevant technical skills',
        'Experience level alignment',
        'Industry background',
      ],
      gaps: [
        'Some specific tools not highlighted',
        'Consider adding relevant certifications',
      ],
    };

    setJobs([newJob, ...jobs]);
    setSelectedJobId(newJob.id);
    setIsAddDialogOpen(false);
    setManualJobData({ company: '', title: '', posting: '' });
    setIsManual(false);
    
    // Log to audit trail
    onAddAuditEvent(
      'Job posting added',
      `${newJob.company} - ${newJob.title} (manual entry)`
    );
    
    toast.success('Job added successfully!');
  };

  const highlightKeywords = (text: string) => {
    let result = text;
    selectedJob.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(regex, `<mark class="bg-yellow-200">$&</mark>`);
    });
    return result;
  };

  const handleDragStart = (block: ProfileBlock) => {
    setDraggedBlock(block);
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock && !selectedBlocks.find(b => b.id === draggedBlock.id)) {
      setSelectedBlocks([...selectedBlocks, draggedBlock]);
      toast.success(`Added "${draggedBlock.title}" to application`);
    }
  };

  const handleRemove = (blockId: string) => {
    const block = selectedBlocks.find(b => b.id === blockId);
    setSelectedBlocks(selectedBlocks.filter(b => b.id !== blockId));
    if (block) {
      toast.success(`Removed "${block.title}" from application`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Job Context Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3>Application Builder</h3>
                  <Badge variant="outline" className="bg-green-50 text-[#10B981] border-green-200">
                    {selectedJob.matchScore}% Match
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <select
                    value={selectedJob.id}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="px-3 py-1.5 border border-border rounded-lg bg-white hover:border-[#2563EB] transition-colors cursor-pointer max-w-md"
                  >
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.company} - {job.title}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Job
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Analyze job requirements, apply AI suggestions, and build your customized application
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left - Job Posting */}
        <div className="w-96 bg-white border-r border-border p-4 overflow-y-auto">
          <h3 className="mb-4">Job Requirements</h3>

          <div className="mb-4">
            <h4 className="mb-2">{selectedJob.company}</h4>
            <p className="text-sm text-gray-600">{selectedJob.title}</p>
          </div>

          {/* Job Description with Highlighted Keywords */}
          <div className="bg-gray-50 border border-border rounded-lg p-4 mb-4">
            <h4 className="mb-3">Description</h4>
            <div
              className="prose prose-sm max-w-none whitespace-pre-line text-sm"
              dangerouslySetInnerHTML={{ __html: highlightKeywords(selectedJob.posting) }}
            />
          </div>

          {/* Detected Keywords */}
          <div>
            <h4 className="mb-3">Key Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {selectedJob.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-yellow-100 text-yellow-900 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Assembly Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Available Blocks */}
            <div className="w-72 bg-gray-50 border-r border-border p-4 overflow-y-auto">
              <div className="mb-3">
                <h4 className="mb-1">Available Blocks</h4>
                <p className="text-xs text-gray-600">Drag to add to your application</p>
              </div>
              
              {/* Legend */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3">
                <div className="flex items-start gap-2 mb-2">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">AI Recommended</span> for this job
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Just Updated</span> by AI suggestion
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {profileBlocks.map(block => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    compact
                    isAISuggested={aiSuggestedBlocks.includes(block.id)}
                    isRecentlyUpdated={recentlyUpdatedBlockIds.includes(block.id)}
                    isDragging={draggedBlock?.id === block.id}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      handleDragStart(block);
                    }}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="mb-1">Your Application</h3>
                    <p className="text-sm text-gray-600">Arrange blocks in your preferred order</p>
                  </div>
                  <div className="text-sm">
                    <span className={totalChars > maxChars ? 'text-red-600' : 'text-gray-600'}>
                      {totalChars} / {maxChars} chars
                    </span>
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`min-h-[500px] border-2 border-dashed rounded-lg p-4 transition-all ${
                    draggedBlock
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <FileText className="w-12 h-12 mb-4" />
                      <p>Drag blocks here to start building</p>
                      <p className="text-xs mt-2">AI-recommended blocks are marked with a star</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedBlocks.map((block, index) => (
                        <div
                          key={block.id}
                          className="bg-white border border-border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">#{index + 1}</span>
                              <h4>{block.title}</h4>
                              {aiSuggestedBlocks.includes(block.id) && (
                                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                              )}
                            </div>
                            <button
                              onClick={() => handleRemove(block.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-sm text-gray-700">{block.content}</p>
                          <div className="text-xs text-gray-400 mt-2">
                            {block.content.length} characters
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assembly Reasoning */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <button
                    onClick={() => setShowAssemblyReasoning(!showAssemblyReasoning)}
                    className="w-full flex items-center justify-between"
                  >
                    <h4>Why These Blocks?</h4>
                    {showAssemblyReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showAssemblyReasoning && (
                    <div className="text-sm text-gray-700 space-y-2 mt-3">
                      <p>
                        <strong>Google Experience:</strong> Directly matches the distributed systems 
                        requirement mentioned in the job posting.
                      </p>
                      <p>
                        <strong>Education:</strong> Meets educational requirements and signals strong 
                        technical foundation.
                      </p>
                      <p>
                        <strong>Consider Adding:</strong> Your leadership block would strengthen the 
                        application for this role.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Button onClick={handlePreview} className="bg-[#2563EB] hover:bg-[#1D4ED8] flex items-center gap-2">
                    Preview Application
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSaveTemplate} variant="outline">
                    Save as Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Match Analysis & AI Suggestions */}
        <div className="w-[420px] bg-gray-50 border-l border-border p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="mb-1">Analysis & Suggestions</h3>
            <p className="text-xs text-gray-600">Accept suggestions to update your blocks</p>
          </div>

          {/* Match Score */}
          <div className="bg-white border border-border rounded-lg p-4 mb-4 relative overflow-hidden">
            {matchScoreIncrease && (
              <div className="absolute inset-0 bg-green-50/80 flex items-center justify-center z-10">
                <div className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">+{matchScoreIncrease}%</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center mb-3">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#10B981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - selectedJob.matchScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="font-semibold text-xl">
                    {selectedJob.matchScore}%
                  </span>
                  <span className="text-xs text-gray-500">Match</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-600">
              {selectedJob.matchScore >= 85 ? 'Excellent' : selectedJob.matchScore >= 70 ? 'Strong' : 'Good'} match
            </p>
          </div>

          {/* Strong Matches */}
          <div className="bg-white border border-border rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
              <h4>Strong Matches</h4>
            </div>
            <ul className="space-y-1">
              {selectedJob.strongMatches.map((match, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span>{match}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div className="bg-white border border-border rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <h4>Potential Gaps</h4>
            </div>
            <ul className="space-y-1">
              {selectedJob.gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-3 h-3 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Reasoning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <button
              onClick={() => setShowJobReasoning(!showJobReasoning)}
              className="w-full flex items-center justify-between"
            >
              <h4>AI Reasoning</h4>
              {showJobReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showJobReasoning && (
              <div className="text-xs text-gray-700 space-y-2 mt-3">
                <p>
                  <strong>Match Calculation:</strong> Based on keyword overlap (78%), experience alignment (85%), 
                  and skill requirements (72%).
                </p>
                <p>
                  <strong>Top Recommendation:</strong> Emphasize your Kubernetes and distributed systems 
                  work from Google, which directly matches core requirements.
                </p>
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4>Improvements</h4>
              {suggestions.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {suggestions.length} pending
                </span>
              )}
            </div>
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map(suggestion => (
                  <AISuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    profileBlocks={profileBlocks}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-xs text-green-700">
                  ✨ All suggestions applied! Your profile is optimized.
                </p>
              </div>
            )}
          </div>

          {/* Recently Updated Blocks */}
          {recentlyUpdatedBlocks.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <h4 className="text-green-900">Block Updated!</h4>
              </div>
              <div className="space-y-1">
                {recentlyUpdatedBlocks.map((title, index) => (
                  <div
                    key={index}
                    className="text-xs text-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {title}
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-start gap-1">
                <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" />
                Updated blocks are highlighted in Available Blocks
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Job Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Add New Job to Analyze</DialogTitle>
            <DialogDescription>
              Paste a job listing URL or manually enter job details for AI analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Toggle between URL and Manual */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setIsManual(false)}
                className={`flex-1 px-4 py-2 rounded text-sm transition-colors ${
                  !isManual ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Link2 className="w-4 h-4 inline-block mr-2" />
                From URL
              </button>
              <button
                onClick={() => setIsManual(true)}
                className={`flex-1 px-4 py-2 rounded text-sm transition-colors ${
                  isManual ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Manual Entry
              </button>
            </div>

            {!isManual ? (
              <div>
                <label className="block mb-2">Job Listing URL</label>
                <Input
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/123456789"
                  className="w-full"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supports LinkedIn, Greenhouse, Lever, and other job platforms
                </p>

                {isAnalyzing && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
                      <div>
                        <p className="text-sm font-medium">Analyzing job posting...</p>
                        <p className="text-xs text-gray-600">
                          Extracting keywords, requirements, and calculating match score
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Company Name</label>
                    <Input
                      value={manualJobData.company}
                      onChange={(e) => setManualJobData({ ...manualJobData, company: e.target.value })}
                      placeholder="e.g., Google"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Job Title</label>
                    <Input
                      value={manualJobData.title}
                      onChange={(e) => setManualJobData({ ...manualJobData, title: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Job Description</label>
                  <Textarea
                    value={manualJobData.posting}
                    onChange={(e) => setManualJobData({ ...manualJobData, posting: e.target.value })}
                    placeholder="Paste the full job description here..."
                    className="w-full min-h-48"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {manualJobData.posting.length} characters
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setJobUrl('');
                setManualJobData({ company: '', title: '', posting: '' });
                setIsManual(false);
                setIsAnalyzing(false);
              }}
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
            <Button
              onClick={isManual ? handleAddManualJob : handleAnalyzeUrl}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  {isManual ? 'Add Job' : 'Analyze URL'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Application Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Application Preview</DialogTitle>
            <DialogDescription>
              Preview your application for {selectedJob.company} - {selectedJob.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Application Header */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-1">{selectedJob.title}</h3>
              <p className="text-sm text-gray-600">{selectedJob.company}</p>
              <p className="text-xs text-gray-500 mt-2">
                Match Score: <span className="font-semibold text-[#2563EB]">{selectedJob.matchScore}%</span>
              </p>
            </div>

            {/* Selected Blocks */}
            <div>
              <h4 className="text-sm font-medium mb-3">Application Content ({totalChars}/{maxChars} characters)</h4>
              <div className="space-y-4">
                {selectedBlocks.map((block) => (
                  <div key={block.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{block.icon}</span>
                      <h5 className="font-medium text-sm">{block.title}</h5>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{block.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords Match */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.keywords.slice(0, 8).map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              Export as PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}