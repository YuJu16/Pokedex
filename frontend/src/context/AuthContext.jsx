import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        // Here you would typically validate the token with the backend
        // For now, we'll just assume valid if present, or decode it
        if (token) {
            // decode token or fetch user profile
            // For now, just setting a mock user or persisting state
            setUser({ username: 'Trainer' }); // Replace with actual user data fetch
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            const { token, message } = res.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser({ username }); // In a real app, decode token to get user info
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:3000/api/auth/register', { username, password });
            // Auto login after register? or redirect to login
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
