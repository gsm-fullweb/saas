import React, { useState } from 'react';
import { MoreHorizontal, User, Clock, Tag, MessageSquare } from 'lucide-react';
import { Conversation, User as UserType } from '../../types/chatwoot';

interface KanbanBoardProps {
  conversations: Conversation[];
  agents: UserType[];
  onUpdateConversation: (conversationId: number, updates: any) => void;
  onConversationClick: (conversation: Conversation) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  conversations,
  agents,
  onUpdateConversation,
  onConversationClick
}) => {
  const [draggedItem, setDraggedItem] = useState<Conversation | null>(null);

  const columns = [
    { id: 'open', title: 'Abertas', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { id: 'pending', title: 'Pendentes', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    { id: 'snoozed', title: 'Pausadas', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
    { id: 'resolved', title: 'Resolvidas', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' }
  ];

  const getConversationsByStatus = (status: string) => {
    return conversations.filter(conv => conv.status === status);
  };

  const handleDragStart = (e: React.DragEvent, conversation: Conversation) => {
    setDraggedItem(conversation);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      onUpdateConversation(draggedItem.id, { status: newStatus });
    }
    setDraggedItem(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'agora';
  };

  const ConversationCard: React.FC<{ conversation: Conversation }> = ({ conversation }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, conversation)}
      onClick={() => onConversationClick(conversation)}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {conversation.contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {conversation.contact.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{conversation.id}
            </p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Assignee */}
      {conversation.assignee && (
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {conversation.assignee.name}
          </span>
        </div>
      )}

      {/* Messages count and time */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <MessageSquare className="w-3 h-3" />
          <span>{conversation.messages_count}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(conversation.last_activity_at)}</span>
        </div>
      </div>

      {/* Labels */}
      {conversation.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {conversation.labels.slice(0, 2).map((label) => (
            <span
              key={label.id}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
                border: `1px solid ${label.color}40`
              }}
            >
              {label.title}
            </span>
          ))}
          {conversation.labels.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              +{conversation.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Unread indicator */}
      {conversation.unread_count > 0 && (
        <div className="flex justify-end">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {conversation.unread_count}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnConversations = getConversationsByStatus(column.id);
        
        return (
          <div
            key={column.id}
            className={`${column.color} border-2 border-dashed rounded-xl p-4 min-h-[600px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded-full">
                {columnConversations.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {columnConversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
            
            {columnConversations.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma conversa</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;