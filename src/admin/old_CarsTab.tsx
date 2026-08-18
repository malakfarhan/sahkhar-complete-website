import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Plus, ToggleRight, ToggleLeft, Trash2, Save, X, AlertTriangle, CheckCircle } from "lucide-react";
import { AdminCar, CAR_CATEGORIES, CAR_CATEGORIES_EN, ARABIC_TO_ENGLISH_CATEGORY, ENGLISH_TO_ARABIC_CATEGORY } from "./types";
import { blankCar } from "./utils/helpers";
import ImageUploadButton from "./ImageUploadButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  cars: AdminCar[];
  onUpdate: (id: number, p: Partial<AdminCar>) => void;
  onAdd: (car: Omit<AdminCar, "id">) => void;
  onDelete: (id: number) => void;
}

export default function CarsTab({ cars, onUpdate, onAdd, onDelete }: Props) {
  const { language, isEnglish } = useLanguage();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<AdminCar>>({});
  const [saved, setSaved] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState<Omit<AdminCar, "id">>(blankCar());
  const [newCarError, setNewCarError] = useState("");
  
  // State for feature string input in modal/edit
  const [featureInput, setFeatureInput] = useState("");

  // ============================================
  // 📝 COMPLETE TRANSLATIONS
  // ============================================
  const t = {
    title: isEnglish ? "Manage Cars & Pricing" : "إدارة السيارات والأسعار",
    carsCount: isEnglish ? "cars" : "سيارة",
    addCar: isEnglish ? "Add Car" : "إضافة سيارة",
    
    addCarTitle: isEnglish ? "Add New Car" : "إضافة سيارة جديدة",
    noImage: isEnglish ? "No image" : "لا توجد صورة",
    uploadImage: isEnglish ? "Upload Image" : "رفع صورة",
    
    carNameAr: isEnglish ? "Car Name (Arabic)" : "اسم السيارة (عربي)",
    carNameArPlaceholder: isEnglish ? "Enter car name in Arabic" : "أدخل اسم السيارة بالعربية",
    carNameEn: isEnglish ? "Car Name (English)" : "اسم السيارة (إنجليزي)",
    carNameEnPlaceholder: isEnglish ? "Enter car name in English" : "أدخل اسم السيارة بالإنجليزية",
    category: isEnglish ? "Category" : "الفئة",
    categoryEn: isEnglish ? "Category (English)" : "الفئة (إنجليزي)",
    dailyPrice: isEnglish ? "Daily Price (SAR)" : "السعر اليومي (⃁)",
    seats: isEnglish ? "Seats" : "عدد المقاعد",
    year: isEnglish ? "Year" : "سنة الصنع",
    transmission: isEnglish ? "Transmission" : "ناقل الحركة",
    fuel: isEnglish ? "Fuel Type" : "نوع الوقود",
    features: isEnglish ? "Features (comma separated)" : "المميزات (مفصولة بفاصلة)",
    featuresPlaceholder: isEnglish ? "e.g. AC, Leather Seats, Bluetooth" : "مثال: مكيف هواء, مقاعد جلد, بلوتوث",
    
    automatic: isEnglish ? "Automatic" : "أوتوماتيك",
    manual: isEnglish ? "Manual" : "مانيوال",
    petrol: isEnglish ? "Petrol" : "بنزين",
    diesel: isEnglish ? "Diesel" : "ديزل",
    hybrid: isEnglish ? "Hybrid" : "هجين",
    electric: isEnglish ? "Electric" : "كهربائي",
    
    addCarBtn: isEnglish ? "Add Car" : "إضافة السيارة",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    
    available: isEnglish ? "Available" : "متاح",
    unavailable: isEnglish ? "Unavailable" : "غير متاح",
    seatsLabel: isEnglish ? "seats" : "مقاعد",
    perDay: isEnglish ? "/ day" : "/ يوم",
    editPrice: isEnglish ? "Edit Details" : "تعديل التفاصيل",
    save: isEnglish ? "Save" : "حفظ",
    
    deleteConfirm: isEnglish ? "Delete?" : "حذف؟",
    yes: isEnglish ? "Yes" : "نعم",
    no: isEnglish ? "No" : "لا",
    
    saved: isEnglish ? "✓ Saved" : "✓ تم الحفظ",
    errorName: isEnglish ? "Car name is required" : "اسم السيارة مطلوب",
    errorNameEn: isEnglish ? "English name is required" : "الاسم بالإنجليزية مطلوب",
    errorPrice: isEnglish ? "Price must be greater than 0" : "السعر يجب أن يكون أكبر من صفر",
  };

  const startEdit = (car: AdminCar) => {
    setEditing(car.id);
    setDraft({ 
      dailyPrice: car.dailyPrice, 
      available: car.available,
      features: car.features || [] 
    });
    setFeatureInput(car.features ? car.features.join(", ") : "");
  };

  const saveEdit = (id: number) => {
    onUpdate(id, {
      ...draft,
      features: featureInput ? featureInput.split(",").map(f => f.trim()).filter(Boolean) : []
    });
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleAddCar = () => {
    if (!newCar.name.trim()) return setNewCarError(t.errorName);
    if (!newCar.nameEn.trim()) return setNewCarError(t.errorNameEn);
    if (!newCar.category.trim()) return setNewCarError(isEnglish ? "Category is required" : "الفئة مطلوبة");
    if (newCar.dailyPrice <= 0) return setNewCarError(t.errorPrice);

    const normalizedCar = {
      ...newCar,
      category: newCar.category.trim(),
      categoryEn: newCar.categoryEn?.trim() || ARABIC_TO_ENGLISH_CATEGORY[newCar.category] || "",
      features: featureInput ? featureInput.split(",").map(f => f.trim()).filter(Boolean) : [],
    };

    onAdd(normalizedCar as Omit<AdminCar, "id">);
    setNewCar(blankCar());
    setFeatureInput("");
    setNewCarError("");
    setShowAddForm(false);
  };

  const categories = [...new Set(cars.map((c) => (isEnglish ? (c.categoryEn || c.category) : c.category)))];
  const arCategoryOptions = [...new Set([...CAR_CATEGORIES, ...cars.map((c) => c.category)])].filter(Boolean);
  const enCategoryOptions = [...new Set([...CAR_CATEGORIES_EN, ...cars.map((c) => c.categoryEn || ARABIC_TO_ENGLISH_CATEGORY[c.category] || "")])].filter(Boolean);

  const handleArabicCategoryChange = (value: string) => {
    const englishValue = ARABIC_TO_ENGLISH_CATEGORY[value] ?? value;
    setNewCar({ ...newCar, category: value, categoryEn: englishValue });
  };

  const handleEnglishCategoryChange = (value: string) => {
    const arabicValue = ENGLISH_TO_ARABIC_CATEGORY[value] ?? value;
    setNewCar({ ...newCar, categoryEn: value, category: arabicValue });
  };

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{cars.length} {t.carsCount}</span>
          <button
            onClick={() => {
              setNewCar(blankCar());
              setFeatureInput("");
              setNewCarError("");
              setShowAddForm(true);
            }}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> {t.addCar}
          </button>
        </div>
      </div>

      {/* ADD CAR MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">{t.addCarTitle}</h3>
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
                      <span className="text-xs">{t.noImage}</span>
                    </div>
                  )}
                </div>
                <ImageUploadButton 
                  small={false} 
                  onUpload={(url) => setNewCar({ ...newCar, image: url })} 
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.carNameAr}</label>
                  <input
                    type="text"
                    value={newCar.name}
                    onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    placeholder={t.carNameArPlaceholder}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.carNameEn}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newCar.nameEn}
                    onChange={(e) => setNewCar({ ...newCar, nameEn: e.target.value })}
                    placeholder={t.carNameEnPlaceholder}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.category}</label>
                  <select
                    value={newCar.category}
                    onChange={(e) => handleArabicCategoryChange(e.target.value)}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    <option value="">{isEnglish ? "Select category" : "اختر الفئة"}</option>
                    {arCategoryOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.categoryEn}</label>
                  <select
                    value={newCar.categoryEn}
                    onChange={(e) => handleEnglishCategoryChange(e.target.value)}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    <option value="">{isEnglish ? "Select English category" : "اختر الفئة بالإنجليزية"}</option>
                    {enCategoryOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.dailyPrice}</label>
                  <input
                    type="number"
                    value={newCar.dailyPrice}
                    onChange={(e) => setNewCar({ ...newCar, dailyPrice: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.seats}</label>
                  <input
                    type="number"
                    value={newCar.seats}
                    onChange={(e) => setNewCar({ ...newCar, seats: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.year}</label>
                  <input
                    type="number"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.transmission}</label>
                  <select
                    value={newCar.transmission}
                    onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    <option value="أوتوماتيك">{t.automatic}</option>
                    <option value="مانيوال">{t.manual}</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.fuel}</label>
                  <select
                    value={newCar.fuel}
                    onChange={(e) => setNewCar({ ...newCar, fuel: e.target.value })}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    <option value="بنزين">{t.petrol}</option>
                    <option value="ديزل">{t.diesel}</option>
                    <option value="هجين">{t.hybrid}</option>
                    <option value="كهربائي">{t.electric}</option>
                  </select>
                </div>

                {/* ✅ Features Input */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.features}</label>
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder={t.featuresPlaceholder}
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              {newCarError && (
                <p className="mt-3 text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {newCarError}
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAddCar}
                  className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={15} /> {t.addCarBtn}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm"
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAR CARDS */}
      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3d1a06] text-white text-xs font-bold px-3 py-1 rounded-full">{cat}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cars
              .filter((c) => (isEnglish ? (c.categoryEn || c.category) === cat : c.category === cat))
              .map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                    car.available ? "border-[hsl(30,15%,88%)]" : "border-red-200 opacity-70"
                  }`}
                >
                  <div className="h-32 bg-[hsl(30,15%,96%)] overflow-hidden relative">
                    <img
                      src={car.image}
                      alt={isEnglish ? car.nameEn : car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/300x120/5c2301/d4a017?text=${car.nameEn?.split(" ")[0] || "Car"}`;
                      }}
                    />
                    <button
                      onClick={() => onUpdate(car.id, { available: !car.available })}
                      className={`absolute top-2 left-2 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                        car.available ? "bg-green-500 text-white" : "bg-red-400 text-white"
                      }`}
                    >
                      {car.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {car.available ? t.available : t.unavailable}
                    </button>
                    {confirmDelete === car.id ? (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1">
                        <span className="text-red-500 text-[10px] font-bold">{t.deleteConfirm}</span>
                        <button
                          onClick={() => onDelete(car.id)}
                          className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold hover:bg-red-600"
                        >
                          {t.yes}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-gray-400 text-[10px] px-1"
                        >
                          {t.no}
                        </button>
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
                    <h3 className="font-bold text-[hsl(22,85%,18%)] mb-1">
                      {isEnglish ? (car.nameEn || car.name) : car.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{car.year} • {car.seats} {t.seatsLabel} • {car.transmission}</p>

                    {/* ✅ Display Features Badges */}
                    {car.features && car.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {car.features.map((f, i) => (
                          <span key={i} className="flex items-center gap-1 bg-[hsl(30,15%,96%)] text-gray-600 text-[10px] px-2 py-0.5 rounded-md">
                        <CheckCircle size={10} className="text-[hsl(40,88%,48%)]" />
                            {f}      
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ✅ Booking Summary Badges */}
{car.bookingSummary && (
  <div className="flex flex-wrap gap-1 mb-3">
    {car.bookingSummary.pending > 0 && (
      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
        🟡 {isEnglish ? "Pending" : "قيد الانتظار"}: {car.bookingSummary.pending}
      </span>
    )}
    {car.bookingSummary.confirmed > 0 && (
      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
        🔵 {isEnglish ? "Confirmed" : "مؤكد"}: {car.bookingSummary.confirmed}
      </span>
    )}
    {car.bookingSummary.completed > 0 && (
      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
        ✅ {isEnglish ? "Completed" : "مكتمل"}: {car.bookingSummary.completed}
      </span>
    )}
    {car.bookingSummary.cancelled > 0 && (
      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
        ❌ {isEnglish ? "Cancelled" : "ملغي"}: {car.bookingSummary.cancelled}
      </span>
    )}
  </div>
)}

                    <ImageUploadButton 
                      small={true} 
                      onUpload={(url) => onUpdate(car.id, { image: url })} 
                    />

                    {editing === car.id ? (
                      <div className="space-y-3 mt-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t.dailyPrice}</label>
                          <input
                            type="number"
                            value={draft.dailyPrice}
                            onChange={(e) => setDraft({ ...draft, dailyPrice: Number(e.target.value) })}
                            className="w-full border-2 border-[hsl(40,88%,52%)] rounded-lg px-3 py-2 text-sm font-bold text-center outline-none"
                          />
                        </div>

                        {/* ✅ Edit Features Input */}
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t.features}</label>
                          <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder={t.featuresPlaceholder}
                            className="w-full border-2 border-[hsl(30,15%,85%)] rounded-lg px-3 py-2 text-xs outline-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(car.id)}
                            className="flex-1 btn-gold py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Save size={13} /> {t.save}
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="flex-1 border border-gray-200 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-2xl font-black text-[hsl(22,85%,18%)]">{car.dailyPrice}</span>
                          <span className="text-[hsl(40,88%,44%)] font-bold text-sm"> ⃁</span>
                          <span className="text-gray-400 text-xs"> {t.perDay}</span>
                        </div>
                        <button
                          onClick={() => startEdit(car)}
                          className="text-xs font-bold text-[hsl(22,85%,18%)] border-2 border-[hsl(22,85%,18%)] px-3 py-1.5 rounded-lg hover:bg-[#3d1a06] hover:text-white transition-colors"
                        >
                          {t.editPrice}
                        </button>
                      </div>
                    )}

                    {saved === car.id && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-600 text-xs text-center mt-2 font-semibold"
                      >
                        {t.saved}
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