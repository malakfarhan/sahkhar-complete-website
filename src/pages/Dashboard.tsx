import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  Image,
  LogOut,
  ShieldCheck,
  UserCog,
  Users,
  ClipboardList,
  ClipboardCheck,
  AlertTriangle,
  Globe,
} from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import { useAdminStore } from "@/store/adminStore";
import { useLanguage } from "@/i18n/LanguageContext";
import { AdminUser, Tab } from "@/admin/types";

// All components imported from admin folder
import LoginScreen from "@/admin/LoginScreen";
import StatsBar from "@/admin/StatsBar";
import CarsTab from "@/admin/CarsTab";
import LocationsTab from "@/admin/LocationsTab";
import SlidesTab from "@/admin/SlidesTab";
import UsersTab from "@/admin/UsersTab";
import BookingsTab from "@/admin/BookingsTab";
import LogsTab from "@/admin/LogsTab";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const { language, isEnglish, toggleLanguage, refreshKey } = useLanguage();
  const [tab, setTab] = useState<Tab>("cars");
  const [showReset, setShowReset] = useState(false);
  const {
    store,
    updateCar,
    updateLocation,
    updateSlide,
    addCar,
    deleteCar,
    addSlide,
    deleteSlide,
    addLocation,
    deleteLocation,
    resetAll,
  } = useAdminStore();

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    dashboard: isEnglish ? "Dashboard" : "لوحة التحكم",
    adminSub: "Sakher Admin Dashboard",
    viewSite: isEnglish ? "View Site" : "عرض الموقع",
    logout: isEnglish ? "Logout" : "خروج",
    languageToggle: isEnglish ? "AR" : "EN",
    resetTitle: isEnglish ? "Reset Data" : "إعادة ضبط البيانات",
    resetDesc: isEnglish 
      ? "All modifications will be deleted and data will be restored to default settings. Are you sure?"
      : "سيتم حذف جميع التعديلات وإعادة البيانات إلى الإعدادات الافتراضية. هل أنت متأكد؟",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    reset: isEnglish ? "Reset" : "إعادة الضبط",
    
    // Tab Labels
    tabs: {
      cars: isEnglish ? "Cars" : "السيارات",
      bookings: isEnglish ? "Bookings" : "الطلبات",
      locations: isEnglish ? "Locations" : "الفروع",
      slides: isEnglish ? "Slider" : "السلايدر",
      users: isEnglish ? "Users" : "المستخدمون",
      logs: isEnglish ? "Activity Logs" : "سجل النشاطات",
    },
  };

  // Tab configuration with translations
  const getTabs = () => [
    { id: "cars" as Tab, label: t.tabs.cars, icon: Car },
    { id: "bookings" as Tab, label: t.tabs.bookings, icon: ClipboardList },
    ...(isSuperAdmin
      ? [
          { id: "locations" as Tab, label: t.tabs.locations, icon: MapPin },
          { id: "slides" as Tab, label: t.tabs.slides, icon: Image },
          { id: "users" as Tab, label: t.tabs.users, icon: Users },
          { id: "logs" as Tab, label: t.tabs.logs, icon: ClipboardCheck },
        ]
      : []),
  ];

  if (!currentUser) return <LoginScreen onLogin={(u) => setCurrentUser(u)} />;

  const isSuperAdmin = currentUser.role === "superadmin";
  const tabs = getTabs();

  return (
    <div 
      key={refreshKey} // 🔑 ADD THIS
      className={`min-h-screen bg-[hsl(30,15%,96%)] ${language === 'ar' ? 'rtl' : 'ltr'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top bar */}
      <header className="bg-[#3d1a06] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon size={36} />
          <div>
            <div className="font-black text-base">{t.dashboard}</div>
            <div className="text-[hsl(40,88%,58%)] text-xs">{t.adminSub}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-lg">
            {isSuperAdmin ? (
              <ShieldCheck size={13} className="text-[hsl(40,88%,52%)]" />
            ) : (
              <UserCog size={13} />
            )}
            <span dir="ltr">{currentUser.username}</span>
          </span>
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded-lg"
          >
            {t.viewSite} ↗
          </a>
          <button
            onClick={toggleLanguage}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 border border-white/20 px-3 py-1.5 rounded-lg transition-colors"
            title={isEnglish ? "Switch to Arabic" : "التبديل للعربية"}
          >
            <Globe size={14} />
            <span>{t.languageToggle}</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin_user");
              setCurrentUser(null);
            }}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <LogOut size={14} /> {t.logout}
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex gap-1 py-3 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  tab === t.id
                    ? "bg-[#3d1a06] text-white"
                    : "text-gray-500 hover:bg-[hsl(30,15%,95%)]"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <StatsBar cars={store.cars} locations={store.locations} slides={store.slides} />

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "cars" && (
              <CarsTab
                cars={store.cars}
                onUpdate={updateCar}
                onAdd={addCar}
                onDelete={deleteCar}
              />
            )}
            {tab === "bookings" && <BookingsTab isSuperAdmin={isSuperAdmin} />}
            {tab === "locations" && isSuperAdmin && (
              <LocationsTab
                locations={store.locations}
                onUpdate={updateLocation}
                onAdd={addLocation}
                onDelete={deleteLocation}
              />
            )}
            {tab === "slides" && (
              <SlidesTab
                slides={store.slides}
                onUpdate={updateSlide}
                onAdd={addSlide}
                onDelete={deleteSlide}
              />
            )}
            {tab === "users" && isSuperAdmin && <UsersTab currentUserId={currentUser.id} />}
            {tab === "logs" && isSuperAdmin && <LogsTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Reset dialog */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-black text-[hsl(22,85%,18%)] mb-2">
                {t.resetTitle}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {t.resetDesc}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    resetAll();
                    setShowReset(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  {t.reset}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}