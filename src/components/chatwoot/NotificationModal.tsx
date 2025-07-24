import React, { useState, useEffect } from 'react';
import { X, MessageSquare, User, Clock, Check, CheckCheck } from 'lucide-react';
import { Conversation } from '../../types/chatwoot';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
  onMarkAsRead: (conversationId: number) => void;
  onMarkAllAsRead: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onConversationClick,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [notifications, setNotifications] = useState<Conversation[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Filter conversations with unread messages
      const unreadConversations = conversations.filter(conv => conv.unread_count > 0);
      setNotifications(unreadConversations);
    }
  }, [isOpen, conversations]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'agora';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'snoozed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'pending': return 'Pendente';
      case 'snoozed': return 'Pausada';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  const handleNotificationClick = (conversation: Conversation) => {
    onConversationClick(conversation);
    onMarkAsRead(conversation.id);
    onClose();
  };

  const handleMarkAsRead = (e: React.MouseEvent, conversationId: number) => {
    e.stopPropagation();
    onMarkAsRead(conversationId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notificações
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notifications.length} mensagens não lidas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={onMarkAllAsRead}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar todas como lidas</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-500 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Todas as mensagens foram lidas
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleNotificationClick(conversation)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {conversation.contact.thumbnail ? (
                        <img
                          src={conversation.contact.thumbnail}
                          alt={conversation.contact.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                          {conversation.contact.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Unread indicator */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {conversation.contact.name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(conversation.last_activity_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          #{conversation.id}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                          {getStatusLabel(conversation.status)}
                        </span>
                      </div>

                      {/* Last message preview */}
                      {conversation.last_non_activity_message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.last_non_activity_message.content}
                        </p>
                      )}

                      {/* Assignee */}
                      {conversation.assignee && (
                        <div className="flex items-center space-x-1 mt-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.assignee.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mark as read button */}
                    <button
                      onClick={(e) => handleMarkAsRead(e, conversation.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="w-4 h-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;