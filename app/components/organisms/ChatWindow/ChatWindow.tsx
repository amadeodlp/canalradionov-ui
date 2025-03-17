'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@components/atoms/Button/Button';
import { Input } from '@components/atoms/Input/Input';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isHost: boolean;
}

interface ChatWindowProps {
  broadcastId: string;
  isHost?: boolean;
  userName: string;
  userId: string;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  broadcastId,
  isHost = false,
  userName,
  userId,
  className = '',
}) => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  
  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Connect to chat WebSocket
  useEffect(() => {
    const socket = new WebSocket('wss://api.example.com/ws/chat');
    socketRef.current = socket;
    
    socket.onopen = () => {
      setIsConnected(true);
      
      // Join the chat room
      socket.send(JSON.stringify({
        action: 'joinChat',
        broadcastId,
        userId,
        userName,
        isHost
      }));
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        // New chat message
        const newMsg: ChatMessage = {
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: data.timestamp,
          isHost: data.isHost
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Scroll to bottom
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      } else if (data.type === 'userCount') {
        // Update user count
        setUserCount(data.count);
      } else if (data.type === 'history') {
        // Chat history
        setMessages(data.messages);
        
        // Scroll to bottom
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    socket.onclose = () => {
      setIsConnected(false);
    };
    
    // Cleanup
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [broadcastId, userId, userName, isHost]);
  
  // Send a message
  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'sendMessage',
        broadcastId,
        userId,
        userName,
        message: newMessage
      }));
      
      setNewMessage('');
    }
  };
  
  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`flex flex-col h-full bg-neutral-800 rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Live Chat</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white/60 text-sm">{userCount} online</span>
        </div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatRef}
        className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 opacity-50">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 14H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm">Be the first to say something!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.userId === userId 
                      ? 'bg-primary/20 text-white' 
                      : msg.isHost
                        ? 'bg-accent/20 text-white'
                        : 'bg-neutral-700/50 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${
                      msg.isHost ? 'text-accent' : 'text-white/80'
                    }`}>
                      {msg.isHost && '🎙️ '}{msg.userName}{msg.userId === userId ? ' (You)' : ''}
                    </span>
                    <span className="text-xs text-white/40 ml-2">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            fullWidth
          />
          <Button
            variant="primary"
            size="md"
            onClick={sendMessage}
            disabled={!isConnected || !newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
