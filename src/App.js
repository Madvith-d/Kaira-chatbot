import React from 'react';
import GeminiChatbot from './GeminiChatbot';

function App() {
  return (
    <div className="App">
      <GeminiChatbot />
    </div>
  );
}
import React, { useState } from 'react';
import Login from './login';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <div style={{ padding: '20px' }}>
      {user ? (
        <h1>Welcome, {user}!</h1>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
