const PROXY_BASE_URL = 'https://api.chathook.com.br/api/chatwoot-proxy.php';
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

class ChatwootAPI {
  private accountId: number;
  private useCorsProxy: boolean;

  constructor(accountId: number) {
    this.accountId = accountId;
    this.useCorsProxy = false; // Pode ser ativado se necessário
  }

  // Função utilitária para extrair dados de diferentes estruturas de resposta
  private extractDataFromResponse(data: any, endpoint: string): any[] {
    console.log(`🔍 Extracting data from ${endpoint} response:`, data);
    
    // Estrutura 1: { data: { payload: [...] } }
    if (data?.data?.payload && Array.isArray(data.data.payload)) {
      console.log(`📦 ${endpoint}: Found data.data.payload structure`);
      return data.data.payload;
    }
    
    // Estrutura 2: { data: [...] }
    if (data?.data && Array.isArray(data.data)) {
      console.log(`📦 ${endpoint}: Found data structure`);
      return data.data;
    }
    
    // Estrutura 3: { payload: [...] }
    if (data?.payload && Array.isArray(data.payload)) {
      console.log(`📦 ${endpoint}: Found payload structure`);
      return data.payload;
    }
    
    // Estrutura 4: { agents: [...] }, { contacts: [...] }, etc.
    const possibleKeys = ['agents', 'contacts', 'teams', 'inboxes', 'conversations', 'messages'];
    for (const key of possibleKeys) {
      if (data?.[key] && Array.isArray(data[key])) {
        console.log(`📦 ${endpoint}: Found ${key} structure`);
        return data[key];
      }
    }
    
    // Estrutura 5: Array direto
    if (Array.isArray(data)) {
      console.log(`📦 ${endpoint}: Found direct array structure`);
      return data;
    }
    
    // Estrutura 6: { data: { agents: [...] } }, { data: { contacts: [...] } }, etc.
    if (data?.data && typeof data.data === 'object') {
      for (const key of possibleKeys) {
        if (data.data[key] && Array.isArray(data.data[key])) {
          console.log(`📦 ${endpoint}: Found data.${key} structure`);
          return data.data[key];
        }
      }
    }
    
    console.warn(`⚠️ ${endpoint}: Unknown data structure, returning empty array`);
    console.log('🔍 Full response structure:', JSON.stringify(data, null, 2));
    return [];
  }

