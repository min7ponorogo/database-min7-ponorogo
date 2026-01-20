"use client";
import { useState, useEffect } from 'react';

export default function Header({ search, setSearch }) {
  const [waktu, setWaktu] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setWaktu(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-emerald-900 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-xl border-b-4 border-emerald-500 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded-full shadow-lg border-2 border-emerald-400">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" 
            alt="Logo" 
            className="w-10 h-auto" 
          />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none">MIN 7 PONOROGO</h1>
          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1">Sistem Informasi Siswa Digital</p>
        </div>
      </div>

      <div className="relative w-full md:w-96 my-2 md:my-0">
        <input 
          type="text" 
          placeholder="Cari data siswa atau wali..." 
          className="w-full bg-emerald-950/50 border border-emerald-700/50 rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-400 outline-none text-white transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-3.5 top-2.5 opacity-40">🔍</span>
      </div>

      <div className="hidden md:block text-right border-l border-emerald-800 pl-6">
        <p className="text-lg font-mono font-black text-emerald-400 leading-none">
          {waktu.toLocaleTimeString('id-ID')}
        </p>
        <p className="text-[9px] font-bold text-emerald-200 uppercase mt-1">
          {waktu.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long'})}
        </p>
      </div>
    </header>
  );
}
