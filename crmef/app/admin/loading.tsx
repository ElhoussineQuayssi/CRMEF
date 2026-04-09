export default function Loading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,82,186,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.08),_transparent_25%),#050816] text-slate-100">
      <section className="px-6 pt-24 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-slate-950/80 px-8 py-12 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
          <div className="h-4 w-32 rounded bg-slate-800 animate-pulse" />
          <div className="mt-6 h-10 w-3/4 rounded bg-slate-800 animate-pulse" />
          <div className="mt-4 h-5 w-1/2 rounded bg-slate-800 animate-pulse" />
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            ))}
          </div>
          <div className="h-96 rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
        </div>
      </section>
    </main>
  );
}