  // Mock data for development when proxy is unavailable
  private getMockConversations() {
    return [
      {
        id: 93,
        status: 'resolved',
        meta: {
          sender: {
            id: 91,
            name: 'Thais CVD',
            phone_number: '+5511975418323',
            email: null,
            thumbnail: '',
            additional_attributes: {},
            availability_status: 'offline'
          },
          assignee: {
            id: 2,
            name: 'Julia Braz Portela',
            email: 'julia.fullweb@gmail.com',
            role: 'agent',
            availability_status: 'offline',
            thumbnail: ''
          },
          channel: 'Channel::Api'
        },
        messages: [
          {
            id: 1648,
            content: 'Conversa foi marcada como resolvida por RICHARD WAGNER PORTELA',
            message_type: 2,
            created_at: 1752766438
          }
        ],
        labels: ['VIP'],
        unread_count: 0,
        messages_count: 5,
        created_at: 1752684300,
        updated_at: 1752766438,
        last_activity_at: 1752766438,
        assignee_id: 2,
        account_id: 1,
        inbox_id: 1
      },
      {
        id: 8,
        status: 'open',
        meta: {
          sender: {
            id: 8,
            name: 'Bruna Cichella Dal Soler',
            phone_number: '+554896960862',
            email: null,
            thumbnail: 'https://fullweb-chatwoot.n1n956.easypanel.host/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBFdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--48889afde3c8f7be9f33679f49671bea4bcb2dcb/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZvdyIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--91b60f7a00bb1094f2414f1a1700189ef49cdc70/491866738_746769961330034_7460552964069383534_n.jpg',
            additional_attributes: {},
            availability_status: 'offline'
          },
          assignee: {
            id: 1,
            name: 'RICHARD WAGNER PORTELA',
            email: 'richard.fullweb@gmail.com',
            role: 'administrator',
            availability_status: 'online',
            thumbnail: 'https://fullweb-chatwoot.n1n956.easypanel.host/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fae15165e870ce78c5d341e816f388fdfe5c666c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZvdyIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--3e97bcfdd34448078029e7818e588fd4b00e2e44/51f5f6cdc52c5752bb42e6cbabe94d54.png'
          },
          team: {
            id: 2,
            name: 'suporte',
            description: 'Suporte'
          },
          channel: 'Channel::Api'
        },
        messages: [
          {
            id: 1637,
            content: 'Atribuído a RICHARD WAGNER PORTELA via suporte por RICHARD WAGNER PORTELA',
            message_type: 2,
            created_at: 1752760166
          }
        ],
        labels: [],
        unread_count: 0,
        messages_count: 12,
        created_at: 1751837905,
        updated_at: 1752760183,
        last_activity_at: 1752760166,
        assignee_id: 1,
        account_id: 1,
        inbox_id: 1
      },
      {
        id: 45,
        status: 'pending',
        meta: {
          sender: {
            id: 45,
            name: 'Carlos Silva',
            phone_number: '+5511987654321',
            email: 'carlos@email.com',
            thumbnail: '',
            additional_attributes: {},
            availability_status: 'offline'
          },
          assignee: {
            id: 2,
            name: 'Julia Braz Portela',
            email: 'julia.fullweb@gmail.com',
            role: 'agent',
            availability_status: 'offline',
            thumbnail: ''
          },
          channel: 'Channel::Api'
        },
        messages: [],
        labels: ['urgente'],
        unread_count: 2,
        messages_count: 3,
        created_at: 1752700000,
        updated_at: 1752750000,
        last_activity_at: 1752750000,
        assignee_id: 2,
        account_id: 1,
        inbox_id: 1
      },
      {
        id: 67,
        status: 'snoozed',
        meta: {
          sender: {
            id: 67,
            name: 'Ana Costa',
            phone_number: '+5511123456789',
            email: null,
            thumbnail: '',
            additional_attributes: {},
            availability_status: 'offline'
          },
          assignee: null,
          channel: 'Channel::Api'
        },
        messages: [],
        labels: ['follow-up'],
        unread_count: 0,
        messages_count: 1,
        created_at: 1752600000,
        updated_at: 1752650000,
        last_activity_at: 1752650000,
        assignee_id: null,
        account_id: 1,
        inbox_id: 1
      }
    ];
  }

