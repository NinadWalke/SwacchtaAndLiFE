import React, { useState } from 'react';
import './Committee.css';

function Committee() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="committee-container">
      <h1 className="committee-title">Committee Section</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register Committee
        </button>
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login Committee
        </button>
      </div>

      {activeTab === 'register' && (
        <form className="committee-form">
          <input type="text" placeholder="Committee Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Register</button>
        </form>
      )}

      {activeTab === 'login' && (
        <form className="committee-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default Committee;
