"use client";
import { useState } from 'react';

export default function Sidebar({ aktif, setAktif }) {
  const [isMinimal, setIsMinimal] = useState(false);

  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥' },
    { id: 'ortu', label: 'Orang Tua', icon: '👨‍👩‍👧' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out flex flex-col shadow-sm relative ${
        isMinimal ? 'w-20' : 'w-72'
      } hidden lg:flex h-full`}
    >
      {/* TOMBOL COLLAPSE - Hijau Emerald Pekat */}
      <button 
        onClick={() => setIsMinimal(!isMinimal)}
        className="absolute -right-3 top-10 bg-emerald-700 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-800 transition-all duration-300 z-50 border-2 border-white"
      >
        <span className={`text-[10px] transition-transform duration-500 ${isMinimal ? 'rotate-180' : 'rotate-0'}`}>
          ◀
        </span>
      </button>

      <div className="p-6 flex flex-col h-full overflow-hidden">
        {/* Label Navigasi */}
        <p className={`text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8 transition-opacity duration-300 ${
          isMinimal ? 'opacity-0' : 'opacity-100'
        }`}>
          {!isMinimal && "NAVIGASI"}
        </p>

        {/* List Menu */}
        <nav className="space-y-3 flex-1">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setAktif(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-200 ${
                aktif === m.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              } ${isMinimal ? 'justify-center px-0' : 'px-4'}`}
            >
              <span className="text-xl">{m.icon}</span>
              {!isMinimal && (
                <span className="text-sm whitespace-nowrap animate-in fade-in duration-500">
                  {m.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Contact Us - Box Hijau Muda */}
        <div className={`transition-all duration-500 ${isMinimal ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-[9px] font-black text-emerald-800 uppercase text-center mb-1">Contact Us</p>
            <p className="text-[10px] font-bold text-emerald-900 text-center truncate">min7ponorogo@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
