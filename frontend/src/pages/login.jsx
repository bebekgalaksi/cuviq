import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cuviq from '../assets/logo_nyar.png';
import Back from '../assets/back.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    if (!formData.name.trim() || !formData.password) {
      setMessage('Username dan password wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || 'Login gagal.');
      }

      if (!data.id) {
        throw new Error('User ID tidak ditemukan di response.');
      }

      localStorage.setItem('user', JSON.stringify(data));

      setIsSuccess(true);
      setMessage('Login berhasil! Mengarahkan ke halaman utama...');

      setTimeout(() => {
        navigate('/homepage');
      }, 1500);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 relative px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-lg px-8 py-12 text-center transition-all duration-500 hover:shadow-2xl">
        <img src={Cuviq} alt="CuviQ Logo" className="w-24 mx-auto mb-4" />

        <h2 className="text-xl font-bold text-black mb-1">Login Page</h2>
        <p className="text-sm text-black mb-6">Connect your skill to dream job</p>

        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-4 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Username"
            autoComplete="username"
          />

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-4 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 !bg-[#2563EB] text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-600 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`} role="alert">
            {message}
          </p>
        )}

        <p className="text-black mt-6 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-800 font-semibold hover:underline">
            Daftar dulu
          </Link>
        </p>
      </div>

      <Link
        to="/"
        className="fixed bottom-4 left-4 text-sm text-black flex items-center space-x-2"
        aria-label="Kembali ke halaman utama"
      >
        <img src={Back} alt="Back" className="w-8 h-8" />
      </Link>
    </div>
  );
}