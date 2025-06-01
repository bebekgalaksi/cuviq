import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cuviq from '../assets/logo_nyar.png';
import Back from '../assets/back.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    });
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/homepage');
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 relative">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-lg px-8 py-12 text-center transition-all duration-500 hover:shadow-2xl">
        <img src={Cuviq} alt="CuviQ Logo" className="w-24 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-black">Login Page</h2>
        <p className="text-sm text-black mb-6">Connect your skill to dream job</p>
        <form className="space-y-4">
          <div className="relative">
            <input type="text" placeholder="Username" className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <span className="absolute right-4 top-3 text-white opacity-80 cursor-pointer">
            </span>
          </div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"/>
            <span role="button" className="absolute right-4 top-3 text-white opacity-80 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              <EyeIcon open={showPassword} />
            </span>
          </div>  
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full !bg-[#03045E] text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-black mt-6 text-sm">
          Belum punya akun? <Link to="/register" className="text-blue-800 font-semibold hover:underline">Daftar dulu</Link>
        </p>
      </div>
      <Link to="/" className="fixed bottom-4 left-4 text-sm text-black hover:text-black flex items-center space-x-2">
        <img src={Back} alt="Back" className="w-8 h-8" />
      </Link>
    </div>
  );
}
