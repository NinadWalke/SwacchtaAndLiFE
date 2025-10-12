import React, { useState } from 'react';
// Import the new stylesheet
import './CommitteeForms.css';

// Renamed component function
function CommitteeForms() {
  const [activeTab, setActiveTab] = useState('register');

  // Suggestion: Add state management for form fields, e.g.:
  // const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  // const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log('Registering committee...');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log('Logging in committee...');
  };

  return (
    <main className="committee-page">
      <div className="form-card">
        <div className="form-card__header">
          <h1 className="form-card__title">Committee Portal</h1>
          <p className="form-card__subtitle">
            {activeTab === 'register'
              ? 'Create a new committee account to get started.'
              : 'Access your committee dashboard.'}
          </p>
        </div>

        <div className="form-card__tabs pb-3">
          <button
            className={`tab-button me-3 ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
          <button
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>

        {activeTab === 'register' && (
          <form className="committee-form" onSubmit={handleRegisterSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="register-name">Committee Name</label>
              <input className="form__input" id="register-name" name="name" type="text" placeholder="e.g., Thane Clean-Up Crew" required />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="register-email">Email Address</label>
              <input className="form__input" id="register-email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="register-password">Password</label>
              <input className="form__input" id="register-password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="confirm-password">Confirm Password</label>
              <input className="form__input" id="confirm-password" name="confirmPassword" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn--primary">Register</button>
          </form>
        )}

        {activeTab === 'login' && (
          <form className="committee-form" onSubmit={handleLoginSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="login-email">Email Address</label>
              <input className="form__input" id="login-email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="login-password">Password</label>
              <input className="form__input" id="login-password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn--primary">Login</button>
          </form>
        )}
      </div>
    </main>
  );
}

export default CommitteeForms;