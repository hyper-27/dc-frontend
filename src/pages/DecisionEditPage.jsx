import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/common.css'; // Import common styles
import './DecisionEditPage.css'; // Specific styles for this page

const API_BASE_URL = 'http://localhost:5000/api';

const DecisionEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [decision, setDecision] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState([]); // Frontend uses 'options'
    const [criteria, setCriteria] = useState([]);
    const [ratings, setRatings] = useState({}); // Stores ratings: {altId: {critId: value}}
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDecision = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/decisions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fetchedDecision = response.data;
                setDecision(fetchedDecision);
                setTitle(fetchedDecision.title);
                setDescription(fetchedDecision.description || '');

                // Safely initialize options (backend's alternatives) and criteria
                setOptions(fetchedDecision.alternatives && fetchedDecision.alternatives.length > 0
                    ? fetchedDecision.alternatives.map(alt => ({ _id: alt._id, text: alt.name, score: alt.score }))
                    : [{ text: '', score: 0 }]); // Default to 0 for score
                setCriteria(fetchedDecision.criteria && fetchedDecision.criteria.length > 0
                    ? fetchedDecision.criteria.map(crit => ({ _id: crit._id, text: crit.name, weight: crit.weight }))
                    : [{ text: '', weight: 1 }]); // Default to 1 for weight

                // Fetch existing ratings for this decision
                const ratingsResponse = await axios.get(`${API_BASE_URL}/decisions/${id}/ratings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fetchedRatings = ratingsResponse.data.reduce((acc, rating) => {
                    if (!acc[rating.alternative]) {
                        acc[rating.alternative] = {};
                    }
                    acc[rating.alternative][rating.criterion] = rating.value;
                    return acc;
                }, {});
                setRatings(fetchedRatings);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching decision for edit:', err);
                setError('Failed to load decision for editing.');
                setLoading(false);
            }
        };

        if (token && id) {
            fetchDecision();
        }
    }, [id, token]);

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { text: '', score: 0 }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleCriterionChange = (index, field, value) => {
        const newCriteria = [...criteria];
        newCriteria[index][field] = value;
        setCriteria(newCriteria);
    };

    const handleAddCriterion = () => {
        setCriteria([...criteria, { text: '', weight: 1 }]);
    };

    const handleRemoveCriterion = (index) => {
        const newCriteria = criteria.filter((_, i) => i !== index);
        setCriteria(newCriteria);
    };

    const handleRatingChange = (alternativeId, criterionId, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [alternativeId]: {
                ...prevRatings[alternativeId],
                [criterionId]: parseFloat(value) || 0 // Store as a number, default to 0 if invalid
            }
        }));
    };

    const handleSaveRatings = async () => {
        setError('');
        setMessage('');
        try {
            const ratingsToSend = [];
            for (const altId in ratings) {
                for (const critId in ratings[altId]) {
                    const value = ratings[altId][critId];
                    // Only send valid numbers and make sure altId and critId are actual IDs
                    if (altId && critId && value !== null && value !== undefined && !isNaN(value)) {
                        ratingsToSend.push({
                            alternative: altId,
                            criterion: critId,
                            value: value
                        });
                    }
                }
            }

            if (ratingsToSend.length === 0) {
                setMessage('No ratings to save.');
                return;
            }

            // Send ratings to a new backend endpoint
            await axios.post(`${API_BASE_URL}/decisions/${id}/ratings`, { ratings: ratingsToSend }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Ratings saved successfully!');

        } catch (err) {
            console.error('Error saving ratings:', err);
            setError(err.response?.data?.message || 'Failed to save ratings.');
        }
    };

    const handleCalculateScore = async () => {
        setError('');
        setMessage('');
        try {
            // Note: The backend calculate-scores function now fetches alternatives/criteria/ratings from the DB
            const res = await axios.post(`${API_BASE_URL}/decisions/${id}/calculate-scores`, {}, { // Send empty body if backend doesn't expect payload
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Update the decision state and local options state with calculated scores
            setDecision(prev => ({ ...prev, alternatives: res.data.alternatives, overallScore: res.data.overallScore }));
            setOptions(res.data.alternatives.map(alt => ({ _id: alt._id, text: alt.name, score: alt.score }))); // Update frontend options state
            setMessage('Scores calculated successfully!');
        } catch (err) {
            console.error('Error calculating scores:', err);
            setError(err.response?.data?.message || 'Failed to calculate scores. Ensure you have options, criteria, AND ratings entered.');
        }
    };

    const handleSaveDecision = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const filteredOptions = options.filter(opt => opt.text.trim() !== '').map(opt => ({
            _id: opt._id,
            name: opt.text,
            score: opt.score || 0
        }));
        const filteredCriteria = criteria.filter(crit => crit.text.trim() !== '').map(crit => ({
            _id: crit._id,
            name: crit.text,
            weight: crit.weight || 1
        }));

        if (!title.trim()) {
            setError('Decision title is required.');
            return;
        }
        if (filteredOptions.length < 2) {
            setError('At least two options are required to save.');
            return;
        }

        try {
            const updatedDecisionData = {
                title,
                description: description.trim() === '' ? undefined : description,
                alternatives: filteredOptions,
                criteria: filteredCriteria,
            };

            const response = await axios.put(
                `${API_BASE_URL}/decisions/${id}`,
                updatedDecisionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDecision(response.data);
            setMessage('Decision saved successfully!');
            navigate(`/decisions/${response.data._id}`); // Navigate back to detail page after successful save
        } catch (err) {
            console.error('Error saving decision:', err);
            setError(err.response?.data?.message || 'Failed to save decision. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading-screen">Loading decision for editing...</div>;
    }

    if (error && !message) {
        return <div className="container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="container edit-decision-container">
            <h1>Edit Decision</h1>
            <p className="subtitle">Refine your decision by updating options, criteria, and their values.</p>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSaveDecision} className="edit-decision-form-content">
                <div className="form-group">
                    <label htmlFor="title">Decision Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide more details about your decision (e.g., budget, specific needs)."
                        className="input-field"
                    ></textarea>
                </div>

                <div className="form-section">
                    <h2>Options</h2>
                    {options.map((option, index) => (
                        <div key={option._id || index} className="form-group form-group-option-edit">
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="input-field option-text-input"
                                name={`option-text-${index}`}
                            />
                            <input
                                type="number"
                                value={option.score || 0}
                                onChange={(e) => handleOptionChange(index, 'score', parseFloat(e.target.value) || 0)}
                                placeholder="Score"
                                className="input-field option-score-input"
                                disabled // Score is calculated, not directly edited by user
                                name={`option-score-${index}`}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="remove-button"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="add-button"
                    >
                        + Add Option
                    </button>
                </div>

                <div className="form-section">
                    <h2>Criteria</h2>
                    {criteria.map((criterion, index) => (
                        <div key={criterion._id || index} className="form-group form-group-criterion-edit">
                            <input
                                type="text"
                                value={criterion.text}
                                onChange={(e) => handleCriterionChange(index, 'text', e.target.value)}
                                placeholder={`Criterion ${index + 1}`}
                                className="input-field criterion-text-input"
                                name={`criterion-text-${index}`}
                            />
                            <input
                                type="number"
                                value={criterion.weight || 1}
                                onChange={(e) => handleCriterionChange(index, 'weight', parseFloat(e.target.value) || 1)}
                                placeholder="Weight"
                                min="0.1"
                                step="0.1"
                                className="input-field criterion-weight-input"
                                name={`criterion-weight-${index}`}
                            />
                            {criteria.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCriterion(index)}
                                    className="remove-button"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddCriterion}
                        className="add-button"
                    >
                        + Add Criterion
                    </button>
                </div>

                {/* --- New Ratings Section --- */}
                <div className="form-section">
                    <h2>Ratings</h2>
                    <p className="subtitle">Assign a rating (e.g., 1-5 or 1-10) for each option against each criterion.</p>
                    {options.length === 0 || criteria.length === 0 ? (
                        <p className="info-message">Add at least two options and one criterion to input ratings.</p>
                    ) : (
                        <div className="ratings-table-container">
                            <table className="ratings-table">
                                <thead>
                                    <tr>
                                        <th>Option / Criterion</th>
                                        {criteria.map(crit => (
                                            <th key={crit._id || crit.text}>{crit.text}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {options.map(opt => (
                                        <tr key={opt._id || opt.text}>
                                            <td>{opt.text}</td>
                                            {criteria.map(crit => (
                                                <td key={crit._id || crit.text}>
                                                    <input
                                                        type="number"
                                                        value={ratings[opt._id]?.[crit._id] || ''}
                                                        onChange={(e) => handleRatingChange(opt._id, crit._id, e.target.value)}
                                                        min="0" // You can adjust min/max based on your rating scale
                                                        step="0.1" // Allows for decimal ratings if needed
                                                        className="rating-input"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* --- End New Ratings Section --- */}

                <div className="edit-actions">
                    <button type="button" onClick={handleCalculateScore} className="calculate-button">
                        Calculate Score
                    </button>
                    {/* New Save Ratings Button */}
                    <button type="button" onClick={handleSaveRatings} className="save-ratings-button">
                        Save Ratings
                    </button>
                    <button type="submit" className="save-button">
                        Save Decision
                    </button>
                </div>

                {/* Overall Score Display */}
                {decision?.overallScore !== undefined && (
                    <div className="result-section final-score-display">
                        <h2 className="score-heading">Current Overall Score</h2>
                        <p className="score">{decision.overallScore.toFixed(2)}</p>
                    </div>
                )}

                {/* Display individual alternative scores */}
                {options.length > 0 && options.some(opt => opt.score > 0) && (
                    <div className="result-section alternative-scores-display">
                        <h2 className="score-heading">Alternative Scores</h2>
                        <ul className="alternative-scores-list">
                            {options.sort((a, b) => b.score - a.score).map(opt => ( // Sort by score for display
                                <li key={opt._id}>
                                    <strong>{opt.text}:</strong> {opt.score.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className="footer">
                    &copy; 2024 Decision Compass &mdash; Your future decision assistant
                </div>
            </form>
        </div>
    );
};

export default DecisionEditPage;