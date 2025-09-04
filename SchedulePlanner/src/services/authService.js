const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
    // Login user
    async login(email, password) {
        try {
            console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('Login response status:', response.status);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('Login error response:', error);
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store token and user info in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userInfo', JSON.stringify({
                studentId: data.studentId,
                email: data.email,
                fullName: data.fullName,
                username: data.username,
                loginTime: new Date().toISOString()
            }));

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register new user
    async register(fullName, username, email, password) {
        try {
            console.log('Attempting registration to:', `${API_BASE_URL}/auth/register`);
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, username, email, password }),
            });

            console.log('Register response status:', response.status);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('Registration error response:', error);
                throw new Error(error.message || 'Registration failed');
            }

            const data = await response.json();
            
            // Store token and user info in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userInfo', JSON.stringify({
                studentId: data.studentId,
                email: data.email,
                fullName: data.fullName,
                username: data.username,
                loginTime: new Date().toISOString()
            }));

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout user
    async logout() {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }

    // Get current user from localStorage
    getCurrentUser() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    // Get auth token
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const userInfo = this.getCurrentUser();
        return !!(token && userInfo);
    }

    // Get authorization headers for API calls
    getAuthHeaders() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        } : {
            'Content-Type': 'application/json',
        };
    }
}

export default new AuthService(); 