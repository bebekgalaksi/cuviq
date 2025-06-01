import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Uploads from '../assets/logo upload.png';
import Home from '../assets/home black.png';
import Background from '../assets/background_.png';
import Chatbot from '../assets/chatbot.png';
import User from '../assets/logo user.png';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Hanya file PDF yang diperbolehkan.');
    }
  };

  const handleExecute = async () => {
    if (!selectedFile) {
      alert('Silakan pilih file PDF terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('cv_file', selectedFile); 

    try {
      const response = await fetch('http://localhost:8000/match_cv/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const hasilCV = {
          summary: data.parsed_sections.description || 'Tidak ada deskripsi.',
          skill: data.parsed_sections.skills || 'Tidak ada skill.',
          education: data.parsed_sections.education_and_experience || 'Tidak ada pendidikan atau pengalaman.',
          jobs: data.top_matches.map((job) => ({
            title: job.job_title,
            company: 'Perusahaan Tidak Diketahui', // 🛠️ karena tidak ada nama company di response
            available: true,
            match: job.match_percentage,
          })),
        };

        navigate('/output', { state: hasilCV });
      } else {
        alert(data.detail || 'Gagal memproses file.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      alert('Terjadi kesalahan saat memproses file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-0 w-full h-[calc(100vh-35vh)] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <img
          src={Background}
          alt="Background"
          className="w-full h-full object-contain animate-float"
          style={{ animationDuration: '2s' }}
        />
        <Link to="/" className="absolute top-10 left-12">
          <img src={Home} alt="Home" className="w-8 h-8" />
        </Link>
        <img src={Chatbot} alt="Chatbot" className="absolute top-26 left-12 w-8 h-8" />
        <img src={User} alt="User" className="absolute top-10 right-12 w-12 h-12" />
      </div>

      {/* Bagian Bawah dengan Background Biru */}
      <div className="absolute bottom-0 w-full h-[35vh] bg-[#03045E] flex flex-col items-center justify-center px-8 py-12">
        <p className="text-lg text-white mb-15 text-center">
          Upload CV ATS anda dan dapatkan rekomendasi <br />
          pekerjaan impian sesuai skill yang anda miliki
        </p>


        <div className="flex flex-col items-center space-y-6">
          <label className="flex items-center justify-center bg-gray-300 rounded-xl shadow-md px-1 py-1 cursor-pointer w-[400px] max-w-lg transition-all duration-300 hover:bg-gray-400">
            <div className="flex items-center space-x-3 bg-white px-1 py-1 rounded-xl">
              <img src={Uploads} alt="Upload Icon" className="w-4 h-4" />
              <span className="text-sm text-black">{selectedFile ? selectedFile.name : 'Choose File'}</span>
            </div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Tombol Execute */}
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className={`px-10 py-2 rounded-full shadow font-semibold ${
            isLoading ? '!bg-blue-600 cursor-not-allowed' : '!bg-blue-600 hover:bg-blue-700 w-[150px] text-white !text-lg !font-extrabold transition-colors duration-300 !rounded-full'
          }`}
        >
          {isLoading ? 'Loading...' : 'Execute'}
        </button>
        </div>
      </div>
    </div>
  );
}