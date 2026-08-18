import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Plus, Trash2, Save, X } from "lucide-react";
import { AdminSlide } from "./types";
import { blankSlide } from "./utils/helpers";
import ImageUploadButton from "./ImageUploadButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  slides: AdminSlide[];
  onUpdate: (id: number, p: Partial<AdminSlide>) => void;
  onAdd: (s: Omit<AdminSlide, "id">) => void;
  onDelete: (id: number) => void;
}

export default function SlidesTab({ slides, onUpdate, onAdd, onDelete }: Props) {
  const { language, isEnglish } = useLanguage();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<AdminSlide>>({});
  const [saved, setSaved] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlide, setNewSlide] = useState<Omit<AdminSlide, "id">>(blankSlide());

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    // Header
    title: isEnglish ? "Manage Homepage Slides" : "إدارة شرائح الصفحة الرئيسية",
    slidesCount: isEnglish ? "slides" : "شرائح",
    addSlide: isEnglish ? "Add Slide" : "إضافة شريحة",
    
    // Add Modal
    addSlideTitle: isEnglish ? "Add New Slide" : "إضافة شريحة جديدة",
    noImage: isEnglish ? "No background image" : "لا توجد صورة خلفية",
    badge: isEnglish ? "Badge" : "الشارة (Badge)",
    heading: isEnglish ? "Heading" : "العنوان الرئيسي",
    sub: isEnglish ? "Subtitle" : "النص التوضيحي",
    ctaLabel: isEnglish ? "Primary Button Text" : "نص الزر الأول",
    cta2Label: isEnglish ? "Secondary Button Text" : "نص الزر الثاني",
    addBtn: isEnglish ? "Add Slide" : "إضافة الشريحة",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    
    // Slide Card
    active: isEnglish ? "Active" : "مفعّلة",
    inactive: isEnglish ? "Inactive" : "معطّلة",
    slide: isEnglish ? "Slide" : "شريحة",
    deleteConfirm: isEnglish ? "Delete Slide?" : "حذف الشريحة؟",
    yes: isEnglish ? "Yes" : "نعم",
    no: isEnglish ? "No" : "لا",
    editTexts: isEnglish ? "Edit Texts" : "تعديل النصوص",
    save: isEnglish ? "Save" : "حفظ",
    saved: isEnglish ? "✓ Saved" : "✓ تم الحفظ",
    
    // Edit Form
    arabic: isEnglish ? "(Arabic)" : "(عربي)",
    english: isEnglish ? "(English)" : "(إنجليزي)",
  };

  const startEdit = (s: AdminSlide) => {
    setEditing(s.id);
    setDraft({
      badge: s.badge,
      badgeEn: s.badgeEn,
      heading: s.heading,
      headingEn: s.headingEn,
      sub: s.sub,
      subEn: s.subEn,
      ctaLabel: s.ctaLabel,
      ctaLabelEn: s.ctaLabelEn,
      cta2Label: s.cta2Label,
      cta2LabelEn: s.cta2LabelEn,
    });
  };

  const saveSlide = (id: number) => {
    onUpdate(id, draft);
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{slides.length} {t.slidesCount}</span>
          <button
            onClick={() => { setNewSlide(blankSlide()); setShowAddForm(true); }}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Plus size={15} /> {t.addSlide}
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
                <h3 className="text-lg font-black text-[hsl(22,85%,18%)]">{t.addSlideTitle}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Image preview */}
              <div
                className="h-36 relative bg-cover bg-center rounded-xl overflow-hidden mb-3"
                style={{ backgroundImage: newSlide.bg ? `url(${newSlide.bg})` : undefined }}
              >
                {!newSlide.bg && (
                  <div className="absolute inset-0 bg-[hsl(30,15%,96%)] flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Image size={36} strokeWidth={1} />
                    <span className="text-xs">{t.noImage}</span>
                  </div>
                )}
                {newSlide.bg && <div className="absolute inset-0 bg-black/50" />}
                <div className="absolute bottom-3 right-3">
                  <ImageUploadButton small onUpload={(url) => setNewSlide({ ...newSlide, bg: url })} />
                </div>
              </div>

              <div className="space-y-3">
                {([
                  { keyAr: "badge", keyEn: "badgeEn", label: t.badge, placeholderAr: "SUV فاخرة", placeholderEn: "Luxury SUVs" },
                  { keyAr: "heading", keyEn: "headingEn", label: t.heading, placeholderAr: "العنوان هنا", placeholderEn: "Heading Here" },
                  { keyAr: "sub", keyEn: "subEn", label: t.sub, placeholderAr: "وصف الشريحة...", placeholderEn: "Description text", isTextarea: true },
                  { keyAr: "ctaLabel", keyEn: "ctaLabelEn", label: t.ctaLabel, placeholderAr: "احجز الآن", placeholderEn: "Book Now" },
                  { keyAr: "cta2Label", keyEn: "cta2LabelEn", label: t.cta2Label, placeholderAr: "تصفح الأسطول", placeholderEn: "Browse Fleet" },
                ] as const).map(({ keyAr, keyEn, label, placeholderAr, placeholderEn, isTextarea }) => (
                  <div key={keyAr}>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label} {t.arabic}</label>
                    {isTextarea ? (
                      <textarea
                        rows={2}
                        value={newSlide[keyAr as keyof typeof newSlide]}
                        onChange={(e) => setNewSlide({ ...newSlide, [keyAr]: e.target.value })}
                        placeholder={placeholderAr}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={newSlide[keyAr as keyof typeof newSlide]}
                        onChange={(e) => setNewSlide({ ...newSlide, [keyAr]: e.target.value })}
                        placeholder={placeholderAr}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none"
                      />
                    )}
                    <label className="text-xs font-semibold text-gray-500 mb-1 block mt-2">{label} {t.english}</label>
                    {isTextarea ? (
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={newSlide[keyEn as keyof typeof newSlide]}
                        onChange={(e) => setNewSlide({ ...newSlide, [keyEn]: e.target.value })}
                        placeholder={placeholderEn}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        dir="ltr"
                        value={newSlide[keyEn as keyof typeof newSlide]}
                        onChange={(e) => setNewSlide({ ...newSlide, [keyEn]: e.target.value })}
                        placeholder={placeholderEn}
                        className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-3 py-2 text-sm outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { onAdd(newSlide); setShowAddForm(false); }}
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

      {/* Slides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden ${
              slide.active ? "border-[hsl(30,15%,88%)]" : "border-red-200"
            }`}
          >
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
                <span className="bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">{t.slide} {idx + 1}</span>
              </div>
              <div className="absolute top-2 left-2 flex gap-1.5">
                <button
                  onClick={() => onUpdate(slide.id, { active: !slide.active })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    slide.active ? "bg-green-500 text-white" : "bg-red-400 text-white"
                  }`}
                >
                  {slide.active ? t.active : t.inactive}
                </button>
              </div>
              {confirmDelete === slide.id ? (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1">
                  <span className="text-red-500 text-[10px] font-bold">{t.deleteConfirm}</span>
                  <button
                    onClick={() => { onDelete(slide.id); setConfirmDelete(null); }}
                    className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold"
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
                  onClick={() => setConfirmDelete(slide.id)}
                  className="absolute bottom-2 left-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="absolute bottom-2 right-2">
                <ImageUploadButton small onUpload={(url) => onUpdate(slide.id, { bg: url })} />
              </div>
            </div>

            <div className="p-4">
              {editing === slide.id ? (
                <div className="space-y-3">
                  {([
                    { keyAr: "badge", keyEn: "badgeEn", label: t.badge },
                    { keyAr: "heading", keyEn: "headingEn", label: t.heading },
                    { keyAr: "sub", keyEn: "subEn", label: t.sub, isTextarea: true },
                    { keyAr: "ctaLabel", keyEn: "ctaLabelEn", label: t.ctaLabel },
                    { keyAr: "cta2Label", keyEn: "cta2LabelEn", label: t.cta2Label },
                  ] as const).map(({ keyAr, keyEn, label, isTextarea }) => (
                    <div key={keyAr}>
                      <label className="text-xs text-gray-500 block mb-1">{label} {t.arabic}</label>
                      {isTextarea ? (
                        <textarea
                          rows={2}
                          defaultValue={slide[keyAr as keyof typeof slide]}
                          onChange={(e) => setDraft({ ...draft, [keyAr]: e.target.value })}
                          className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          defaultValue={slide[keyAr as keyof typeof slide]}
                          onChange={(e) => setDraft({ ...draft, [keyAr]: e.target.value })}
                          className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)]"
                        />
                      )}
                      <label className="text-xs text-gray-500 block mb-1 mt-2">{label} {t.english}</label>
                      {isTextarea ? (
                        <textarea
                          rows={2}
                          dir="ltr"
                          defaultValue={slide[keyEn as keyof typeof slide]}
                          onChange={(e) => setDraft({ ...draft, [keyEn]: e.target.value })}
                          className="w-full border border-[hsl(30,15%,88%)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[hsl(40,88%,52%)] resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          dir="ltr"
                          defaultValue={slide[keyEn as keyof typeof slide]}
                          onChange={(e) => setDraft({ ...draft, [keyEn]: e.target.value })}
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
                      <Save size={14} /> {t.save}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      {t.cancel}
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
                    {saved === slide.id && <span className="text-green-600 text-xs font-semibold">{t.saved}</span>}
                    <button
                      onClick={() => startEdit(slide)}
                      className="mr-auto text-xs font-bold text-[hsl(22,85%,18%)] border-2 border-[hsl(22,85%,18%)] px-3 py-1.5 rounded-lg hover:bg-[#3d1a06] hover:text-white transition-colors"
                    >
                      {t.editTexts}
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