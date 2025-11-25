import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { messageService, startMessagePolling } from '../../services/messages';
import { useNotification } from '../../contexts/NotificationContext';
import { Message, Conversation } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { safeFormatDateObject } from '../../utils/dateUtils';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        let convs = await messageService.getConversations(user.id);
        
        // If no conversations exist, create a default one
        if (convs.length === 0) {
          const newConv = await messageService.getOrCreateConversation(user.id);
          convs = [newConv];
          setConversations(convs);
          setSelectedConversation(newConv.id);
        } else {
          setConversations(convs);
          if (!selectedConversation) {
            setSelectedConversation(convs[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // Try to create a default conversation on error
        try {
          const newConv = await messageService.getOrCreateConversation(user.id);
          setConversations([newConv]);
          setSelectedConversation(newConv.id);
        } catch (createError) {
          console.error('Failed to create conversation:', createError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const msgs = await messageService.getMessages(selectedConversation);
        setMessages(msgs);
        if (user) {
          await messageService.markAsRead(selectedConversation, user.id);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      }
    };

    loadMessages();

    // Start polling for new messages
    const stopPolling = startMessagePolling(selectedConversation, (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      stopPolling();
    };
  }, [selectedConversation, user]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !user || isSending) return;

    const textToSend = messageText.trim();
    setMessageText(''); // Clear input immediately for better UX
    setIsSending(true);

    try {
      // If no conversation selected, create one
      let convId = selectedConversation;
      if (!convId) {
        const newConv = await messageService.getOrCreateConversation(user.id);
        convId = newConv.id;
        setSelectedConversation(convId);
        setConversations([newConv]);
      }

      const sentMessage = await messageService.sendMessage(
        convId,
        user.id,
        user.name,
        textToSend
      );
      
      // Add message to local state immediately
      setMessages(prev => [...prev, sentMessage]);
      
      // Refresh conversations to update last message
      const updatedConvs = await messageService.getConversations(user.id);
      setConversations(updatedConvs);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('Failed to send message', 'error');
      setMessageText(textToSend); // Restore text on error
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Chat with the registrar office</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Conversations</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`
                    w-full p-4 text-left hover:bg-gray-50 transition-colors
                    ${selectedConversation === conv.id ? 'bg-gold-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      {conv.adminId ? 'Registrar Office' : 'Support'}
                    </span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="info">{conv.unreadCount}</Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage.content}
                    </p>
                  )}
                  {!conv.lastMessage && (
                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">No conversations yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (user) {
                      try {
                        const newConv = await messageService.getOrCreateConversation(user.id);
                        setConversations([newConv]);
                        setSelectedConversation(newConv.id);
                      } catch (error) {
                        showToast('Failed to create conversation', 'error');
                      }
                    }
                  }}
                >
                  Start Conversation
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="p-0 flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {selectedConversation 
                  ? (conversations.find(c => c.id === selectedConversation)?.adminId ? 'Registrar Office' : 'Support')
                  : 'Start a Conversation'
                }
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[70%] rounded-2xl px-4 py-2
                        ${msg.senderId === user?.id
                          ? 'bg-gold-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                        }
                      `}
                    >
                      <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-gold-100' : 'text-gray-500'}`}>
                        {safeFormatDateObject(new Date(msg.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={user ? "Type your message..." : "Please log in to send messages"}
                  className="flex-1"
                  disabled={!user || isSending}
                />
                <Button 
                  variant="primary" 
                  onClick={handleSend}
                  disabled={!messageText.trim() || !user || isSending}
                  isLoading={isSending}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

