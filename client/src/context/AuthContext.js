import { jsx as _jsx } from "react/jsx-runtime";
// client/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
                if (token) {
                    // Set the token in the API service
                    api.setAuthToken(token);
                    try {
                        const response = await api.auth.getMe();
                        console.log('Authentication successful');
                        setUser({
                            id: response.id,
                            name: response.name,
                            email: response.email,
                            role: response.role,
                            phone: response.phone,
                        });
                    }
                    catch (apiError) {
                        console.error('API Error during authentication check:', apiError);
                        // Check if token is expired or invalid
                        if (apiError.message === 'Invalid token' || apiError.message === 'Token expired') {
                            console.log('Token is invalid or expired, attempting to refresh...');
                            // For now, just log out the user
                            localStorage.removeItem('token');
                            api.setAuthToken(null);
                            setUser(null);
                        }
                        else {
                            // For other errors, keep the token but log the error
                            console.error('Other API error:', apiError.message);
                        }
                    }
                }
            }
            catch (error) {
                console.error('Auth check failed', error);
                localStorage.removeItem('token');
                api.setAuthToken(null); // Clear the token in the API service
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuth();
        // Set up event listener for storage changes (in case token is modified in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                if (!e.newValue) {
                    // Token was removed
                    setUser(null);
                    api.setAuthToken(null);
                }
                else if (e.newValue !== e.oldValue) {
                    // Token was changed, re-authenticate
                    checkAuth();
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    const login = async (email, password) => {
        try {
            const response = await api.auth.login({ email, password });
            const { token, user } = response;
            localStorage.setItem('token', token);
            // Set the token in the API service
            api.setAuthToken(token);
            setUser({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            });
        }
        catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };
    const signup = async (data) => {
        try {
            const response = await api.auth.signup(data);
            const { token, user } = response;
            localStorage.setItem('token', token);
            // Set the token in the API service
            api.setAuthToken(token);
            setUser({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            });
            return user;
        }
        catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        api.setAuthToken(null); // Clear the token in the API service
        setUser(null);
    };
    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        isOwner: user?.role === 'owner',
        isCustomer: user?.role === 'customer',
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
