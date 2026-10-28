export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#020617] font-sans pb-24" role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">Cargando la guía deportiva…</p>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* HERO BANNER SKELETON */}
        <div className="mb-12 w-full min-h-[22rem] md:min-h-[24rem] rounded-[40px] bg-slate-900/50 animate-pulse border border-slate-800" aria-hidden="true"></div>

        {/* FEED EVENTOS SKELETON */}
        <section>
          <div className="flex items-center gap-4 mb-6" aria-hidden="true">
            <div className="h-4 w-40 bg-slate-800 rounded animate-pulse"></div>
            <div className="h-px w-full bg-slate-800/30"></div>
          </div>

          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 md:p-5" aria-hidden="true">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="h-5 w-16 bg-slate-800/70 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-slate-800/70 rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center">
                  <div className="flex shrink-0 items-center gap-3 md:min-w-[118px] md:flex-col md:items-start md:border-r md:border-white/10 md:pr-5 md:pb-0">
                    <div className="h-8 w-8 rounded-xl bg-slate-800/70 animate-pulse"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-10 bg-slate-800/70 rounded animate-pulse"></div>
                      <div className="h-4 w-14 bg-slate-800/70 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 bg-slate-800/70 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-slate-800/70 rounded animate-pulse"></div>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-2">
                    <div className="h-11 w-24 rounded-xl bg-slate-800/70 animate-pulse"></div>
                    <div className="h-11 w-11 rounded-xl bg-slate-800/70 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
