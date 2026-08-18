import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Phone, Car, ChevronDown, RefreshCw, Search,
  Clock, XCircle, CheckCheck, X, AlertTriangle, Trash2,
} from "lucide-react";
import { apiGetBookings, apiUpdateBookingStatus, apiDeleteBooking, apiGetActivityLogs, type ActivityLog } from "@/lib/api";
import { Booking } from "./types";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  isSuperAdmin: boolean;
}

function BookingActivity({ bookingId }: { bookingId: string }) {
  const { language, isEnglish } = useLanguage();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    apiGetActivityLogs({ bookingId, limit: 50 })
      .then((data) => {
        if (data && Array.isArray(data)) setLogs(data);
        else if (data && data.logs && Array.isArray(data.logs)) setLogs(data.logs);
        else setLogs([]);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const t = {
    title: isEnglish ? "Booking Activity" : "نشاط الحجز",
    noActivity: isEnglish ? "No activity has been recorded for this booking." : "لا يوجد نشاط مسجل لهذا الحجز.",
    by: isEnglish ? "by" : "بواسطة",
    loading: isEnglish ? "Loading..." : "جاري التحميل...",
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-5">
      <h4 className="font-bold text-sm text-stone-900 mb-3">{t.title}</h4>
      {loading ? (
        <p className="text-xs text-gray-400">{t.loading}</p>
      ) : logs.length === 0 ? (
        <p className="text-xs text-gray-400">{t.noActivity}</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
              <span><b dir="ltr">{log.username || 'System'}</b> — {log.description || 'No description'}</span>
              <time className="text-gray-400 shrink-0">
                {log.created_at ? new Date(log.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') : ''}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingsTab({ isSuperAdmin }: Props) {
  const { language, isEnglish } = useLanguage();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "pending" | "completed" | "cancelled">("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ Conflict warning state
  const [conflictWarning, setConflictWarning] = useState<{
    booking: Booking;
    conflicts: Booking[];
  } | null>(null);

  const t = {
    title: isEnglish ? "Booking Requests" : "طلبات الحجز",
    refresh: isEnglish ? "Refresh" : "تحديث",
    statusLabels: {
      pending: isEnglish ? "Pending" : "قيد الانتظار",
      completed: isEnglish ? "Completed" : "مكتمل",
      cancelled: isEnglish ? "Cancelled" : "ملغي",
    },
    all: isEnglish ? "All" : "الكل",
    pending: isEnglish ? "Pending" : "قيد الانتظار",
    completed: isEnglish ? "Booked" : "محجوز",
    cancelled: isEnglish ? "Cancelled" : "ملغاة",
    searchPlaceholder: isEnglish ? "Search by name, phone, ID or car..." : "ابحث بالاسم، الجوال، رقم الحجز أو السيارة...",
    searchBtn: isEnglish ? "Search" : "بحث",
    clear: isEnglish ? "Clear" : "مسح",
    loadingText: isEnglish ? "Loading bookings..." : "جاري تحميل الطلبات...",
    noBookings: isEnglish ? "No bookings" : "لا توجد طلبات",
    noBookingsDesc: isEnglish ? "No bookings have been received yet" : "لم يتم استلام أي طلبات حجز حتى الآن",
    idNumber: isEnglish ? "ID Number:" : "رقم الهوية:",
    email: isEnglish ? "Email:" : "البريد:",
    car: isEnglish ? "Car:" : "السيارة:",
    pickupLocation: isEnglish ? "Pickup Location:" : "مكان الاستلام:",
    pickupDateTime: isEnglish ? "Pickup Date & Time:" : "تاريخ ووقت الاستلام:",
    dropoffLocation: isEnglish ? "Dropoff Location:" : "مكان التسليم:",
    dropoffDateTime: isEnglish ? "Dropoff Date & Time:" : "تاريخ ووقت التسليم:",
    days: isEnglish ? "Days:" : "عدد الأيام:",
    total: isEnglish ? "Total:" : "إجمالي:",
    bookingDate: isEnglish ? "Booking Date:" : "تاريخ الطلب:",
    notes: isEnglish ? "Notes:" : "ملاحظات:",
    daysLabel: isEnglish ? "days" : "يوم",
    markCompleted: isEnglish ? "Mark as Completed" : "تعيين كمكتمل",
    returnToPending: isEnglish ? "Return to Pending" : "إعادة للانتظار",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    delete: isEnglish ? "Delete" : "حذف",
    deleteTitle: isEnglish ? "Delete Booking" : "حذف الطلب",
    deleteConfirm: isEnglish ? "Are you sure you want to permanently delete this booking?" : "هل أنت متأكد من حذف هذا الطلب نهائياً؟",
    cancelBtn: isEnglish ? "Cancel" : "إلغاء",
    deleteBtn: isEnglish ? "Delete" : "حذف",
    updateError: isEnglish ? "Failed to update booking status. Please try again." : "تعذّر تحديث حالة الطلب، يرجى المحاولة مجدداً.",
    deleteErrorMsg: isEnglish ? "Failed to delete booking. Please try again." : "تعذّر حذف الطلب، يرجى المحاولة مجدداً.",
    // ✅ Conflict translations
    conflictTitle: isEnglish ? "⚠️ Conflict Warning!" : "⚠️ تحذير تعارض!",
    conflictDesc: isEnglish ? "This car has other bookings on overlapping dates:" : "هذه السيارة لديها حجوزات أخرى في نفس الفترة:",
    conflictConfirm: isEnglish ? "Do you still want to mark this booking as completed?" : "هل تريد تعيين هذا الحجز كمكتمل على أي حال؟",
    completeAnyway: isEnglish ? "Complete Anyway" : "تأكيد رغم ذلك",
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => { load(); }, [debouncedSearch, dateFilter]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGetBookings({ search: debouncedSearch || undefined, date: dateFilter || undefined });
      if (data && Array.isArray(data)) setAllBookings(data);
      else setAllBookings([]);
    } catch {
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  const bookings = statusFilter ? allBookings.filter((b) => b.status === statusFilter) : allBookings;

  // ✅ Find conflicting bookings for same car + overlapping dates
  const findConflictingBookings = (booking: Booking): Booking[] => {
    return allBookings.filter((b) => {
      if (b.id === booking.id) return false;
      if (String(b.carId) !== String(booking.carId)) return false;
      if (b.status === "cancelled") return false;

      const aStart = new Date(`${booking.pickupDate}T${booking.pickupTime || "00:00"}:00`);
      const aEnd = new Date(`${booking.dropoffDate}T${booking.dropoffTime || "23:59"}:00`);
      const bStart = new Date(`${b.pickupDate}T${b.pickupTime || "00:00"}:00`);
      const bEnd = new Date(`${b.dropoffDate}T${b.dropoffTime || "23:59"}:00`);

      return aStart <= bEnd && aEnd >= bStart;
    });
  };

  // ✅ Check conflicts before marking completed
  const handleMarkCompleted = (booking: Booking) => {
    const conflicts = findConflictingBookings(booking);
    if (conflicts.length > 0) {
      setConflictWarning({ booking, conflicts });
    } else {
      updateStatus(booking.id, "completed");
    }
  };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setActionLoading(id + status);
    setStatusUpdateError(null);
    const previousBooking = allBookings.find((b) => b.id === id);
    const previousStatus = previousBooking?.status;
    try {
      setAllBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      await apiUpdateBookingStatus(id, status);
    } catch (err) {
      if (previousStatus) {
        setAllBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: previousStatus } : b));
      }
      setStatusUpdateError(t.updateError);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string | null) => {
    if (!id) return;
    setDeleteError("");
    setActionLoading(id + "del");
    try {
      await apiDeleteBooking(id);
      setConfirmDelete(null);
      setAllBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setDeleteError(t.deleteErrorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  const statusBadge = (s: Booking["status"]) => {
    const label = t.statusLabels[s] || s;
    if (s === "completed")
      return (
        <button onClick={(e) => { e.stopPropagation(); setStatusFilter("completed"); }}
          className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer">
          <CheckCheck size={12} /> {label}
        </button>
      );
    if (s === "cancelled")
      return (
        <button onClick={(e) => { e.stopPropagation(); setStatusFilter("cancelled"); }}
          className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-red-200 transition-colors cursor-pointer">
          <XCircle size={12} /> {label}
        </button>
      );
    return (
      <button onClick={(e) => { e.stopPropagation(); setStatusFilter("pending"); }}
        className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors cursor-pointer">
        <Clock size={12} /> {label}
      </button>
    );
  };

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
        <button
          onClick={() => { setSearch(""); setDebouncedSearch(""); load(); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[hsl(22,85%,18%)] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw size={14} /> {t.refresh}
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {([
          ["", t.all, "bg-[#3d1a06]", "text-white"],
          ["pending", t.pending, "bg-amber-50", "text-amber-700"],
          ["completed", t.completed, "bg-green-50", "text-green-700"],
          ["cancelled", t.cancelled, "bg-red-50", "text-red-600"],
        ] as const).map(([val, label, bg, tc]) => (
          <button key={val} onClick={() => setStatusFilter(val as any)}
            className={`${bg} ${tc} rounded-xl p-3 text-right border-2 transition-all ${statusFilter === val ? "border-current shadow-sm" : "border-transparent"}`}>
            <div className="text-2xl font-black">{val === "" ? counts.all : counts[val as keyof typeof counts]}</div>
            <div className="text-xs font-semibold mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 text-gray-400 pointer-events-none`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
            className={`w-full border border-gray-200 rounded-xl ${language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/30 focus:border-[hsl(40,88%,52%)]`} />
        </div>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/30 focus:border-[hsl(40,88%,52%)]" />
        <button type="submit" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">{t.searchBtn}</button>
        {(search || dateFilter) && (
          <button type="button" onClick={() => { setSearch(""); setDebouncedSearch(""); setDateFilter(""); setTimeout(load, 50); }}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 px-3 py-2.5 rounded-xl transition-colors">
            {t.clear}
          </button>
        )}
      </form>

      {/* Status update error */}
      {statusUpdateError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <div className="flex-1"><p className="text-red-700 font-semibold text-sm">{statusUpdateError}</p></div>
          <button onClick={() => setStatusUpdateError(null)} className="text-red-600 hover:text-red-800 ml-2"><X size={16} /></button>
        </motion.div>
      )}

      {/* Bookings list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <RefreshCw size={32} className="mx-auto mb-3 animate-spin text-[hsl(40,88%,52%)]" />
          <p>{t.loadingText}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <ClipboardList size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold">{t.noBookings}</p>
          <p className="text-sm mt-1">{t.noBookingsDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            // ✅ Check if this booking has conflicts
            const hasConflicts = findConflictingBookings(b).length > 0;

            return (
              <div key={b.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  b.status === "completed" ? "border-green-200"
                  : b.status === "cancelled" ? "border-red-100"
                  : hasConflicts ? "border-amber-400" // ✅ Conflict highlight
                  : "border-amber-200"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-black text-[hsl(22,85%,18%)]">{b.name}</span>
                      {statusBadge(b.status)}
                      <span className="text-xs text-gray-400 font-mono">{b.id}</span>
                      {/* ✅ Conflict badge */}
                      {hasConflicts && b.status !== "cancelled" && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          <AlertTriangle size={11} /> {isEnglish ? "Conflict" : "تعارض"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><Phone size={12} />{b.phone}</span>
                      <span className="flex items-center gap-1"><Car size={12} />{b.carName}</span>
                      <span>{b.pickupDate} {b.pickupTime ?? ""} ← {b.dropoffDate} {b.dropoffTime ?? ""}</span>
                      <span className="font-bold text-[hsl(22,85%,18%)]">{b.totalPrice} ⃁</span>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform shrink-0 ${expandedId === b.id ? "rotate-180" : ""}`} />
                </div>

                {/* Expanded details */}
                {expandedId === b.id && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-[hsl(30,15%,98%)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm mb-5">
                      <div><span className="text-gray-400">{t.idNumber} </span><span className="font-semibold">{b.idNumber}</span></div>
                      {b.email && <div><span className="text-gray-400">{t.email} </span><span className="font-semibold">{b.email}</span></div>}
                      <div><span className="text-gray-400">{t.car} </span><span className="font-semibold">{b.carName} — {b.carCategory}</span></div>
                      <div><span className="text-gray-400">{t.pickupLocation} </span><span className="font-semibold">{b.pickupLocation}</span></div>
                      <div><span className="text-gray-400">{t.pickupDateTime} </span><span className="font-semibold">{b.pickupDate} {b.pickupTime ?? ""}</span></div>
                      <div><span className="text-gray-400">{t.dropoffLocation} </span><span className="font-semibold">{b.dropoffLocation}</span></div>
                      <div><span className="text-gray-400">{t.dropoffDateTime} </span><span className="font-semibold">{b.dropoffDate} {b.dropoffTime ?? ""}</span></div>
                      <div><span className="text-gray-400">{t.days} </span><span className="font-semibold">{b.days} {t.daysLabel}</span></div>
                      <div><span className="text-gray-400">{t.total} </span><span className="font-black text-[hsl(22,85%,18%)]">{b.totalPrice} ⃁</span></div>
                      <div><span className="text-gray-400">{t.bookingDate} </span><span className="font-semibold">{new Date(b.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span></div>
                    </div>

                    {b.notes && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm mb-5">
                        <span className="font-bold text-amber-700">{t.notes} </span>{b.notes}
                      </div>
                    )}

                    {/* ✅ Conflict warning inside expanded */}
                    {hasConflicts && b.status !== "cancelled" && (
                      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={14} className="text-amber-600" />
                          <span className="font-bold text-amber-700">
                            {isEnglish ? "This car has conflicting bookings!" : "هذه السيارة لديها حجوزات متعارضة!"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {findConflictingBookings(b).map((c) => (
                            <div key={c.id} className="text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-1.5">
                              <span className="font-bold">{c.name}</span> — {c.pickupDate} {c.pickupTime} → {c.dropoffDate} {c.dropoffTime}
                              <span className={`ml-2 font-bold ${c.status === "pending" ? "text-amber-600" : "text-green-600"}`}>
                                ({c.status === "pending" ? (isEnglish ? "Pending" : "قيد الانتظار") : (isEnglish ? "Completed" : "مكتمل")})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <BookingActivity key={b.status} bookingId={b.id} />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {b.status !== "completed" && (
                        <button onClick={() => handleMarkCompleted(b)} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
                          {actionLoading === b.id + "completed" ? <RefreshCw size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                          {t.markCompleted}
                        </button>
                      )}
                      {b.status !== "pending" && (
                        <button onClick={() => updateStatus(b.id, "pending")} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
                          <Clock size={14} /> {t.returnToPending}
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => updateStatus(b.id, "cancelled")} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
                          <XCircle size={14} /> {t.cancel}
                        </button>
                      )}
                      {isSuperAdmin && (
                        <button onClick={() => setConfirmDelete(b.id)} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-xl transition-colors border border-red-200 disabled:opacity-60 mr-auto">
                          <Trash2 size={14} /> {t.delete}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Conflict Warning Modal */}
      <AnimatePresence>
        {conflictWarning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-amber-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-center text-[hsl(22,85%,18%)] mb-2">{t.conflictTitle}</h3>
              <p className="text-gray-500 text-sm text-center mb-4">{t.conflictDesc}</p>

              <div className="space-y-2 mb-5">
                {conflictWarning.conflicts.map((c) => (
                  <div key={c.id} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-amber-800">{c.name}</span>
                      <span className="text-xs font-mono text-gray-400">{c.id}</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {c.pickupDate} {c.pickupTime} → {c.dropoffDate} {c.dropoffTime}
                    </div>
                    <div className="text-xs mt-1">
                      <span className={`font-bold ${c.status === "pending" ? "text-amber-600" : "text-green-600"}`}>
                        {c.status === "pending" ? (isEnglish ? "Pending" : "قيد الانتظار") : (isEnglish ? "Completed" : "مكتمل")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center mb-5">{t.conflictConfirm}</p>

              <div className="flex gap-3">
                <button onClick={() => setConflictWarning(null)}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                  {t.cancelBtn}
                </button>
                <button
                  onClick={() => { updateStatus(conflictWarning.booking.id, "completed"); setConflictWarning(null); }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                  {t.completeAnyway}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-[hsl(22,85%,18%)] mb-2">{t.deleteTitle}</h3>
              <p className="text-gray-500 text-sm mb-4">{t.deleteConfirm}</p>
              {deleteError && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{deleteError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setConfirmDelete(null); setDeleteError(""); }}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                  {t.cancelBtn}
                </button>
                <button onClick={() => handleDelete(confirmDelete)} disabled={!!actionLoading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-60">
                  {actionLoading ? "..." : t.deleteBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )} 
      </AnimatePresence>
    </div>
  );
}