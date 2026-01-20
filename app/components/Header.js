"use client";
import { useState, useEffect } from 'react';

export default function Header() {
  const [waktu, setWaktu] = useState("");
  const [tanggal, setTanggal] = useState("");

  // Fungsi Jam Digital
  useEffect(() => {
    const updateWaktu = () => {
      const now = new Date();
      setWaktu(now.toLocaleTimeString('id-ID', { hour12: false }));
      setTanggal(now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }));
    };
    updateWaktu();
    const interval = setInterval(updateWaktu, 1000);
    return () => clearInterval(interval);
  }, []);

  // Link Direct dari Google Drive Anda
  const logoUrl = "https://lh3.googleusercontent.com/d/1cpRBbgN3qHLks1Dp6LKC7UG4UKf7q9r-";

  return (
    <header className="bg-[#065f46] text-white p-4 shadow-md flex items-center justify-between border-b-4 border-emerald-500/30">
      <div className="flex items-center gap-4">
        {/* Lingkaran Logo Putih Bersih */}
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-emerald-400 shadow-inner">
          <img 
            src={logoUrl} 
            alt="Logo MIN 7 Ponorogo" 
            className="w-11 h-11 object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=MIN7"; 
            }}
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-black leading-none tracking-tight">MIN 7 PONOROGO</h1>
          <p className="text-[10px] font-bold text-emerald-300 tracking-[0.2em] uppercase mt-1">
            Sistem Informasi Siswa Digital
          </p>
        </div>
      </div>

      {/* Bagian Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-emerald-300 group-focus-within:text-white transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder="Cari data siswa atau wali..." 
            className="w-full bg-emerald-900/40 border border-emerald-700/50 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-emerald-800 transition-all text-white placeholder-emerald-400/70"
          />
        </div>
      </div>

      {/* Jam Digital & Tanggal */}
      <div className="text-right border-l border-emerald-800/50 pl-6">
        <p className="text-2xl font-black text-emerald-400 tabular-nums leading-none mb-1">{waktu}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200/80">{tanggal}</p>
      </div>
    </header>
  );
}
