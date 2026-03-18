import { useState } from 'react';
import { sendChatMessage } from '../services/api';
import './Chatbot.css';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 I am ShopAI assistant. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await sendChatMessage(text);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting. Try again!' }]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-wrap">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="bot-av">🤖</div>
            <div>
              <div className="bot-name">ShopAI Assistant</div>
              <div className="bot-status">● Online</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && <div className="msg bot"><div className="bubble">Typing...</div></div>}
          </div>

          <div className="quick-replies">
            {['Track order', 'Return policy', 'Best deals'].map(q => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
            />
            <button onClick={() => send()}>→</button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>💬</button>
    </div>
  );
}
