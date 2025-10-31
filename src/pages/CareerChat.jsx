import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Trash2, MessageCircle, Bot, User, 
  Loader2, Sparkles, Brain, Target, TrendingUp
} from 'lucide-react';

const CareerChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    setMessages([{
      user: '',
      bot: "Hi! I'm your AI career guidance assistant. I'm here to help you with career advice, job search tips, skill development, and professional growth. How can I assist you today?",
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Add user message to UI immediately
      setMessages(prev => [...prev, { 
        user: userMessage, 
        bot: '', 
        timestamp: new Date().toISOString() 
      }]);

      // Call FastAPI backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update messages with bot response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          user: userMessage,
          bot: data.response,
          timestamp: new Date().toISOString()
        };
        return newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update with error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          user: userMessage,
          bot: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running on http://localhost:8000 and try again.",
          timestamp: new Date().toISOString()
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await fetch('http://localhost:8000/chat/history', { method: 'DELETE' });
      setMessages([{
        user: '',
        bot: "Chat history cleared! How can I help you with your career today?",
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-800">Career AI Chat</h1>
                <p className="text-sm text-secondary-600">Your personal career guidance assistant</p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <div key={index} className="space-y-2">
                {/* User Message */}
                {msg.user && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 20, y: -10 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] bg-primary-500 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{msg.user}</p>
                          <p className="text-xs opacity-75 mt-1">{formatTime(msg.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bot Message */}
                {msg.bot && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-secondary-200">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-secondary-800">Career AI</span>
                            <Sparkles className="w-3 h-3 text-purple-500" />
                          </div>
                          <p className="text-sm text-secondary-700 whitespace-pre-wrap">{msg.bot}</p>
                          <p className="text-xs text-secondary-500 mt-1">{formatTime(msg.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Loading Message */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-secondary-200">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    <span className="text-sm text-secondary-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about careers, job search, skills, or professional growth..."
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                rows="3"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "What career paths suit my skills?",
              "How to improve my resume?",
              "Interview preparation tips",
              "Salary negotiation advice"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setCurrentMessage(suggestion)}
                className="px-3 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full hover:bg-secondary-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerChat;


