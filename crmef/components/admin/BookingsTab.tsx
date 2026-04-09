"use client";

import { useState, useEffect, useTransition } from "react";
import { CheckCircle, XCircle, Trash2, Calendar, Clock, Phone, BookOpen, RefreshCw, Search } from "lucide-react";
import { confirmBooking, cancelBooking, deleteBooking } from "@/actions/booking";

interface Booking {
  id: number;
  student_name: string;
  student_phone: string;
  subject_topic: string;
  date: string;
  time_slot: string;
  status: string;
}

interface BookingsTabProps {
  initialBookings: Booking[];
  onRefresh: () => void;
}

const statusColors = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  confirmed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

export function BookingsTab({ initialBookings, onRefresh }: BookingsTabProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.subject_topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirm = (id: number) => {
    setLoadingId(id);
    startTransition(async () => {
      const result = await confirmBooking(id);
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b))
        );
        onRefresh();
      }
      setLoadingId(null);
    });
  };

  const handleCancel = (id: number) => {
    setLoadingId(id);
    startTransition(async () => {
      const result = await cancelBooking(id);
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
        );
        onRefresh();
      }
      setLoadingId(null);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;
    setLoadingId(id);
    startTransition(async () => {
      const result = await deleteBooking(id);
      if (result.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        onRefresh();
      }
      setLoadingId(null);
    });
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 flex-1">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-0.5 text-xl font-bold text-slate-100">{bookings.length}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-xs text-amber-400">En attente</p>
            <p className="mt-0.5 text-xl font-bold text-amber-300">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-400">Confirmées</p>
            <p className="mt-0.5 text-xl font-bold text-emerald-300">{confirmedCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-slate-500">Archivées</p>
            <p className="mt-0.5 text-xl font-bold text-slate-100">
              {bookings.length - pendingCount - confirmedCount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou sujet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500/50 focus:outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="cancelled">Annulé</option>
        </select>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
            <Calendar className="h-6 w-6 text-slate-500" />
          </div>
          <h3 className="mt-4 text-base font-medium text-slate-300">Aucune réservation trouvée</h3>
          <p className="mt-2 text-sm text-slate-500">
            {searchQuery || statusFilter !== "all"
              ? "Essayez de modifier vos filtres de recherche"
              : "Les réservations apparaîtront ici une fois créées"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Étudiant
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sujet
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date & Heure
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-sapphire-500/20 text-xs font-medium text-cyan-300">
                          {booking.student_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-200">{booking.student_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{booking.student_phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-sapphire-400" />
                        <span className="max-w-[180px] truncate text-xs text-slate-300">
                          {booking.subject_topic}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span className="text-xs">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{booking.time_slot}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}
                      >
                        {statusLabels[booking.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirm(booking.id)}
                              disabled={loadingId === booking.id}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 transition hover:bg-emerald-500/30 disabled:opacity-50"
                              title="Confirmer"
                            >
                              {loadingId === booking.id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={loadingId === booking.id}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 transition hover:bg-amber-500/30 disabled:opacity-50"
                              title="Annuler"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={loadingId === booking.id}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 transition hover:bg-rose-500/30 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}