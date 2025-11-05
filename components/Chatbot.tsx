
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamGeminiResponse } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon, SparklesIcon, UserIcon, BotIcon } from './icons';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        
        const modelMessage: ChatMessage = { role: 'model', content: '' };
        setMessages(prev => [...prev, modelMessage]);

        await streamGeminiResponse(newMessages, isThinkingMode, (chunk) => {
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.role === 'model') {
                    const updatedMessage = { ...lastMessage, content: lastMessage.content + chunk };
                    return [...prev.slice(0, -1), updatedMessage];
                }
                return prev;
            });
        });

        setIsLoading(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-cyan-500/80 hover:bg-cyan-400 text-white p-4 rounded-full shadow-lg shadow-cyan-500/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                aria-label="Open Chat"
            >
                <ChatIcon />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[70vh] flex flex-col bg-black/50 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
                <h3 className="text-lg font-semibold text-cyan-200">Cosmic Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-400"><BotIcon /></div>}
                        <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600/50 text-white' : 'bg-gray-800/50 text-gray-300'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300"><UserIcon /></div>}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-400"><BotIcon /></div>
                        <div className="max-w-[80%] rounded-xl p-3 text-sm bg-gray-800/50 text-gray-300">
                           <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="thinking-mode-toggle" className="flex items-center cursor-pointer text-xs text-gray-300">
                        <SparklesIcon className={`w-4 h-4 mr-2 transition-colors ${isThinkingMode ? 'text-cyan-400' : 'text-gray-500'}`} />
                        Thinking Mode
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="thinking-mode-toggle" 
                            id="thinking-mode-toggle"
                            checked={isThinkingMode}
                            onChange={() => setIsThinkingMode(!isThinkingMode)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                         <label htmlFor="thinking-mode-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                    <style>{`
                        .toggle-checkbox:checked { right: 0; border-color: #22d3ee; }
                        .toggle-checkbox:checked + .toggle-label { background-color: #0891b2; }
                    `}</style>
                </div>
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        rows={1}
                        className="w-full bg-gray-900/70 border border-cyan-800/50 rounded-lg py-2 pl-3 pr-12 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                    />
                    <button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-cyan-400 hover:bg-cyan-900/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
