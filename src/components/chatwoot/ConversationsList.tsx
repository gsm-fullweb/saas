import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, User, Clock, Tag, MessageSquare, Star, UserPlus, Users } from 'lucide-react';
import { Conversation, User as UserType } from '../../types/chatwoot';
import ChatInterface from './ChatInterface';
import CreateContactModal from './CreateContactModal';
import TeamAssignmentModal from './TeamAssignmentModal';

interface ConversationsListProps {
  conversations: Conversation[];
  agents: UserType[];
  onConversationClick: (conversation: Conversation) => void;
  onUpdateConversation: (conversationId: number, updates: any) => void;
  onAddNote: (conversationId: number) => void;
  onAddLabel: (conversationId: number) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  agents,
  onConversationClick,
  onUpdateConversation,
  onAddNote,
  onAddLabel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [selectedConversations, setSelectedConversations] = useState<number[]>([]);
  const [openChat, setOpenChat] = useState<Conversation | null>(null);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [selectedConversationForContact, setSelectedConversationForContact] = useState<Conversation | null>(null);
  const [showTeamAssignment, setShowTeamAssignment] = useState(false);
  const [selectedConversationForTeam, setSelectedConversationForTeam] = useState<Conversation | null>(null);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
                           (assigneeFilter === 'unassigned' && !conversation.assignee_id) ||
                           conversation.assignee_id?.toString() === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversations(prev => 
      prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const handleBulkStatusChange = (newStatus: string) => {
    selectedConversations.forEach(id => {
      onUpdateConversation(id, { status: newStatus });
    });
    setSelectedConversations([]);
  };

  const handleOpenChat = (conversation: Conversation) => {
    setOpenChat(conversation);
  };

  const handleCreateContact = (conversation: Conversation) => {
    setSelectedConversationForContact(conversation);
    setShowCreateContact(true);
  };

  const handleContactCreated = (contact: any) => {
    console.log('Contact created from conversation:', contact);
    // You could update the conversation with the new contact ID here
    // if (selectedConversationForContact) {
    //   onUpdateConversation(selectedConversationForContact.id, { contact_id: contact.id });
    // }
  };

  const handleTeamAssignment = (conversation: Conversation) => {
    setSelectedConversationForTeam(conversation);
    setShowTeamAssignment(true);
  };

  const handleTeamAssigned = (conversationId: number, teamId: number | null) => {
    console.log('Team assigned:', { conversationId, teamId });
    // Update the conversation in the parent component
    onUpdateConversation(conversationId, { team_id: teamId });
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    // Simulate API call to send message
    console.log('Sending message:', { content, attachments });
    
    // In real implementation, this would call the API
    // await api.sendMessage(openChat!.id, content, attachments);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
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

  // If chat is open, show chat interface
  if (openChat) {
    return (
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface
          conversation={openChat}
          currentUser={{
            id: 1,
            name: 'RICHARD WAGNER PORTELA',
            email: 'richard.fullweb@gmail.com',
            role: 'administrator',
            availability_status: 'online'
          }}
          onClose={() => setOpenChat(null)}
          onSendMessage={handleSendMessage}
          onUpdateConversation={onUpdateConversation}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value="open">Abertas</option>
            <option value="pending">Pendentes</option>
            <option value="snoozed">Pausadas</option>
            <option value="resolved">Resolvidas</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Agentes</option>
            <option value="unassigned">Não Atribuídas</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id.toString()}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedConversations.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-400">
                {selectedConversations.length} conversas selecionadas
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusChange('open')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Abrir
                </button>
                <button
                  onClick={() => handleBulkStatusChange('pending')}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Pendente
                </button>
                <button
                  onClick={() => handleBulkStatusChange('resolved')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resolver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversations Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedConversations(filteredConversations.map(c => c.id));
                      } else {
                        setSelectedConversations([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Última Mensagem</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Agente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Mensagens</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conversation) => (
                <tr
                  key={conversation.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedConversations.includes(conversation.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectConversation(conversation.id);
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {conversation.contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {conversation.contact.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          #{conversation.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTimeAgo(conversation.last_activity_at)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                      {getStatusLabel(conversation.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {conversation.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {conversation.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {conversation.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Não atribuída
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {conversation.messages_count}
                      </span>
                      {conversation.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenChat(conversation)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      >
                        Abrir
                      </button>
                      
                      <select
                        value={conversation.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateConversation(conversation.id, { status: e.target.value });
                        }}
                        className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                      >
                        <option value="open">Aberta</option>
                        <option value="pending">Pendente</option>
                        <option value="snoozed">Pausada</option>
                        <option value="resolved">Resolvida</option>
                      </select>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddNote(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Adicionar nota"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateContact(conversation);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Criar contato"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddLabel(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Adicionar etiqueta"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeamAssignment(conversation);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Atribuir time"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma conversa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </div>

      {/* Create Contact Modal */}
      <CreateContactModal
        isOpen={showCreateContact}
        onClose={() => {
          setShowCreateContact(false);
          setSelectedConversationForContact(null);
        }}
        conversationData={selectedConversationForContact ? {
          name: selectedConversationForContact.contact.name,
          email: selectedConversationForContact.contact.email,
          phone_number: selectedConversationForContact.contact.phone_number,
          avatar_url: selectedConversationForContact.contact.thumbnail,
          identifier: selectedConversationForContact.contact.identifier,
          additional_attributes: selectedConversationForContact.contact.additional_attributes
        } : undefined}
        onContactCreated={handleContactCreated}
      />

      {/* Team Assignment Modal */}
      <TeamAssignmentModal
        isOpen={showTeamAssignment}
        onClose={() => {
          setShowTeamAssignment(false);
          setSelectedConversationForTeam(null);
        }}
        conversation={selectedConversationForTeam!}
        onTeamAssigned={handleTeamAssigned}
      />
    </div>
  );
};

export default ConversationsList;