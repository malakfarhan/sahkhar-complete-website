import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, ChevronUp, ChevronDown, Save, X, AlertTriangle } from "lucide-react";
import { AdminLocation } from "./types";
import { blankLocation } from "./utils/helpers";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  locations: AdminLocation[];
  onUpdate: (id: string, p: Partial<AdminLocation>) => void;
  onAdd: (loc: Omit<AdminLocation, "id">) => void;
  onDelete: (id: string) => void;
}

export default function LocationsTab({ locations, onUpdate, onAdd, onDelete }: Props) {
  const { language, isEnglish } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<AdminLocation>>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoc, setNewLoc] = useState<Omit<AdminLocation, "id">>(blankLocation());
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [locError, setLocError] = useState("");

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    // Header
    title: isEnglish ? "Manage Branches" : "إدارة الفروع",
    branchesCount: isEnglish ? "branches" : "فروع",
    citiesCount: isEnglish ? "cities" : "مدينة",
    addBranch: isEnglish ? "Add Branch" : "إضافة فرع",
    
    // Add Modal
    addBranchTitle: isEnglish ? "Add New Branch" : "إضافة فرع جديد",
    cityAr: isEnglish ? "City (Arabic)" : "المدينة (عربي)",
    cityEn: isEnglish ? "City (English)" : "المدينة (إنجليزي)",
    newCity: isEnglish ? "New City" : "مدينة جديدة",
    newCityBtn: isEnglish ? "+ New City" : "+ مدينة جديدة",
    newCityActive: isEnglish ? "✓ New City" : "✓ مدينة جديدة",
    branchName: isEnglish ? "Branch Name" : "اسم الفرع",
    address: isEnglish ? "Address" : "العنوان",
    hours: isEnglish ? "Working Hours" : "ساعات العمل",
    description: isEnglish ? "Description" : "الوصف",
    phone: isEnglish ? "Phone Number" : "رقم الهاتف",
    mapUrl: isEnglish ? "Google Maps URL" : "رابط الموقع (Google Maps)",
    mapEmbed: isEnglish ? "Map Embed URL" : "رابط تضمين الخريطة المصغرة",
    mapPreview: isEnglish ? "Preview" : "للمعاينة",
    mainBranch: isEnglish ? "Main Branch" : "فرع رئيسي",
    addBtn: isEnglish ? "Add Branch" : "إضافة الفرع",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    
    // Branch Card
    active: isEnglish ? "Active" : "مفعّل",
    inactive: isEnglish ? "Inactive" : "معطّل",
    main: isEnglish ? "Main" : "رئيسي",
    deleteConfirm: isEnglish ? "Delete?" : "حذف؟",
    yes: isEnglish ? "Yes" : "نعم",
    no: isEnglish ? "No" : "لا",
    save: isEnglish ? "Save" : "حفظ",
    saved: isEnglish ? "✓ Saved" : "✓ تم الحفظ",
    saveChanges: isEnglish ? "Save Changes" : "حفظ التغييرات",
    
    // Labels
    branchLabel: isEnglish ? "Branch" : "فرع",
    branches: isEnglish ? "branches" : "فروع",
    
    // Errors
    cityRequired: isEnglish ? "City is required" : "المدينة مطلوبة",
    branchRequired: isEnglish ? "Branch name is required" : "اسم الفرع مطلوب",
  };

  const existingCities = [...new Set(locations.map((l) => l.city))];
  const cities = [...new Set(locations.map((l) => l.city))];

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
    if (!city) return setLocError(t.cityRequired);
    if (!newLoc.branch.trim()) return setLocError(t.branchRequired);
    onAdd({ ...newLoc, city });
    setNewLoc(blankLocation());
    setCustomCity("");
    setUseCustomCity(false);
    setLocError("");
    setShowAddForm(false);
  };

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{locations.length} {t.branchesCount} — {cities.length} {t.citiesCount}</span>
          <button
            onClick={() => {
              setNewLoc(blankLocation(existingCities[0] || ""));
              setUseCustomCity(false);
              setLocError("");
              setShowAddForm(true);
            }}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> {t.addBranch}
          </button>
        </div>
      </div>

      {/* Add location modal */}
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
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">{t.addBranchTitle}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* City selector */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.cityAr}</label>
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
                        placeholder={t.newCity}
                        className="flex-1 border-2 border-[hsl(40,88%,52%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setUseCustomCity(!useCustomCity)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors ${
                        useCustomCity
                          ? "bg-[#3d1a06] text-white border-[#3d1a06]"
                          : "border-[hsl(30,15%,80%)] text-gray-500 hover:border-[hsl(22,85%,18%)]"
                      }`}
                    >
                      {useCustomCity ? t.newCityActive : t.newCityBtn}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.cityEn}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newLoc.cityEn}
                    onChange={(e) => setNewLoc({ ...newLoc, cityEn: e.target.value })}
                    placeholder="City in English"
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                {[
                  { keyAr: "branch", keyEn: "branchEn", label: t.branchName, placeholderAr: "فرع العليا", placeholderEn: "Branch Name" },
                  { keyAr: "address", keyEn: "addressEn", label: t.address, placeholderAr: "حي العليا، شارع العروبة", placeholderEn: "Address" },
                  { keyAr: "hours", keyEn: "hoursEn", label: t.hours, placeholderAr: "8:00 ص - 10:00 م", placeholderEn: "8:00 AM - 10:00 PM" },
                  { keyAr: "description", keyEn: "descriptionEn", label: t.description, placeholderAr: "وصف الفرع...", placeholderEn: "Description" },
                ].map(({ keyAr, keyEn, label, placeholderAr, placeholderEn }) => (
                  <div key={keyAr} className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label} (عربي)</label>
                    <input
                      type="text"
                      value={String((newLoc as unknown as Record<string, unknown>)[keyAr] ?? "")}
                      onChange={(e) => setNewLoc({ ...newLoc, [keyAr]: e.target.value })}
                      placeholder={placeholderAr}
                      className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                    />
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label} (إنجليزي)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={String((newLoc as unknown as Record<string, unknown>)[keyEn] ?? "")}
                      onChange={(e) => setNewLoc({ ...newLoc, [keyEn]: e.target.value })}
                      placeholder={placeholderEn}
                      className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                ))}

                {/* Phone field */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.phone}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newLoc.phone}
                    onChange={(e) => setNewLoc({ ...newLoc, phone: e.target.value })}
                    placeholder="920017014"
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                {/* Map URL */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.mapUrl}</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={newLoc.mapUrl ?? ""}
                    onChange={(e) => setNewLoc({ ...newLoc, mapUrl: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                {/* Map Embed */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                    {t.mapEmbed}
                    <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold">{t.mapPreview}</span>
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={newLoc.mapEmbed ?? ""}
                    onChange={(e) => setNewLoc({ ...newLoc, mapEmbed: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2.5 text-sm outline-none"
                  />
                  {newLoc.mapEmbed && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-[hsl(30,15%,85%)] h-36">
                      <iframe
                        src={newLoc.mapEmbed}
                        width="100%"
                        height="100%"
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
                  <input
                    type="checkbox"
                    checked={newLoc.isMain}
                    onChange={(e) => setNewLoc({ ...newLoc, isMain: e.target.checked })}
                    className="w-4 h-4 accent-[hsl(40,88%,52%)]"
                  />
                  <span className="text-sm font-semibold text-gray-600">{t.mainBranch}</span>
                </label>
              </div>

              {locError && (
                <p className="mt-3 text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {locError}
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAdd}
                  className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={15} /> {t.addBtn}
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

      {/* Branches grouped by city */}
      {cities.map((city) => (
        <div key={city} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-[#3d1a06]" />
            <span className="font-black text-[hsl(22,85%,18%)] text-base">{city}</span>
            <span className="text-xs text-gray-400">({locations.filter((l) => l.city === city).length} {t.branches})</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-3">
            {locations.filter((l) => l.city === city).map((loc) => {
              const d = drafts[loc.id] || {};
              const isOpen = expanded === loc.id;

              return (
                <div
                  key={loc.id}
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                    loc.active ? "border-[hsl(30,15%,88%)]" : "border-red-200 opacity-70"
                  }`}
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[hsl(30,15%,98%)]"
                    onClick={() => toggle(loc.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${loc.active ? "bg-green-500" : "bg-red-400"}`} />
                      <div>
                        <span className="font-bold text-[hsl(22,85%,18%)]">{loc.branch}</span>
                        {loc.isMain && (
                          <span className="mr-2 text-xs bg-[hsl(40,88%,95%)] text-[hsl(40,88%,40%)] font-bold px-2 py-0.5 rounded-full">
                            {t.main}
                          </span>
                        )}
                        <p className="text-xs text-gray-400">{d.phone ?? loc.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdate(loc.id, { active: !loc.active }); }}
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          loc.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {loc.active ? t.active : t.inactive}
                      </button>
                      {confirmDelete === loc.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <span className="text-red-500 text-xs font-bold">{t.deleteConfirm}</span>
                          <button
                            onClick={() => { onDelete(loc.id); setConfirmDelete(null); }}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold"
                          >
                            {t.yes}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-gray-400 text-xs px-1"
                          >
                            {t.no}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(loc.id); }}
                          className="text-red-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-[hsl(30,15%,92%)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            { keyAr: "branch", keyEn: "branchEn", label: t.branchName },
                            { keyAr: "city", keyEn: "cityEn", label: t.cityAr },
                            { keyAr: "address", keyEn: "addressEn", label: t.address },
                            { keyAr: "hours", keyEn: "hoursEn", label: t.hours },
                            { keyAr: "description", keyEn: "descriptionEn", label: t.description, fullWidth: true },
                          ] as const).map(({ keyAr, keyEn, label, fullWidth }) => (
                            <div key={keyAr} className={fullWidth ? "sm:col-span-2" : ""}>
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">{label} (عربي)</label>
                              <input
                                type="text"
                                defaultValue={String((loc as unknown as Record<string, unknown>)[keyAr] ?? "")}
                                onChange={(e) => patch(loc.id, keyAr as keyof AdminLocation, e.target.value)}
                                className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors mb-2"
                              />
                              <label className="text-xs font-semibold text-gray-500 mb-1 block">{label} (إنجليزي)</label>
                              <input
                                type="text"
                                dir="ltr"
                                defaultValue={String((loc as unknown as Record<string, unknown>)[keyEn] ?? "")}
                                onChange={(e) => patch(loc.id, keyEn as keyof AdminLocation, e.target.value)}
                                className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                              />
                            </div>
                          ))}

                          {/* Phone field */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.phone}</label>
                            <input
                              type="text"
                              dir="ltr"
                              defaultValue={loc.phone ?? ""}
                              onChange={(e) => patch(loc.id, "phone", e.target.value)}
                              className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                            />
                          </div>

                          {/* Map URL field */}
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.mapUrl}</label>
                            <input
                              type="url"
                              dir="ltr"
                              defaultValue={loc.mapUrl ?? ""}
                              onChange={(e) => patch(loc.id, "mapUrl", e.target.value)}
                              placeholder="https://maps.app.goo.gl/..."
                              className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                            />
                          </div>

                          {/* Map Embed field */}
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                              {t.mapEmbed}
                              <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold">{t.mapPreview}</span>
                            </label>
                            <input
                              type="url"
                              dir="ltr"
                              defaultValue={loc.mapEmbed ?? ""}
                              onChange={(e) => patch(loc.id, "mapEmbed", e.target.value)}
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] transition-colors"
                            />
                            {(drafts[loc.id]?.mapEmbed ?? loc.mapEmbed) && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-[hsl(30,15%,85%)] h-36">
                                <iframe
                                  src={drafts[loc.id]?.mapEmbed ?? loc.mapEmbed}
                                  width="100%"
                                  height="100%"
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
                            {saved === loc.id && (
                              <span className="text-green-600 text-sm font-semibold self-center">{t.saved}</span>
                            )}
                            <button
                              onClick={() => save(loc.id, loc)}
                              className="btn-gold px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5"
                            >
                              <Save size={14} /> {t.saveChanges}
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