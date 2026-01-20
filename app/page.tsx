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

  // Statistik
  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR NAVIGATION - Ciri Khas Dashboard Beneran */}
      <div className="w-64 bg-emerald-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-emerald-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-emerald-900">M</div>
          <span className="font-black tracking-tighter text-lg">EMIS 4.0</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => setMenuAktif('dashboard')} className={`w-full text-left p-3 rounded-xl text-sm font-bold flex items-center gap-3 ${menuAktif === 'dashboard' ? 'bg-emerald-700 shadow-lg' : 'hover:bg-emerald-800 text-emerald-300'}`}>
            <span>📊</span> Dashboard
          </button>
          <button onClick={() => setMenuAktif('siswa')} className={`w-full text-left p-3 rounded-xl text-sm font-bold flex items-center gap-3 ${menuAktif === 'siswa' ? 'bg-emerald-700 shadow-lg' : 'hover:bg-emerald-800 text-emerald-300'}`}>
            <span>👥</span> Data Siswa
          </button>
          <button onClick={() => setMenuAktif('rombel')} className={`w-full text-left p-3 rounded-xl text-sm font-bold flex items-center gap-3 ${menuAktif === 'rombel' ? 'bg-emerald-700 shadow-lg' : 'hover:bg-emerald-800 text-emerald-300'}`}>
            <span>🏫</span> Rombongan Belajar
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-800 text-[10px] text-emerald-500 text-center font-bold">
          VERSI 2026.1.1
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="bg-white h-16 border-b flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Madrasah</span>
            <span className="text-xs font-bold text-gray-300">/</span>
            <span className="text-xs font-bold text-emerald-700">MIN 7 Ponorogo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-gray-800 leading-none">NSM: 111135020001</p>
              <p className="text-[10px] text-emerald-600 font-bold">Tahun Ajaran 2025/2026</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-emerald-100 flex items-center justify-center text-gray-400 font-bold">A</div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="p-6 overflow-y-auto">
          {menuAktif === 'dashboard' && (
            <div className="space-y-6">
              {/* BANNER */}
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 rounded-3xl text-white shadow-xl">
                <h2 className="text-3xl font-black mb-1">Selamat Datang di Portal EMIS</h2>
                <p className="opacity-80 text-sm">Monitoring Data Pendidikan MIN 7 Ponorogo secara Real-Time.</p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Siswa" value={totalSiswa} color="blue" />
                <StatCard label="Siswa Aktif" value={siswaAktif} color="emerald" />
                <StatCard label="Menunggu Validasi" value={siswaTidakAktif} color="rose" />
                <StatCard label="Rombongan Belajar" value={daftarKelas.length} color="amber" />
              </div>

              {/* PENGUMUMAN */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <p className="text-amber-800 text-xs font-bold italic">Info: Batas akhir validasi data semester ganjil adalah 30 Januari 2026.</p>
              </div>
            </div>
          )}

          {menuAktif === 'siswa' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b font-bold text-xs uppercase tracking-widest text-gray-500">Daftar Induk Siswa</div>
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 border-b text-gray-400 font-black">
                  <tr><th className="p-4">Nama Lengkap</th><th className="p-4">NISN</th><th className="p-4">Kelas</th><th className="p-4 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {siswa.map((s, i) => (
                    <tr key={i} className="hover:bg-emerald-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800 uppercase">{s.NAMA}</td>
                      <td className="p-4 font-mono text-gray-400">{s.NISN || '-'}</td>
                      <td className="p-4 font-black text-gray-500">KLS {s["DITERIMA DI KELAS"]}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s["STATUS SISWA"]?.toLowerCase() === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                          {s["STATUS SISWA"] || 'OFFLINE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {menuAktif === 'rombel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daftarKelas.map((kelas, i) => {
                const jml = siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length;
                return (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-emerald-500 transition-all cursor-default group">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Rombongan Belajar</p>
                    <h4 className="text-2xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors">KELAS {kelas}</h4>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-3xl font-black text-emerald-600">{jml} <span className="text-[10px] text-gray-400">Siswa</span></span>
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">GO</div>
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

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: "border-blue-500 text-blue-600",
    emerald: "border-emerald-500 text-emerald-600",
    rose: "border-rose-500 text-rose-600",
    amber: "border-amber-500 text-amber-600"
  };
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-b-4 ${colors[color]}`}>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  )
}
