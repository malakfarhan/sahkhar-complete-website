import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle, Users, Fuel, Settings } from "lucide-react";
import { usePublicCars } from "@/store/adminStore";
import { useLanguage, localized } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Cars() {
  const { language, isEnglish, refreshKey } = useLanguage();
  
  const allCars = usePublicCars();
  const cars = allCars.filter((c) => c.active !== false);

  // ✅ Sirf completed + aaj ka time pickup aur dropoff datetime ke beech ho
  const isCarCurrentlyBooked = (car: any): boolean => {
    const now = new Date(); // exact time ke saath

    const recentBookings = Array.isArray(car?.recentBookings) ? car.recentBookings : [];

    return recentBookings.some((booking: any) => {
      const status = String(booking?.status || "").toLowerCase();

      // ✅ Sirf completed check karo
      if (status !== "completed") return false;

      if (!booking?.pickupDate || !booking?.dropoffDate) return false;

      // ✅ Time ke saath datetime banao
      const pickupTime = booking.pickupTime || "00:00";
      const dropoffTime = booking.dropoffTime || "23:59";

      const pickupDateTime = new Date(`${booking.pickupDate}T${pickupTime}:00`);
      const dropoffDateTime = new Date(`${booking.dropoffDate}T${dropoffTime}:00`);

      // ✅ Abhi pickup aur dropoff datetime ke beech hai?
      return now >= pickupDateTime && now <= dropoffDateTime;
    });
  };

  const t = {
    pageTitle: isEnglish ? "Our Fleet" : "أسطولنا من السيارات",
    pageSub: isEnglish 
      ? "Choose from a wide range of modern cars that suit every need and budget"
      : "اختر من بين مجموعة واسعة من السيارات الحديثة التي تناسب كل احتياجاتك وميزانيتك",
    all: isEnglish ? "All" : "الكل",
    unavailable: isEnglish ? "Unavailable" : "غير متاح",
    booked: isEnglish ? "Booked" : "محجوز",
    seats: isEnglish ? "seats" : "مقعد",
    perDay: isEnglish ? "day" : "يوم",
    bookNow: isEnglish ? "Book Now" : "احجز الآن",
    notAvailable: isEnglish ? "Not Available" : "غير متاح",
    noCars: isEnglish 
      ? "No cars available in this category at the moment"
      : "لا توجد سيارات في هذه الفئة حالياً",
  };

  const rawCategories = [...new Set(cars.map((c) => c.category))].filter(Boolean);
  
  const getCategoryLabel = (cat: string): string => {
    if (isEnglish) {
      const commonTranslations: Record<string, string> = {
        "اقتصادية": "Economy",
        "عائلية": "Family",
        "فاخرة": "Luxury",
        "SUV": "SUV",
        "ميني باص": "Minibus",
        "رياضية": "Sports",
        "كهربائية": "Electric",
        "دفع رباعي": "4x4",
        "كوبيه": "Coupe",
        "هاتشباك": "Hatchback",
        "سيدان": "Sedan",
        "شاحنة": "Truck",
      };
      return commonTranslations[cat] || cat;
    }
    return cat;
  };

  const [activeCategory, setActiveCategory] = useState<string>(t.all);

  useEffect(() => {
    setActiveCategory(t.all);
  }, [language]);

  const filtered = activeCategory === t.all
    ? cars
    : cars.filter((c) => c.category === activeCategory);

  return (
    <div 
      key={refreshKey}
      className={`pt-16 md:pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* Hero Section */}
      <section className="bg-[hsl(22,85%,18%)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {t.pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="text-[hsl(30,20%,80%)] text-lg max-w-2xl mx-auto"
          >
            {t.pageSub}
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(t.all)}
              className={`shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                activeCategory === t.all
                  ? "bg-[hsl(22,85%,18%)] text-white"
                  : "bg-[hsl(30,15%,96%)] text-gray-600 hover:bg-[hsl(30,15%,91%)]"
              }`}
            >
              {t.all} ({cars.length})
            </button>
            
            {rawCategories.map((cat) => {
              const count = cars.filter((c) => c.category === cat).length;
              const displayLabel = getCategoryLabel(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                    activeCategory === cat
                      ? "bg-[hsl(22,85%,18%)] text-white"
                      : "bg-[hsl(30,15%,96%)] text-gray-600 hover:bg-[hsl(30,15%,91%)]"
                  }`}
                >
                  {displayLabel} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((car) => {
              const isBooked = isCarCurrentlyBooked(car);

              return (
                <motion.div
                  key={car.id}
                  variants={fadeUp}
                  className="bg-white rounded-2xl overflow-hidden border border-[hsl(30,15%,90%)] shadow-sm card-hover"
                >
                  {/* Car Image */}
                  <div className="relative h-52 bg-[hsl(30,15%,96%)] overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x200/5c2301/d4a017?text=${car.nameEn.replace(" ", "+")}`;
                      }}
                    />
                    <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} flex gap-2`}>
                      <span className="bg-[hsl(22,85%,18%)] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {getCategoryLabel(car.category)}
                      </span>
                      {/* ✅ Booked badge sirf completed + time ke beech */}
                      {isBooked ? (
                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t.booked}
                        </span>
                      ) : !car.available ? (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t.unavailable}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[hsl(22,85%,18%)]">
                          {localized(car, "name", language)}
                        </h3>
                        <p className="text-gray-400 text-sm">{car.year}</p>
                      </div>
                    </div>

                    {/* Car Specs */}
                    <div className="grid grid-cols-3 gap-3 mb-5 bg-[hsl(30,15%,97%)] rounded-xl p-3">
                      <div className="flex flex-col items-center gap-1">
                        <Users size={16} className="text-[hsl(40,88%,48%)]" />
                        <span className="text-xs text-gray-500">{car.seats} {t.seats}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Settings size={16} className="text-[hsl(40,88%,48%)]" />
                        <span className="text-xs text-gray-500">{car.transmission}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Fuel size={16} className="text-[hsl(40,88%,48%)]" />
                        <span className="text-xs text-gray-500">{car.fuel}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {car.features.slice(0, 3).map((f) => (
                        <span key={f} className="flex items-center gap-1 bg-[hsl(30,15%,97%)] text-gray-600 text-xs px-2.5 py-1.5 rounded-lg">
                          <CheckCircle size={12} className="text-[hsl(40,88%,48%)]" />
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Price & Booking */}
                    <div className="flex items-center justify-between border-t border-[hsl(30,15%,92%)] pt-4">
                      <div>
                        <span className="text-2xl font-black text-gradient-gold">{car.dailyPrice}</span>
                        <span className="text-[hsl(22,85%,18%)] font-bold text-lg"> ⃁</span>
                        <span className="text-gray-400 text-sm"> / {t.perDay}</span>
                      </div>
                      {/* ✅ Booked button sirf completed + time ke beech */}
                      {isBooked ? (
                        <span className="px-5 py-2.5 rounded-lg text-sm font-bold bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200">
                          {t.booked}
                        </span>
                      ) : car.available ? (
                        <Link href="/booking" className="btn-gold px-5 py-2.5 rounded-lg text-sm font-bold">
                          {t.bookNow}
                        </Link>
                      ) : (
                        <span className="px-5 py-2.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
                          {t.notAvailable}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Cars Message */}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl font-semibold">{t.noCars}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}