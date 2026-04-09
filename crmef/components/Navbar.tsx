import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-20 w-48 overflow-hidden">
            <Image src="/logo.png" alt="A. Essaghyry" fill className="object-cover" />
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link href="/resources" className="rounded-full px-4 py-2 transition hover:bg-slate-800/80 hover:text-slate-100">
            Ressources
          </Link>
          <Link href="/booking" className="rounded-full px-4 py-2 transition hover:bg-slate-800/80 hover:text-slate-100">
            Réserver
          </Link>
          <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-slate-800/80 hover:text-slate-100">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
