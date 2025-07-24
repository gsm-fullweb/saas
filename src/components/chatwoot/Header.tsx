import React from 'react';
import { Bell, Settings, LogOut, User, MessageSquare } from 'lucide-react';
import { User as UserType } from '../../types/chatwoot';
import NotificationModal from './NotificationModal';
import { Conversation } from '../../types/chatwoot';

interface HeaderProps {
  user: UserType;
  conversations: Conversation[];
  onNotificationClick: () => void;
  onConversationClick: (conversation: Conversation) => void;
  onMarkAsRead: (conversationId: number) => void;
  onMarkAllAsRead: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  conversations,
  onNotificationClick,
  onConversationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onSettingsClick,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  // Calculate total unread messages
  const totalUnreadCount = conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
  
  const getRoleLabel = (role: string) => {
    return role === 'administrator' ? 'Gerente' : 'Atendente';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    onNotificationClick();
  };

  const handleConversationClick = (conversation: Conversation) => {
    setShowNotifications(false);
    onConversationClick(conversation);
  };

  const handleMarkAsRead = (conversationId: number) => {
    onMarkAsRead(conversationId);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    setShowNotifications(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CH</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chathook</h1>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center animate-pulse">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.availability_status)}`} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>

            {/* Settings */}
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        conversations={conversations}
        onConversationClick={handleConversationClick}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};

export default Header;