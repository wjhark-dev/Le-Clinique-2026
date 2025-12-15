import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email: email }]);

      if (error) {
        console.error('Error saving email:', error);
        alert('Something went wrong. Please try again.');
      } else {
        console.log('Email saved successfully:', email);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setEmail('');
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="hero">
        <div className="container">
          <h1>Lé Clinique 2026</h1>
          <p className="tagline">Version 2: The Davis-Vega Wedding Trim / Dad Bod Aversion Protocol</p>
          
          <div className="hero-description">
            <p>
            "We lost a lot of good men out there. I don't like to talk about it..." 
            </p>
            <p>
            "Riding your indoor Peloton bike?"
            </p>
          </div>

          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">
              Create Account
            </Link>
            <Link to="/login" className="cta-button secondary">
              Log In
            </Link>
          </div>

          <div className="signup-section">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="email-form">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
                <button type="submit" className="signup-button">
                  Get Updates
                </button>
              </form>
            ) : (
              <div className="success-message">
                ✓ Thanks! We'll keep you updated.
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <h2>2026 Clinic Overview</h2>
          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Rules</h3>
              <p>TBD by committee</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Scoring System</h3>
              <p>TBD by committee</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Teams</h3>
              <p>TBD</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>We're Putting On A CLINIC.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;