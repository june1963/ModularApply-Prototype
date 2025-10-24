import { ProfileBlock } from '../types';
import { Briefcase, GraduationCap, Code, FolderGit2, Users, Star, Sparkles } from 'lucide-react';

interface BlockCardProps {
  block: ProfileBlock;
  onClick?: () => void;
  isAISuggested?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  compact?: boolean;
  isRecentlyUpdated?: boolean;
}

const iconMap: Record<string, any> = {
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Users,
};

export function BlockCard({ block, onClick, isAISuggested, isDragging, onDragStart, onDragEnd, compact, isRecentlyUpdated }: BlockCardProps) {
  const Icon = iconMap[block.icon] || Briefcase;

  if (compact) {
    return (
      <div
        draggable={!!onDragStart}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
        className={`bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[#2563EB] transition-all relative ${
          isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
        } ${isRecentlyUpdated ? 'border-green-500 bg-green-50' : 'border-border'}`}
      >
        {isRecentlyUpdated && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        )}
        {isAISuggested && !isRecentlyUpdated && (
          <div className="absolute -top-1 -right-1">
            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-[#2563EB]/10 rounded flex items-center justify-center flex-shrink-0">
            <Icon className="w-3 h-3 text-[#2563EB]" />
          </div>
          <h4 className="text-xs font-medium truncate">{block.title}</h4>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{block.content}</p>
      </div>
    );
  }

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`bg-white border rounded-lg p-4 cursor-pointer hover:border-[#2563EB] transition-all relative ${
        isDragging ? 'opacity-50 scale-105 shadow-lg' : ''
      } ${isRecentlyUpdated ? 'border-green-500 bg-green-50' : 'border-border'}`}
      style={{ width: '320px' }}
    >
      {isRecentlyUpdated && (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      {isAISuggested && !isRecentlyUpdated && (
        <div className="absolute -top-2 -right-2 bg-[#F59E0B] rounded-full p-1">
          <Star className="w-4 h-4 text-white fill-white" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#2563EB]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1 truncate">{block.title}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{block.preview || block.content}</p>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        {block.category}
      </div>
    </div>
  );
}