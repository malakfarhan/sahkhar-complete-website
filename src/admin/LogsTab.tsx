import { useState, useEffect } from "react";
import { RefreshCw, ClipboardCheck } from "lucide-react";
import { apiGetActivityLogs, type ActivityLog } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LogsTab() {
  const { language, isEnglish } = useLanguage();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 🔑 Separate state for refresh
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    title: isEnglish ? "Activity Logs" : "سجل النشاطات",
    subtitle: isEnglish 
      ? "Refreshes automatically every 15 seconds"
      : "يتم التحديث تلقائياً كل 15 ثانية",
    refresh: isEnglish ? "Refresh" : "تحديث",
    refreshing: isEnglish ? "Refreshing..." : "جاري التحديث...",
    loading: isEnglish ? "Loading..." : "جاري التحميل...",
    noActivity: isEnglish 
      ? "No activity has been recorded yet."
      : "لا يوجد نشاط مسجل حتى الآن.",
    error: isEnglish 
      ? "Unable to load activity logs."
      : "تعذر تحميل سجل النشاطات.",
    by: isEnglish ? "by" : "بواسطة",
    page: isEnglish ? "Page" : "صفحة",
    of: isEnglish ? "of" : "من",
    previous: isEnglish ? "Previous" : "السابق",
    next: isEnglish ? "Next" : "التالي",
  };

  const load = async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) {
        setRefreshing(true); // 🔑 Show refreshing state
      } else {
        setLoading(true);
      }
      
      const res: any = await apiGetActivityLogs({ limit: 200 });
      setLogs(res.logs || res || []);
    } catch (err) {
      console.error("Logs error:", err);
      setError(t.error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(() => load(true), 15000); // 🔑 Auto-refresh with loading state
    return () => window.clearInterval(timer);
  }, []);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 🔑 Handle refresh click
  const handleRefresh = () => {
    load(true);
  };

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        
        {/* 🔥 Refresh Button with Loading State */}
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className={`flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg transition-all ${
            refreshing || loading
              ? "text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
              : "text-gray-500 hover:text-[hsl(22,85%,18%)] border-gray-200 hover:border-[hsl(22,85%,18%)] cursor-pointer"
          }`}
        >
          <RefreshCw 
            size={14} 
            className={refreshing ? "animate-spin" : ""} 
          />
          {refreshing ? t.refreshing : t.refresh}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw className="mx-auto animate-spin mb-3" size={32} />
          {t.loading}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
          {t.noActivity}
        </div>
      ) : (
        /* Logs List */
        <div className="space-y-3">
          {currentLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex gap-3 items-start"
            >
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ClipboardCheck size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-stone-900 text-sm">{log.description}</div>
                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span>
                    {t.by}: <b dir="ltr">{log.username}</b>
                  </span>
                  {log.booking_id && <span dir="ltr">#{log.booking_id}</span>}
                  {log.old_value !== null && (
                    <span>
                      {log.old_value} ← {log.new_value}
                    </span>
                  )}
                </div>
              </div>
              <time className="text-xs text-gray-400 shrink-0">
                {new Date(log.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </time>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className={`flex items-center justify-between mt-6 pt-4 border-t border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {t.previous}
          </button>
          <span className="text-sm text-gray-500">
            {t.page} {page} {t.of} {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}