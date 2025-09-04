import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login({ onLoginSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const { login, register } = useContext(AuthContext);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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

    async function handleRegisterAttempt(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const result = await register('', '', '', '');
            if (!result.success) {
                setError(result.error);
            }
        } catch (error) {
            setError('Registration is not available');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="login-card p-4">
                            <div className="text-center mb-4">
                                <h2>{isRegisterMode ? 'Student Registration' : 'Student Login'}</h2>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {!isRegisterMode ? (
                                // Login Form
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <a href="#" className="text-primary" onClick={(e) => e.preventDefault()}>
                                            Forgot password?
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>

                                    <div className="text-center">
                                        <span className="text-muted">Don't have an account? </span>
                                        <button
                                            type="button"
                                            className="btn-link text-primary"
                                            onClick={() => setIsRegisterMode(true)}
                                            style={{ border: 'none', background: 'none', padding: 0, textDecoration: 'underline' }}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Registration "Form" (disabled)
                                <form onSubmit={handleRegisterAttempt}>
                                    <div className="alert alert-warning">
                                        <strong>Registration Disabled</strong><br />
                                        Please use the demo login credentials above.
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-secondary w-100 mb-3"
                                        onClick={() => setIsRegisterMode(false)}
                                    >
                                        Back to Login
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}