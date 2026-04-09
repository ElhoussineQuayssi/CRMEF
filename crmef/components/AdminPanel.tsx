"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Lock, ShieldCheck, LogOut, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { AdminLayout } from "./admin/AdminLayout";
import { BookingsTab } from "./admin/BookingsTab";
import { ResourcesTab } from "./admin/ResourcesTab";
import { ToastProvider, useToast } from "./admin/Toast";
import { getResources, type Resource } from "@/actions/resources";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function buildClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

interface BookingRecord {
  id: number;
  student_name: string;
  student_phone: string;
  subject_topic: string;
  date: string;
  time_slot: string;
  status: string;
}

function AdminPanelInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "resources">("bookings");
  const [userEmail, setUserEmail] = useState<string>("");

  const supabase = useMemo(() => buildClient(), []);

  const loadData = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings((bookingsData as BookingRecord[]) || []);
    setLoading(false);
  };

  const loadResources = async () => {
    const data = await getResources();
    setResources(data);
  };

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(true);
        setUserEmail(data.session.user.email || "");
        loadData();
        loadResources();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(true);
        setUserEmail(session.user.email || "");
        loadData();
        loadResources();
      } else {
        setSession(false);
        setUserEmail("");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async () => {
    if (!supabase) {
      setError("Supabase configuration is missing.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSession(true);
    setError(null);
    await loadData();
    await loadResources();
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(false);
    setBookings([]);
    setResources([]);
  };

  const handleRefresh = () => {
    loadData();
    loadResources();
  };

  if (!supabase) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 text-slate-200 shadow-[0_36px_100px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4 text-cyan-300">
          <Lock className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Configuration administrateur requise</h2>
        </div>
        <p className="mt-4 text-slate-300">
          Pour activer la connexion administrateur, définissez <code className="rounded bg-slate-900 px-2 py-1">NEXT_PUBLIC_SUPABASE_URL</code> et <code className="rounded bg-slate-900 px-2 py-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans votre environnement.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-2xl border border-slate-800 bg-[#111827] p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 mb-4">
              <ShieldCheck className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Connexion Enseignant</h2>
            <p className="text-slate-400 text-sm mt-2">Gérez vos réservations et vos séances en toute simplicité.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@crmef.ma"
                  className="w-full rounded-xl border border-slate-700 bg-[#0a0f1a] px-4 py-3 pl-12 text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                <a href="#" className="text-xs text-cyan-400 hover:underline">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-[#0a0f1a] px-4 py-3 pl-12 text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400 text-center">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 font-bold text-[#0a0f1a] shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-cyan-300 hover:shadow-cyan-500/30"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onSignOut={signOut} userEmail={userEmail} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span>Tableau de bord</span>
        <span>/</span>
        <span className="text-slate-300 capitalize">{activeTab === "bookings" ? "Réservations" : "Ressources"}</span>
      </div>

      {activeTab === "bookings" ? (
        <BookingsTab initialBookings={bookings} onRefresh={handleRefresh} />
      ) : (
        <ResourcesTab initialResources={resources} onRefresh={handleRefresh} />
      )}
    </AdminLayout>
  );
}

export function AdminPanel() {
  return (
    <ToastProvider>
      <AdminPanelInner />
    </ToastProvider>
  );
}