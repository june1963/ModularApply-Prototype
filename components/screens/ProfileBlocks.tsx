import { useState, useEffect } from 'react';
import { aiSuggestions } from '../../data/mockData';
import { ProfileBlock, AISuggestion } from '../../types';
import { BlockCard } from '../BlockCard';
import { AISuggestionCard } from '../AISuggestionCard';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['Work', 'Education', 'Skills', 'Projects', 'Leadership'];

const categoryIcons: Record<string, string> = {
  Work: 'Briefcase',
  Education: 'GraduationCap',
  Skills: 'Code',
  Projects: 'FolderGit2',
  Leadership: 'Users',
};

interface ProfileBlocksProps {
  profileBlocks: ProfileBlock[];
  setProfileBlocks: (blocks: ProfileBlock[]) => void;
  onAddAuditEvent: (action: string, details: string) => void;
}

export function ProfileBlocks({ profileBlocks, setProfileBlocks, onAddAuditEvent }: ProfileBlocksProps) {
  const [blocks, setBlocks] = useState<ProfileBlock[]>(profileBlocks);
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [selectedBlock, setSelectedBlock] = useState<ProfileBlock | null>(blocks[0]);
  // Filter to only show general suggestions (those without a jobId)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(
    aiSuggestions.filter(s => !s.jobId)
  );
  const [editedContent, setEditedContent] = useState(selectedBlock?.content || '');
  const [editedTitle, setEditedTitle] = useState(selectedBlock?.title || '');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [recentlyUpdatedBlockIds, setRecentlyUpdatedBlockIds] = useState<string[]>([]);

  // Sync with parent state
  useEffect(() => {
    setBlocks(profileBlocks);
    const selectedId = selectedBlock?.id;
    if (selectedId) {
      const updatedBlock = profileBlocks.find(b => b.id === selectedId);
      if (updatedBlock) {
        setSelectedBlock(updatedBlock);
        setEditedContent(updatedBlock.content);
        setEditedTitle(updatedBlock.title);
      }
    }
  }, [profileBlocks]); // selectedBlock.id is captured in selectedId

  // Update selected block when category changes
  useEffect(() => {
    const blocksInCategory = blocks.filter(b => b.category === selectedCategory);
    if (blocksInCategory.length > 0) {
      const firstBlock = blocksInCategory[0];
      setSelectedBlock(firstBlock);
      setEditedContent(firstBlock.content);
      setEditedTitle(firstBlock.title);
    } else {
      setSelectedBlock(null);
      setEditedContent('');
      setEditedTitle('');
    }
  }, [selectedCategory, blocks]);

  const handleAccept = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (!suggestion) return;

    let updatedBlockTitle = '';
    let updatedBlock: ProfileBlock | null = null;

    if (suggestion.blockId && suggestion.suggestedValue) {
      const block = blocks.find(b => b.id === suggestion.blockId);
      if (block) {
        const updatedBlocks = blocks.map(b =>
          b.id === suggestion.blockId
            ? { ...b, content: suggestion.suggestedValue!, preview: b.title }
            : b
        );
        setBlocks(updatedBlocks);
        setProfileBlocks(updatedBlocks);
        
        updatedBlock = { ...block, content: suggestion.suggestedValue!, preview: block.title };
        
        // Switch to the category and select the updated block
        setSelectedCategory(block.category);
        setSelectedBlock(updatedBlock);
        setEditedContent(suggestion.suggestedValue!);
        setEditedTitle(block.title);
        
        // Track updated blocks with visual indicator
        setRecentlyUpdatedBlockIds(prev => [...prev, suggestion.blockId!]);
        setTimeout(() => {
          setRecentlyUpdatedBlockIds(prev => prev.filter(id => id !== suggestion.blockId));
        }, 3000);
        
        updatedBlockTitle = block.title;
      }
    }

    // Log to audit trail
    onAddAuditEvent(
      'AI suggestion accepted',
      `${suggestion.title} - ${updatedBlockTitle || 'Profile updated'}`
    );

    setSuggestions(suggestions.filter(s => s.id !== id));
    
    const message = updatedBlockTitle 
      ? `"${updatedBlockTitle}" updated with AI suggestion!`
      : `Profile updated successfully!`;
    
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

  const handleBlockSelect = (block: ProfileBlock) => {
    setSelectedBlock(block);
    setEditedContent(block.content);
    setEditedTitle(block.title);
  };

  const handleSaveChanges = () => {
    if (selectedBlock) {
      const updatedBlocks = blocks.map(b => 
        b.id === selectedBlock.id 
          ? { ...b, title: editedTitle, content: editedContent, preview: editedTitle }
          : b
      );
      setBlocks(updatedBlocks);
      setProfileBlocks(updatedBlocks);
      setSelectedBlock({ ...selectedBlock, title: editedTitle, content: editedContent, preview: editedTitle });
      
      // Log to audit trail
      onAddAuditEvent(
        'Profile block edited',
        `${editedTitle} - ${selectedBlock.category} block updated`
      );
      
      toast.success('Block updated successfully');
    }
  };

  const handleAddNewBlock = () => {
    if (!newBlockTitle.trim() || !newBlockContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newBlock: ProfileBlock = {
      id: `${selectedCategory.toLowerCase()}-${Date.now()}`,
      category: selectedCategory,
      title: newBlockTitle,
      content: newBlockContent,
      icon: categoryIcons[selectedCategory],
      preview: newBlockTitle,
    };

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    setProfileBlocks(updatedBlocks);
    setIsAddDialogOpen(false);
    setNewBlockTitle('');
    setNewBlockContent('');
    
    // Log to audit trail
    onAddAuditEvent(
      'Profile block created',
      `${newBlockTitle} - New ${selectedCategory} block added`
    );
    
    toast.success('Block created successfully');
    handleBlockSelect(newBlock);
  };

  const handleDeleteBlock = () => {
    if (selectedBlock) {
      const deletedTitle = selectedBlock.title;
      const deletedCategory = selectedBlock.category;
      
      const updatedBlocks = blocks.filter(b => b.id !== selectedBlock.id);
      setBlocks(updatedBlocks);
      setProfileBlocks(updatedBlocks);
      setSelectedBlock(null);
      
      // Log to audit trail
      onAddAuditEvent(
        'Profile block deleted',
        `${deletedTitle} - ${deletedCategory} block removed`
      );
      
      toast.success('Block deleted');
    }
  };

  const filteredBlocks = blocks.filter(b => b.category === selectedCategory);
  const blockSuggestions = suggestions.filter(s => s.blockId === selectedBlock?.id);
  
  // Check if category has recently updated blocks
  const categoryHasUpdate = (category: string) => {
    return blocks
      .filter(b => b.category === category)
      .some(b => recentlyUpdatedBlockIds.includes(b.id));
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar - Categories */}
      <div className="w-64 bg-white border-r border-border p-4">
        <h3 className="mb-4">Profile Blocks</h3>
        <div className="space-y-2">
          {categories.map(category => {
            const count = blocks.filter(b => b.category === category).length;
            const hasUpdate = categoryHasUpdate(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors relative ${
                  selectedCategory === category
                    ? 'bg-[#2563EB] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {hasUpdate && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
                <div className="flex items-center justify-between">
                  <span>{category}</span>
                  <span className={`text-xs ${selectedCategory === category ? 'text-blue-200' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Area - Block Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-2">{selectedCategory}</h2>
              <p className="text-gray-600">Select a block to edit or add details</p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Block
            </Button>
          </div>

          {/* Block List */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {filteredBlocks.map(block => (
              <BlockCard
                key={block.id}
                block={block}
                onClick={() => handleBlockSelect(block)}
                isRecentlyUpdated={recentlyUpdatedBlockIds.includes(block.id)}
              />
            ))}
            {filteredBlocks.length === 0 && (
              <div className="col-span-2 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No blocks in this category yet</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Block
                </Button>
              </div>
            )}
          </div>

          {/* Editor */}
          {selectedBlock && (
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="mb-4">Edit Block</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Content</label>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editedContent.length} characters
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveChanges}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditedTitle(selectedBlock.title);
                        setEditedContent(selectedBlock.content);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleDeleteBlock}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete Block
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - AI Suggestions */}
      <div className="w-96 bg-gray-50 border-l border-border p-4 overflow-y-auto">
        <h3 className="mb-4">AI Suggestions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Recommendations to strengthen your profile
        </p>

        {blockSuggestions.length > 0 ? (
          <div>
            <p className="text-xs text-gray-500 mb-3">For this block:</p>
            {blockSuggestions.map(suggestion => (
              <AISuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : null}

        <p className="text-xs text-gray-500 mb-3 mt-6">General suggestions:</p>
        {suggestions.filter(s => !s.blockId || s.blockId !== selectedBlock?.id).map(suggestion => (
          <AISuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>

      {/* Add New Block Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New {selectedCategory} Block</DialogTitle>
            <DialogDescription>
              Create a new block to add to your {selectedCategory.toLowerCase()} profile section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block mb-2">Title</label>
              <Input
                value={newBlockTitle}
                onChange={(e) => setNewBlockTitle(e.target.value)}
                placeholder={`e.g., ${
                  selectedCategory === 'Work' ? 'Senior Engineer - Company Name' :
                  selectedCategory === 'Education' ? 'BS Computer Science - University' :
                  selectedCategory === 'Skills' ? 'Technical Skills' :
                  selectedCategory === 'Projects' ? 'Project Name' :
                  'Team Leadership Experience'
                }`}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Content</label>
              <Textarea
                value={newBlockContent}
                onChange={(e) => setNewBlockContent(e.target.value)}
                placeholder="Add detailed information about this experience, skill, or achievement..."
                className="w-full min-h-32"
              />
              <p className="text-xs text-gray-500 mt-1">
                {newBlockContent.length} characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setNewBlockTitle('');
                setNewBlockContent('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNewBlock}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Create Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}