"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "bot";
    text: string;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Hello! I'm Sentinel AI. Need advice on prevention or identifying symptoms?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5328/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: "bot", text: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting to the server." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "bot", text: "Network error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white border border-border-soft rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="p-4 bg-charcoal text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-bold">Sentinel AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-primary text-white ml-auto"
                                    : "bg-white border border-border-soft text-charcoal mr-auto"
                            )}>
                                {msg.text.split('\n').map((line, i) => {
                                    // Handle Headers (###)
                                    if (line.trim().startsWith('###')) {
                                        return <p key={i} className="font-bold mt-3 mb-1 text-base">{line.replace(/^###\s*/, '')}</p>;
                                    }

                                    // Handle regular lines with bolding (**text**)
                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                    return (
                                        <p key={i} className={`min-h-[1.2rem] ${line.trim().startsWith('-') ? 'pl-2' : ''}`}>
                                            {parts.map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                    );
                                })}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white border border-border-soft rounded-2xl p-3 mr-auto w-16 flex items-center justify-center gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-border-soft flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about Dengue..."
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-72 p-5 bg-white border border-border-soft rounded-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="size-2 bg-risk-low rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">AI Assistant Online</span>
                    </div>
                    <p className="text-sm leading-relaxed text-charcoal">&quot;Hello! I&apos;m Sentinel AI. Need advice on prevention or identifying symptoms?&quot;</p>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="size-16 rounded-full bg-charcoal text-white shadow-xl flex items-center justify-center hover:scale-105 hover:bg-black active:scale-95 transition-all relative"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 size-4 bg-risk-low rounded-full border-4 border-slate-50"></span>
                )}
            </button>
        </div>
    );
}
