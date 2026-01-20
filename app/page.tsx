import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

async function DaftarSiswa() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: siswa, error } = await supabase
    .from('Data Siswa') 
    .select('NAMA, NISN, NIK, "DITERIMA DI KELAS", "ASAL SEKOLAH"')
    .order('NAMA', { ascending: true })

  if (error) return <div className="p-10 text-red-600 font-bold">Koneksi Database Gagal: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans text-slate-800">
      {/* Header Ala EMIS */}
      <div className="max-w-6xl mx-auto bg-white p-6 border-b-4 border-emerald-600 shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-emerald-900">EMIS DIGITAL MADRASAH</h1>
          <p className="text-xs font-bold text-slate-500 tracking-[0.3em]">MIN 7 PONOROGO</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold text-slate-400 italic">Tahun Pelajaran 2025/2026</p>
        </div>
      </div>

      {/* Tabel Utama */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-700 text-white text-[11px] uppercase">
                <th className="p-3 border-r border-emerald-600 w-12 text-center">No</th>
                <th className="p-3 border-r border-emerald-600">Identitas Siswa</th>
                <th className="p-3 border-r border-emerald-600">NISN / NIK</th>
                <th className="p-3 border-r border-emerald-600">Asal Sekolah</th>
                <th className="p-3 text-center">Kls</th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-gray-200">
              {siswa && siswa.length > 0 ? (
                siswa.map((s: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 text-center border-r font-mono text-gray-400">{i + 1}</td>
                    <td className="p-3 border-r font-black text-slate-900 uppercase">
                      {s.NAMA}
                    </td>
                    <td className="p-3 border-r leading-relaxed font-mono">
                      <div className="text-emerald-700 font-bold">{s.NISN || '-'}</div>
                      <div className="text-gray-400 text-[10px]">{s.NIK || '-'}</div>
                    </td>
                    <td className="p-3 border-r text-gray-600 text-[11px] uppercase italic">
                      {s["ASAL SEKOLAH"] || '-'}
                    </td>
                    <td className="p-3 text-center font-black bg-emerald-50 text-emerald-800">
                      {s["DITERIMA DI KELAS"]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400">Data tidak ditemukan dalam database EMIS.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <span>© 2026 Kementerian Agama RI - Versi Digital Madrasah</span>
        <span className="bg-gray-200 px-2 py-1 rounded text-gray-600">Status: Real-Time Sync</span>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-emerald-700 animate-pulse uppercase tracking-widest">Sinkronisasi EMIS...</div>}>
      <DaftarSiswa />
    </Suspense>
  )
}
