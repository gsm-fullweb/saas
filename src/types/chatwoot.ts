export interface User {
  id: number;
  name: string;
  email: string;
  role: 'administrator' | 'agent';
  avatar_url?: string;
  availability_status: 'online' | 'busy' | 'offline';
}

export interface Contact {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  thumbnail?: string;
  identifier?: string;
  blocked?: boolean;
  additional_attributes?: any;
  custom_attributes?: any;
  last_activity_at?: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  account_id: number;
  inbox_id: number;
  uuid?: string;
  status: 'open' | 'resolved' | 'pending' | 'snoozed';
  assignee_id?: number;
  assignee?: User;
  contact: Contact;
  meta?: {
    sender: Contact;
    channel: string;
    assignee?: User;
    team?: Team;
    hmac_verified: boolean;
  };
  messages_count: number;
  messages?: Message[];
  last_activity_at: string;
  last_non_activity_message?: Message;
  created_at: string;
  updated_at: string;
  timestamp?: number;
  first_reply_created_at?: string;
  labels: Label[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  waiting_since?: string;
  waiting_since?: number;
  first_reply_created_at?: string;
  unread_count: number;
  additional_attributes?: any;
  custom_attributes?: any;
  agent_last_seen_at?: number;
  assignee_last_seen_at?: number;
  contact_last_seen_at?: number;
  can_reply?: boolean;
  muted?: boolean;
  snoozed_until?: string | null;
  sla_policy_id?: number | null;
}

export interface Message {
  id: number;
  content: string;
  processed_message_content?: string;
  message_type: 'incoming' | 'outgoing' | 'activity' | 'template' | number;
  message_type: number;
  created_at: string;
  updated_at: string;
  conversation_id: number;
  account_id: number;
  inbox_id: number;
  private: boolean;
  status: string;
  source_id?: string;
  content_type: string;
  content_attributes?: any;
  sender_type?: string;
  sender_id?: number;
  external_source_ids?: any;
  additional_attributes?: any;
  sentiment?: any;
  sender?: User | Contact;
  attachments?: Attachment[];
  conversation?: any;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  allow_auto_assign: boolean;
  account_id: number;
  is_member: boolean;
}

export interface Label {
  id: number;
  title: string;
  description?: string;
  color: string;
  show_on_sidebar: boolean;
}

export interface Attachment {
  id: number;
  message_id: number;
  file_type: string;
  account_id: number;
  extension?: string;
  data_url: string;
  thumb_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
}

export interface Note {
  id: number;
  content: string;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  open_conversations: number;
  resolved_conversations: number;
  pending_conversations: number;
  snoozed_conversations: number;
  agents_online: number;
  avg_response_time: number;
  conversations_without_reply: number;
  total_conversations_today: number;
  resolution_rate: number;
}