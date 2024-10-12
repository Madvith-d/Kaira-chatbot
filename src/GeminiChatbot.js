import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiChatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-pro-002",
            systemInstruction: `
            Imagine yourself as a mental wellbeing bot named "Kaira". You can provide mental support through soothing words and proper relaxation techniques. Your tone should be friendly and humorous. You must answer the questions the user asks based on their mood. 
            For users in a good mood, ask them to share their positive experiences. For those in a bad mood, ask them to speak about their problems and offer appropriate support and techniques. 
            Reference content from:
            - https://psychcentral.com
            - https://www.mind.org.uk/information-support/tips-for-everyday-living/wellbeing/
            - https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics
            - https://kidshealth.org/en/teens/anxiety-tips.html
            - https://kidshealth.org/en/teens/stressful-feelings.html`,  

        });

      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { text, sender: 'bot' }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '20px',
              backgroundColor: message.sender === 'user' ? '#007bff' : '#f1f0f0',
              color: message.sender === 'user' ? 'white' : 'black'
            }}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flexGrow: 1, marginRight: '10px', padding: '10px', borderRadius: '20px', border: '1px solid #ddd' }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={isLoading} style={{
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer'
        }}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default GeminiChatbot;