  private getMockAgents() {
    return [
      {
        id: 1,
        name: 'RICHARD WAGNER PORTELA',
        email: 'richard.fullweb@gmail.com',
        role: 'administrator',
        availability_status: 'online',
        thumbnail: 'https://fullweb-chatwoot.n1n956.easypanel.host/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fae15165e870ce78c5d341e816f388fdfe5c666c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZvdyIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--3e97bcfdd34448078029e7818e588fd4b00e2e44/51f5f6cdc52c5752bb42e6cbabe94d54.png'
      },
      {
        id: 2,
        name: 'Julia Braz Portela',
        email: 'julia.fullweb@gmail.com',
        role: 'agent',
        availability_status: 'offline',
        thumbnail: ''
      }
    ];
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${PROXY_BASE_URL}?endpoint=${encodeURIComponent(endpoint)}&account_id=${this.accountId}&debug=1`;
    
    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
      console.log('🔄 Making fetch request...');
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        mode: 'cors',
        ...options,
      });

      console.log('🔄 Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('🔄 Parsing JSON response...');
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.log('🔄 Error in request:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('⚠️ CORS Error: Proxy não acessível. Usando dados mock.');
        console.error('❌ CORS Error details:', error);
        throw new Error('CORS_ERROR: Proxy não acessível - usando dados mock');
      }
      throw error;
    }
  }

  // Conversations
  async getConversations(assigneeId?: number): Promise<any[]> {
    try {
      let endpoint = 'conversations';
      if (assigneeId) {
        endpoint += `?assignee_id=${assigneeId}`;
      }
      console.log('🔄 getConversations: Attempting to fetch from proxy...');
      const data = await this.request<any[]>(endpoint);
      console.log(`✅ Real conversations loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const conversations = this.extractDataFromResponse(data, 'conversations');
      console.log(`📊 Extracted ${conversations.length} conversations`);
      
      return conversations;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock conversations data');
      console.error('❌ Error details:', error);
      const mockData = this.getMockConversations();
      console.log('📦 Returning mock data:', mockData.length, 'conversations');
      if (assigneeId) {
        return mockData.filter(conv => conv.assignee_id === assigneeId);
      }
      return mockData;
    }
  }

  async getConversation(conversationId: number): Promise<any> {
    try {
      const data = await this.request(`conversations/${conversationId}`);
      console.log(`✅ Real conversation loaded: #${conversationId}`);
      return data;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock conversation data');
      const mockData = this.getMockConversations();
      return mockData.find(conv => conv.id === conversationId) || mockData[0];
    }
  }

  async updateConversation(conversationId: number, data: {
    status?: 'open' | 'resolved' | 'pending' | 'snoozed';
    assignee_id?: number;
    team_id?: number;
  }) {
    try {
      const result = await this.request(`conversations/${conversationId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      console.log(`✅ Real conversation updated: #${conversationId}`, data);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating conversation update', { conversationId, data });
      return { success: true, ...data };
    }
  }

  // Contacts
  async createContact(data: {
    name: string;
    email?: string;
    phone_number?: string;
    avatar_url?: string;
    identifier?: string;
    additional_attributes?: any;
  }) {
    try {
      const newContact = await this.request('contacts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('✅ Real contact created via API:', newContact);
      return newContact;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating contact creation', data);
      // Return mock contact for development
      return {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        avatar_url: data.avatar_url,
        identifier: data.identifier,
        additional_attributes: data.additional_attributes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        blocked: false,
        last_activity_at: Date.now()
      };
    }
  }

  // Contacts
  async getContacts() {
    try {
      const data = await this.request<any[]>('contacts');
      console.log(`✅ Real contacts loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const contacts = this.extractDataFromResponse(data, 'contacts');
      console.log(`📊 Extracted ${contacts.length} contacts`);
      
      return contacts;
    } catch (error) {
      if (error instanceof Error && error.message.includes('CORS_ERROR')) {
        console.warn('⚠️ CORS Error: Proxy não acessível. Usando dados mock para contacts.');
      } else {
        console.warn('⚠️ Proxy unavailable, using mock contacts data');
        console.error('❌ Error details:', error);
      }
      return [];
    }
  }

  // Inboxes
  async getInboxes() {
    try {
      const data = await this.request<any[]>('inboxes');
      console.log(`✅ Real inboxes loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const inboxes = this.extractDataFromResponse(data, 'inboxes');
      console.log(`📊 Extracted ${inboxes.length} inboxes`);
      
      return inboxes;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock inboxes data');
      console.error('❌ Error details:', error);
      return [
        {
          id: 1,
          name: 'WhatsApp',
          channel_type: 'Channel::Api',
          account_id: 1,
          enabled: true
        },
        {
          id: 2,
          name: 'Email',
          channel_type: 'Channel::Email',
          account_id: 1,
          enabled: true
        }
      ];
    }
  }

  // Messages
  async getMessages(conversationId: number) {
    try {
      const data = await this.request<any[]>(`conversations/${conversationId}/messages`);
      console.log(`✅ Real messages loaded for conversation #${conversationId}: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const messages = this.extractDataFromResponse(data, `messages-${conversationId}`);
      console.log(`📊 Extracted ${messages.length} messages for conversation #${conversationId}`);
      
      return messages;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock messages data');
      return [];
    }
  }

  async markConversationAsRead(conversationId: number) {
    try {
      const result = await this.request(`conversations/${conversationId}/update_last_seen`, {
        method: 'PATCH',
      });
      console.log(`✅ Real conversation marked as read: #${conversationId}`);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating mark as read', { conversationId });
      return { success: true };
    }
  }

  async markAllConversationsAsRead() {
    try {
      const result = await this.request('conversations/mark_all_as_read', {
        method: 'PATCH',
      });
      console.log('✅ All conversations marked as read');
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating mark all as read');
      return { success: true };
    }
  }

  async sendMessage(conversationId: number, content: string) {
    try {
      const result = await this.request(`conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          message_type: 'outgoing',
        }),
      });
      console.log(`✅ Real message sent to conversation #${conversationId}`);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating message send', { conversationId, content });
      return { success: true };
    }
  }

  // Labels
  async createLabel(data: { title: string; description?: string; color: string }) {
    try {
      const result = await this.request('labels', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('✅ Real label created:', result);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating label creation', data);
      return { success: true, ...data };
    }
  }

  async addLabelToConversation(conversationId: number, labelIds: number[]) {
    try {
      const result = await this.request(`conversations/${conversationId}/labels`, {
        method: 'POST',
        body: JSON.stringify({ labels: labelIds }),
      });
      console.log(`✅ Real labels added to conversation #${conversationId}`);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating label addition', { conversationId, labelIds });
      return { success: true };
    }
  }

  // Notes
  async addNote(conversationId: number, content: string) {
    try {
      const result = await this.request('notes', {
        method: 'POST',
        body: JSON.stringify({
          content,
          conversation_id: conversationId,
        }),
      });
      console.log(`✅ Real note added to conversation #${conversationId}`);
      return result;
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, simulating note addition', { conversationId, content });
      return { success: true };
    }
  }

  // Teams
  async getTeams() {
    try {
      const data = await this.request<any[]>('teams');
      console.log(`✅ Real teams loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const teams = this.extractDataFromResponse(data, 'teams');
      console.log(`📊 Extracted ${teams.length} teams`);
      
      return teams;
    } catch (error) {
      if (error instanceof Error && error.message.includes('CORS_ERROR')) {
        console.warn('⚠️ CORS Error: Proxy não acessível. Usando dados mock para teams.');
      } else {
        console.warn('⚠️ Proxy unavailable, using mock teams data');
        console.error('❌ Error details:', error);
      }
      return [
        { 
          id: 1, 
          name: 'Vendas', 
          description: 'Equipe de Vendas', 
          allow_auto_assign: true,
          account_id: 1,
          is_member: true
        },
        { 
          id: 2, 
          name: 'Suporte', 
          description: 'Equipe de Suporte Técnico', 
          allow_auto_assign: true,
          account_id: 1,
          is_member: true
        },
        { 
          id: 3, 
          name: 'Atendimento', 
          description: 'Atendimento ao Cliente', 
          allow_auto_assign: false,
          account_id: 1,
          is_member: true
        }
      ];
    }
  }

  // Agents
  async getAgents() {
    try {
      const data = await this.request<any[]>('agents');
      console.log(`✅ Real agents loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      
      // Usar a função utilitária para extrair dados
      const agents = this.extractDataFromResponse(data, 'agents');
      console.log(`📊 Extracted ${agents.length} agents`);
      
      return agents;
    } catch (error) {
      if (error instanceof Error && error.message.includes('CORS_ERROR')) {
        console.warn('⚠️ CORS Error: Proxy não acessível. Usando dados mock para agents.');
      } else {
        console.warn('⚠️ Proxy unavailable, using mock agents data');
        console.error('❌ Error details:', error);
      }
      return this.getMockAgents();
    }
  }
}

export default ChatwootAPI;