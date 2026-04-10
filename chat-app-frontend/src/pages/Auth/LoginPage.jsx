import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Assuming username is email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate(); // For redirection after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password }); // Call the login function from context
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      console.error('Login error:', err);
      // Display a user-friendly error message
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ChitChat Logo" className="h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back!</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <InputField
            type="email" // Use email type for username
            placeholder="Email"
            icon="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            icon="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-md flex items-center justify-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
          <span className="mx-2">|</span>
          <p className="inline">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;