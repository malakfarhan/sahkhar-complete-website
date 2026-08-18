import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Car, User, CheckCircle, Loader2, AlertCircle, Check } from "lucide-react";
import { usePublicCars } from "@/store/adminStore";
import { apiAddBooking } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";

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
  const [, navigate] = useLocation();
  const { language, isEnglish, refreshKey } = useLanguage();
  const allCars = usePublicCars();

  // 🔥 Check if car has COMPLETED booking that is currently ACTIVE
  const isCarCurrentlyBooked = (car: any): boolean => {
    const now = new Date();
    const recentBookings = Array.isArray(car?.recentBookings) ? car.recentBookings : [];

    return recentBookings.some((booking: any) => {
      const status = String(booking?.status || "").toLowerCase();
      
      // ✅ Sirf COMPLETED check karo
      if (status !== "completed") return false;
      
      if (!booking?.pickupDate || !booking?.dropoffDate) return false;

      const pickupTime = booking.pickupTime || "00:00";
      const dropoffTime = booking.dropoffTime || "23:59";

      const pickupDateTime = new Date(`${booking.pickupDate}T${pickupTime}:00`);
      const dropoffDateTime = new Date(`${booking.dropoffDate}T${dropoffTime}:00`);

      // ✅ Abhi pickup aur dropoff datetime ke beech hai?
      return now >= pickupDateTime && now <= dropoffDateTime;
    });
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: "", dropoffLocation: "",
    pickupDate: "", pickupTime: "09:00",
    dropoffDate: "", dropoffTime: "09:00",
    carId: "", name: "", phone: "", idNumber: "", email: "", notes: "",
  });

  // ✅ Available cars - Sirf Active Completed ko filter karo
  const availableCars = allCars.filter((c) => {
    if (!c.available || c.active === false) return false;
    if (isCarCurrentlyBooked(c)) return false;
    return true;
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lastBookingId, setLastBookingId] = useState("");

  // ============================================
  // 📝 ALL TRANSLATIONS
  // ============================================
  const t = {
    pageTitle: step === 4 
      ? (isEnglish ? "Booking Confirmed" : "تأكيد الحجز")
      : (isEnglish ? "Book Your Car" : "احجز سيارتك"),
    pageSub: step === 4
      ? (isEnglish ? "Thank you for choosing our services" : "شكراً لاختيارك خدماتنا")
      : (isEnglish ? "Quick and easy booking in simple steps" : "عملية حجز سريعة وسهلة في خطوات بسيطة"),
    steps: [
      { ar: "بيانات الرحلة", en: "Trip Details" },
      { ar: "اختر السيارة", en: "Choose Car" },
      { ar: "بياناتك الشخصية", en: "Your Details" },
    ],
    tripDetails: isEnglish ? "Trip Details" : "بيانات الرحلة",
    pickupLocation: isEnglish ? "Pickup Location *" : "مكان الاستلام *",
    pickupPlaceholder: isEnglish ? "Select pickup location" : "اختر مكان الاستلام",
    dropoffLocation: isEnglish ? "Dropoff Location *" : "مكان التسليم *",
    dropoffPlaceholder: isEnglish ? "Select dropoff location" : "اختر مكان التسليم",
    pickupDate: isEnglish ? "Pickup Date *" : "تاريخ الاستلام *",
    pickupTime: isEnglish ? "Pickup Time *" : "وقت الاستلام *",
    dropoffDate: isEnglish ? "Dropoff Date *" : "تاريخ التسليم *",
    dropoffTime: isEnglish ? "Dropoff Time *" : "وقت التسليم *",
    rentalPeriod: isEnglish ? "Rental Period:" : "مدة الإيجار:",
    days: isEnglish ? "days" : "يوم",
    nextStep1: isEnglish ? "Next: Choose Your Car" : "التالي: اختر سيارتك",
    alertMessage1: isEnglish 
      ? "Please select pickup/dropoff locations and dates to continue."
      : "يرجى اختيار مكان الاستلام والتسليم وتحديد تواريخ الحجز للمتابعة.",
    chooseCar: isEnglish ? "Choose Your Car" : "اختر سيارتك",
    loadingCars: isEnglish ? "Loading available cars..." : "جاري تحميل السيارات المتاحة...",
    seats: isEnglish ? "seats" : "مقاعد",
    riyal: isEnglish ? "SAR" : "ريال",
    daysShort: isEnglish ? "days" : "أيام",
    previous: isEnglish ? "Previous" : "السابق",
    nextStep2: isEnglish ? "Next: Your Details" : "التالي: بياناتك",
    alertMessage2: isEnglish 
      ? "Please select a car to continue."
      : "يرجى اختيار سيارة للمتابعة.",
    personalDetails: isEnglish ? "Your Personal Details" : "بياناتك الشخصية",
    fullName: isEnglish ? "Full Name *" : "الاسم الكامل *",
    fullNamePlaceholder: isEnglish ? "Name as per ID" : "الاسم كما في الهوية",
    phoneNumber: isEnglish ? "Phone Number *" : "رقم الجوال *",
    phonePlaceholder: isEnglish ? "05xxxxxxxx" : "05xxxxxxxx",
    idNumber: isEnglish ? "ID / Iqama Number *" : "رقم الهوية / الإقامة *",
    idPlaceholder: isEnglish ? "National ID number" : "رقم الهوية الوطنية",
    email: isEnglish ? "Email Address" : "البريد الإلكتروني",
    emailPlaceholder: isEnglish ? "example@email.com" : "example@email.com",
    notes: isEnglish ? "Additional Notes" : "ملاحظات إضافية",
    notesPlaceholder: isEnglish ? "Any special requirements..." : "أي متطلبات خاصة...",
    confirmBooking: isEnglish ? "Confirm Booking" : "تأكيد الحجز",
    submitting: isEnglish ? "Submitting..." : "جاري الإرسال...",
    errorMessage: isEnglish 
      ? "An error occurred while submitting your request. Please try again."
      : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً.",
    bookingConfirmed: isEnglish ? "Booking Confirmed!" : "تم استلام طلب حجزك بنجاح",
    thankYou: isEnglish ? "Thank you" : "شكراً لك",
    dearCustomer: isEnglish ? "dear customer" : "عميلنا العزيز",
    bookingReceived: isEnglish 
      ? "Your booking request has been received. Our team will contact you at"
      : "تم استلام طلب حجز سيارتك. سيتواصل معك فريقنا على الرقم",
    toConfirm: isEnglish ? "to confirm your booking shortly." : "لتأكيد الحجز في أقرب وقت.",
    referenceNumber: isEnglish ? "Booking Reference Number:" : "رقم مرجع الحجز:",
    followUp: isEnglish 
      ? "You can track your booking status through your email or by contacting us directly."
      : "يمكنك متابعة حالة حجزك من خلال بريدك الإلكتروني أو بالاتصال بنا مباشرة.",
    newBooking: isEnglish ? "New Booking" : "حجز جديد",
    home: isEnglish ? "Home" : "الرئيسية",
    summary: isEnglish ? "Booking Summary" : "ملخص الحجز",
    pickupSummary: isEnglish ? "Pickup" : "الاستلام",
    dropoffSummary: isEnglish ? "Dropoff" : "التسليم",
    pickupDateSummary: isEnglish ? "Pickup Date" : "تاريخ الاستلام",
    dropoffDateSummary: isEnglish ? "Dropoff Date" : "تاريخ التسليم",
    duration: isEnglish ? "Duration" : "المدة",
    total: isEnglish ? "Total" : "الإجمالي",
    selectCar: isEnglish ? "Select a car" : "اختر سيارة",
  };

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
  const selectedCarName = isEnglish ? (selectedCar?.nameEn || selectedCar?.name || "") : (selectedCar?.name || selectedCar?.nameEn || "");
  const selectedCarCategory = isEnglish ? (selectedCar?.categoryEn || selectedCar?.category || "") : (selectedCar?.category || selectedCar?.categoryEn || "");
  const dailyPrice = selectedCar 
    ? Number(String(selectedCar.dailyPrice ?? selectedCar.price ?? 0).replace(/[^0-9.]/g, "")) || 0
    : 0;
  const totalPrice = dailyPrice * rentalDays;

  const getStepLabel = (stepNum: number) => {
    return t.steps[stepNum - 1]?.[isEnglish ? 'en' : 'ar'] || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
  
    try {
      const res: any = await apiAddBooking({
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
        carName: selectedCarName,
        carCategory: selectedCarCategory,
        totalPrice,
      });

      if (res && res.id) {
        setLastBookingId(res.id);
      }

      setStep(4);
    } catch (err) {
      console.error("Booking submit error:", err);
      setSubmitError(t.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-white";

  return (
    <div 
      key={refreshKey}
      className={`pt-32 md:pt-40 min-h-screen bg-gray-50 pb-20 relative ${language === 'ar' ? 'rtl' : 'ltr'}`} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      translate="no"
    >
      {/* Black Header Banner */}
      <section className="bg-stone-900 py-12 w-full absolute top-15 md:top-20 shadow-sm z-0">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-stone-400 text-base">
            {t.pageSub}
          </p>
        </div>
      </section>

      {/* Steps Indicator */}
      {step < 4 && (
        <div className="bg-white border-b shadow-sm relative z-10 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-amber-500 text-stone-900" : "bg-gray-100 text-gray-400"}`}>
                    {s}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${step >= s ? "text-stone-900" : "text-gray-400"}`}>
                    {getStepLabel(s)}
                  </span>
                  {i < 2 && <div className={`w-8 sm:w-12 h-0.5 mx-1 ${step > s ? "bg-amber-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-10 min-h-[600px] relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            {/* ===== STEP 1: TRIP DETAILS ===== */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">{t.tripDetails}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pickupLocation}</label>
                    <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className={inputCls}>
                      <option value="">{t.pickupPlaceholder}</option>
                      {pickupLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dropoffLocation}</label>
                    <select name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required className={inputCls}>
                      <option value="">{t.dropoffPlaceholder}</option>
                      {pickupLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pickupDate}</label>
                      <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required
                        min={new Date().toISOString().split("T")[0]} dir="ltr" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pickupTime}</label>
                      <select name="pickupTime" value={formData.pickupTime} onChange={handleChange} required className={inputCls}>
                        {timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dropoffDate}</label>
                      <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleChange} required
                        min={formData.pickupDate || new Date().toISOString().split("T")[0]} dir="ltr" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t.dropoffTime}</label>
                      <select name="dropoffTime" value={formData.dropoffTime} onChange={handleChange} required className={inputCls}>
                        {timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
                  <span className="text-stone-900 font-semibold text-sm">
                    {t.rentalPeriod} <strong className="text-amber-700 text-base">{rentalDays}</strong> {t.days}
                  </span>
                </div>
                <button type="button"
                  onClick={() => {
                    if (formData.pickupLocation && formData.dropoffLocation && formData.pickupDate && formData.dropoffDate) {
                      setStep(2);
                    } else {
                      alert(t.alertMessage1);
                    }
                  }}
                  className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-md text-base"
                >
                  {t.nextStep1}
                </button>
              </div>
            )}

            {/* ===== STEP 2: CHOOSE CAR ===== */}
            {step === 2 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Car size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">{t.chooseCar}</h2>
                </div>
                {availableCars.length === 0 && (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 shadow-xl border border-gray-100">
                    <Car size={36} className="mx-auto mb-2 text-gray-300" />
                    <p>{t.loadingCars}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {availableCars.map((car) => {
                    const carDailyPrice = Number(String(car.dailyPrice ?? car.price ?? 0).replace(/[^0-9.]/g, "")) || 0;
                    const isSelected = formData.carId === String(car.id);
                    return (
                      <label key={car.id}
                        className={`cursor-pointer bg-white rounded-2xl p-4 border-2 transition-all flex gap-3 shadow-sm ${isSelected ? "border-amber-500 shadow-md ring-2 ring-amber-500/20" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <input type="radio" name="carId" value={car.id} checked={isSelected} onChange={handleChange} className="hidden" />
                        <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                          <img src={car.image} alt={isEnglish ? (car.nameEn || car.name) : car.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x60/333/fff?text=Car`; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-stone-900 text-sm truncate">{isEnglish ? (car.nameEn || car.name) : car.name}</h3>
                              <span className="text-xs text-gray-500">{isEnglish ? (car.categoryEn || car.category) : car.category} • {car.year}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">{car.seats ?? 4} {t.seats} • {car.transmission ?? 'أوتوماتيك'}</span>
                            <span className="font-bold text-stone-900 text-sm">
                              {carDailyPrice * rentalDays} <span className="text-xs font-normal text-gray-500">{t.riyal} ({rentalDays} {t.daysShort})</span>
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
                  >{t.previous}</button>
                  <button type="button"
                    onClick={() => {
                      if (formData.carId) {
                        setStep(3);
                      } else {
                        alert(t.alertMessage2);
                      }
                    }}
                    className="flex-1 py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-md"
                  >{t.nextStep2}</button>
                </div>
              </div>
            )}

            {/* ===== STEP 3: PERSONAL DETAILS ===== */}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-12">
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">{t.personalDetails}</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.fullName}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={t.fullNamePlaceholder} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.phoneNumber}</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t.phonePlaceholder} className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.idNumber}</label>
                        <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required placeholder={t.idPlaceholder} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.emailPlaceholder} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.notes}</label>
                      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder={t.notesPlaceholder} className={inputCls + " resize-none"} />
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
                    >{t.previous}</button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 cursor-pointer"
                    >
                      {submitting ? <><Loader2 size={18} className="animate-spin" /> {t.submitting}</> : <><CheckCircle size={18} /> {t.confirmBooking}</>}
                    </button>
                  </div>
                </div>

                {/* ===== SUMMARY SIDEBAR ===== */}
                <div className="lg:col-span-2">
                  <div className="bg-stone-900 rounded-3xl p-6 text-white sticky top-24 shadow-xl">
                    <h3 className="font-bold text-base mb-4 text-amber-400">{t.summary}</h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.pickupSummary}</span>
                        <span className="font-medium text-right max-w-[60%]">{formData.pickupLocation || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.dropoffSummary}</span>
                        <span className="font-medium text-right max-w-[60%]">{formData.dropoffLocation || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.pickupDateSummary}</span>
                        <span className="font-medium">{formData.pickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.dropoffDateSummary}</span>
                        <span className="font-medium">{formData.dropoffDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.duration}</span>
                        <span className="font-medium">{rentalDays} {t.daysShort}</span>
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
                              <div className="font-bold text-sm">{selectedCarName}</div>
                              <div className="text-gray-400 text-xs">{selectedCarCategory}</div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-white/15 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">{dailyPrice} × {rentalDays} {t.daysShort}</span>
                            <span className="font-black text-amber-400 text-lg">{totalPrice} {t.riyal}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 4: THANK YOU ===== */}
            {step === 4 && (
              <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-xl border border-gray-100 mt-12 relative z-10">
                <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle size={40} />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  {t.bookingConfirmed}
                </h2>

                <p className="text-gray-600 mb-2">
                  {t.thankYou} <strong>{formData.name || t.dearCustomer}</strong>!
                </p>

                <p className="text-gray-500 text-sm mb-6">
                  {t.bookingReceived} <span dir="ltr"><strong>{formData.phone || ""}</strong></span> {t.toConfirm}
                </p>

                {lastBookingId && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 inline-block">
                    <span className="text-xs text-gray-500 block mb-1">{t.referenceNumber}</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{lastBookingId}</span>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
                  <p className="text-sm text-gray-600">
                    {t.followUp}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        pickupLocation: "", dropoffLocation: "",
                        pickupDate: "", pickupTime: "09:00",
                        dropoffDate: "", dropoffTime: "09:00",
                        carId: "", name: "", phone: "", idNumber: "", email: "", notes: "",
                      });
                      setLastBookingId("");
                    }}
                    className="block w-full py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md text-base cursor-pointer"
                  >
                    {t.newBooking}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="block w-full py-3.5 rounded-xl font-bold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                  >
                    {t.home}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}