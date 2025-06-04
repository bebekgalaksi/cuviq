import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Cuviq from "../assets/logo_nyar.png";
import Interview from "../assets/interview.png";
import Hoeman from "../assets/online_cv.png";
import UploadIcon from "../assets/upload_cv.png";
import RekomIcon from "../assets/rekomendasi.png";
import LokasiIcon from "../assets/lokasi.png";

import Dataset from "../dataset/Tingkat Pengangguran Terbuka Berdasarkan Tingkat Pendidikan, 2024.json";
const statisticsData = [
  { pendidikan: "SMA Kejuruan", persentase: Dataset[0]["SMA Kejuruan"] },
  { pendidikan: "SMA Umum", persentase: Dataset[0]["SMA umum"] },
  { pendidikan: "Universitas", persentase: Dataset[0]["Universitas"] },
  { pendidikan: "Diploma", persentase: Dataset[0]["Diploma I/II/III"] },
];

function FeatureCard({ image, title, description }) {
  return (
    <div className="flex flex-col items-center text-center bg-[#0A066E] text-white rounded-xl px-6 py-8 w-full max-w-sm mx-auto shadow-lg 
                    transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-opacity-95">
      <img src={image} alt={title} className="mb-4 h-16" />
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-base leading-relaxed opacity-90">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [animateTitle, setAnimateTitle] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-[#e9e5e5] to-gray-200 min-h-screen w-full overflow-auto font-sans">
    
      <header className="sticky top-0 z-50 bg-[#f4f4f4] shadow-md py-3 px-8 md:px-30 flex justify-between items-center">
        <img src={Cuviq} alt="Cuviq Logo" className="h-20" />
        <nav className="hidden md:flex items-center space-x-8">
          {["home", "fitur", "statistics", "contact-us"].map((id, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(id)}
              className="!bg-transparent text-[#0A066E] hover:text-blue-800 text-base font-medium transition duration-300"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <Link
            to="/login"
            className="border border-[#0A066E] text-[#0A066E] px-5 py-2 rounded-md text-base font-medium hover:bg-[#0A066E] hover:text-white transition duration-300"
          >
            Login
          </Link>
        </nav>
      </header>

      <section
        id="home"
        className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-20 px-8 md:px-32 pt-32 pb-20 bg-gradient-to-br from-blue-100 to-indigo-300"
      >
        <div className="md:w-1/2 mb-20 md:mb-0 text-left z-20">
          <h2
            className={`text-8xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-10 max-w-xl cursor-pointer transition-opacity duration-700 ${
              animateTitle ? "animate-fade-in" : ""
            }`}
          >
            Rekomendasi Pekerjaan Berdasarkan <br /> CV ATS Anda
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-16 max-w-lg md:max-w-2xl font-semibold">
            Upload CV ATS anda dan dapatkan rekomendasi pekerjaan paling cocok berdasarkan skill yang terdeteksi secara otomatis.
          </p>
          <div className="flex justify-start mt-12">
            <Link
              to="/register"
              className="bg-[#0A066E] !text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-[#07045A] hover:shadow-xl"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end pr-0 relative z-0 mt-20 ml-20">
          <img src={Hoeman} alt="Hoeman illustration" className="w-auto scale-125 animate-float" />
        </div>
      </section>

      <section id="fitur" className="py-24 px-6 md:px-24 bg-gradient-to-br from-white to-gray-100 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-[#0A066E] text-center mb-16">Fitur Unggulan Kami</h2>

        <div className="flex flex-col md:flex-row items-center gap-16 w-full max-w-7xl">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={Interview} alt="Ilustrasi Interview" className="w-full max-w-xl md:max-w-md drop-shadow-xl rounded-xl" />
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-12">
            {[
              {
                image: RekomIcon,
                title: "Rekomendasi Berbasis Machine Learning",
                description: "Upload CV ATS Anda dan dapatkan pekerjaan paling relevan sesuai skill yang Anda miliki."
              },
              {
                image: UploadIcon,
                title: "Upload CV ATS",
                description: "Mendukung format PDF untuk ekstraksi CV otomatis dan akurat."
              },
              {
                image: LokasiIcon,
                title: "Terhubung dengan Berbagai Perusahaan",
                description: "Temukan rekomendasi perusahaan dan lowongan pekerjaan yang sesuai dengan profil Anda."
              }
            ].map((feature, index) => (
              <div key={index} className="relative flex items-center gap-6 bg-white text-[#0A066E] rounded-xl shadow-lg p-6
                  hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-gray-200 max-w-md mx-auto">
                {/* Efek Floating */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#0A066E] rounded-full flex items-center justify-center shadow-md">
                  <img src={feature.image} alt={feature.title} className="w-6 h-6" />
                </div>
                <div className="pl-12">
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="statistics"
        className="py-24 px-6 md:px-24 bg-gradient-to-br from-white to-gray-100 flex flex-col items-center text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A066E] mb-6 animate-fade-in">
          Statistik Pengangguran 2024 Berdasarkan Pendidikan
        </h2>
        <p className="text-gray-700 mb-10 max-w-2xl text-base md:text-lg leading-relaxed">
          Data tahun 2024 menunjukkan bahwa tingkat pengangguran tertinggi berasal dari lulusan 
          <strong>SMA Kejuruan</strong> dengan <strong>9.01%</strong>. 
          Sementara itu, lulusan <strong>Diploma</strong> memiliki tingkat pengangguran terendah, yaitu 
          <strong>4.83%</strong>, mengindikasikan efektivitas pendidikan vokasi dalam mempersiapkan tenaga kerja.
        </p>

        <div className="w-full h-80 md:h-96 max-w-4xl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statisticsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pendidikan" tick={{ fill: "#0A066E", fontWeight: "bold" }} />
              <YAxis unit="%" tick={{ fill: "#0A066E", fontWeight: "bold" }} />
              <Tooltip contentStyle={{ backgroundColor: "#0A066E", color: "#fff" }} />
              <Bar dataKey="persentase" fill="url(#colorGradient)" radius={[10, 10, 0, 0]}>
                {statisticsData.map((entry, index) => (
                  <text key={index} x={index * 100 + 50} y={entry.persentase * 10} 
                    dy={-6} fontSize="14" fill="#0A066E" fontWeight="bold">
                    {entry.persentase}%
                  </text>
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90E2" />
                  <stop offset="100%" stopColor="#0A066E" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <footer id="contact-us" className="bg-[#03045e] text-white py-12 px-6 md:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <img src={Cuviq} alt="Cuviq Logo" className="h-20 mb-4 md:mb-0" />
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold">Project Base Learning</p>
            <p className="text-sm opacity-80">Email: contact@cuviq.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm opacity-80">
          © 2025 Curriculum Vitae Qu [CuViQ].
        </div>
      </footer>
    </div>
  );
}
