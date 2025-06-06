// src/pages/DecisionDetailPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/common.css'; // Import common styles
import './DecisionDetailPage.css'; // Specific styles for this page

const API_BASE_URL = 'https://dc-backend-ocfq.onrender.com/api';

const DecisionDetailPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDecision = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/decisions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDecision(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching decision details:', err);
                setError('Failed to load decision details.');
                setLoading(false);
            }
        };

        if (token && id) {
            fetchDecision();
        }
    }, [id, token]);

    if (loading) {
        return <div className="loading-screen">Loading decision...</div>;
    }

    if (error) {
        return <div className="container"><p className="error-message">{error}</p></div>;
    }

    if (!decision) {
        return <div className="container"><p className="no-data-message">Decision not found.</p></div>;
    }

    return (
        <div className="container decision-detail-container"> {/* Added specific class for detail container */}
            <h1 className="decision-detail-title">{decision.title}</h1> {/* Specific title class */}
            {decision.description && (
                <p className="decision-detail-description">{decision.description}</p>
            )}

            {/* Options Section: Changed to alternatives and option.name */}
            <div className="detail-section">
                <h2>Options</h2>
                <div className="detail-list">
                    {decision.alternatives && decision.alternatives.length > 0 ? ( // Changed decision.options to decision.alternatives
                        decision.alternatives.map((option) => (
                            <div key={option._id} className="detail-list-item option-item">
                                <span className="item-text">{option.name}</span> {/* Changed option.text to option.name */}
                                {option.score !== undefined && (
                                    <span className="item-score">{option.score.toFixed(2)}</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-data-text">No options defined.</p>
                    )}
                </div>
            </div>

            {/* Criteria Section: Changed criterion.text to criterion.name */}
            <div className="detail-section">
                <h2>Criteria</h2>
                <div className="detail-list">
                    {decision.criteria && decision.criteria.length > 0 ? (
                        decision.criteria.map((criterion) => (
                            <div key={criterion._id} className="detail-list-item criterion-item">
                                <span className="item-text">{criterion.name}</span> {/* Changed criterion.text to criterion.name */}
                                {criterion.weight !== undefined && (
                                    <span className="item-weight">Weight: {criterion.weight.toFixed(1)}</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-data-text">No criteria defined.</p>
                    )}
                </div>
            </div>

            {/* Overall Score Section (if applicable) */}
            {decision.overallScore !== undefined && (
                <div className="result-section">
                    <h2 className="score-heading">Overall Decision Score</h2>
                    <p className="score">{decision.overallScore.toFixed(2)}</p>
                </div>
            )}

            <div className="decision-detail-actions">
                <Link to={`/decisions/${decision._id}/edit`} className="edit-detail-button">
                    Edit Decision
                </Link>
                <Link to="/decisions" className="back-button">
                    Back to My Decisions
                </Link>
            </div>

            <div className="footer">
                &copy; 2024 Decision Compass &mdash; Your future decision assistant
            </div>
        </div>
    );
};

export default DecisionDetailPage;