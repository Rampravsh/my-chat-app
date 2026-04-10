import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For password confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth(); // Get the register function from AuthContext
  const navigate = useNavigate(); // For redirection after registration

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register({ name, email, password }); // Call the register function from context
      navigate('/dashboard'); // Redirect to dashboard on successful registration
    } catch (err) {
      console.error('Registration error:', err);
      // Display a user-friendly error message
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Your Account</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Full Name"
            icon="user"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            type="email"
            placeholder="Email Address"
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
          <InputField
            type="password"
            placeholder="Confirm Password"
            icon="password" // Use password icon for confirm password too
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Sign Up Button */}
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
              'Sign Up'
            )}
          </button>
        </form>

        {/* Link */}
        <div className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;