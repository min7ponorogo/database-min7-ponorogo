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
        .select('NAMA, NISN, "DITERIMA DI KELAS", "STATUS SISWA", "JENIS KELAMIN"');
      if (data) setSiswa(data);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER: Identitas & Logo */}
      <header className="bg-emerald-900 text-white p-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-emerald-900 font-black text-xl text-center leading-none">MIN<br/>7</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none uppercase">MIN 7 Ponorogo</h1>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-[0.2em]">NSM: 111135020001</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-medium tracking-widest opacity-70 uppercase italic">Selamat Datang</h2>
            <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center border border-emerald-700">
              <span className="text-2xl">🏛️</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Navigasi Tanpa Nomor */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
          <nav className="p-6 space-y-3 font-bold">
            <button 
              onClick={() => setMenuAktif('dashboard')} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all ${menuAktif === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'}`}
            >
              <span className="text-xl">📊</span> Dashboard
            </button>
            <button 
              onClick={() => setMenuAktif('siswa')} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all ${menuAktif === 'siswa' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'}`}
            >
              <span className="text-xl">👥</span> Daftar Siswa
            </button>
            <button 
              onClick={() => setMenuAktif('rombel')} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all ${menuAktif === 'rombel' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'}`}
            >
              <span className="text-xl">🏫</span> Rombongan Belajar
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* VIEW: Dashboard */}
          {menuAktif === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Statistik Kelembagaan</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
                  <StatBox label="Total Siswa" value={totalSiswa} color="slate" />
                  <StatBox label="Siswa Aktif" value={siswaAktif} color="emerald" />
                  <StatBox label="Belum Aktif" value={siswaTidakAktif} color="rose" />
                  <StatBox label="Total Rombel" value={daftarKelas.length} color="blue" />
                </div>
              </div>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
                <span className="text-2xl">📢</span>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Pengumuman</p>
                  <p className="text-xs font-bold text-amber-900 leading-relaxed italic">
                    Harap segera memverifikasi data siswa yang belum memiliki status Masuk untuk sinkronisasi Pusat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Daftar Siswa */}
          {menuAktif === 'siswa' && (
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Nama Lengkap</th>
                    <th className="px-8 py-5 text-center">NISN</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 uppercase font-bold text-slate-700">
                  {siswa.map((s, i) => (
                    <tr key={i} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="px-8 py-5 font-black">{s.NAMA}</td>
                      <td className="px-8 py-5 text-center font-mono font-normal text-slate-400">{s.NISN || '-'}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${s["STATUS SISWA"]?.toLowerCase() === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                          {s["STATUS SISWA"] || 'OFFLINE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW: Rombongan Belajar */}
          {menuAktif === 'rombel' && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daftarKelas.map((kelas, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-emerald-500 transition-all group">
                  <p className="text-[10px] font-black text-gray-300 uppercase mb-2">Unit Kelas</p>
                  <h4 className="text-3xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors uppercase">Kelas {kelas}</h4>
                  <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center font-black">
                    <span className="text-4xl text-emerald-600">{siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Peserta Didik</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t p-6 text-center text-[10px] font-black text-gray-300 uppercase tracking-[1em] flex-shrink-0">
        MIN 7 Ponorogo
      </footer>
    </div>
  )
}

function StatBox({ label, value, color }: any) {
  const colors: any = {
    slate: "text-slate-800",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    blue: "text-blue-600"
  };
  return (
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black tracking-tighter ${colors[color]}`}>{value}</p>
    </div>
  )
}
