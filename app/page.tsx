import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function DaftarSiswa() {
  const cookieStore = await cookies()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: siswa, error } = await supabase
    .from('"Data Siswa"') 
    .select('NAMA, NISN, NIK, "ASAL SEKOLAH"')
    .order('NAMA', { ascending: true })

  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-black mb-6">DATABASE EMIS MIN 7</h1>
      <div className="border rounded-xl overflow-hidden shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white text-[10px] uppercase">
            <tr><th className="p-4">Nama</th><th className="p-4">Identitas</th></tr>
          </thead>
          <tbody className="divide-y uppercase text-xs">
            {siswa?.map((s: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-bold">{s.NAMA}</td>
                <td className="p-4 font-mono text-slate-500">{s.NISN}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Memuat Data...</div>}>
      <DaftarSiswa />
    </Suspense>
  )
}
