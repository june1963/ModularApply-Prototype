import { useState } from 'react';
import { Application, ProfileBlock } from '../../types';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

const statusColors = {
  'Submitted': 'bg-blue-100 text-blue-800',
  'Viewed': 'bg-purple-100 text-purple-800',
  'Interview': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'No Response': 'bg-gray-100 text-gray-800',
};

interface TrackerProps {
  applications: Application[];
  profileBlocks: ProfileBlock[];
}

export function Tracker({ applications, profileBlocks }: TrackerProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const statuses = ['All', 'Submitted', 'Viewed', 'Interview', 'Rejected', 'No Response'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="mb-2">Application Tracker</h1>
      <p className="text-gray-600 mb-6">
        Monitor all your job applications in one place
      </p>

      {/* Filters */}
      <div className="bg-white border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter by status:</span>
          </div>
          <div className="flex gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
                {status !== 'All' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({applications.filter(a => a.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-8"></th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Company</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Position</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Applied</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <>
                <tr
                  key={app.id}
                  className="border-b border-border hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(app.id)}
                >
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      {expandedRows.has(app.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium">{app.company}</td>
                  <td className="px-6 py-4">{app.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.appliedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.lastUpdate || '-'}</td>
                </tr>
                {expandedRows.has(app.id) && (
                  <tr key={`expanded-${app.id}`} className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="pl-8">
                        <h4 className="mb-3">Blocks Used in This Application</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {app.blocksUsed.map(blockId => {
                            const block = profileBlocks.find(b => b.id === blockId);
                            return block ? (
                              <div key={blockId} className="bg-white border border-border rounded p-3">
                                <p className="font-medium text-sm mb-1">{block.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {block.content}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 inline-block">
                                  {block.category}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No applications found with status "{filterStatus}"
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-semibold">{applications.length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Submitted</p>
          <p className="text-2xl font-semibold">
            {applications.filter(a => a.status === 'Submitted').length}
          </p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Viewed</p>
          <p className="text-2xl font-semibold">
            {applications.filter(a => a.status === 'Viewed').length}
          </p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Interviews</p>
          <p className="text-2xl font-semibold text-[#10B981]">
            {applications.filter(a => a.status === 'Interview').length}
          </p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-2xl font-semibold">
            {Math.round((applications.filter(a => a.status !== 'No Response').length / applications.length) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
