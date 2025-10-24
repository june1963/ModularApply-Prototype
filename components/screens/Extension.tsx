import { useState } from 'react';
import { profileBlocks } from '../../data/mockData';
import { Application } from '../../types';
import { Chrome, X, ChevronRight, CheckCircle, AlertCircle, Sparkles, MousePointer, Info, Undo } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface ExtensionProps {
  onAddApplication: (application: Application) => void;
  onAddAuditEvent: (action: string, details: string) => void;
}

export function Extension({ onAddApplication, onAddAuditEvent }: ExtensionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Start closed
  const [selectedProfile, setSelectedProfile] = useState('default');
  const [autoFillStep, setAutoFillStep] = useState(0);
  const [showHelp, setShowHelp] = useState(true);

  const handleAutoFill = () => {
    // Simulate autofill sequence - fills one field at a time with delay
    setAutoFillStep(1);
    const fields = ['name', 'email', 'experience', 'skills', 'education'];
    
    fields.forEach((field, index) => {
      setTimeout(() => {
        setAutoFillStep(index + 2);
      }, (index + 1) * 500);
    });

    // Don't auto-reset, let user undo manually
    setTimeout(() => {
      setAutoFillStep(7); // Complete state
    }, fields.length * 500 + 500);
  };

  const handleInstantFill = () => {
    // Fill all fields instantly - user can review after
    setAutoFillStep(7);
  };

  const handleOneClickApply = () => {
    // Fill instantly and show submission confirmation
    setAutoFillStep(7);
    submitApplication();
  };

  const submitApplication = () => {
    setTimeout(() => {
      setAutoFillStep(8); // Submitted state
      
      // Create new application entry
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        jobId: 'job-google',
        company: 'Google',
        position: 'Senior Software Engineer',
        status: 'Submitted',
        appliedDate: new Date().toISOString().split('T')[0],
        blocksUsed: ['work-1', 'work-2', 'skills-1', 'edu-1'],
      };
      
      onAddApplication(newApplication);
      onAddAuditEvent('Application submitted', 'Google - Senior Software Engineer');
      
      // Show success toast
      toast.success('Application submitted successfully!', {
        description: 'Your application to Google has been submitted.',
        duration: 4000,
      });
    }, 500);
  };

  const handleUndo = () => {
    setAutoFillStep(0);
  };

  const fieldMappings = [
    { field: 'Full Name', value: 'Alex Chen', confidence: 100 },
    { field: 'Email', value: 'alex.chen@email.com', confidence: 100 },
    { field: 'Work Experience', value: 'Senior Software Engineer - Google', confidence: 95 },
    { field: 'Skills', value: 'Python, React, AWS, Kubernetes...', confidence: 90 },
    { field: 'Education', value: 'BS Computer Science - Stanford', confidence: 100 },
  ];

  return (
    <div className="relative h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
      {/* Help Banner */}
      {showHelp && (
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-start gap-4">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-white mb-1">Browser Extension Demo</h4>
              <p className="text-sm text-blue-100">
                This shows how the ModularApply browser extension works when you visit a job application page. 
                Click the blue button in the bottom-right to open the extension panel, then click "Preview & Fill" to auto-fill the form with your profile data.
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Simulated Job Application Page */}
      <div className="max-w-4xl mx-auto p-8 overflow-y-auto h-full">
        {/* Page Header to look like a real job site */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border-l-4 border-blue-500">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                G
              </div>
              <div>
                <h2 className="mb-1">Senior Software Engineer Application</h2>
                <p className="text-gray-600">Google Cloud Infrastructure Team</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              careers.google.com
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <h3>Application Form</h3>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    autoFillStep >= 2 ? 'border-[#10B981] bg-green-50' : 'border-gray-300'
                  }`}
                  value={autoFillStep >= 2 ? 'Alex Chen' : ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    autoFillStep >= 3 ? 'border-[#10B981] bg-green-50' : 'border-gray-300'
                  }`}
                  value={autoFillStep >= 3 ? 'alex.chen@email.com' : ''}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Work Experience</label>
              <textarea
                className={`w-full px-4 py-2 border rounded-lg min-h-24 transition-colors ${
                  autoFillStep >= 4 ? 'border-[#10B981] bg-green-50' : 'border-gray-300'
                }`}
                value={autoFillStep >= 4 ? profileBlocks[0].content : ''}
                readOnly
              />
            </div>

            <div>
              <label className="block mb-2">
                Technical Skills
                {autoFillStep >= 5 && (
                  <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    Review recommended
                  </span>
                )}
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  autoFillStep >= 5 ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                }`}
                value={autoFillStep >= 5 ? 'Python, React, TypeScript, Go, AWS, Kubernetes...' : ''}
                readOnly
              />
            </div>

            <div>
              <label className="block mb-2">Education</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  autoFillStep >= 6 ? 'border-[#10B981] bg-green-50' : 'border-gray-300'
                }`}
                value={autoFillStep >= 6 ? 'BS Computer Science - Stanford' : ''}
                readOnly
              />
            </div>

            {/* Submit Button */}
            {autoFillStep >= 6 && autoFillStep < 8 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={submitApplication}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
                >
                  Submit Application
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Review your information above before submitting
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* FAB Button with Pointer */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isPanelOpen && (
          <div className="absolute -top-20 right-0 bg-white rounded-lg shadow-lg p-3 border border-border max-w-[200px]">
            <p className="text-sm mb-2">Click to open the extension</p>
            <MousePointer className="w-4 h-4 text-[#2563EB] ml-auto" />
            <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
          </div>
        )}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-lg hover:bg-[#1D4ED8] flex items-center justify-center relative hover:scale-110 active:scale-90 transition-all"
        >
          {isPanelOpen ? <X className="w-6 h-6" /> : <Chrome className="w-6 h-6" />}
        </button>
      </div>

      {/* Slide-in Panel */}
      {isPanelOpen && (
        <div className="fixed right-0 top-[64px] bottom-0 w-[400px] bg-white border-l border-border shadow-2xl overflow-y-auto z-40 transition-transform">
          <div className="p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-lg p-4 mb-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Chrome className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white">ModularApply</h3>
                  <p className="text-xs text-blue-100">Browser Extension</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Detected application form on this page. Ready to auto-fill with your profile data.
              </p>
            </div>

            {/* Profile Selector */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Select Profile</label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value="default">Default Profile (85% complete)</option>
                <option value="tech-lead">Tech Lead Focus</option>
                <option value="backend">Backend Specialist</option>
              </select>
            </div>

            {/* Field Mapping Preview */}
            <div className="mb-6">
              <h4 className="mb-3">Field Mapping</h4>
              <div className="space-y-2">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="bg-gray-50 border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">{mapping.field}</span>
                      <div className="flex items-center gap-1">
                        {mapping.confidence === 100 ? (
                          <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        ) : mapping.confidence >= 90 ? (
                          <AlertCircle className="w-3 h-3 text-yellow-500" />
                        ) : null}
                        <span className="text-xs text-gray-500">{mapping.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 truncate">{mapping.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium mb-2">Auto-fill Actions</label>
              
              <Button
                onClick={handleAutoFill}
                disabled={autoFillStep > 0}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] justify-between relative"
              >
                <span>{autoFillStep > 0 && autoFillStep < 7 ? 'Filling...' : 'Preview & Fill'}</span>
                <ChevronRight className="w-4 h-4" />
                {autoFillStep === 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </Button>
              <p className="text-xs text-gray-600 px-1">
                Fill form fields one-by-one so you can review each entry
              </p>
              
              <Button
                onClick={handleInstantFill}
                disabled={autoFillStep > 0}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Fill & Review</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-gray-600 px-1">
                Fill all fields instantly, then review before submitting
              </p>

              <Button
                onClick={handleOneClickApply}
                disabled={autoFillStep > 0}
                variant="outline"
                className="w-full justify-between border-[#10B981] text-[#10B981] hover:bg-green-50"
              >
                <span>One-Click Apply</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-gray-600 px-1">
                Fill and submit application automatically (requires confirmation)
              </p>

              {/* Undo Button */}
              {autoFillStep > 0 && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={handleUndo}
                    variant="outline"
                    className="w-full justify-between border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <span className="flex items-center gap-2">
                      <Undo className="w-4 h-4" />
                      Undo Auto-fill
                    </span>
                  </Button>
                  <p className="text-xs text-gray-600 px-1 mt-2">
                    Clear all auto-filled fields and start over
                  </p>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="mb-6">
              <h4 className="mb-3">How This Works</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#2563EB] text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Extension detects form</p>
                    <p className="text-xs text-gray-600">
                      Recognizes application forms on job sites
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#2563EB] text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maps your profile blocks</p>
                    <p className="text-xs text-gray-600">
                      Intelligently matches your data to form fields
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#2563EB] text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">You maintain control</p>
                    <p className="text-xs text-gray-600">
                      Review and edit any field before submitting
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-1">Privacy First</p>
                  <p className="text-xs text-blue-700">
                    Your data stays local on your device. The extension only fills forms when you explicitly click an action button.
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {autoFillStep >= 6 && autoFillStep < 8 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  <p className="text-sm text-green-900">
                    Application filled successfully! Review highlighted fields before submitting.
                  </p>
                </div>
              </div>
            )}

            {/* Submitted Message */}
            {autoFillStep === 8 && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#2563EB]" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Application Submitted!</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your application has been successfully submitted to Google. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
