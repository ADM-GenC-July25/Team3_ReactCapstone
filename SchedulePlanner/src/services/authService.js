// Frontend-only auth service with hardcoded credentials
const HARDCODED_EMAIL = "nikhil@gmail.com";
const HARDCODED_PASSWORD = "test123";

class AuthService {
    // Check if user is currently authenticated
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    // Get current user from localStorage
    getCurrentUser() {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }

    // Frontend-only login validation
    async login(email, password) {
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Validate against hardcoded credentials
        if (email.toLowerCase().trim() !== HARDCODED_EMAIL.toLowerCase() || password !== HARDCODED_PASSWORD) {
            throw new Error('Invalid email or password');
        }
        
        const userInfo = {
            email: HARDCODED_EMAIL,
            fullName: "Nikhil",
            username: "nikhil",
            loginTime: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        return userInfo;
    }

    // Register is disabled in hardcoded system
    async register(fullName, username, email, password) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Registration is disabled. Please use the provided login credentials.');
    }

    // Logout - clear localStorage
    async logout() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userInfo');
        return { message: 'Logged out successfully' };
    }

    // Get auth token (not needed for frontend-only, but kept for compatibility)
    getToken() {
        return this.isAuthenticated() ? 'frontend-only-token' : null;
    }
}

export default new AuthService(); 