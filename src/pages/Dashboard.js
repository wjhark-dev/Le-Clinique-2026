import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
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
      
      // Fetch user's challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      
      if (challengesData) {
        setChallenges(challengesData);
      }
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
  <h2>Your Challenges</h2>
  
  <button 
    onClick={() => window.location.href = '/create-challenge'}
    className="auth-button"
    style={{ marginBottom: '30px', width: 'auto', padding: '12px 30px' }}
  >
    + Create New Challenge
  </button>
          
  <div className="challenges-list">
  {challenges.length === 0 ? (
    <p style={{ color: '#718096', fontStyle: 'italic' }}>
      No challenges yet. Create your first challenge above!
    </p>
  ) : (
    challenges.map((challenge) => (
      <div key={challenge.id} className="challenge-card">
        <h3>{challenge.name}</h3>
        <p className="challenge-type">
          {challenge.challenge_type.charAt(0).toUpperCase() + challenge.challenge_type.slice(1)}
        </p>
        {challenge.description && (
          <p className="challenge-description">{challenge.description}</p>
        )}
        <div className="challenge-dates">
          <span>📅 {new Date(challenge.start_date).toLocaleDateString()}</span>
          <span> → </span>
          <span>{new Date(challenge.end_date).toLocaleDateString()}</span>
        </div>
      </div>
    ))
  )}
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