import { useState } from 'react';
import { Lock, Database, Shield, Download, Trash2, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PrivacyProps {
  auditTrail: Array<{ date: string; action: string; details: string }>;
  onAddAuditEvent: (action: string, details: string) => void;
}

export function Privacy({ auditTrail, onAddAuditEvent }: PrivacyProps) {
  const [localStorage, setLocalStorage] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(true);

  const handleToggle = (setting: string, newValue: boolean, onChange: (value: boolean) => void) => {
    onChange(newValue);
    const status = newValue ? 'enabled' : 'disabled';
    
    // Log to audit trail
    onAddAuditEvent(
      'Privacy setting changed',
      `${setting} ${status}`
    );
    
    toast.success(`${setting} ${status}`, {
      duration: 2000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="mb-2">Privacy & Data Control</h1>
      <p className="text-gray-600 mb-8">
        Complete transparency and control over your data
      </p>

      {/* Main Privacy Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Data Storage */}
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-white">Data Storage</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-purple-100 mb-2">Storage Location</p>
              <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                <Database className="w-5 h-5" />
                <span>100% Local</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-purple-100 mb-2">Encryption</p>
              <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>AES-256</span>
              </div>
            </div>

            <div className="text-sm text-purple-100 mt-4">
              Your profile data never leaves your device unless you explicitly submit an application.
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h3>Data Flow</h3>
          </div>

          {/* Flowchart */}
          <div className="relative h-48 bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {/* Node 1 */}
              <div className="bg-white border border-border rounded p-2 text-xs">
                <strong>1. You</strong> - Create & edit profile
              </div>

              {/* Arrow */}
              <div className="w-0.5 h-4 bg-[#2563EB] ml-4" />

              {/* Node 2 */}
              <div className="bg-white border border-border rounded p-2 text-xs">
                <strong>2. Local AI</strong> - Analyze & suggest (offline)
              </div>

              {/* Arrow */}
              <div className="w-0.5 h-4 bg-[#2563EB] ml-4" />

              {/* Node 3 */}
              <div className="bg-white border border-border rounded p-2 text-xs">
                <strong>3. You Approve</strong> - Review before sending
              </div>

              {/* Arrow */}
              <div className="w-0.5 h-4 bg-[#10B981] ml-4" />

              {/* Node 4 */}
              <div className="bg-[#10B981]/10 border border-[#10B981] rounded p-2 text-xs">
                <strong>4. Submit</strong> - Data sent only when you apply
              </div>
            </div>
          </div>
        </div>

        {/* Data Control */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#10B981]" />
            </div>
            <h3>Data Control</h3>
          </div>

          <div className="space-y-1">
            {/* Local Storage Toggle */}
            <div
              className={`flex items-start justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all ${
                localStorage ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">Local Storage</p>
                  {localStorage && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {localStorage 
                    ? 'Your profile data is saved locally in your browser. No data is sent to external servers.'
                    : 'Profile data will not be saved. You will lose all changes when you close this tab.'
                  }
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Switch 
                  checked={localStorage} 
                  onCheckedChange={(checked) => handleToggle('Local storage', checked, setLocalStorage)}
                />
                <span className="text-xs font-medium" style={{ color: localStorage ? '#10B981' : '#9CA3AF' }}>
                  {localStorage ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            {/* Usage Analytics Toggle */}
            <div
              className={`flex items-start justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all ${
                analytics ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">Usage Analytics</p>
                  {analytics && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {analytics 
                    ? 'Anonymous usage statistics are collected to improve the app. No personal data is included.'
                    : 'No usage data is collected. Features may be less personalized.'
                  }
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Switch 
                  checked={analytics} 
                  onCheckedChange={(checked) => handleToggle('Usage analytics', checked, setAnalytics)}
                />
                <span className="text-xs font-medium" style={{ color: analytics ? '#10B981' : '#9CA3AF' }}>
                  {analytics ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            {/* AI Processing Toggle */}
            <div
              className={`flex items-start justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 transition-all ${
                aiProcessing ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">AI Suggestions</p>
                  {aiProcessing && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {aiProcessing 
                    ? 'AI analyzes job postings and suggests profile improvements. Processing happens locally on your device.'
                    : 'AI suggestions are disabled. You will manually customize all profile blocks.'
                  }
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Switch 
                  checked={aiProcessing} 
                  onCheckedChange={(checked) => handleToggle('AI suggestions', checked, setAiProcessing)}
                />
                <span className="text-xs font-medium" style={{ color: aiProcessing ? '#10B981' : '#9CA3AF' }}>
                  {aiProcessing ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Warning for disabled local storage */}
            {!localStorage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-900">Warning: Data Not Saved</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Without local storage, all profile blocks and settings will be lost when you close this page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning for disabled AI */}
            {!aiProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900">AI Suggestions Disabled</p>
                    <p className="text-xs text-blue-700 mt-1">
                      You won't receive keyword recommendations or match score analysis for job postings.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-2 mt-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => {
                  onAddAuditEvent('Data export', 'Full profile exported as JSON');
                  toast.success('Data export started. Download will begin shortly.');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                size="sm"
                onClick={() => toast.error('Delete all data? This action cannot be undone.', {
                  action: {
                    label: 'Confirm Delete',
                    onClick: () => {
                      onAddAuditEvent('Data deletion', 'All profile data and settings deleted');
                      toast.success('All data deleted');
                    },
                  },
                })}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="mb-4">Audit Trail</h3>
        <p className="text-sm text-gray-600 mb-4">
          Complete history of all actions and data access
        </p>

        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {auditTrail.map((item, index) => (
              <div key={index} className="relative pl-12">
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white" />
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </div>
              </div>
            ))}</div>
        </div>
      </div>
    </div>
  );
}
