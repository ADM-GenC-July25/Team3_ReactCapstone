import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Hardcoded credentials
const HARDCODED_EMAIL = "nikhil@gmail.com";
const HARDCODED_PASSWORD = "test123";
const HARDCODED_USER_INFO = {
    email: "nikhil@gmail.com",
    fullName: "Nikhil",
    username: "nikhil",
    loginTime: null
};

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check localStorage when app starts
    useEffect(() => {
        const checkAuth = () => {
            const savedAuth = localStorage.getItem('isAuthenticated');
            const savedUser = localStorage.getItem('userInfo');
            
            if (savedAuth === 'true' && savedUser) {
                try {
                    setUserInfo(JSON.parse(savedUser));
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Error parsing saved user info:', error);
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    // Login function - validates against hardcoded credentials
    const login = async (email, password) => {
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            // Validate hardcoded credentials
            if (email.toLowerCase().trim() !== HARDCODED_EMAIL.toLowerCase() || password !== HARDCODED_PASSWORD) {
                throw new Error('Invalid email or password');
            }
            
            // Create user info with current login time
            const userWithLoginTime = {
                ...HARDCODED_USER_INFO,
                loginTime: new Date().toISOString()
            };
            
            // Save authentication state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(userWithLoginTime));
            
            setUserInfo(userWithLoginTime);
            setIsLoggedIn(true);
            
            return { success: true, data: userWithLoginTime };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    };

    // Register function - disabled for hardcoded system
    const register = async (fullName, username, email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { 
            success: false, 
            error: 'Registration is disabled. Please use the provided login credentials.' 
        };
    };

    // Logout function - clears localStorage
    const logout = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        
        try {
            // Clear authentication state
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userInfo');
            
            setUserInfo(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout error:', error);
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