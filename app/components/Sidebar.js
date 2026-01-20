"use client";

export default function Sidebar({ aktif, setAktif }) {
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥' },
    { id: 'ortu', label: 'Orang Tua', icon: '👨‍👩‍👧' },
    { id: 'alamat', label: 'Domisili', icon: '📍' },
    { id: 'aktivitas', label: 'Aktivitas', icon: '📝' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Navigasi</p>
      <nav className="space-y-2 flex-1">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setAktif(m.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
              aktif === m.id 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{m.icon}</span>
            <span className="text-sm">{m.label}</span>
          </button>
        ))}
      </nav>
      <div className="bg-slate-100 p-4 rounded-2xl">
        <p className="text-[9px] font-bold text-slate-500 uppercase italic text-center">"Contact Us"</p>
        <p className="text-[9px] font-bold text-slate-800 uppercase italic text-center">"min7ponorogo@gmail.com"</p>
      </div>
    </aside>
  );
}
