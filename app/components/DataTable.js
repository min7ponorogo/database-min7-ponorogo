"use client";
// --- TAMBAHAN: Import State & Supabase ---
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

export default function DataTable({ data }) {
  // --- TAMBAHAN: Logika Cek Admin ---
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.email === 'min7ponorogo141197@gmail.com';
  // ------------------------------------

  if (!data || data.length === 0) return (
    <div className="p-20 text-center text-slate-400 font-medium">Data tidak ditemukan.</div>
  );

  const headers = Object.keys(data[0]).filter(k => k.toLowerCase() !== 'id').slice(0, 6);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {h.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
              {headers.map(h => (
                <td key={h} className="p-4 text-sm text-slate-600 font-medium">
                  {/* --- BAGIAN YANG DIUBAH: Logika Sensor NIK & Status Aktif --- */}
                  {h.toUpperCase() === 'NIK' && !isAdmin ? (
                    <span className="tracking-tighter text-slate-300">**********</span>
                  ) : String(row[h]).toLowerCase() === 'aktif' ? (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase">Aktif</span>
                  ) : (
                    row[h] || "-"
                  )}
                  {/* -------------------------------------------------------- */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
