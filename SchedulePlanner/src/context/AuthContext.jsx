import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Check localStorage when app starts
    useEffect(() => {
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserInfo(user);
            setIsLoggedIn(true);
        }
    }, []);

    // Login function - saves to localStorage
    const login = (userData) => {
        const user = {
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            loginTime: new Date().toISOString()
        };

        setUserInfo(user);
        setIsLoggedIn(true);
        localStorage.setItem('userInfo', JSON.stringify(user));
    };

    // Logout function - removes from localStorage
    const logout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        
        setUserInfo(null);
        setIsLoggedIn(false);
        localStorage.removeItem('userInfo');
    };

    // Value provided to all components
    const value = {
        isLoggedIn,
        userInfo,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}