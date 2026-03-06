import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Kss kss... Coucou ! Je suis Mimiqui, le petit fantôme de PokéVerse ! 👻💜", sender: 'bot' },
        { id: 2, text: "Pose-moi des questions sur les Pokémon, ou juste viens papoter avec moi ! 🖤✨", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        // User message
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputValue("");
        setIsTyping(true);

        try {
            // Envoyer au backend (sans les 2 premiers messages d'accueil qui sont statiques)
            const response = await axios.post('http://localhost:3000/api/chatbot', {
                messages: updatedMessages.slice(2) // On envoie seulement les messages de la conversation
            });

            const botMsg = {
                id: Date.now() + 1,
                text: response.data.reply,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Erreur chatbot:', error);
            const errorMsg = {
                id: Date.now() + 1,
                text: "Kss... Je suis un peu fatigué là... Réessaie dans un moment ! 👻💤",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="pointer-events-auto mb-4 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] flex flex-col bg-[#fff0f5] shadow-2xl overflow-hidden relative"
                        style={{
                            borderRadius: "30px",
                            border: "4px solid white",
                            boxShadow: "0 10px 40px -10px rgba(255,105,180,0.3)"
                        }}
                    >
                        {/* Header */}
                        <div className="bg-[#ffb7b2] p-4 flex items-center justify-between text-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-lg tracking-wide text-white drop-shadow-sm">Mimiqui</h3>
                                    <span className="flex items-center gap-1 text-[11px] opacity-90 font-medium bg-white/20 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_currentColor]" />
                                        En ligne
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                            >
                                <X size={22} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fff0f5] scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] px-4 py-3 text-sm font-medium shadow-sm",
                                            msg.sender === 'user'
                                                ? "bg-[#ffb7b2] text-white rounded-[20px] rounded-br-[4px]"
                                                : "bg-white text-gray-600 rounded-[20px] rounded-bl-[4px] border-2 border-pink-100"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-400 rounded-[20px] rounded-bl-[4px] border-2 border-pink-100 px-4 py-3 text-sm font-medium shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t-2 border-pink-100 flex gap-2 z-10">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Parle à Mimiqui..."
                                disabled={isTyping}
                                className="flex-1 bg-pink-50 border-2 border-transparent focus:border-pink-200 rounded-full px-4 py-2 text-sm text-gray-700 placeholder:text-pink-300 focus:outline-none transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="p-2.5 bg-[#ffb7b2] text-white rounded-full hover:bg-[#ff9e99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto relative z-10 transition-transform active:scale-95"
            >
                <img
                    src="/img/bot.png"
                    alt="Mimiqui Chatbot"
                    className="w-20 h-20 object-contain drop-shadow-xl"
                />
            </button>
        </div>
    );
};

export default Chatbot;
