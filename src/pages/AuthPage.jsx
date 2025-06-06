// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AuthPage.css'; // Import the new external 

const API_BASE_URL = 'https://dc-backend-ocfq.onrender.com/api'; // Your backend API base URL

const AuthPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For success messages
    const [loading, setLoading] = useState(false); // Loading state for UX
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setMessage(''); // Clear previous success messages
        setLoading(true); // Set loading to true on form submission

        try {
            let res;
            if (isRegistering) {
                res = await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
                setMessage(res.data.message || 'Registration successful! Please log in.'); // Show success message
                setUsername(''); // Clear form fields
                setPassword('');
                setTimeout(() => {
                    setIsRegistering(false); // Switch to login view after successful registration message
                }, 1500); // Give user a moment to read the message
            } else {
                res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
                login(res.data.token, res.data.user); // Use the login context function
                setMessage('Login successful!'); // Show success message briefly
                setTimeout(() => {
                    navigate('/decisions'); // Redirect to decisions page on successful login
                }, 500); // Short delay for message visibility
            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.response?.data?.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false); // Always set loading to false when request finishes
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h2 className="auth-heading">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                    <p className="auth-message error-message">
                        {error}
                    </p>
                )}
                {message && (
                    <p className="auth-message success-message">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                {isRegistering ? 'Registering...' : 'Logging In...'}
                            </>
                        ) : (
                            isRegistering ? 'Register' : 'Login'
                        )}
                    </button>
                </form>

                <div className="auth-toggle-section">
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="auth-toggle-button"
                    >
                        {isRegistering
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;