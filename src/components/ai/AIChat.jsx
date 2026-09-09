import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle,
  Code
} from 'lucide-react';
import { processAIQuery } from '../../utils/calculations';
import { useExpenses } from '../../context/ExpenseContext';

const SUGGESTED_QUESTIONS = [
  "Where am I spending the most?",
  "How much have I spent this month?",
  "How much can I spend per day?",
  "What category should I watch?",
  "Summarize my spending."
];

export const AIChat = () => {
  const { expenses, budget, settings } = useExpenses();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am **SpendWise AI**. Ask me questions about your spending, category breakdowns, or daily budgets!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate response delay for natural UX
    setTimeout(() => {
      // Analytical processing based on user expense data
      const aiReplyText = processAIQuery(query, expenses, budget, settings.currency);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* HEADER */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-xl shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">SpendWise AI</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 rounded-md border border-brand-200 dark:border-brand-800">
                AI Insights
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions about your spending habits and budget goals.</p>
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES BODY */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                  AI
                </div>
              )}

              <div
                className={`max-w-lg rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isAI
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700'
                    : 'bg-brand-600 text-white rounded-tr-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text.split('\n').map((line, idx) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className={isAI ? 'text-slate-900 dark:text-white font-bold' : 'font-extrabold'}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <span className={`block text-[10px] mt-1.5 text-right ${isAI ? 'text-slate-400' : 'text-brand-200'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
              <span className="ml-1">Analyzing spending data...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* SUGGESTED QUESTIONS PILLS */}
      <div className="p-3 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap pl-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Suggested:
          </span>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question about your spending..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
