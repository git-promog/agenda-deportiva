"use client";

import { useState } from 'react';
import NextImage from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const login = async () => {
    if (cargando) return;
    setCargando(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Navegación completa: el proxy del servidor revalida la cookie
        window.location.href = '/admin';
      } else {
        alert(data.error || "Contraseña incorrecta");
        setCargando(false);
      }
    } catch {
      alert("Error al intentar iniciar sesión");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-[#0f172a] shadow-2xl border border-slate-800 p-10 rounded-[40px] text-center">
        <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={180} height={60} className="mx-auto mb-8" />
        <h1 className="text-xl font-black uppercase mb-6 text-slate-300">Acceso Restringido</h1>
        <input
          type="password"
          placeholder="Contraseña de Admin"
          className="w-full bg-[#020617] border border-slate-800 rounded-2xl p-4 mb-6 text-center text-white outline-none focus:border-[#a3e635] shadow-inner"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          autoFocus
        />
        <button
          onClick={login}
          disabled={cargando}
          className="w-full bg-[#a3e635] hover:bg-[#86c523] disabled:opacity-50 transition-colors text-black font-black p-4 rounded-2xl uppercase italic shadow-lg"
        >
          {cargando ? 'Verificando...' : 'Comenzar'}
        </button>
      </div>
    </div>
  );
}
