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
      className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out flex flex-col shadow-sm relative group ${
        isMinimal ? 'w-24' : 'w-72'
      } hidden lg:flex h-full`}
    >
      {/* Tombol Toggle yang dipercantik */}
      <button 
        onClick={() => setIsMinimal(!isMinimal)}
        className="absolute -right-4 top-12 bg-white text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all duration-300 z-50 group-hover:scale-110"
      >
        <span className={`transition-transform duration-500 ${isMinimal ? 'rotate-180' : 'rotate-0'}`}>
          {isMinimal ? '➔' : '⬅'}
        </span>
      </button>

      <div className="p-6 flex flex-col h-full overflow-hidden">
        {/* Label Navigasi */}
        <p className={`text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 transition-all duration-300 ${
          isMinimal ? 'text-center' : 'px-4'
        }`}>
          {isMinimal ? '•••' : 'NAVIGASI'}
        </p>

        {/* List Menu */}
        <nav className="space-y-3 flex-1">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setAktif(m.id)}
              title={m.label}
              className={`w-full flex items-center gap-4 p-4 rounded-[1.25rem] font-bold transition-all duration-300 group/item ${
                aktif === m.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'
              } ${isMinimal ? 'justify-center' : ''}`}
            >
              <span className={`text-xl transition-transform duration-300 ${aktif === m.id ? 'scale-110' : ''}`}>
                {m.icon}
              </span>
              {!isMinimal && (
                <span className="text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                  {m.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bagian Contact Us yang lebih rapi */}
        <div className={`mt-auto transition-all duration-500 ${
          isMinimal ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center mb-1">Hubungi Kami</p>
            <p className="text-[10px] font-bold text-emerald-800 text-center truncate">min7ponorogo@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
