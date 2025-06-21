import React, { useState, useRef, useEffect } from 'react';
import Chatbotstyles from "./Chatbot.module.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '您好，有什麼可以幫助您的嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // 跳過第一次渲染
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth' ,
        block: 'nearest',    // 避免跳太遠
      });
    }
  }, [messages, isTyping]);

  const formatText = (text) => {
    return text
      .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s*(.+)$/gm, '<h1>$1</h1>')
      .replace(/\n/g, '<br>');
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5678/webhook-test/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: '伺服器錯誤，請稍後再試' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={Chatbotstyles.container}>
      <div className={Chatbotstyles.chatWindow}>
        <div className={Chatbotstyles.chatHeader}>
          {/* <a href="/" className={Chatbotstyles.backBtn}>← 返回首頁</a> */}
          <div className={Chatbotstyles.titleWrapper}>
            Acne互動機器人
          </div>
        </div>

        <div className={Chatbotstyles.chatMessagesList}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${Chatbotstyles.chatMessage} ${Chatbotstyles[msg.sender]}`}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          ))}
          {isTyping && (
            <div className={`${Chatbotstyles.chatMessage} ${Chatbotstyles.bot} ${Chatbotstyles.typing}`}>
              <div className={Chatbotstyles.spinner} /> 客服正在輸入中...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={Chatbotstyles.chatFooter}>
          <textarea
            className={Chatbotstyles.chatInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入訊息..."
            rows="1"
          />
          <button className={Chatbotstyles.sendBtn} onClick={sendMessage}>📤</button>
        </div>
      </div>
    </div>

  );
}

export default Chatbot;
