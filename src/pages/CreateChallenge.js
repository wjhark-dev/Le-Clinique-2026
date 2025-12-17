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
  const [scoringFrequency, setScoringFrequency] = useState('total');
  const [scoringTemplate, setScoringTemplate] = useState('distance_based');
  const [teamFormat, setTeamFormat] = useState('teams_optional');
  const [maxTeamSize, setMaxTeamSize] = useState('');
  const [allowedActivities, setAllowedActivities] = useState({
    cycling: { enabled: true, types: ['indoor', 'outdoor'] },
    running: { enabled: false, types: ['outdoor'] }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleActivityToggle = (activity) => {
    setAllowedActivities({
      ...allowedActivities,
      [activity]: {
        ...allowedActivities[activity],
        enabled: !allowedActivities[activity].enabled
      }
    });
  };

  const handleActivityTypeToggle = (activity, type) => {
    const currentTypes = allowedActivities[activity].types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setAllowedActivities({
      ...allowedActivities,
      [activity]: {
        ...allowedActivities[activity],
        types: newTypes
      }
    });
  };

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
          scoring_frequency: scoringFrequency,
          scoring_template: scoringTemplate,
          team_format: teamFormat,
          max_team_size: maxTeamSize ? parseInt(maxTeamSize) : null,
          allowed_activities: JSON.stringify(allowedActivities),
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
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <h1>Create New Challenge</h1>
        <p className="auth-subtitle">Set up a fitness competition</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Basic Info Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: '1.1rem' }}>
              Basic Information
            </h3>
            
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
                  resize: 'vertical',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            </div>
          </div>

          {/* Allowed Activities Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: '1.1rem' }}>
              Allowed Activities
            </h3>

            {/* Cycling */}
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                <input
                  type="checkbox"
                  checked={allowedActivities.cycling.enabled}
                  onChange={() => handleActivityToggle('cycling')}
                  style={{ marginRight: '10px', width: '18px', height: '18px' }}
                />
                Cycling
              </label>
              
              {allowedActivities.cycling.enabled && (
                <div style={{ marginLeft: '30px', display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={allowedActivities.cycling.types.includes('indoor')}
                      onChange={() => handleActivityTypeToggle('cycling', 'indoor')}
                      style={{ marginRight: '6px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Indoor Cycling</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={allowedActivities.cycling.types.includes('outdoor')}
                      onChange={() => handleActivityTypeToggle('cycling', 'outdoor')}
                      style={{ marginRight: '6px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Outdoor Cycling</span>
                  </label>
                </div>
              )}
            </div>

            {/* Running */}
            <div style={{ padding: '15px', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                <input
                  type="checkbox"
                  checked={allowedActivities.running.enabled}
                  onChange={() => handleActivityToggle('running')}
                  style={{ marginRight: '10px', width: '18px', height: '18px' }}
                />
                Running
              </label>
              
              {allowedActivities.running.enabled && (
                <div style={{ marginLeft: '30px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={allowedActivities.running.types.includes('outdoor')}
                      onChange={() => handleActivityTypeToggle('running', 'outdoor')}
                      style={{ marginRight: '6px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Outdoor Running</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Scoring Settings Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: '1.1rem' }}>
              Scoring Settings
            </h3>

            <div className="form-group">
              <label>Scoring Frequency</label>
              <select
                value={scoringFrequency}
                onChange={(e) => setScoringFrequency(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                <option value="total">Total Challenge Score</option>
                <option value="weekly">Weekly Scoring</option>
                <option value="monthly">Monthly Scoring</option>
              </select>
              <small style={{ color: '#718096', fontSize: '0.85rem' }}>
                How often rankings are calculated
              </small>
            </div>

            <div className="form-group">
              <label>Scoring System</label>
              <select
                value={scoringTemplate}
                onChange={(e) => setScoringTemplate(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                <option value="distance_based">Distance Based (Miles × 10)</option>
                <option value="frequency_distance">Frequency + Distance (Daily bonus + Miles × 10)</option>
                <option value="performance_based">Performance Based (Bonus for PRs + Distance)</option>
              </select>
              <small style={{ color: '#718096', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                {scoringTemplate === 'distance_based' && 'Simple points based on distance covered'}
                {scoringTemplate === 'frequency_distance' && '50 points per day active + distance points'}
                {scoringTemplate === 'performance_based' && 'Rewards consistency, distance, and personal records'}
              </small>
            </div>
          </div>

          {/* Team Settings Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: '1.1rem' }}>
              Team Settings
            </h3>

            <div className="form-group">
              <label>Team Format</label>
              <select
                value={teamFormat}
                onChange={(e) => setTeamFormat(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  width: '100%'
                }}
              >
                <option value="solo">Solo Only (No teams)</option>
                <option value="teams_optional">Teams Optional</option>
                <option value="teams_required">Teams Required</option>
              </select>
            </div>

            {teamFormat !== 'solo' && (
              <div className="form-group">
                <label>Maximum Team Size (optional)</label>
                <input
                  type="number"
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(e.target.value)}
                  placeholder="Leave blank for unlimited"
                  min="2"
                />
                <small style={{ color: '#718096', fontSize: '0.85rem' }}>
                  Leave blank for no limit
                </small>
              </div>
            )}
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
              textDecoration: 'underline',
              fontSize: '0.9rem'
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