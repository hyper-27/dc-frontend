// src/pages/CreateDecisionPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../styles/common.css'; // Import common styles
import './CreateDecisionPage.css'; // We'll create this for any specific styles

const API_BASE_URL = 'http://localhost:5000/api';

const CreateDecisionPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState([{ text: '' }, { text: '' }]); // Start with two empty options
    const [criteria, setCriteria] = useState([{ text: '' }]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { text: '' }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleCriteriaChange = (index, value) => {
        const newCriteria = [...criteria];
        newCriteria[index].text = value;
        setCriteria(newCriteria);
    };

    const handleAddCriterion = () => {
        setCriteria([...criteria, { text: '' }]);
    };

    const handleRemoveCriterion = (index) => {
        const newCriteria = criteria.filter((_, i) => i !== index);
        setCriteria(newCriteria);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!title.trim()) {
            setError('Decision title is required.');
            return;
        }

        const filteredOptions = options.filter(opt => opt.text.trim() !== '');
        if (filteredOptions.length < 2) {
            setError('At least two options are required.');
            return;
        }

        const filteredCriteria = criteria.filter(crit => crit.text.trim() !== '');
        if (filteredCriteria.length === 0) {
            setError('At least one criterion is recommended.');
            // Optionally, you could allow creation without criteria, but warn the user.
        }
        
        try {
            const response = await axios.post(
                `${API_BASE_URL}/decisions`,
                {
                    title,
                    description: description.trim() === '' ? undefined : description,
                    options: filteredOptions,
                    criteria: filteredCriteria,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Decision created successfully!');
            // Redirect to the newly created decision's detail or edit page
            navigate(`/decisions/${response.data._id}/edit`);
        } catch (err) {
            console.error('Error creating decision:', err);
            setError(err.response?.data?.message || 'Failed to create decision. Please try again.');
        }
    };

    return (
        <div className="container"> {/* Main container for the page */}
            <h1>Create New Decision</h1> {/* Page title */}
            <p className="subtitle">Define your options and criteria to make an informed choice.</p> {/* Subtitle */}

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSubmit} className="create-decision-form-content"> {/* Specific form content class */}
                <div className="form-group">
                    <label htmlFor="title">Decision Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Which laptop should I buy?"
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
                        className="input-field" // Reusing input-field for textarea
                    ></textarea>
                </div>

                <div className="form-section"> {/* New class for a section (Options/Criteria) */}
                    <h2>Options</h2>
                    {options.map((option, index) => (
                        <div key={index} className="form-group form-group-inline"> {/* Inline group for input and remove button */}
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="input-field"
                            />
                            {options.length > 2 && ( // Allow removing only if more than 2 options
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

                <div className="form-section"> {/* New class for a section (Options/Criteria) */}
                    <h2>Criteria</h2>
                    {criteria.map((criterion, index) => (
                        <div key={index} className="form-group form-group-inline"> {/* Inline group for input and remove button */}
                            <input
                                type="text"
                                value={criterion.text}
                                onChange={(e) => handleCriteriaChange(index, e.target.value)}
                                placeholder={`Criterion ${index + 1}`}
                                className="input-field"
                            />
                            {criteria.length > 1 && ( // Allow removing only if more than 1 criterion
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

                <button type="submit" className="submit-button"> {/* Specific class for submit button */}
                    Create Decision
                </button>
            </form>

            <div className="footer">
                &copy; 2024 Decision Compass &mdash; Your future decision assistant
            </div>
        </div>
    );
};

export default CreateDecisionPage;