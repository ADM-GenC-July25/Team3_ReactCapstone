import { useState } from 'react';
import './Login.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        console.log(form.email, form.password);

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(res => setTimeout(res, 800));
            console.log('Logged in with:', form);
            alert('Login successful!');
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                                <h1 className="h4 mb-4 text-center">Student Login</h1>

                                {/* {error && (
                                    <div className="alert alert-danger py-2" role="alert">
                                        {error}
                                    </div>
                                )} */}

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
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        )}
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}