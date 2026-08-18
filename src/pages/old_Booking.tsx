import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Car, User, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { usePublicCars } from "@/store/adminStore";
import { apiAddBooking } from "@/lib/api";

const pickupLocations = [
  "Riyadh - Main Branch",
  "Riyadh - Al Qayrawan Branch",
  "Riyadh - Al Aqiq Branch",
  "Riyadh - Al Shifa Branch",
  "Ras Tanura",
  "Jeddah - Jeddah First Branch",
  "Jeddah - Jeddah Branch 2",
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "ص" : "م";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function Booking() {
  const allCars = usePublicCars();
  const availableCars = allCars.filter((c) => c.available && c.active !== false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: "", dropoffLocation: "",
    pickupDate: "", pickupTime: "09:00",
    dropoffDate: "", dropoffTime: "09:00",
    carId: "", name: "", phone: "", idNumber: "", email: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDays = (pDate: string, dDate: string) => {
    if (!pDate || !dDate) return 1;
    const start = new Date(pDate);
    const end = new Date(dDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays(formData.pickupDate, formData.dropoffDate);
  const selectedCar = availableCars.find((c) => String(c.id) === formData.carId);
  const dailyPrice = selectedCar 
    ? Number(String(selectedCar.dailyPrice ?? selectedCar.price ?? 0).replace(/[^0-9.]/g, "")) || 0
    : 0;
  const totalPrice = dailyPrice * rentalDays;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await apiAddBooking({
        name: formData.name || "",
        phone: formData.phone || "",
        idNumber: formData.idNumber || "",
        email: formData.email || "",
        notes: formData.notes || "",
        pickupLocation: formData.pickupLocation || "",
        dropoffLocation: formData.dropoffLocation || "",
        pickupDate: formData.pickupDate || "",
        pickupTime: formData.pickupTime || "09:00",
        dropoffDate: formData.dropoffDate || "",
        dropoffTime: formData.dropoffTime || "09:00",
        days: rentalDays,
        carId: String(selectedCar?.id ?? ""),
        carName: selectedCar?.name ?? "",
        carCategory: selectedCar?.category ?? "",
        totalPrice,
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-white";

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-gray-50 pb-20">
      <section className="bg-stone-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">احجز سيارتك</h1>
          <p className="text-stone-400 text-base">عملية حجز سريعة وسهلة في خطوات بسيطة</p>
        </div>
      </section>

      {!submitted && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              {[
                { n: 1, label: "بيانات الرحلة" },
                { n: 2, label: "اختر السيارة" },
                { n: 3, label: "بياناتك الشخصية" },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.n ? "bg-amber-500 text-stone-900" : "bg-gray-100 text-gray-400"}`}>
                    {s.n}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${step >= s.n ? "text-stone-900" : "text-gray-400"}`}>{s.label}</span>
                  {i < 2 && <div className={`w-8 sm:w-12 h-0.5 mx-1 ${step > s.n ? "bg-amber-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-10 min-h-[600px]">
        <div className="max-w-4xl mx-auto px-4">
          {submitted ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-xl border border-gray-100 my-10">
              <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">تم استلام طلب حجزك بنجاح</h2>
              <p className="text-gray-600 mb-2">شكراً لك يا <strong>{formData.name || 'عميلنا العزيز'}</strong>!</p>
              <p className="text-gray-500 text-sm mb-8">
                سيتواصل معك فريقنا على الرقم <strong>{formData.phone || ''}</strong> لتأكيد الحجز في أقرب وقت.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setFormData({
                    pickupLocation: "", dropoffLocation: "",
                    pickupDate: "", pickupTime: "09:00",
                    dropoffDate: "", dropoffTime: "09:00",
                    carId: "", name: "", phone: "", idNumber: "", email: "", notes: "",
                  });
                }}
                className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-md text-base"
              >
                حجز جديد
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">بيانات الرحلة</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">مكان الاستلام *</label>
                      <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className={inputCls}>
                        <option value="">اختر مكان الاستلام</option>
                        {pickupLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">مكان التسليم *</label>
                      <select name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required className={inputCls}>
                        <option value="">اختر مكان التسليم</option>
                        {pickupLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الاستلام *</label>
                        <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required
                          min={new Date().toISOString().split("T")[0]} dir="ltr" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">وقت الاستلام *</label>
                        <select name="pickupTime" value={formData.pickupTime} onChange={handleChange} required className={inputCls}>
                          {timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ التسليم *</label>
                        <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleChange} required
                          min={formData.pickupDate || new Date().toISOString().split("T")[0]} dir="ltr" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">وقت التسليم *</label>
                        <select name="dropoffTime" value={formData.dropoffTime} onChange={handleChange} required className={inputCls}>
                          {timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
                    <span className="text-stone-900 font-semibold text-sm">
                      مدة الإيجار: <strong className="text-amber-700 text-base">{rentalDays}</strong> يوم
                    </span>
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (formData.pickupLocation && formData.dropoffLocation && formData.pickupDate && formData.dropoffDate) {
                        setStep(2);
                      } else {
                        alert("يرجى اختيار مكان الاستلام والتسليم وتحديد تواريخ الحجز للمتابعة.");
                      }
                    }}
                    className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-md"
                  >
                    التالي: اختر سيارتك
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Car size={18} />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">اختر سيارتك</h2>
                  </div>
                  {availableCars.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
                      <Car size={36} className="mx-auto mb-2 text-gray-300" />
                      <p>جاري تحميل السيارات المتاحة...</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {availableCars.map((car) => {
                      const carDailyPrice = Number(String(car.dailyPrice ?? car.price ?? 0).replace(/[^0-9.]/g, "")) || 0;
                      const isSelected = formData.carId === String(car.id);
                      return (
                        <label key={car.id}
                          className={`cursor-pointer bg-white rounded-2xl p-4 border-2 transition-all flex gap-3 ${isSelected ? "border-amber-500 shadow-md ring-2 ring-amber-500/20" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <input type="radio" name="carId" value={car.id} checked={isSelected} onChange={handleChange} className="hidden" />
                          <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x60/333/fff?text=Car`; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-stone-900 text-sm truncate">{car.name}</h3>
                                <span className="text-xs text-gray-500">{car.category} • {car.year}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">{car.seats ?? 4} مقاعد • {car.transmission ?? 'أوتوماتيك'}</span>
                              <span className="font-bold text-stone-900 text-sm">
                                {carDailyPrice * rentalDays} <span className="text-xs font-normal text-gray-500">ريال ({rentalDays} أيام)</span>
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-3.5 rounded-xl font-bold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                    >السابق</button>
                    <button type="button"
                      onClick={() => {
                        if (formData.carId) {
                          setStep(3);
                        } else {
                          alert("يرجى اختيار سيارة للمتابعة.");
                        }
                      }}
                      className="flex-1 py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-md"
                    >التالي: بياناتك</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">بياناتك الشخصية</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="الاسم كما في الهوية" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الجوال *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="05xxxxxxxx" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهوية / الإقامة *</label>
                          <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required placeholder="رقم الهوية الوطنية" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">ملاحظات إضافية</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="أي متطلبات خاصة..." className={inputCls + " resize-none"} />
                      </div>
                    </div>

                    {submitError && (
                      <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(2)}
                        className="flex-1 py-3.5 rounded-xl font-bold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                      >السابق</button>
                      <button type="submit" disabled={submitting}
                        className="flex-1 py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 cursor-pointer"
                      >
                        {submitting ? <><Loader2 size={18} className="animate-spin" /> جاري الإرسال...</> : <><CheckCircle size={18} /> تأكيد الحجز</>}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-stone-900 rounded-2xl p-6 text-white sticky top-24">
                      <h3 className="font-bold text-base mb-4 text-amber-400">ملخص الحجز</h3>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">الاستلام</span>
                          <span className="font-medium text-right max-w-[60%]{formData.pickupLocation || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">التسليم</span>
                          <span className="font-medium text-right max-w-[60%]">{formData.dropoffLocation || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">تاريخ الاستلام</span>
                          <span className="font-medium">{formData.pickupDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">تاريخ التسليم</span>
                          <span className="font-medium">{formData.dropoffDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">المدة</span>
                          <span className="font-medium">{rentalDays} يوم</span>
                        </div>
                      </div>
                      {selectedCar && (
                        <>
                          <div className="border-t border-white/15 my-4 pt-4">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
                                <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/60x40/fff/333?text=Car"; }} />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{selectedCar.name}</div>
                                <div className="text-gray-400 text-xs">{selectedCar.category}</div>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-white/15 pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">{dailyPrice} × {rentalDays} أيام</span>
                              <span className="font-black text-amber-400 text-lg">{totalPrice} ريال</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}