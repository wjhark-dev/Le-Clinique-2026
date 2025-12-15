import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>
        <div className="user-info">
          <p><strong>Welcome, {user?.user_metadata?.name || 'User'}!</strong></p>
          <p>Email: {user?.email}</p>
        </div>

        <div className="dashboard-content">
          <h2>Your Fitness Challenges</h2>
          <p className="coming-soon">Challenge creation coming soon! 🚀</p>
          
          <div className="placeholder-features">
            <div className="feature-box">
              <h3>📊 Active Challenges</h3>
              <p>0 challenges</p>
            </div>
            <div className="feature-box">
              <h3>👥 Your Teams</h3>
              <p>0 teams</p>
            </div>
            <div className="feature-box">
              <h3>🏆 Total Points</h3>
              <p>0 points</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;