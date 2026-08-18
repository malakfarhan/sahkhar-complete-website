import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, MapPin, Image, Lock, LogOut, Save,
  ToggleLeft, ToggleRight, RotateCcw, Eye, EyeOff,
  ChevronDown, ChevronUp, AlertTriangle, Users, Trash2,
  UserPlus, ShieldCheck, UserCog, Plus, Upload, X, Download,
  ClipboardList, Phone, CreditCard, Search, CheckCheck,
  Clock, XCircle, RefreshCw, ClipboardCheck
} from "lucide-react";
import { apiGetBookings, apiUpdateBookingStatus, apiDeleteBooking, apiGetActivityLogs, type ActivityLog } from "@/lib/api";
import {
  useAdminStore,
  useAdminUsers,
  type AdminCar,
  type AdminLocation,
  type AdminSlide,
  type AdminUser,
  findUser,
} from "@/store/adminStore";
import LogoIcon from "@/components/LogoIcon";
import type { CarCategory } from "@/data/cars";

// ─── Image upload helper ─────────────────────────────────────────────────────
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Image Upload Button ─────────────────────────────────────────────────────
function ImageUploadButton({ onUpload, small }: { onUpload: (url: string) => void; small?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    onUpload(url);
    e.target.value = "";
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-1.5 bg-white border-2 border-dashed border-[hsl(40,88%,52%)] text-[hsl(22,85%,18%)] font-bold rounded-lg hover:bg-[hsl(40,88%,97%)] transition-colors ${small ? "text-xs px-2.5 py-1.5" : "text-sm px-3 py-2"}`}
      >
        <Upload size={small ? 12 : 14} />
        {small ? "تغيير الصورة" : "رفع صورة"}
      </button>
    </>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: AdminUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  // const submit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const user = await findUser(username.trim(), password);
  //   if (user) {
  //     onLogin(user);
  //   } else {
  //     setError(true);
  //     setPassword("");
  //     setTimeout(() => setError(false), 2500);
  //   }
  // };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await findUser(username.trim(), password);
    if (user) {
      // Yahan localStorage mein save kar rahe hain
      localStorage.setItem("admin_user", JSON.stringify(user));
      onLogin(user);
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#3d1a06] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          <LogoIcon size={64} />
        </div>
        <h1 className="text-2xl font-black text-[hsl(22,85%,18%)] mb-1 text-center">لوحة التحكم</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">أدخل بيانات الدخول للمتابعة</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              dir="ltr"
              className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all ${error ? "border-red-400 bg-red-50" : "border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)]"
                }`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all pr-10 ${error ? "border-red-400 bg-red-50 text-red-600" : "border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertTriangle size={14} /> اسم المستخدم أو كلمة المرور غير صحيحة
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 mt-2"
          >
            <Lock size={16} />
            دخول
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = "cars" | "locations" | "slides" | "users" | "bookings" | "logs";

// ─── Cars tab ─────────────────────────────────────────────────────────────────
const CAR_CATEGORIES: string[] = ["اقتصادية", "عائلية", "فاخرة", "SUV", "ميني باص"];

const blankCar = (): Omit<AdminCar, "id"> => ({
  name: "",
  nameEn: "",
  category: "اقتصادية",
  dailyPrice: 150,
  seats: 5,
  transmission: "أوتوماتيك",
  fuel: "بنزين",
  year: new Date().getFullYear(),
  features: [],
  image: "",
  available: true,
  active: true,
});

function CarsTab({
  cars,
  onUpdate,
  onAdd,
  onDelete,
}: {
  cars: AdminCar[];
  onUpdate: (id: number, p: Partial<AdminCar>) => void;
  onAdd: (car: Omit<AdminCar, "id">) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<AdminCar>>({});
  const [saved, setSaved] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState<Omit<AdminCar, "id">>(blankCar());
  const [newCarError, setNewCarError] = useState("");

  const startEdit = (car: AdminCar) => {
    setEditing(car.id);
    setDraft({ dailyPrice: car.dailyPrice, available: car.available });
  };

  const saveEdit = (id: number) => {
    onUpdate(id, draft);
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };



  const handleAddCar = () => {
    if (!newCar.name.trim()) return setNewCarError("اسم السيارة مطلوب");
    if (!newCar.nameEn.trim()) return setNewCarError("الاسم بالإنجليزية مطلوب");
    if (newCar.dailyPrice <= 0) return setNewCarError("السعر يجب أن يكون أكبر من صفر");
    onAdd(newCar);
    setNewCar(blankCar());
    setNewCarError("");
    setShowAddForm(false);
  };

  const categories = [...new Set(cars.map((c) => c.category))];

  return (
    <div >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">إدارة السيارات والأسعار</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{cars.length} سيارة</span>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> إضافة سيارة
          </button>
        </div>
      </div>

      {/* Add car modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">إضافة سيارة جديدة</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Image preview + upload */}
              <div className="mb-4">
                <div className="h-36 bg-[hsl(30,15%,96%)] rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                  {newCar.image ? (
                    <img src={newCar.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center gap-2">
                      <Car size={40} strokeWidth={1} />
                      <span className="text-xs">لا توجد صورة</span>
                    </div>
                  )}
                </div>
                <ImageUploadButton onUpload={(url) => setNewCar({ ...newCar, image: url })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">اسم السيارة (عربي)</label>
                  <input type="text" value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    placeholder="تويوتا كامري"
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">اسم السيارة (إنجليزي)</label>
                  <input type="text" dir="ltr" value={newCar.nameEn} onChange={(e) => setNewCar({ ...newCar, nameEn: e.target.value })}
                    placeholder="Toyota Camry"
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">الفئة</label>
                  <input
                    list="car-cat-list"
                    value={newCar.category}
                    onChange={(e) => setNewCar({ ...newCar, category: e.target.value as CarCategory })}
                    placeholder="اكتب فئة أو اختر من القائمة"
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                  />
                  <datalist id="car-cat-list">
                    {[...new Set([...CAR_CATEGORIES, ...cars.map((c) => c.category)])].filter(Boolean).map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">السعر اليومي (⃁)</label>
                  <input type="number" value={newCar.dailyPrice} onChange={(e) => setNewCar({ ...newCar, dailyPrice: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">عدد المقاعد</label>
                  <input type="number" value={newCar.seats} onChange={(e) => setNewCar({ ...newCar, seats: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">سنة الصنع</label>
                  <input type="number" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">ناقل الحركة</label>
                  <select value={newCar.transmission} onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
                    <option value="أوتوماتيك">أوتوماتيك</option>
                    <option value="مانيوال">مانيوال</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">نوع الوقود</label>
                  <select value={newCar.fuel} onChange={(e) => setNewCar({ ...newCar, fuel: e.target.value })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="هجين">هجين</option>
                    <option value="كهربائي">كهربائي</option>
                  </select>
                </div>
              </div>

              {newCarError && (
                <p className="mt-3 text-red-500 text-xs flex items-center gap-1"><AlertTriangle size={12} />{newCarError}</p>
              )}

              <div className="flex gap-3 mt-5">
                <button onClick={handleAddCar} className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={15} /> إضافة السيارة
                </button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3d1a06] text-white text-xs font-bold px-3 py-1 rounded-full">{cat}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cars.filter((c) => c.category === cat).map((car) => (
              <motion.div
                key={car.id}
                layout
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${car.available ? "border-[hsl(30,15%,88%)]" : "border-red-200 opacity-70"
                  }`}
              >
                <div className="h-32 bg-[hsl(30,15%,96%)] overflow-hidden relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x120/5c2301/d4a017?text=${car.nameEn.split(" ")[0]}`; }}
                  />
                  <button
                    onClick={() => onUpdate(car.id, { available: !car.available })}
                    className={`absolute top-2 left-2 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${car.available ? "bg-green-500 text-white" : "bg-red-400 text-white"
                      }`}
                  >
                    {car.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {car.available ? "متاح" : "غير متاح"}
                  </button>
                  {/* Delete confirm */}
                  {confirmDelete === car.id ? (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1">
                      <span className="text-red-500 text-[10px] font-bold">حذف؟</span>
                      <button onClick={() => onDelete(car.id)} className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold hover:bg-red-600">نعم</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-[10px] px-1">لا</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(car.id)}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[hsl(22,85%,18%)] mb-1">{car.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{car.year} • {car.seats} مقاعد • {car.transmission}</p>

                  {/* Image upload */}
                  <div className="mb-3">
                    <ImageUploadButton small onUpload={(url) => onUpdate(car.id, { image: url })} />
                  </div>

                  {editing === car.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">السعر اليومي (⃁)</label>
                        <input
                          type="number"
                          value={draft.dailyPrice}
                          onChange={(e) => setDraft({ ...draft, dailyPrice: Number(e.target.value) })}
                          className="w-full border-2 border-[hsl(40,88%,52%)] rounded-lg px-3 py-2 text-sm font-bold text-center outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(car.id)}
                          className="flex-1 btn-gold py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <Save size={13} /> حفظ
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="flex-1 border border-gray-200 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[hsl(22,85%,18%)]">{car.dailyPrice}</span>
                        <span className="text-[hsl(40,88%,44%)] font-bold text-sm"> ⃁</span>
                        <span className="text-gray-400 text-xs"> / يوم</span>
                      </div>
                      <button
                        onClick={() => startEdit(car)}
                        className="text-xs font-bold text-[hsl(22,85%,18%)] border-2 border-[hsl(22,85%,18%)] px-3 py-1.5 rounded-lg hover:bg-[#3d1a06] hover:text-white transition-colors"
                      >
                        تعديل السعر
                      </button>
                    </div>
                  )}

                  {saved === car.id && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-600 text-xs text-center mt-2 font-semibold"
                    >
                      ✓ تم الحفظ
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Locations tab ────────────────────────────────────────────────────────────
const blankLocation = (city = ""): Omit<AdminLocation, "id"> => ({
  city,
  branch: "",
  address: "",
  phone: "920017014",
  hours: "8:00 ص - 10:00 م",
  isMain: false,
  lat: 24.7136,
  lng: 46.6753,
  mapUrl: "",
  mapEmbed: "",
  description: "",
  services: ["تسليم واستلام السيارات"],
  active: true,
});

function LocationsTab({
  locations,
  onUpdate,
  onAdd,
  onDelete,
}: {
  locations: AdminLocation[];
  onUpdate: (id: string, p: Partial<AdminLocation>) => void;
  onAdd: (loc: Omit<AdminLocation, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<AdminLocation>>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoc, setNewLoc] = useState<Omit<AdminLocation, "id">>(blankLocation());
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [locError, setLocError] = useState("");

  const existingCities = [...new Set(locations.map((l) => l.city))];

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  const patch = (id: string, key: keyof AdminLocation, val: string) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), [key]: val } }));
  };

  const save = (id: string, original: AdminLocation) => {
    onUpdate(id, { ...original, ...drafts[id] });
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleAdd = () => {
    const city = useCustomCity ? customCity.trim() : newLoc.city;
    if (!city) return setLocError("المدينة مطلوبة");
    if (!newLoc.branch.trim()) return setLocError("اسم الفرع مطلوب");
    onAdd({ ...newLoc, city });
    setNewLoc(blankLocation());
    setCustomCity("");
    setUseCustomCity(false);
    setLocError("");
    setShowAddForm(false);
  };

  // Group by city
  const cities = [...new Set(locations.map((l) => l.city))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">إدارة الفروع</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{locations.length} فروع — {cities.length} مدينة</span>
          <button
            onClick={() => { setNewLoc(blankLocation(existingCities[0] || "")); setUseCustomCity(false); setLocError(""); setShowAddForm(true); }}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> إضافة فرع
          </button>
        </div>
      </div>

      {/* Add location modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">إضافة فرع جديد</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* City selector */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">المدينة</label>
                  <div className="flex gap-2">
                    {!useCustomCity ? (
                      <select
                        value={newLoc.city}
                        onChange={(e) => setNewLoc({ ...newLoc, city: e.target.value })}
                        className="flex-1 border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                      >
                        {existingCities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="اسم المدينة الجديدة"
                        className="flex-1 border-2 border-[hsl(40,88%,52%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setUseCustomCity(!useCustomCity)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors ${useCustomCity ? "bg-[#3d1a06] text-white border-[#3d1a06]" : "border-[hsl(30,15%,80%)] text-gray-500 hover:border-[hsl(22,85%,18%)]"}`}
                    >
                      {useCustomCity ? "✓ مدينة جديدة" : "+ مدينة جديدة"}
                    </button>
                  </div>
                </div>

                {[
                  { key: "branch", label: "اسم الفرع", placeholder: "فرع العليا" },
                  { key: "address", label: "العنوان", placeholder: "حي العليا، شارع العروبة" },
                  { key: "phone", label: "رقم الهاتف", placeholder: "920017014" },
                  { key: "hours", label: "ساعات العمل", placeholder: "8:00 ص - 10:00 م" },
                  { key: "description", label: "الوصف", placeholder: "وصف الفرع..." },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                    <input
                      type="text"
                      value={String((newLoc as unknown as Record<string, unknown>)[key] ?? "")}
                      onChange={(e) => setNewLoc({ ...newLoc, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                ))}

                {/* Map URL */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">رابط الموقع (Google Maps)</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={newLoc.mapUrl ?? ""}
                    onChange={(e) => setNewLoc({ ...newLoc, mapUrl: e.target.value })}
                    placeholder="https://maps.app.goo.gl/... أو https://www.google.com/maps/place/..."
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">أي رابط من Google Maps — يُستخدم كزر "فتح في الخريطة"</p>
                </div>

                {/* Map Embed */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                    رابط تضمين الخريطة المصغرة
                    <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold">للمعاينة في الموقع</span>
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={newLoc.mapEmbed ?? ""}
                    onChange={(e) => setNewLoc({ ...newLoc, mapEmbed: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=!1m18..."
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    في Google Maps → Share (مشاركة) → Embed a map (تضمين خريطة) → انسخ الرابط من داخل src="..."
                  </p>
                  {newLoc.mapEmbed && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-[hsl(30,15%,85%)] h-36">
                      <iframe
                        src={newLoc.mapEmbed}
                        width="100%" height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="معاينة الخريطة"
                      />
                    </div>
                  )}
                </div>

                

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={newLoc.isMain} onChange={(e) => setNewLoc({ ...newLoc, isMain: e.target.checked })}
                    className="w-4 h-4 accent-[hsl(40,88%,52%)]" />
                  <span className="text-sm font-semibold text-gray-600">فرع رئيسي</span>
                </label>
              </div>

              {locError && <p className="mt-3 text-red-500 text-xs flex items-center gap-1"><AlertTriangle size={12} />{locError}</p>}

              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={15} /> إضافة الفرع
                </button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branches grouped by city */}
      {cities.map((city) => (
        <div key={city} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-[#3d1a06]" />
            <span className="font-black text-[hsl(22,85%,18%)] text-base">{city}</span>
            <span className="text-xs text-gray-400">({locations.filter((l) => l.city === city).length} فروع)</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-3">
            {locations.filter((l) => l.city === city).map((loc) => {
              const d = drafts[loc.id] || {};
              const isOpen = expanded === loc.id;

              return (
                <div
                  key={loc.id}
                  className={"bg-white rounded-2xl border-2 overflow-hidden transition-all " + (loc.active ? "border-[hsl(30,15%,88%)]" : "border-red-200 opacity-70")}
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[hsl(30,15%,98%)]"
                    onClick={() => toggle(loc.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={"w-2 h-2 rounded-full " + (loc.active ? "bg-green-500" : "bg-red-400")} />
                      <div>
                        <span className="font-bold text-[hsl(22,85%,18%)]">{loc.branch}</span>
                        {loc.isMain && (
                          <span className="mr-2 text-xs bg-[hsl(40,88%,95%)] text-[hsl(40,88%,40%)] font-bold px-2 py-0.5 rounded-full">رئيسي</span>
                        )}
                        <p className="text-xs text-gray-400">{d.phone ?? loc.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdate(loc.id, { active: !loc.active }); }}
                        className={"text-xs font-bold px-3 py-1 rounded-full " + (loc.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}
                      >
                        {loc.active ? "مفعّل" : "معطّل"}
                      </button>
                      {confirmDelete === loc.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <span className="text-red-500 text-xs font-bold">حذف؟</span>
                          <button onClick={() => { onDelete(loc.id); setConfirmDelete(null); }} className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold">نعم</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-xs px-1">لا</button>
                        </div>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(loc.id); }} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-[hsl(30,15%,92%)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            { key: "branch", label: "اسم الفرع" },
                            { key: "city", label: "المدينة" },
                            { key: "address", label: "العنوان" },
                            { key: "phone", label: "رقم الهاتف" },
                            { key: "hours", label: "ساعات العمل" },
                            { key: "description", label: "الوصف" },
                          ] as const).map(({ key, label }) => (
                            <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                              <input
                                type="text"
                                defaultValue={String((loc as unknown as Record<string, unknown>)[key] ?? "")}
                                onChange={(e) => patch(loc.id, key, e.target.value)}
                                className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                              />
                            </div>
                          ))}

                          {/* Map URL field */}
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">رابط الموقع (Google Maps)</label>
                            <input
                              type="url"
                              dir="ltr"
                              defaultValue={loc.mapUrl ?? ""}
                              onChange={(e) => patch(loc.id, "mapUrl", e.target.value)}
                              placeholder="https://maps.app.goo.gl/... أو https://www.google.com/maps/place/..."
                              className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">أي رابط من Google Maps — يُستخدم كزر "فتح في الخريطة"</p>
                          </div>

                          {/* Map Embed field */}
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                              رابط تضمين الخريطة المصغرة
                              <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold">للمعاينة في الموقع</span>
                            </label>
                            <input
                              type="url"
                              dir="ltr"
                              defaultValue={loc.mapEmbed ?? ""}
                              onChange={(e) => patch(loc.id, "mapEmbed", e.target.value)}
                              placeholder="https://www.google.com/maps/embed?pb=!1m18..."
                              className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                              في Google Maps → Share → Embed a map → انسخ الرابط من داخل src="..."
                            </p>
                            {(drafts[loc.id]?.mapEmbed ?? loc.mapEmbed) && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-[hsl(30,15%,85%)] h-36">
                                <iframe
                                  src={drafts[loc.id]?.mapEmbed ?? loc.mapEmbed}
                                  width="100%" height="100%"
                                  style={{ border: 0 }}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  title="معاينة الخريطة"
                                />
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                            {saved === loc.id && <span className="text-green-600 text-sm font-semibold self-center">✓ تم الحفظ</span>}
                            <button onClick={() => save(loc.id, loc)} className="btn-gold px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5">
                              <Save size={14} /> حفظ التغييرات
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Slides tab ───────────────────────────────────────────────────────────────
const blankSlide = (): Omit<AdminSlide, "id"> => ({
  bg: "",
  badge: "جديد",
  heading: "العنوان هنا",
  sub: "النص التوضيحي للشريحة",
  ctaLabel: "احجز الآن",
  ctaHref: "/booking",
  cta2Label: "تصفح الأسطول",
  active: true,
});

function SlidesTab({
  slides,
  onUpdate,
  onAdd,
  onDelete,
}: {
  slides: AdminSlide[];
  onUpdate: (id: number, p: Partial<AdminSlide>) => void;
  onAdd: (s: Omit<AdminSlide, "id">) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<AdminSlide>>({});
  const [saved, setSaved] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlide, setNewSlide] = useState<Omit<AdminSlide, "id">>(blankSlide());

  const startEdit = (s: AdminSlide) => {
    setEditing(s.id);
    setDraft({ badge: s.badge, heading: s.heading, sub: s.sub, ctaLabel: s.ctaLabel, cta2Label: s.cta2Label });
  };

  const saveSlide = (id: number) => {
    onUpdate(id, draft);
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">إدارة شرائح الصفحة الرئيسية</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{slides.length} شرائح</span>
          <button
            onClick={() => { setNewSlide(blankSlide()); setShowAddForm(true); }}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> إضافة شريحة
          </button>
        </div>
      </div>

      {/* Add slide modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">إضافة شريحة جديدة</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              {/* Image preview */}
              <div className="h-36 relative bg-cover bg-center rounded-xl overflow-hidden mb-3" style={{ backgroundImage: newSlide.bg ? `url(${newSlide.bg})` : undefined }}>
                {!newSlide.bg && (
                  <div className="absolute inset-0 bg-[hsl(30,15%,96%)] flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Image size={36} strokeWidth={1} />
                    <span className="text-xs">لا توجد صورة خلفية</span>
                  </div>
                )}
                {newSlide.bg && <div className="absolute inset-0 bg-black/50" />}
                <div className="absolute bottom-3 right-3">
                  <ImageUploadButton small onUpload={(url) => setNewSlide({ ...newSlide, bg: url })} />
                </div>
              </div>

              <div className="space-y-3">
                {([
                  { key: "badge", label: "الشارة (Badge)", placeholder: "SUV فاخرة" },
                  { key: "heading", label: "العنوان الرئيسي", placeholder: "العنوان هنا" },
                  { key: "sub", label: "النص التوضيحي", placeholder: "وصف الشريحة..." },
                  { key: "ctaLabel", label: "نص الزر الأول", placeholder: "احجز الآن" },
                  { key: "cta2Label", label: "نص الزر الثاني", placeholder: "تصفح الأسطول" },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                    {key === "sub" ? (
                      <textarea rows={2} value={newSlide[key]} onChange={(e) => setNewSlide({ ...newSlide, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none resize-none" />
                    ) : (
                      <input type="text" value={newSlide[key]} onChange={(e) => setNewSlide({ ...newSlide, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => { onAdd(newSlide); setShowAddForm(false); }}
                  className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={15} /> إضافة الشريحة
                </button>
                <button onClick={() => setShowAddForm(false)}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide, idx) => (
          <div key={slide.id} className={`bg-white rounded-2xl border-2 overflow-hidden ${slide.active ? "border-[hsl(30,15%,88%)]" : "border-red-200"}`}>
            {/* Preview */}
            <div
              className="h-36 relative bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className="absolute inset-0 bg-[hsl(22,85%,8%)]/70" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-[hsl(40,88%,60%)] text-xs font-bold mb-1">{slide.badge}</span>
                <h3 className="text-white font-black text-lg leading-tight">{slide.heading}</h3>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">شريحة {idx + 1}</span>
              </div>
              <div className="absolute top-2 left-2 flex gap-1.5">
                <button
                  onClick={() => onUpdate(slide.id, { active: !slide.active })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${slide.active ? "bg-green-500 text-white" : "bg-red-400 text-white"}`}
                >
                  {slide.active ? "مفعّلة" : "معطّلة"}
                </button>
              </div>
              {/* Delete */}
              {confirmDelete === slide.id ? (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1">
                  <span className="text-red-500 text-[10px] font-bold">حذف الشريحة؟</span>
                  <button onClick={() => { onDelete(slide.id); setConfirmDelete(null); }} className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">نعم</button>
                  <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-[10px] px-1">لا</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(slide.id)}
                  className="absolute bottom-2 left-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors">
                  <Trash2 size={12} />
                </button>
              )}
              {/* Image change button */}
              <div className="absolute bottom-2 right-2">
                <ImageUploadButton small onUpload={(url) => onUpdate(slide.id, { bg: url })} />
              </div>
            </div>

            <div className="p-4">
              {editing === slide.id ? (
                <div className="space-y-3">
                  {([
                    { key: "badge", label: "الشارة (Badge)" },
                    { key: "heading", label: "العنوان الرئيسي" },
                    { key: "sub", label: "النص التفسيري" },
                    { key: "ctaLabel", label: "نص زر الحجز" },
                    { key: "cta2Label", label: "نص الزر الثاني" },
                  ] as const).map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{label}</label>
                      {key === "sub" ? (
                        <textarea
                          rows={2}
                          defaultValue={slide[key]}
                          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                          className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          defaultValue={slide[key]}
                          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                          className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)]"
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveSlide(slide.id)}
                      className="flex-1 btn-gold py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1"
                    >
                      <Save size={14} /> حفظ
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{slide.sub}</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-[#3d1a06] text-white px-2 py-1 rounded">{slide.ctaLabel}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{slide.cta2Label}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {saved === slide.id && <span className="text-green-600 text-xs font-semibold">✓ تم الحفظ</span>}
                    <button
                      onClick={() => startEdit(slide)}
                      className="mr-auto text-xs font-bold text-[hsl(22,85%,18%)] border-2 border-[hsl(22,85%,18%)] px-3 py-1.5 rounded-lg hover:bg-[#3d1a06] hover:text-white transition-colors"
                    >
                      تعديل النصوص
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ currentUserId }: { currentUserId: string }) {
  const { users, addUser, deleteUser, updateUserPassword, reload } = useAdminUsers();
  const [form, setForm] = useState({ username: "", password: "", role: "admin" as AdminUser["role"] });
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [changingPassId, setChangingPassId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const uname = form.username.trim();
    if (!uname) return setFormError("اسم المستخدم مطلوب");
    if (form.password.length < 4) return setFormError("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
    if (users.some((u) => u.username === uname)) return setFormError("اسم المستخدم مستخدم مسبقاً");
    try {
      await addUser({ username: uname, password: form.password, role: form.role });
      setForm({ username: "", password: "", role: "admin" });
      setFormError("");
      setSuccess("تم إنشاء المستخدم بنجاح");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setFormError(err?.message ?? "حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setConfirmDelete(null);
  };

  const handleChangePass = async (id: string) => {
    if (newPass.length < 4) return;
    await updateUserPassword(id, newPass);
    setChangingPassId(null);
    setNewPass("");
    setSuccess("تم تحديث كلمة المرور");
    setTimeout(() => setSuccess(""), 3000);
  };

  const roleLabel = (role: AdminUser["role"]) =>
    role === "superadmin" ? "مشرف رئيسي" : "مشرف";

  const roleColor = (role: AdminUser["role"]) =>
    role === "superadmin" ? "bg-[#3d1a06] text-white" : "bg-blue-100 text-blue-700";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">إدارة المستخدمين</h2>
        <span className="text-sm text-gray-400">{users.length} مستخدم</span>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold"
        >
          ✓ {success}
        </motion.div>
      )}

      {/* Users list */}
      <div className="grid gap-3 mb-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border-2 border-[hsl(30,15%,88%)] p-5 flex flex-wrap items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[hsl(22,85%,95%)] flex items-center justify-center">
              {user.role === "superadmin" ? (
                <ShieldCheck size={20} className="text-[hsl(22,85%,18%)]" />
              ) : (
                <UserCog size={20} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[hsl(22,85%,18%)] text-base" dir="ltr">{user.username}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                أُنشئ في {new Date(user.createdAt).toLocaleDateString("ar-SA")}
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColor(user.role)}`}>
              {roleLabel(user.role)}
            </span>

            {/* Change password */}
            {changingPassId === user.id ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  dir="ltr"
                  minLength={4}
                  className="border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-lg px-3 py-2 text-sm outline-none w-40"
                />
                <button
                  onClick={() => handleChangePass(user.id)}
                  disabled={newPass.length < 4}
                  className="bg-[#3d1a06] text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={() => { setChangingPassId(null); setNewPass(""); }}
                  className="text-gray-400 px-2 py-2 rounded-lg text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setChangingPassId(user.id)}
                className="text-xs font-bold text-gray-500 hover:text-[hsl(22,85%,18%)] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                تغيير كلمة المرور
              </button>
            )}

            {/* Delete button — can't delete self or root if it's the only superadmin */}
            {user.id !== currentUserId && !(user.role === "superadmin" && users.filter((u) => u.role === "superadmin").length === 1) && (
              confirmDelete === user.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500 font-semibold">تأكيد الحذف؟</span>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-red-600"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-gray-400 text-xs px-2 py-1.5 rounded-lg"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(user.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {/* Add user form */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-[hsl(30,15%,80%)] p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={20} className="text-[hsl(22,85%,18%)]" />
          <h3 className="font-black text-[hsl(22,85%,18%)]">إضافة مستخدم جديد</h3>
        </div>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">اسم المستخدم</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="username"
              dir="ltr"
              className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                dir="ltr"
                minLength={4}
                className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">الصلاحية</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })}
              className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors bg-white"
            >
              <option value="admin">مشرف</option>
              <option value="superadmin">مشرف رئيسي</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            {formError && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><AlertTriangle size={12} /> {formError}</p>}
            <button
              type="submit"
              className="btn-gold py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={15} />
              إنشاء المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ cars, locations, slides }: { cars: AdminCar[]; locations: AdminLocation[]; slides: AdminSlide[] }) {
  const stats = [
    { label: "السيارات المتاحة", value: cars.filter((c) => c.available).length, total: cars.length, color: "text-green-600" },
    { label: "الفروع المفعّلة", value: locations.filter((l) => l.active).length, total: locations.length, color: "text-blue-600" },
    { label: "الشرائح المفعّلة", value: slides.filter((s) => s.active).length, total: slides.length, color: "text-[hsl(40,88%,44%)]" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-[hsl(30,15%,88%)] text-center">
          <div className={`text-3xl font-black ${s.color}`}>{s.value}<span className="text-gray-300 text-lg">/{s.total}</span></div>
          <div className="text-gray-500 text-xs mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────
interface Booking {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  email: string;
  notes: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  days: number;
  carId: string;
  carName: string;
  carCategory: string;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

function BookingActivity({ bookingId }: { bookingId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  useEffect(() => {
    apiGetActivityLogs({ bookingId, limit: 50 }).then(setLogs).catch(() => setLogs([]));
  }, [bookingId]);
  return (
    <div className="border-t border-gray-200 pt-4 mt-5">
      <h4 className="font-bold text-sm text-stone-900 mb-3">Booking Activity</h4>
      {logs.length === 0 ? <p className="text-xs text-gray-400">No activity has been recorded for this booking.</p> : <div className="space-y-2">
        {logs.map((log) => <div key={log.id} className="flex justify-between gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-gray-100"><span><b dir="ltr">{log.username}</b> — {log.description}</span><time className="text-gray-400 shrink-0">{new Date(log.created_at).toLocaleString("ar-SA")}</time></div>)}
      </div>}
    </div>
  );
}

function BookingsTab({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  // كل الطلبات من السيرفر (بدون فلتر) — الفلترة تتم على React-side فقط
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

  // نجلب دائماً كل الطلبات بدون فلتر status — الفلترة محلياً
  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGetBookings({
        search: search || undefined,
        date: dateFilter || undefined,
      });
      setAllBookings(data as Booking[]);
    } catch {
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [dateFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  // الفلترة المحلية: حسب التبويب المختار
  const bookings = statusFilter
    ? allBookings.filter((b) => b.status === statusFilter)
    : allBookings;

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setActionLoading(id + status);
    setStatusUpdateError(null);
    
    // Store previous status in case we need to rollback
    const previousBooking = allBookings.find((b) => b.id === id);
    const previousStatus = previousBooking?.status;
    
    try {
      // Optimistic update: update state immediately
      setAllBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      
      // Then call the API
      await apiUpdateBookingStatus(id, status);
    } catch (err) {
      // Rollback on error
      if (previousStatus) {
        setAllBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: previousStatus } : b));
      }
      setStatusUpdateError("تعذّر تحديث حالة الطلب، يرجى المحاولة مجدداً.");
      console.error("Update status error:", err);
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
      setDeleteError("تعذّر حذف الطلب، يرجى المحاولة مجدداً.");
    } finally {
      setActionLoading(null);
    }
  };

  // العدادات تُحسب دائماً من كل الطلبات (allBookings) وليس المفلترة
  const counts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  const statusBadge = (s: Booking["status"]) => {
    if (s === "completed") return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full"><CheckCheck size={12} /> مكتمل</span>;
    if (s === "cancelled") return <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full"><XCircle size={12} /> ملغي</span>;
    return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full"><Clock size={12} /> قيد الانتظار</span>;
  };

  return (
    <div translate="no">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">طلبات الحجز</h2>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[hsl(22,85%,18%)] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
          <RefreshCw size={14} /> تحديث
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {([["", "الكل", "bg-[#3d1a06]", "text-white"], ["pending", "قيد الانتظار", "bg-amber-50", "text-amber-700"], ["completed", "مكتملة", "bg-green-50", "text-green-700"], ["cancelled", "ملغاة", "bg-red-50", "text-red-600"]] as const).map(([val, label, bg, tc]) => (
          <button key={val} onClick={() => setStatusFilter(val as any)}
            className={`${bg} ${tc} rounded-xl p-3 text-right border-2 transition-all ${statusFilter === val ? "border-current shadow-sm" : "border-transparent"}`}
          >
            <div className="text-2xl font-black">{val === "" ? counts.all : counts[val as keyof typeof counts]}</div>
            <div className="text-xs font-semibold mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الجوال أو السيارة..."
            className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/30 focus:border-[hsl(40,88%,52%)]"
          />
        </div>
        <div className="relative">
          <input
            type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/30 focus:border-[hsl(40,88%,52%)]"
          />
        </div>
        <button type="submit" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">بحث</button>
        {(search || dateFilter) && (
          <button type="button" onClick={() => { setSearch(""); setDateFilter(""); setTimeout(load, 50); }}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 px-3 py-2.5 rounded-xl transition-colors"
          >مسح</button>
        )}
      </form>

      {/* Status update error message */}
      {statusUpdateError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3"
        >
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-semibold text-sm">{statusUpdateError}</p>
          </div>
          <button
            onClick={() => setStatusUpdateError(null)}
            className="text-red-600 hover:text-red-800 ml-2"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Bookings list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <RefreshCw size={32} className="mx-auto mb-3 animate-spin text-[hsl(40,88%,52%)]" />
          <p>جاري تحميل الطلبات...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <ClipboardList size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold">لا توجد طلبات</p>
          <p className="text-sm mt-1">لم يتم استلام أي طلبات حجز حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${b.status === "completed" ? "border-green-200" : b.status === "cancelled" ? "border-red-100" : "border-amber-200"}`}>
              {/* Header row */}
              <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-[hsl(22,85%,18%)]">{b.name}</span>
                    {statusBadge(b.status)}
                    <span className="text-xs text-gray-400 font-mono">{b.id}</span>
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
                    <div><span className="text-gray-400">رقم الهوية: </span><span className="font-semibold">{b.idNumber}</span></div>
                    {b.email && <div><span className="text-gray-400">البريد: </span><span className="font-semibold">{b.email}</span></div>}
                    <div><span className="text-gray-400">السيارة: </span><span className="font-semibold">{b.carName} — {b.carCategory}</span></div>
                    <div><span className="text-gray-400">مكان الاستلام: </span><span className="font-semibold">{b.pickupLocation}</span></div>
                    <div><span className="text-gray-400">تاريخ ووقت الاستلام: </span><span className="font-semibold">{b.pickupDate} {b.pickupTime ?? ""}</span></div>
                    <div><span className="text-gray-400">مكان التسليم: </span><span className="font-semibold">{b.dropoffLocation}</span></div>
                    <div><span className="text-gray-400">تاريخ ووقت التسليم: </span><span className="font-semibold">{b.dropoffDate} {b.dropoffTime ?? ""}</span></div>
                    <div><span className="text-gray-400">عدد الأيام: </span><span className="font-semibold">{b.days} يوم</span></div>
                    <div><span className="text-gray-400">إجمالي: </span><span className="font-black text-[hsl(22,85%,18%)]">{b.totalPrice} ⃁</span></div>
                    <div><span className="text-gray-400">تاريخ الطلب: </span><span className="font-semibold">{new Date(b.createdAt).toLocaleString("ar-SA")}</span></div>
                  </div>
                  {b.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm mb-5">
                      <span className="font-bold text-amber-700">ملاحظات: </span>{b.notes}
                    </div>
                  )}
                  <BookingActivity key={b.status} bookingId={b.id} />
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {b.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(b.id, "completed")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        {actionLoading === b.id + "completed" ? <RefreshCw size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                        تعيين كمكتمل
                      </button>
                    )}
                    {b.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(b.id, "pending")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        <Clock size={14} /> إعادة للانتظار
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(b.id, "cancelled")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        <XCircle size={14} /> إلغاء
                      </button>
                    )}
                    {isSuperAdmin && (
                      <button
                        onClick={() => setConfirmDelete(b.id)}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-xl transition-colors border border-red-200 disabled:opacity-60 mr-auto"
                      >
                        <Trash2 size={14} /> حذف
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-[hsl(22,85%,18%)] mb-2">حذف الطلب</h3>
              <p className="text-gray-500 text-sm mb-4">هل أنت متأكد من حذف هذا الطلب نهائياً؟</p>
              {deleteError && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{deleteError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setConfirmDelete(null); setDeleteError(""); }} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">إلغاء</button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={!!actionLoading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {actionLoading ? "..." : "حذف"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────


//logs
function LogsTab() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15; // Ek page par kitne logs dikhane hain

  const load = async () => {
    try {
      setError("");
      // Agar aapka purana function yeh tha, toh yahi use karein:
      const res: any = await apiGetActivityLogs({ limit: 200 }); 
      setLogs(res.logs || res || []);
    } catch (err) {
      console.error("Logs error:", err);
      setError("Unable to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, []);

  // Frontend Pagination Logic
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div translate="no">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">Activity Logs</h2>
          <p className="text-sm text-gray-500 mt-1">Refreshes automatically every 15 seconds</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[hsl(22,85%,18%)] border border-gray-200 px-3 py-1.5 rounded-lg">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-400"><RefreshCw className="mx-auto animate-spin mb-3" />Loading...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">No activity has been recorded yet.</div>
      ) : (
        <div className="space-y-3">
          {currentLogs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ClipboardCheck size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-stone-900 text-sm">{log.description}</div>
                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span>بواسطة: <b dir="ltr">{log.username}</b></span>
                  {log.booking_id && <span dir="ltr">#{log.booking_id}</span>}
                  {log.old_value !== null && <span>{log.old_value} ← {log.new_value}</span>}
                </div>
              </div>
              <time className="text-xs text-gray-400 shrink-0">{new Date(log.created_at).toLocaleString("ar-SA")}</time>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            السابق (Previous)
          </button>
          <span className="text-sm text-gray-500">
            صفحة {page} من {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            التالي (Next)
          </button>
        </div>
      )}
    </div>
  );
}
export default function Dashboard() {
  //const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  // Component ke shuru mein state aise likhein taake refresh par data na udaye
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tab, setTab] = useState<Tab>("cars");
  const [showReset, setShowReset] = useState(false);
  const { store, updateCar, updateLocation, updateSlide, addCar, deleteCar, addSlide, deleteSlide, addLocation, deleteLocation, resetAll } = useAdminStore();

  if (!currentUser) return <LoginScreen onLogin={(u) => setCurrentUser(u)} />;

  const isSuperAdmin = currentUser.role === "superadmin";

  const tabs = [
    { id: "cars" as Tab, label: "السيارات", icon: Car },
    { id: "bookings" as Tab, label: "الطلبات", icon: ClipboardList },
    ...(isSuperAdmin ? [
      { id: "locations" as Tab, label: "الفروع", icon: MapPin },
      { id: "slides" as Tab, label: "السلايدر", icon: Image },
      { id: "users" as Tab, label: "المستخدمون", icon: Users },
      { id: "logs" as Tab, label: "سجل النشاطات", icon: ClipboardCheck },
      
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-[hsl(30,15%,96%)]">
      {/* Top bar */}
      <header className="bg-[#3d1a06] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon size={36} />
          <div>
            <div className="font-black text-base">لوحة التحكم</div>
            <div className="text-[hsl(40,88%,58%)] text-xs">Sakher Admin Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-lg">
            {isSuperAdmin ? <ShieldCheck size={13} className="text-[hsl(40,88%,52%)]" /> : <UserCog size={13} />}
            <span dir="ltr">{currentUser.username}</span>
          </span>
          <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded-lg">
            عرض الموقع ↗
          </a>
          {/* <button
            onClick={() => {
              const data = {
                cars: store.cars,
                locations: store.locations,
                slides: store.slides,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "sakhr-data.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Download size={13} /> تصدير البيانات
          </button> */}
          {/* <button
            onClick={() => setShowReset(true)}
            className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <RotateCcw size={13} /> إعادة ضبط
          </button>
          <button
            onClick={() => setCurrentUser(null)}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <LogOut size={14} /> خروج
          </button> */}
          <button
            onClick={() => {
              localStorage.removeItem("admin_user");
              setCurrentUser(null);
            }}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <LogOut size={14} /> خروج
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 py-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t.id
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
              <CarsTab cars={store.cars} onUpdate={updateCar} onAdd={addCar} onDelete={deleteCar} />
            )}
            {tab === "bookings" && (
              <BookingsTab isSuperAdmin={isSuperAdmin} />
            )}
            {tab === "locations" && isSuperAdmin && (
              <LocationsTab locations={store.locations} onUpdate={updateLocation} onAdd={addLocation} onDelete={deleteLocation} />
            )}
            {tab === "slides" && (
              <SlidesTab slides={store.slides} onUpdate={updateSlide} onAdd={addSlide} onDelete={deleteSlide} />
            )}
            {tab === "users" && isSuperAdmin && (
              <UsersTab currentUserId={currentUser.id} />
            )}
            {tab === "logs" && isSuperAdmin && <LogsTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Reset confirmation dialog */}
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
              <h3 className="text-xl font-black text-[hsl(22,85%,18%)] mb-2">إعادة ضبط البيانات</h3>
              <p className="text-gray-500 text-sm mb-6">سيتم حذف جميع التعديلات وإعادة البيانات إلى الإعدادات الافتراضية. هل أنت متأكد؟</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => { resetAll(); setShowReset(false); }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  إعادة الضبط
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
