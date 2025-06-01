import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cuviqbig from '../assets/logo_nyar.png';
import Back from '../assets/back.png';
import { getCSRFToken } from '../csrf';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    });
  }, []);

  const EyeIcon = ({ open }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223a10.477 10.477 0 0 1 16.02 0M3.98 15.777a10.477 10.477 0 0 0 16.02 0M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0 0 12 15a3 3 0 0 0 2.122-.878M15.592 15.592A10.477 10.477 0 0 1 3.98 15.777M9.88 9.88A3 3 0 0 1 14.12 14.12M20.02 8.223a10.477 10.477 0 0 1-1.576 1.618M12 6.5c1.98 0 3.867.7 5.373 1.873M12 17.5c-1.98 0-3.867-.7-5.373-1.873" />
      )}
    </svg>
  );

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Password dan konfirmasi tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const csrfToken = getCSRFToken();

      const res = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registrasi berhasil! Mengarahkan ke login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.message || 'Registrasi gagal.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat mengirim data.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 relative">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-lg px-8 py-12 text-center transition-all duration-500 hover:shadow-2xl">
        {/* Logo */}
        <img src={Cuviqbig} alt="CuviQ Logo" className="w-24 mx-auto mb-4" />
        
        {/* Judul */}
        <h2 className="text-xl font-bold text-black">Register Page</h2>
        <p className="text-sm text-black mb-6">Connect your skill to dream job</p>

        {/* Form Register */}
        <div className="space-y-4">
          {[ 
            { type: "text", name: "username", placeholder: "Username" },
            { type: "email", name: "email", placeholder: "Email" },
            { type: showPassword ? "text" : "password", name: "password", placeholder: "Password", toggle: setShowPassword },
            { type: showConfirmPassword ? "text" : "password", name: "confirmPassword", placeholder: "Konfirmasi Password", toggle: setShowConfirmPassword }
          ].map((field, index) => (
            <div key={index} className="relative">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={handleChange}
              />
              {field.toggle && (
                <span
                  role="button"
                  className="absolute right-4 top-3 text-white opacity-80 cursor-pointer"
                  onClick={() => field.toggle(prev => !prev)}
                >
                  <EyeIcon open={field.type === "text"} />
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          className="w-full mt-8 !bg-[#03045E] text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
          onClick={handleRegister}
        >
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </button>
        {message && (
          <p className={`text-center mt-4 text-sm ${message.includes('berhasil') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <p className="text-black mt-6 text-sm">
          Sudah punya akun? <Link to="/login" className="text-blue-800 font-semibold hover:underline">Login disini</Link>
        </p>
      </div>
      <Link to="/" className="fixed bottom-4 left-4 text-sm text-white hover:text-black flex items-center space-x-2">
        <img src={Back} alt="Back" className="w-8 h-8" />
      </Link>
    </div>
  );
}
