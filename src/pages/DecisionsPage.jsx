// src/pages/DecisionsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/common.css'; // Import common styles
import './DecisionsPage.css'; // We'll create this for specific styles

const API_BASE_URL = 'http://localhost:5000/api';

const DecisionsPage = () => {
  const { user, token } = useAuth();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDecisionTitle, setNewDecisionTitle] = useState(''); // For the new decision form
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchDecisions = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/decisions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDecisions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching decisions:', err);
      setError('Failed to load decisions.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [token]); // Refetch when token changes (login/logout)

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    if (!newDecisionTitle.trim()) {
      setError('Decision title cannot be empty.');
      return;
    }
    setError(''); // Clear previous errors
    try {
      const response = await axios.post(
        `${API_BASE_URL}/decisions`,
        { title: newDecisionTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDecisions([...decisions, response.data]);
      setNewDecisionTitle(''); // Clear input
      navigate(`/decisions/${response.data._id}/edit`); // Redirect to edit the new decision
    } catch (err) {
      console.error('Error creating decision:', err);
      setError(err.response?.data?.message || 'Failed to create decision.');
    }
  };

  const handleDeleteDecision = async (id) => {
    if (window.confirm('Are you sure you want to delete this decision?')) {
      try {
        await axios.delete(`${API_BASE_URL}/decisions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDecisions(decisions.filter((decision) => decision._id !== id));
      } catch (err) {
        console.error('Error deleting decision:', err);
        setError('Failed to delete decision.');
      }
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your decisions...</div>;
  }

  return (
    <div className="container"> {/* Use the 'container' class from common.css */}
      <h1>My Decisions</h1> {/* Uses h1 from common.css */}
      {error && <p className="error-message">{error}</p>} {/* Uses error-message from AuthPage.css (if moved to common.css) */}

      {/* Form to create a new decision */}
      <form onSubmit={handleCreateDecision} className="create-decision-form"> {/* New class for this form */}
        <h3 className="form-title">Create New Decision</h3> {/* New class for title */}
        <div className="form-input-group"> {/* New class for input and button group */}
          <input
            type="text"
            placeholder="e.g., Which job offer to take?"
            value={newDecisionTitle}
            onChange={(e) => setNewDecisionTitle(e.target.value)}
            required
            className="input-field" /* Uses input-field from AuthPage.css (move to common.css) */
          />
          <button type="submit" className="button"> {/* Uses button from common.css */}
            Create
          </button>
        </div>
      </form>

      {/* List of existing decisions */}
      <div className="decisions-list"> {/* New class for the grid */}
        {decisions.length === 0 ? (
          <p className="no-decisions-message">You haven't created any decisions yet. Start by creating one!</p>
        ) : (
          decisions.map((decision) => (
            <div key={decision._id} className="decision-card"> {/* New class for each card */}
              <Link to={`/decisions/${decision._id}`} className="decision-card-title-link"> {/* New class for link */}
                {decision.title}
              </Link>
              <p className="decision-card-description">{decision.description || 'No description provided.'}</p> {/* New class */}
              <div className="decision-card-actions"> {/* New class for actions */}
                <Link to={`/decisions/${decision._id}/edit`} className="edit-button"> {/* New class for edit button */}
                  Edit
                </Link>
                <button onClick={() => handleDeleteDecision(decision._id)} className="delete-button"> {/* New class for delete button */}
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DecisionsPage;