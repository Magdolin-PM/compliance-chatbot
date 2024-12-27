import React, { useState } from 'react';
import { sendChatMessage } from './api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Sends the user's message and handles bot response
  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages
    // Add the user's message to the chat
    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(input);
      console.log("API Response:", response);

      if (response.reply) {
        // Format and add the bot's response
        const structuredResponse = parseStructuredResponse(response.reply);
        setMessages((prev) => [...prev, { type: 'bot', text: structuredResponse }]);
      } else {
        throw new Error('Invalid response format from API.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessages((prev) => [...prev, { type: 'bot', text: 'Error: Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false); // Always stop loading
    }
  };
  // Parses the bot's response into a structured format
  const parseStructuredResponse = (content) => {
    try {
      const sections = content.split(/\n\s*\n/); // Split into sections by blank lines
      return sections
        .map((section) => {
          if (section.includes(':')) {
            const [title, ...rest] = section.split(':');
            return `<div><strong>${title.trim()}:</strong> ${rest.join(':').trim()}</div>`;
          } else if (section.startsWith('-')) {
            return `<ul><li>${section.substring(1).trim()}</li></ul>`;
          } else if (/^\d+\./.test(section)) {
            return `<ol><li>${section.substring(section.indexOf('.') + 1).trim()}</li></ol>`;
          } else {
            return `<p>${section}</p>`;
          }
        })
        .join('');
    } catch (error) {
      console.error('Error parsing bot response:', error);
      return "<p>Error parsing bot response.</p>";
    }
  };

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <div className="Chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`Message ${msg.type}`}>
            {msg.type === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
        {loading && <div className="Message bot">Typing...</div>}
      </div>
      <div className="Input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
