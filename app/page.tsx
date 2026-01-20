"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('NAMA, NISN, NIK, "DITERIMA DI KELAS", "ASAL SEKOLAH", "STATUS SISWA"')
        .order('NAMA', { ascending: true });
      if (data) setSiswa(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredSiswa = siswa.filter(s => 
    s.NAMA?.toLowerCase().includes(search.toLowerCase()) || 
    s.NISN?.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-700">
      {/* Top Navigation Bar */}
      <div className="bg-emerald-800 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg">
              <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-black text-white">M7</div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none">EMIS MOBILE</h1>
              <p className="text-[10px] opacity-70 uppercase tracking-widest">MIN 7 Ponorogo</p>
            </div>
          </div>
          <div className="text-[10px] font-bold bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700">
            TA 2025/2026
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Welcome Card & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-xl font-black text-slate-800 mb-1">Pencarian Data Siswa</h2>
          <p className="text-xs text-slate-500 mb-4">Silakan masukkan Nama atau NISN siswa untuk memverifikasi data.</p>
          <input 
            type="text"
            placeholder="Ketik Nama Siswa di sini..."
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-medium"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Data Counter */}
        <div className="flex gap-4 mb-4">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md">
            TOTAL: {siswa.length} SISWA
          </div>
          {search && (
            <div className="bg-white text-emerald-600 border border-emerald-600 px-4 py-2 rounded-lg text-xs font-bold">
              DITEMUKAN: {filteredSiswa.length}
            </div>
          )}
        </div>

        {/* List Data */}
        <div className="grid gap-3">
          {loading ? (
            <div className="text-center p-20 text-slate-400 font-bold animate-pulse">Sinkronisasi Server...</div>
          ) : filteredSiswa.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase text-sm">{s.NAMA}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">NISN: {s.NISN || '-'}</span>
                    <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded text-emerald-700 font-bold">KELAS {s["DITERIMA DI KELAS"]}</span>
                  </div>
                </div>
              </div>
              <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Asal Sekolah</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase">{s["ASAL SEKOLAH"] || '---'}</p>
                <span className="inline-block mt-1 text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase">
                  {s["STATUS SISWA"] || 'MASUK'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
