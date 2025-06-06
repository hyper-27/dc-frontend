// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5000/api/auth/';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserString = localStorage.getItem('user'); // Renamed variable for clarity

        // Only attempt to parse if both token and user string exist AND user string is not "undefined"
        if (storedToken && storedUserString && storedUserString !== 'undefined') {
            try {
                setUser(JSON.parse(storedUserString));
                setToken(storedToken);
            } catch (error) {
                console.error("Failed to parse stored user data or data is invalid:", error);
                // If parsing fails, clear invalid data to prevent continuous errors
                logout();
            }
        }
        setLoading(false);
    }, []);

    const register = async (username, password) => {
        // ... (rest of your register function)
    };

    const login = (jwtToken, userData) => {
        try {
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData)); // Ensure user data is stringified
            setToken(jwtToken);
            setUser(userData);
        } catch (error) {
            console.error('Error setting login context:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const contextValue = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};