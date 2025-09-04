import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check localStorage when app starts
    useEffect(() => {
        const checkAuth = () => {
            if (authService.isAuthenticated()) {
                const user = authService.getCurrentUser();
                setUserInfo(user);
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    // Login function - calls backend API
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const user = authService.getCurrentUser();
            setUserInfo(user);
            setIsLoggedIn(true);
            return { success: true, data: response };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    };

    // Register function - calls backend API
    const register = async (fullName, username, email, password) => {
        try {
            const response = await authService.register(fullName, username, email, password);
            const user = authService.getCurrentUser();
            setUserInfo(user);
            setIsLoggedIn(true);
            return { success: true, data: response };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message };
        }
    };

    // Logout function - calls backend and clears localStorage
    const logout = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUserInfo(null);
            setIsLoggedIn(false);
        }
    };

    // Value provided to all components
    const value = {
        isLoggedIn,
        userInfo,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}