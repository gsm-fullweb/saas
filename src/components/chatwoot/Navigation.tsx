import React from 'react';
import { BarChart3, MessageSquare, Kanban, FileText, Settings, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'administrator' | 'agent';
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, userRole }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['administrator', 'agent'] },
    { id: 'conversations', label: 'Conversas', icon: MessageSquare, roles: ['administrator', 'agent'] },
    { id: 'kanban', label: 'Kanban', icon: Kanban, roles: ['administrator', 'agent'] },
    { id: 'demo', label: 'Demo', icon: Zap, roles: ['administrator', 'agent'] },
    { id: 'reports', label: 'Relatórios', icon: FileText, roles: ['administrator'] },
    { id: 'config', label: 'Config', icon: Settings, roles: ['administrator'] },
  ];

  const availableTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;