import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cuviqbig from '../assets/logo_nyar.png';
import Back from '../assets/back.png';

// Eye icon component
const EyeIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5"
  >
    {open ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223a10.477 10.477 0 0 1 16.02 0M3.98 15.777a10.477 10.477 0 0 0 16.02 0M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.477 10.477A3 3 0 0 0 12 15a3 3 0 0 0 2.122-.878M15.592 15.592A10.477 10.477 0 0 1 3.98 15.777M9.88 9.88A3 3 0 0 1 14.12 14.12M20.02 8.223a10.477 10.477 0 0 1-1.576 1.618M12 6.5c1.98 0 3.867.7 5.373 1.873M12 17.5c-1.98 0-3.867-.7-5.373-1.873"
      />
    )}
  </svg>
);

// Password input reusable component
const PasswordInput = ({ name, value, onChange, show, onToggle, placeholder, autoFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-gray placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <span
        role="button"
        className="absolute right-4 top-3 text-white opacity-80 cursor-pointer"
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <EyeIcon open={show} />
      </span>
    </div>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setMessage('Semua field wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('Format email tidak valid.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Password dan konfirmasi tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage('Registrasi berhasil! Mengarahkan ke login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.detail || data.message || 'Registrasi gagal.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 relative">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-lg px-8 py-12 text-center transition-all duration-500 hover:shadow-2xl">
        <img src={Cuviqbig} alt="CuviQ Logo" className="w-24 mx-auto mb-4" />

        <h2 className="text-xl font-bold text-black">Register Page</h2>
        <p className="text-sm text-black mb-6">Connect your skill to dream job</p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Username"
            className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-gray placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.name}
            onChange={handleChange}
            autoComplete="username"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-gray placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            placeholder="Password"
            autoFocus={false}
          />

          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
            placeholder="Confirm Password"
            autoFocus={false}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 !bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <div className="mt-6 text-white">
          Sudah punya akun?{' '}
          <Link to="/login" className="underline text-blue-200 hover:text-blue-400">
            Login
          </Link>
        </div>
      </div>

      <Link to="/" className="fixed bottom-4 left-4 text-sm text-black hover:text-black flex items-center space-x-2">
        <img src={Back} alt="Back" className="w-5 h-5" />
      </Link>
    </div>
  );
}
