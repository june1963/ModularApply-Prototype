import { AISuggestion, ProfileBlock } from '../types';
import { Lightbulb, Check, X, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
  profileBlocks?: ProfileBlock[];
}

export function AISuggestionCard({ suggestion, onAccept, onReject, onEdit, profileBlocks }: AISuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const targetBlock = profileBlocks?.find(b => b.id === suggestion.blockId);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept(suggestion.id);
      toast.success('Suggestion applied');
    }, 300);
  };

  const handleReject = () => {
    setIsRejecting(true);
    setTimeout(() => {
      onReject(suggestion.id);
      toast('Suggestion dismissed', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }, 300);
  };

  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3 transition-all duration-300 ${
        isAccepting ? 'opacity-0 scale-90' : isRejecting ? 'opacity-0 -translate-x-24' : 'opacity-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
          {targetBlock && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-gray-500">Updates:</span>
              <span className="text-xs font-medium text-[#2563EB]">{targetBlock.title}</span>
            </div>
          )}
          <p className="text-xs text-gray-600 mb-2">{suggestion.reason}</p>

          {isExpanded && (
            <div className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-200 mb-3 transition-all duration-300">
              {suggestion.details}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1 bg-[#10B981] text-white rounded text-xs hover:bg-[#059669] transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reject
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(suggestion.id)}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 text-gray-600 hover:text-gray-900 text-xs flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Why?
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}