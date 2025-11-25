import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

export const messageService = {
  async getOrCreateConversation(userId: string, adminId?: string): Promise<Conversation> {
    // Try to find existing conversation
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data: existing, error: fetchError } = await query.maybeSingle();

    if (existing && !fetchError) {
      // Get last message
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', existing.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        id: existing.id,
        userId: existing.user_id,
        adminId: existing.admin_id,
        lastMessage: lastMessage ? this.mapMessage(lastMessage) : undefined,
        unreadCount: existing.unread_count || 0,
        updatedAt: existing.updated_at,
      };
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        admin_id: adminId || null,
        unread_count: 0,
      })
      .select()
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    return {
      id: newConversation.id,
      userId: newConversation.user_id,
      adminId: newConversation.admin_id,
      unreadCount: 0,
      updatedAt: newConversation.updated_at,
    };
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user_id.eq.${userId},admin_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Get last message for each conversation
    const conversationsWithMessages = await Promise.all(
      data.map(async (conv) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: conv.id,
          userId: conv.user_id,
          adminId: conv.admin_id,
          lastMessage: lastMessage ? this.mapMessage(lastMessage) : undefined,
          unreadCount: conv.unread_count || 0,
          updatedAt: conv.updated_at,
        };
      })
    );

    return conversationsWithMessages;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((msg) => this.mapMessage(msg));
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    attachments?: Array<{ name: string; url: string; type: string }>
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_name: senderName,
        content,
        attachments: attachments || null,
        status: 'sent',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapMessage(data);
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    // Update all messages in conversation that are not from the user
    const { error: updateError } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('status', 'delivered');

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Reset unread count
    await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId);
  },

  // Real-time subscription for messages
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(this.mapMessage(payload.new));
        }
      )
      .subscribe();

    return channel;
  },

  // Real-time subscription for conversation updates
  subscribeToConversations(
    userId: string,
    callback: (conversation: Conversation) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const conv = payload.new as any;
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .maybeSingle();

          callback({
            id: conv.id,
            userId: conv.user_id,
            adminId: conv.admin_id,
            lastMessage: lastMessage ? this.mapMessage(lastMessage) : undefined,
            unreadCount: conv.unread_count || 0,
            updatedAt: conv.updated_at,
          });
        }
      )
      .subscribe();

    return channel;
  },

  // Helper to map database row to Message type
  mapMessage(data: any): Message {
    return {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      senderName: data.sender_name,
      content: data.content,
      attachments: data.attachments,
      status: data.status,
      timestamp: data.timestamp,
    };
  },
};

// Polling helper for real-time simulation (kept for backward compatibility)
export const startMessagePolling = (
  conversationId: string,
  callback: (messages: Message[]) => void,
  interval: number = 3000
): (() => void) => {
  let isPolling = true;

  const poll = async () => {
    if (!isPolling) return;
    const messages = await messageService.getMessages(conversationId);
    callback(messages);
    setTimeout(poll, interval);
  };

  poll();

  return () => {
    isPolling = false;
  };
};
