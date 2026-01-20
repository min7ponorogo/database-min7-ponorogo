"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa' | 'rombel'>('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('NAMA, NISN, "DITERIMA DI KELAS", "STATUS SISWA", "JENIS KELAMIN", "ASAL SEKOLAH"');
      if (data) setSiswa(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Logika Statistik
  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* SIDEBAR - Navigasi Khas EMIS */}
      <div className="w-72 bg-[#064E3B] text-white hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-emerald-800/50 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-[#064E3B] font-black text-2xl tracking-tighter">M7</span>
          </div>
          <h1 className="font-black text-center leading-tight tracking-tight uppercase">Dashboard Emis<br/>MIN 7 Ponorogo</h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <button onClick={() => setMenuAktif('dashboard')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${menuAktif === 'dashboard' ? 'bg-emerald-600 shadow-xl' : 'text-emerald-300 hover:bg-emerald-800'}`}>
            <span className="text-lg">🏠</span> Beranda Utama
          </button>
          <button onClick={() => setMenuAktif('siswa')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${menuAktif === 'siswa' ? 'bg-emerald-600 shadow-xl' : 'text-emerald-300 hover:bg-emerald-800'}`}>
            <span className="text-lg">📋</span> Data Induk Siswa
          </button>
          <button onClick={() => setMenuAktif('rombel')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${menuAktif === 'rombel' ? 'bg-emerald-600 shadow-xl' : 'text-emerald-300 hover:bg-emerald-800'}`}>
            <span className="text-lg">🚪</span> Rombongan Belajar
          </button>
        </nav>
        
        <div className="p-6 text-center text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">
          Version 4.0.2 Stable
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER / TOPBAR */}
        <header className="bg-white h-20 border-b px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Madrasah</span>
            <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              Terakreditasi A <span className="text-slate-200">|</span> NSM: 111135020001
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 hidden sm:block">
              <p className="text-[9px] font-black text-emerald-700 uppercase leading-none mb-1">Tahun Ajaran</p>
              <p className="text-xs font-bold text-emerald-900">2025/2026 Ganjil</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-400">ADM</div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {menuAktif === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              {/* WELCOME BANNER */}
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black tracking-tighter mb-3 uppercase">Selamat Datang</h3>
                  <p className="text-emerald-100 max-w-xl text-sm font-medium leading-relaxed">
                    Sistem Integrasi Data EMIS MIN 7 Ponorogo. Monitoring rekapitulasi siswa, 
                    validasi rombel, dan pemantauan status keaktifan dalam satu panel kendali.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard label="Total Terdaftar" value={totalSiswa} icon="📁" border="border-slate-300" />
                <StatCard label="Siswa Aktif" value={siswaAktif} icon="✅" border="border-emerald-500" />
                <StatCard label="Belum Aktif" value={siswaTidakAktif} icon="⚠️" border="border-rose-400" />
                <StatCard label="Total Rombel" value={daftarKelas.length} icon="🏫" border="border-blue-500" />
              </div>

              {/* INFO BOX */}
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-4">
                <span className="text-xl">📢</span>
                <div>
                  <h4 className="text-xs font-black text-amber-800 uppercase mb-1 tracking-widest">Pengumuman Terkini</h4>
                  <p className="text-xs text-amber-900 leading-relaxed font-bold italic">
                    Segera lakukan pemutakhiran data untuk siswa dengan status "OFFLINE" agar sinkronisasi pusat tetap berjalan lancar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {menuAktif === 'siswa' && (
            <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">Master Data Siswa</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Live Update</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white border-b text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <tr>
                        <th className="px-8 py-5">Nama Lengkap</th>
                        <th className="px-8 py-5">NISN</th>
                        <th className="px-8 py-5">Kelas</th>
                        <th className="px-8 py-5 text-center">Status Keaktifan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {siswa.map((s, i) => (
                        <tr key={i} className="hover:bg-emerald-50/50 transition-all duration-200 group">
                          <td className="px-8 py-5 font-black text-slate-800 uppercase text-xs group-hover:text-emerald-700">{s.NAMA}</td>
                          <td className="px-8 py-5 font-mono text-slate-400 text-[11px]">{s.NISN || '---'}</td>
                          <td className="px-8 py-5 font-bold text-slate-500 text-xs tracking-widest">KLS {s["DITERIMA DI KELAS"]}</td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              s["STATUS SISWA"]?.toLowerCase() === 'masuk' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-rose-100 text-rose-600 shadow-sm'
                            }`}>
                              {s["STATUS SISWA"] || 'OFFLINE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {menuAktif === 'rombel' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
              {daftarKelas.map((kelas, i) => {
                const jml = siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length;
                return (
                  <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-slate-100 hover:border-emerald-500 hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500 transition-all"></div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 relative z-10">Rombel Aktif</p>
                    <h4 className="text-3xl font-black text-slate-800 mb-6 group-hover:text-emerald-700 transition-colors">KELAS {kelas}</h4>
                    <div className="flex items-end justify-between relative z-10">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total Peserta Didik</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter mt-1">{jml}</p>
                      </div>
                      <div className="bg-slate-100 px-4 py-2 rounded-2xl group-hover:bg-emerald-100 transition-all">
                        <span className="text-[10px] font-black text-emerald-800">Cek Detail →</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, border }: any) {
  return (
    <div className={`bg-white p-7 rounded-[2rem] shadow-sm border-b-8 ${border} transition-transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-xl opacity-40">{icon}</span>
      </div>
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
  )
}
