import { userProfile, stats } from '../../data/mockData';
import { ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Screen } from '../../types';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  auditTrail: Array<{ date: string; action: string; details: string }>;
}

export function Dashboard({ onNavigate, auditTrail }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Welcome back, {userProfile.name}</h1>
        <p className="text-gray-600">{userProfile.experience} experience • {userProfile.companies.join(', ')}</p>
      </div>

      {/* Completion Ring & Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Completion */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Profile</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#2563EB"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - userProfile.completionPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-semibold text-2xl">{userProfile.completionPercentage}%</span>
                <span className="text-xs text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#10B981]" />
            <h3>Submitted</h3>
          </div>
          <p className="text-3xl font-semibold mb-1">{stats.submitted}</p>
          <p className="text-xs text-gray-500">{stats.responseRate}% response rate</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
            <h3>In Progress</h3>
          </div>
          <p className="text-3xl font-semibold mb-1">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">Active applications</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
            <h3>Interviews</h3>
          </div>
          <p className="text-3xl font-semibold mb-1">{stats.interviews}</p>
          <p className="text-xs text-gray-500">Scheduled this week</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-lg p-8 mb-8 text-white">
        <h2 className="text-white mb-2">Ready to apply?</h2>
        <p className="mb-4 text-blue-100">
          Analyze job postings, apply AI suggestions, and build customized applications all in one place
        </p>
        <button
          onClick={() => onNavigate('application-builder')}
          className="px-6 py-3 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          Start New Application
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity Feed */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {auditTrail.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-2" />
              <div className="flex-1">
                <p className="text-sm">{item.action}</p>
                <p className="text-xs text-gray-500">{item.details} • {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
