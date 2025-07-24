import React, { useState, useEffect } from 'react';
import { X, Users, Save, Check } from 'lucide-react';
import { Conversation, Team } from '../../types/chatwoot';
import ChatwootAPI from '../../services/chatwootApi';

interface TeamAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  onTeamAssigned: (conversationId: number, teamId: number | null) => void;
}

const TeamAssignmentModal: React.FC<TeamAssignmentModalProps> = ({
  isOpen,
  onClose,
  conversation,
  onTeamAssigned
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const api = new ChatwootAPI(1);

  useEffect(() => {
    if (isOpen) {
      loadTeams();
      // Set current team if conversation has one
      setSelectedTeamId(conversation.meta?.team?.id || null);
    }
  }, [isOpen, conversation]);

  const loadTeams = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('🔄 Loading teams from API...');
      const teamsData = await api.getTeams();
      console.log('✅ Teams loaded:', teamsData);
      
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('❌ Error loading teams:', error);
      setError('Erro ao carregar times. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      console.log('🔄 Assigning team to conversation:', {
        conversationId: conversation.id,
        teamId: selectedTeamId
      });

      // Update conversation with team assignment
      await api.updateConversation(conversation.id, {
        team_id: selectedTeamId
      });

      console.log('✅ Team assigned successfully');
      
      // Notify parent component
      onTeamAssigned(conversation.id, selectedTeamId);
      
      // Close modal
      handleClose();
      
      // Show success message
      alert('Time atribuído com sucesso!');
    } catch (error) {
      console.error('❌ Error assigning team:', error);
      setError('Erro ao atribuir time. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedTeamId(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const currentTeam = conversation.meta?.team;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Atribuir Time
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conversa #{conversation.id} - {conversation.contact.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Team Info */}
          {currentTeam && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                Time Atual
              </h4>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {currentTeam.name}
                </span>
                {currentTeam.description && (
                  <span className="text-blue-600 dark:text-blue-400 text-sm">
                    - {currentTeam.description}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Selecionar Time
            </label>
            
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* No Team Option */}
                <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="team"
                    value=""
                    checked={selectedTeamId === null}
                    onChange={() => setSelectedTeamId(null)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Nenhum Time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Remover atribuição de time
                    </p>
                  </div>
                </label>

                {/* Team Options */}
                {teams.map((team) => (
                  <label
                    key={team.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      checked={selectedTeamId === team.id}
                      onChange={() => setSelectedTeamId(team.id)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {team.name}
                      </p>
                      {team.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {team.description}
                        </p>
                      )}
                    </div>
                    {team.id === currentTeam?.id && (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />
                    )}
                  </label>
                ))}

                {teams.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhum time disponível
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isSaving || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Salvando...' : 'Atribuir Time'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamAssignmentModal;