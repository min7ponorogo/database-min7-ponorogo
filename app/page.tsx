"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState<'1' | '2' | '3'>('1');

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

  // Statistik Data
  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* 1. HEADER: Nama Sekolah, NSM, dan Logo di kiri-kanan Selamat Datang */}
      <header className="bg-emerald-800 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo Kiri */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-emerald-800 font-black text-xl">MIN</span>
            </div>
            <div>
              <h1 className="text-2xl font-black leading-none">MIN 7 PONOROGO</h1>
              <p className="text-xs font-bold text-emerald-300 mt-1 uppercase tracking-widest">NSM: 111135020001</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <h2 className="text-xl font-medium italic opacity-90">"Selamat Datang"</h2>
            {/* Logo Kanan (Ikon Instansi) */}
            <div className="w-16 h-16 bg-emerald-700 rounded-lg flex items-center justify-center border border-emerald-500">
              <span className="text-white text-3xl">🕌</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. SIDE BAR: Navigasi Nomor 1, 2, 3 */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
          <div className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b">
            Menu Utama
          </div>
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setMenuAktif('1')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${menuAktif === '1' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span className="bg-black/10 w-6 h-6 rounded flex items-center justify-center text-[10px]">1</span> 
              Dashboard
            </button>
            <button 
              onClick={() => setMenuAktif('2')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${menuAktif === '2' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span className="bg-black/10 w-6 h-6 rounded flex items-center justify-center text-[10px]">2</span> 
              Daftar Siswa
            </button>
            <button 
              onClick={() => setMenuAktif('3')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${menuAktif === '3' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span className="bg-black/10 w-6 h-6 rounded flex items-center justify-center text-[10px]">3</span> 
              Rombongan Belajar
            </button>
          </nav>
        </aside>

        {/* 3. MAIN CONTENT: Area Konten */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Konten 1: Dashboard */}
          {menuAktif === '1' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Ringkasan Data</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Siswa</p>
                    <p className="text-2xl font-black">{totalSiswa}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Siswa Aktif</p>
                    <p className="text-2xl font-black text-emerald-700">{siswaAktif}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-600 uppercase">Belum Aktif</p>
                    <p className="text-2xl font-black text-rose-700">{siswaTidakAktif}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Rombel</p>
                    <p className="text-2xl font-black text-blue-700">{daftarKelas.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
                <span className="text-xl">📢</span>
                <p className="text-xs font-bold text-amber-800 italic">Pengumuman: Mohon verifikasi data siswa sebelum batas akhir semester.</p>
              </div>
            </div>
          )}

          {/* Konten 2: Daftar Siswa */}
          {menuAktif === '2' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b font-black text-gray-400 uppercase">
                  <tr>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">NISN</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {siswa.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50 uppercase font-bold">
                      <td className="p-4 text-gray-800">{s.NAMA}</td>
                      <td className="p-4 font-mono text-gray-400">{s.NISN || '-'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] ${s["STATUS SISWA"]?.toLowerCase() === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                          {s["STATUS SISWA"] || 'OFFLINE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Konten 3: Rombongan Belajar */}
          {menuAktif === '3' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {daftarKelas.map((kelas, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:border-emerald-500 transition-all">
                  <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Rombel</p>
                  <h4 className="text-xl font-black text-gray-800">KELAS {kelas}</h4>
                  <div className="mt-4 pt-4 border-t flex justify-between items-end">
                    <span className="text-3xl font-black text-emerald-600">
                      {siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length}
                      <span className="text-[10px] text-gray-400 ml-1 uppercase">Siswa</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      <footer className="bg-white border-t p-4 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
        MIN 7 Ponorogo • TA 2025/2026
      </footer>
    </div>
  )
}
