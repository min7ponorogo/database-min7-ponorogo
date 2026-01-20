"use client";
import { useState, useEffect } from 'react';

export default function Header({ search, setSearch }) {
  const [waktu, setWaktu] = useState(new Date());

  // Efek untuk menjalankan jam digital secara real-time
  useEffect(() => {
    const timer = setInterval(() => setWaktu(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-emerald-900 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-xl border-b-4 border-emerald-500 sticky top-0 z-50">
      
      {/* Bagian Kiri: Identitas Madrasah */}
      <div className="flex items-center gap-4">
        <div className="bg-white p-1.5 rounded-full shadow-lg ring-2 ring-emerald-400/50">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" 
            alt="Logo Kemenag" 
            className="w-10 h-auto" 
          />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none">MIN 7 PONOROGO</h1>
          <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1 italic">
            "Ikhlas Beramal"
          </p>
        </div>
      </div>

      {/* Bagian Tengah: Kolom Pencarian Global */}
      <div className="relative w-full md:w-96 my-2 md:my-0 group">
        <input 
          type="text" 
          placeholder="Cari NISN, Nama Siswa, atau Orang Tua..." 
          className="w-full bg-emerald-950/50 border border-emerald-700/50 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition-all placeholder-emerald-600 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-4 top-3 text-emerald-500 group-focus-within:text-emerald-300 transition-colors">
          🔍
        </span>
      </div>

      {/* Bagian Kanan: Jam Digital Modern */}
      <div className="hidden md:flex items-center gap-4 border-l border-emerald-800 pl-6">
        <div className="text-right">
          <p className="text-xl font-mono font-black text-emerald-400 leading-none tracking-tighter">
            {waktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[9px] font-bold text-emerald-200 uppercase mt-1 tracking-tighter">
            {waktu.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>
    </header>
  );
}
