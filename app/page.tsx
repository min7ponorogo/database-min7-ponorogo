"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa' | 'rombel'>('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('*')
        .order('DITERIMA DI KELAS', { ascending: false });
      if (data) setSiswa(data);
    };
    fetchData();
  }, [supabase]);

  const filteredSiswa = siswa.filter(s => 
    s.NAMA?.toLowerCase().includes(search.toLowerCase()) || 
    s.NISN?.toString().includes(search)
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER UTAMA */}
      <header className="bg-emerald-900 text-white p-4 flex justify-between items-center shadow-lg border-b-4 border-emerald-500">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full w-12 h-12 flex items-center justify-center shadow-inner">
             <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" 
                alt="Logo Kemenag" 
                className="w-10 h-auto" 
             />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight uppercase tracking-tight">MIN 7 PONOROGO</h1>
            <p className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wider">Jl. Al-Huda, Winong, Jetis, Ponorogo</p>
          </div>
        </div>
        <div className="text-right hidden md:block border-l border-emerald-700 pl-4">
          <p className="text-sm font-medium italic text-emerald-100 italic">"Ikhlas Beramal"</p>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Tahun Ajaran 2025/2026</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-20">
          <nav className="space-y-2 flex-1">
            <button onClick={() => setMenuAktif('dashboard')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'dashboard' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
              📊 <span>Dashboard</span>
            </button>
            <button onClick={() => setMenuAktif('siswa')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'siswa' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
              👥 <span>Daftar Siswa</span>
            </button>
            <button onClick={() => setMenuAktif('rombel')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'rombel' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
              🏫 <span>Rombongan Belajar</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Admin Madrasah</span>
            <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[11px] text-emerald-800 font-bold break-all">min7ponorogo@gmail.com</p>
            </div>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {menuAktif === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2 leading-tight">Selamat Datang di Sistem Informasi Digital MIN 7 Ponorogo</h2>
                  <p className="opacity-80 text-sm max-w-md leading-relaxed">Kelola data EMIS, monitoring rombongan belajar, dan administrasi kesiswaan secara terpadu.</p>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-10 select-none">🕌</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Total Peserta Didik</p>
                  <h3 className="text-4xl font-black text-emerald-800">{siswa.length} <span className="text-sm font-normal text-slate-400">Siswa</span></h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Status Aktif (Masuk)</p>
                  <h3 className="text-4xl font-black text-blue-700">{siswa.filter(s => s["STATUS SISWA"] === 'Masuk').length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Periode Data</p>
                  <h3 className="text-xl font-black text-slate-700 mt-2 tracking-tight">T.A 2025 / 2026</h3>
                </div>
              </div>
            </div>
          )}

          {menuAktif === 'siswa' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Data Peserta Didik</h3>
                <div className="relative w-full md:w-80">
                  <input 
                    type="text" 
                    placeholder="Cari Nama atau NISN..." 
                    className="w-full px-5 py-3 bg-slate-100 border-2 border-transparent rounded-2xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                      <th className="p-5">Nama Lengkap</th>
                      <th className="p-5">NISN</th>
                      <th className="p-5 text-center">Kelas</th>
                      <th className="p-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {filteredSiswa.map((item, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/40 transition-colors group">
                        <td className="p-5 font-bold text-slate-800 group-hover:text-emerald-700 uppercase">{item.NAMA}</td>
                        <td className="p-5 text-slate-500 font-mono">{item.NISN}</td>
                        <td className="p-5 text-center">
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-black text-[11px] uppercase">
                            KELAS {item["DITERIMA DI KELAS"]}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${item["STATUS SISWA"] === 'Masuk' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            {item["STATUS SISWA"]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menuAktif === 'rombel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in duration-300">
              {[6, 5, 4, 3, 2, 1].map((kls) => (
                <div key={kls} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-emerald-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                      {kls}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Rombongan Belajar</span>
                  </div>
                  <h4 className="font-bold text-slate-500 mb-1 relative z-10">Total Siswa Kelas {kls}</h4>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-5xl font-black text-slate-800">
                      {siswa.filter(s => String(s["DITERIMA DI KELAS"]) === String(kls)).length}
                    </span>
                    <span className="text-sm font-bold text-slate-400 uppercase">Siswa</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] group-hover:opacity-[0.1] transition-opacity font-black select-none uppercase italic">
                    MIN 7
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
