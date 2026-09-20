import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sendChat } from '@/lib/api';
import './AppPages.css';

/**
 * Chat Component
 * Web chat interface simulating WhatsApp customer conversations with KiranaGo's AI Agent.
 */
export default function Chat() {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Namaste! I am your KiranaGo AI Assistant. Send a customer order message (e.g. "Send 2 bags Atta and 1L Mustard Oil to Ramesh") to see how structured order extraction works.',
      timestamp: '10:00 AM',
    },
  ]);

  const getCustomerId = () => {
    let customerId = localStorage.getItem('kiranago_customer_id');
    if (!customerId) {
      customerId = `CUST-WEB-${Date.now()}`;
      localStorage.setItem('kiranago_customer_id', customerId);
    }
    return customerId;
  };

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      if (containerRef.current) {
        gsap.from(containerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }
    },
    { scope: containerRef }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);

    const callApi = async () => {
      try {
        const data = await sendChat(currentInput, getCustomerId());
        return data.reply || 'Got it! Your request has been processed.';
      } catch {
        let mockReply = 'Order received! I have processed your request and reserved 1x Aashirvaad Atta 10kg and 1x Fortune Oil. Total: ₹585.';
        if (currentInput.toLowerCase().includes('atta') || currentInput.toLowerCase().includes('oil')) {
          mockReply = `Extracted items:\n• 1x Aashirvaad Whole Wheat Atta 10kg (₹440)\n• 1x Fortune Mustard Oil 1L (₹145)\n\nOrder total: ₹585. Added to queue for Ramesh Verma.`;
        } else if (currentInput.toLowerCase().includes('price') || currentInput.toLowerCase().includes('rate')) {
          mockReply = 'Stock Price Check:\n• Atta 10kg: ₹440\n• Mustard Oil 1L: ₹145\n• Tata Salt 1kg: ₹28';
        }
        return mockReply;
      } finally {
        setIsThinking(false);
      }
    };

    // Simulate AI Agent processing delay
    setTimeout(async () => {
      const reply = await callApi();
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 350);
  };

  return (
    <div ref={containerRef} className="app-page chat-page gsap-chat-reveal">
      <header className="page-header">
        <h2>KiranaGo AI Conversation Agent</h2>
        <p className="page-sub">Simulate WhatsApp customer chats & structured order generation</p>
      </header>

      <div className="chat-messages-box glass-panel--dark">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div className={`chat-avatar ${msg.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble glass-panel'}`}>
              <div className="chat-text">{msg.text}</div>
              <div className="chat-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="chat-bubble-row bot-row">
            <div className="chat-avatar bot-avatar">
              <Bot size={16} />
            </div>
            <div className="chat-bubble bot-bubble glass-panel">
              <div className="chat-text chat-thinking">
                <Loader2 size={14} className="spin" /> Processing...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a customer order message (e.g., '2kg Sugar and 1 packet Salt')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input glass-panel--dark"
        />
        <button type="submit" className="chat-send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
