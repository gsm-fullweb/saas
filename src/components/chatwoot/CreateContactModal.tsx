import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Save, Building, MapPin, Calendar } from 'lucide-react';
import { Contact } from '../../types/chatwoot';
import ChatwootAPI from '../../services/chatwootApi';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationData?: {
    name: string;
    email?: string;
    phone_number?: string;
    avatar_url?: string;
    identifier?: string;
    additional_attributes?: any;
  };
  onContactCreated: (contact: Contact) => void;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  conversationData,
  onContactCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    avatar_url: '',
    identifier: '',
    company: '',
    location: '',
    notes: '',
    custom_attributes: {} as any
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const api = new ChatwootAPI(1);

  // Pre-fill form with conversation data
  useEffect(() => {
    if (conversationData && isOpen) {
      setFormData({
        name: conversationData.name || '',
        email: conversationData.email || '',
        phone_number: conversationData.phone_number || '',
        avatar_url: conversationData.avatar_url || '',
        identifier: conversationData.identifier || '',
        company: conversationData.additional_attributes?.company || '',
        location: conversationData.additional_attributes?.location || '',
        notes: '',
        custom_attributes: conversationData.additional_attributes || {}
      });
    }
  }, [conversationData, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Creating contact with data:', formData);

      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone_number: formData.phone_number.trim(),
        avatar_url: formData.avatar_url.trim() || undefined,
        identifier: formData.identifier.trim() || undefined,
        additional_attributes: {
          ...formData.custom_attributes,
          company: formData.company.trim() || undefined,
          location: formData.location.trim() || undefined,
          notes: formData.notes.trim() || undefined,
          created_from: 'conversation',
          created_at: new Date().toISOString()
        }
      };

      const newContact = await api.createContact(contactData);
      console.log('✅ Contact created successfully:', newContact);

      onContactCreated(newContact);
      handleClose();
      
      // Show success message
      alert('Contato criado com sucesso!');
    } catch (error) {
      console.error('❌ Error creating contact:', error);
      alert('Erro ao criar contato. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      avatar_url: '',
      identifier: '',
      company: '',
      location: '',
      notes: '',
      custom_attributes: {}
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Criar Novo Contato
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preencha os dados do contato
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Informações Básicas
            </h3>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="Nome completo do contato"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone_number ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="+55 11 99999-9999"
                />
              </div>
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Informações Adicionais
            </h3>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Localização
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cidade, Estado"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais sobre o contato..."
              />
            </div>
          </div>

          {/* Preview */}
          {conversationData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                Dados da Conversa
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Identificador:</strong> {conversationData.identifier || 'N/A'}</p>
                <p><strong>Origem:</strong> Conversa #{conversationData.identifier?.split('@')[0] || 'N/A'}</p>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
            <span>{isLoading ? 'Criando...' : 'Criar Contato'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContactModal;