import React from 'react';
import { Brain, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface AIStatusIndicatorProps {
  isAIAvailable: boolean;
  onConfigureClick?: () => void;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ 
  isAIAvailable, 
  onConfigureClick 
}) => {
  const getStatusConfig = () => {
    if (isAIAvailable) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: 'IA Habilitada',
        description: 'Funcionalidades de IA estão disponíveis',
        color: 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        features: [
          '🤖 Lead Scoring Inteligente',
          '💬 Respostas Automáticas',
          '🎯 Roteamento Inteligente',
          '📈 Enriquecimento de Contatos'
        ]
      };
    } else {
      return {
        icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        title: 'IA Desabilitada',
        description: 'Configure a API key do OpenAI para habilitar funcionalidades de IA',
        color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        features: [
          '📊 Dados básicos do Chatwoot',
          '🔄 Funcionalidades limitadas',
          '📝 Processamento manual',
          '⚙️ Configuração necessária'
        ]
      };
    }
  };

  const status = getStatusConfig();

  return (
    <div className={`p-4 rounded-lg border ${status.color}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {status.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {status.title}
            </h3>
            <Brain className="w-4 h-4 text-gray-400" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {status.description}
          </p>

          <div className="space-y-1 mb-3">
            {status.features.map((feature, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                {feature}
              </div>
            ))}
          </div>

          {!isAIAvailable && onConfigureClick && (
            <button
              onClick={onConfigureClick}
              className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Configurar IA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 