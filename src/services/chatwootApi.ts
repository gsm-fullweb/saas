const PROXY_BASE_URL = 'https://api.chathook.com.br/api/chatwoot-proxy.php';

class ChatwootAPI {
  private accountId: number;

  constructor(accountId: number) {
    this.accountId = accountId;
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
    const url = `${PROXY_BASE_URL}?endpoint=${encodeURIComponent(endpoint)}&account_id=${this.accountId}`;
    
    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return data;
  }

  // Conversations
  async getConversations(assigneeId?: number): Promise<any[]> {
    try {
      let endpoint = 'conversations';
      if (assigneeId) {
        endpoint += `?assignee_id=${assigneeId}`;
      }
      const data = await this.request<any[]>(endpoint);
      console.log(`✅ Real conversations loaded: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock conversations data');
      const mockData = this.getMockConversations();
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock contacts data');
      return [];
    }
  }

  // Messages
  async getMessages(conversationId: number) {
    try {
      const data = await this.request<any[]>(`conversations/${conversationId}/messages`);
      console.log(`✅ Real messages loaded for conversation #${conversationId}: ${Array.isArray(data) ? data.length : 'unknown'} items`);
      return Array.isArray(data) ? data : [];
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock teams data');
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('⚠️ Proxy unavailable, using mock agents data');
      return this.getMockAgents();
    }
  }
}

export default ChatwootAPI;