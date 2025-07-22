import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft,
  Download,
  Eye,
  Clock,
  Check,
  CheckCheck,
  User,
  UserPlus
} from 'lucide-react';
import { Conversation, Message, User as UserType } from '../../types/chatwoot';
import CreateContactModal from './CreateContactModal';

interface ChatInterfaceProps {
  conversation: Conversation;
  currentUser: UserType;
  onClose: () => void;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  onUpdateConversation: (conversationId: number, updates: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  currentUser,
  onClose,
  onSendMessage,
  onUpdateConversation
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [isSending, setIsSending] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    setIsSending(true);
    try {
      await onSendMessage(message, attachments);
      
      // Add message to local state for immediate UI update
      const newMessage: Message = {
        id: Date.now(),
        content: message,
        message_type: 'outgoing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        conversation_id: conversation.id,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        private: false,
        status: 'sent',
        content_type: 'text',
        sender_type: 'User',
        sender_id: currentUser.id,
        sender: currentUser,
        attachments: attachments.map((file, index) => ({
          id: Date.now() + index,
          message_id: Date.now(),
          file_type: file.type.startsWith('image/') ? 'image' : 'file',
          account_id: conversation.account_id,
          data_url: URL.createObjectURL(file),
          file_size: file.size,
          extension: file.name.split('.').pop()
        }))
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.sender_type === 'Contact') return null;
    
    switch (message.status) {
      case 'sent': return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read': return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯'];

  const handleCreateContact = () => {
    setShowCreateContact(true);
  };

  const handleContactCreated = (contact: any) => {
    console.log('Contact created:', contact);
    // You could update the conversation with the new contact ID here
    // onUpdateConversation(conversation.id, { contact_id: contact.id });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
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
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {conversation.contact.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {conversation.contact.phone_number || 'Cliente'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCreateContact}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Criar Contato"
          >
            <UserPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((msg, index) => {
              const isOutgoing = msg.sender_type === 'User';
              const isConsecutive = index > 0 && 
                dateMessages[index - 1].sender_type === msg.sender_type &&
                new Date(msg.created_at).getTime() - new Date(dateMessages[index - 1].created_at).getTime() < 300000; // 5 minutes
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOutgoing ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    {!isOutgoing && !isConsecutive && (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {conversation.contact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOutgoing && isConsecutive && <div className="w-8" />}
                    
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOutgoing
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      } ${isConsecutive ? (isOutgoing ? 'rounded-tr-2xl' : 'rounded-tl-2xl') : ''}`}
                    >
                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-2 space-y-2">
                          {msg.attachments.map((attachment) => (
                            <div key={attachment.id} className="relative">
                              {attachment.file_type === 'image' ? (
                                <img
                                  src={attachment.data_url}
                                  alt="Attachment"
                                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(attachment.data_url, '_blank')}
                                />
                              ) : (
                                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Paperclip className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      Arquivo.{attachment.extension}
                                    </p>
                                    <p className="text-xs opacity-75">
                                      {(attachment.file_size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => window.open(attachment.data_url, '_blank')}
                                    className="p-1 hover:bg-white/20 rounded"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Message Content */}
                      {msg.content && (
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}
                      
                      {/* Message Time and Status */}
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${isOutgoing ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span className="text-xs">
                          {formatTime(msg.created_at)}
                        </span>
                        {getMessageStatus(msg)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {conversation.contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Paperclip className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="w-full px-4 py-2 pr-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
              rows={1}
            />
            
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 bottom-2 p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setMessage(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={(!message.trim() && attachments.length === 0) || isSending}
            className={`p-2 rounded-full transition-all ${
              (message.trim() || attachments.length > 0) && !isSending
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>

      {/* Create Contact Modal */}
      <CreateContactModal
        isOpen={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        conversationData={{
          name: conversation.contact.name,
          email: conversation.contact.email,
          phone_number: conversation.contact.phone_number,
          avatar_url: conversation.contact.thumbnail,
          identifier: conversation.contact.identifier,
          additional_attributes: conversation.contact.additional_attributes
        }}
        onContactCreated={handleContactCreated}
      />
    </>
  );
};

export default ChatInterface;