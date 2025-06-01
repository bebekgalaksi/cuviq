// src/pages/Output.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '../assets/logo user.png';
import Back from '../assets/back.png';
import Available from '../assets/logo available.png';
import Unavailable from '../assets/logo not available.png';
import Summary from '../assets/logo summary.png';
import LogoutIcon from '../assets/logout.png';

export default function Output() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [showMenu, setShowMenu] = useState(false);

  if (!data) {
    return (
      <div className="text-center mt-20 font-poppins">
        <p className="text-red-500 text-lg font-semibold">
          Anda harus mengupload CV terlebih dahulu dari halaman utama.
        </p>
        <button
          onClick={() => navigate('/homepage')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
        >
          Kembali ke Homepage
        </button>
      </div>
    );
  }

  const getMatchColor = (match) => {
    if (match >= 75) return 'bg-green-500';
    if (match >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-200 text-gray-900 font-poppins">
      <div className="flex flex-col items-center justify-center px-6 py-8 shadow-lg bg-[#E9E5E5] text-gray-900 text-center !fixed top-0 left-0 w-full z-50 relative">
        <img src={Back} alt="Back" className="w-10 h-10 cursor-pointer absolute left-12 opacity-80 hover:opacity-100 transition" onClick={() => navigate('/homepage')} />
        <div className="flex-1 flex justify-center">
          <div className="px-6 py-3 rounded-lg text-lg font-bold bg-gradient-to-br from-blue-50 to-indigo-200 shadow-md text-black text-center w-fit mx-auto">
            Hasil Rekomendasi Pekerjaan
          </div>
        </div>
        <p className="text-center text-black mt-4 text-sm font-lg">
          Berikut adalah hasil rekomendasi pekerjaan berbasis machine learning hasil scan dari CV ATS anda.
        </p>
        <div className="absolute right-12">
          <img 
            src={UserIcon} 
            alt="UserIcon" 
            className="w-10 h-10 rounded-full border border-gray-500 object-cover cursor-pointer hover:shadow-sm transition"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 top-14 bg-white shadow-xl rounded-lg p-5 w-56 text-gray-800 transition transform scale-95 hover:scale-100">
              <p className="text-lg font-semibold">Akun:Nama Pengguna</p>
              <hr className="my-3 border-gray-300" />
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition" onClick={() => navigate('/login')}>
                ➕ <span className="font-semibold">Tambah Akun</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 transition mt-2" onClick={() => navigate('/landingpage')}>
                <img src={LogoutIcon} alt="Logout" className="w-6 h-6" />
                <span className="font-semibold">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Jarak antara header dan main section */}
      <div className="mt-50"></div>

      {/* 🔹 CV Summary */}
      <div className="bg-white max-w-4xl mx-auto rounded-2xl p-6 shadow-md mb-12 border text-left">
        <div className="flex flex-col items-center">
          <img src={Summary} alt="Summary" className="w-12 h-12 opacity-90" />
          <h2 className="text-xl font-bold text-gray-700 mt-2">CV SUMMARY</h2>
        </div>
        <div className="mt-4 text-md space-y-2 text-gray-700 font-medium pl-6">
          <p><strong>Summary:</strong> {data.summary || 'Tidak tersedia'}</p>
          <p><strong>Skill:</strong> {data.skill || 'Tidak tersedia'}</p>
          <p><strong>Education & Experience:</strong> {data.education || 'Tidak tersedia'}</p>
        </div>
      </div>


      {/* Job Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center px-8 pb-16">
        {data.jobs && data.jobs.length > 0 ? (
          data.jobs.map((job, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md h-56 flex flex-col justify-between transition duration-300 hover:shadow-2xl hover:scale-[1.02] border">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-lg text-gray-700">{job.title}</p>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={job.available ? Available : Unavailable} alt={job.available ? 'Available' : 'Unavailable'} className="w-6 h-6 opacity-90" />
                  <p className={`font-semibold ${job.available ? 'text-green-600' : 'text-red-600'}`}>
                    {job.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
                <div className={`${getMatchColor(job.match)} h-3 rounded-full`} style={{ width: `${job.match}%` }}></div>
              </div>

              <p className="text-sm text-center mt-3 text-gray-700 font-medium">
                Tingkat Kecocokan: <strong>{job.match?.toFixed(0)}%</strong>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full font-medium">
            Tidak ada rekomendasi pekerjaan ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}