import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function CreateChallenge() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [challengeType, setChallengeType] = useState('cycling');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create a challenge');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('challenges')
        .insert([{
          name: name,
          description: description,
          start_date: startDate,
          end_date: endDate,
          challenge_type: challengeType,
          creator_id: user.id
        }]);

      if (insertError) {
        setError(insertError.message);
      } else {
        alert('Challenge created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h1>Create New Challenge</h1>
        <p className="auth-subtitle">Set up a fitness competition</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Challenge Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Spring Cycling Challenge"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenge..."
              rows="3"
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group">
            <label>Challenge Type</label>
            <select
              value={challengeType}
              onChange={(e) => setChallengeType(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="cycling">Cycling</option>
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="mixed">Mixed Activities</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Challenge'}
          </button>
        </form>

        <p className="auth-footer">
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#48bb78',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Dashboard
          </button>
        </p>
      </div>
    </div>
  );
}

export default CreateChallenge;