import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-20">
      
      {/* HEADER SKELETON */}
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={200} height={50} className="h-10 w-auto opacity-50" />
            <div className="flex flex-col items-end gap-2">
              <div className="w-12 h-4 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-20 h-3 bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="relative mb-6 w-full px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 w-4 h-4" />
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl h-[50px] animate-pulse"></div>
          </div>

          {/* SKELETON FILTROS DE DEPORTES */}
          <div className="relative flex items-center mb-4">
            <div className="flex gap-2 overflow-hidden py-1 px-10 w-full mb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[34px] w-24 bg-slate-800/80 rounded-xl animate-pulse shrink-0"></div>
              ))}
            </div>
          </div>
          
          {/* SKELETON FILTROS DE FECHAS */}
          <div className="flex gap-2 pb-4 pt-4 border-t border-slate-900 overflow-hidden">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[28px] w-20 bg-slate-800/50 rounded-lg animate-pulse shrink-0"></div>
             ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* HERO BANNER SKELETON */}
        <div className="mb-12 w-full h-[320px] md:h-[400px] rounded-[40px] bg-slate-900/50 animate-pulse border border-slate-800"></div>

        {/* FEED EVENTOS SKELETON */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-4 w-40 bg-slate-800 rounded animate-pulse"></div>
            <div className="h-px w-full bg-slate-800/30"></div>
          </div>

          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="w-16 h-8 bg-slate-800/60 rounded animate-pulse shrink-0"></div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800/60 rounded-xl animate-pulse shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full max-w-[200px]">
                    <div className="w-1/2 h-3 bg-slate-800/60 rounded animate-pulse"></div>
                    <div className="w-full h-4 bg-slate-800/60 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-24 h-10 bg-slate-800/60 rounded-xl animate-pulse"></div>
                   <div className="w-10 h-10 bg-slate-800/60 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
