import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login({ onLoginSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [registerForm, setRegisterForm] = useState({ 
        fullName: '', 
        username: '', 
        email: '', 
        password: '' 
    });

    const { login, register } = useContext(AuthContext);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    }

    function handleRegisterChange(e) {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
        setError('');
    }

    function validate() {
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            setError('Please enter a valid email.');
            return false;
        }
        if (!form.password) {
            setError('Password is required.');
            return false;
        }
        return true;
    }

    function validateRegister() {
        if (!registerForm.fullName.trim()) {
            setError('Full name is required.');
            return false;
        }
        if (!registerForm.username.trim()) {
            setError('Username is required.');
            return false;
        }
        if (!registerForm.email || !/\S+@\S+\.\S+/.test(registerForm.email)) {
            setError('Please enter a valid email.');
            return false;
        }
        if (!registerForm.password || registerForm.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError('');
        
        try {
            const result = await login(form.email, form.password);
            
            if (result.success) {
                console.log('Login successful:', result.data);
                onLoginSuccess && onLoginSuccess();
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        if (!validateRegister()) return;

        setLoading(true);
        setError('');
        
        try {
            const result = await register(
                registerForm.fullName,
                registerForm.username,
                registerForm.email,
                registerForm.password
            );
            
            if (result.success) {
                console.log('Registration successful:', result.data);
                onLoginSuccess && onLoginSuccess();
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                        <div className="card shadow login-card">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="h4 mb-4 text-center">
                                    {isRegisterMode ? 'Student Registration' : 'Student Login'}
                                </h1>

                                {error && (
                                    <div className="alert alert-danger py-2" role="alert">
                                        {error}
                                    </div>
                                )}

                                {!isRegisterMode ? (
                                    <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className={`form-control ${error && (!form.email || !/\S+@\S+\.\S+/.test(form.email)) ? 'is-invalid' : ''}`}
                                            placeholder="Enter your student email"
                                            value={form.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            className={`form-control ${error && !form.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                            value={form.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <a href="#" className="small text-decoration-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert(`Contact admin@contact.com to reset your password.`);
                                            }}
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-submit w-100"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        )}
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </form>
                                ) : (
                                    <form onSubmit={handleRegisterSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="fullName" className="form-label">Full Name</label>
                                            <input
                                                id="fullName"
                                                type="text"
                                                name="fullName"
                                                className="form-control"
                                                placeholder="Enter your full name"
                                                value={registerForm.fullName}
                                                onChange={handleRegisterChange}
                                                autoComplete="name"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                className="form-control"
                                                placeholder="Choose a username"
                                                value={registerForm.username}
                                                onChange={handleRegisterChange}
                                                autoComplete="username"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="registerEmail" className="form-label">Email</label>
                                            <input
                                                id="registerEmail"
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter your student email"
                                                value={registerForm.email}
                                                onChange={handleRegisterChange}
                                                autoComplete="email"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="registerPassword" className="form-label">Password</label>
                                            <input
                                                id="registerPassword"
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                placeholder="Create a password (min 6 characters)"
                                                value={registerForm.password}
                                                onChange={handleRegisterChange}
                                                autoComplete="new-password"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-submit w-100"
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            )}
                                            {loading ? 'Creating account...' : 'Create Account'}
                                        </button>
                                    </form>
                                )}

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => {
                                            setIsRegisterMode(!isRegisterMode);
                                            setError('');
                                            setForm({ email: '', password: '' });
                                            setRegisterForm({ fullName: '', username: '', email: '', password: '' });
                                        }}
                                    >
                                        {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}