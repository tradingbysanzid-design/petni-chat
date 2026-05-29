import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FiSend, FiPhone, FiVideo, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';

function ChatPage({ user }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [gender, setGender] = useState('ভूत');
  const [ageRange, setAgeRange] = useState('18-19');
  const [chatMode, setChatMode] = useState('Chat with Random');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    socketRef.current = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000');

    socketRef.current.on('matched', (data) => {
      setSessionId(data.sessionId);
      setPartnerName(`Stranger ${data.partnerId}`);
      setMessages([]);
      setLoading(false);
    });

    socketRef.current.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socketRef.current.on('user-typing', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    });

    socketRef.current.on('chat-ended', (data) => {
      endChat();
    });

    socketRef.current.on('error', (data) => {
      alert(data.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setLoading(true);
    socketRef.current.emit('join-queue', {
      userId: user.id,
      gender,
      ageRange,
      chatMode
    });
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !sessionId) return;

    socketRef.current.emit('send-message', {
      sessionId,
      content: inputValue,
      userId: user.id
    });

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender_id: user.id,
      content: inputValue,
      created_at: new Date()
    }]);

    setInputValue('');
  };

  const endChat = () => {
    if (sessionId) {
      socketRef.current.emit('end-chat', {
        sessionId,
        userId: user.id
      });
    }
    setSessionId(null);
    setMessages([]);
    setPartnerName('');
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Start Anonymous Chat</h2>

            {/* Preferences Modal */}
            <div className="space-y-4 text-left mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input"
                >
                  <option value="ভूत">👻 ভूत (Male)</option>
                  <option value="पेत्नी">🟣 पेत्नी (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Age Range</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="input"
                >
                  <option value="18-19">18-19</option>
                  <option value="20-22">20-22</option>
                  <option value="23-24">23-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Chat Mode</label>
                <select
                  value={chatMode}
                  onChange={(e) => setChatMode(e.target.value)}
                  className="input"
                >
                  <option value="Chat with Random">Chat with Random (Free)</option>
                  <option value="Premium Age Search">Premium Age Search (1 Stone)</option>
                </select>
              </div>
            </div>

            <button
              onClick={startChat}
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Searching...' : 'Find Stranger'}
            </button>

            <p className="text-gray-400 text-sm mt-4">
              Searching for a real stranger… Please wait
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-purple-500 border-opacity-30 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{partnerName}</h2>
          <p className="text-sm text-gray-400">
            {typing ? 'typing...' : 'Online'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline p-2">
            <FiPhone size={20} />
          </button>
          <button className="btn btn-outline p-2">
            <FiVideo size={20} />
          </button>
          <button className="btn btn-outline p-2">
            <FiMoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-900 to-gray-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender_id === user.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <span className="animate-pulse">typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-purple-500 border-opacity-30 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="input flex-1"
            maxLength={200}
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary p-2"
          >
            <FiSend size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {inputValue.length}/200 characters
        </div>
      </div>

      {/* End Chat Button */}
      <div className="bg-gray-900 p-4 border-t border-purple-500 border-opacity-30 text-center">
        <button
          onClick={endChat}
          className="btn btn-secondary px-6"
        >
          End Chat
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
