import { useState } from "react";
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
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const { language } = useLanguage();
  const cars = usePublicCars().filter((c) => c.active !== false);
  // الفئات مستخرجة تلقائياً من السيارات المحمّلة
  const categories = [...new Set(cars.map((c) => c.category))].filter(Boolean);

  const filtered = activeCategory === "الكل"
    ? cars
    : cars.filter((c) => c.category === activeCategory);

  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-[hsl(22,85%,18%)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {language === "ar" ? "أسطولنا من السيارات" : "Our Fleet"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="text-[hsl(30,20%,80%)] text-lg max-w-2xl mx-auto"
          >
            {language === "ar" 
              ? "اختر من بين مجموعة واسعة من السيارات الحديثة التي تناسب كل احتياجاتك وميزانيتك"
              : "Choose from a wide range of modern cars that suit every need and budget"}
          </motion.p>
        </div>
      </section>

      <section className="bg-white border-b sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("الكل")}
              className={`shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                activeCategory === "الكل"
                  ? "bg-[hsl(22,85%,18%)] text-white"
                  : "bg-[hsl(30,15%,96%)] text-gray-600 hover:bg-[hsl(30,15%,91%)]"
              }`}
            >
              {language === "ar" ? "الكل" : "All"} ({cars.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat
                    ? "bg-[hsl(22,85%,18%)] text-white"
                    : "bg-[hsl(30,15%,96%)] text-gray-600 hover:bg-[hsl(30,15%,91%)]"
                }`}
              >
                {cat} ({cars.filter((c) => c.category === cat).length})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((car) => (
              <motion.div
                key={car.id}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden border border-[hsl(30,15%,90%)] shadow-sm card-hover"
              >
                <div className="relative h-52 bg-[hsl(30,15%,96%)] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x200/5c2301/d4a017?text=${car.nameEn.replace(" ", "+")}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-[hsl(22,85%,18%)] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {car.category}
                    </span>
                    {!car.available && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {language === "ar" ? "غير متاح" : "Unavailable"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-[hsl(22,85%,18%)]">{localized(car, "name", language)}</h3>
                      <p className="text-gray-400 text-sm">{car.year}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5 bg-[hsl(30,15%,97%)] rounded-xl p-3">
                    <div className="flex flex-col items-center gap-1">
                      <Users size={16} className="text-[hsl(40,88%,48%)]" />
                      <span className="text-xs text-gray-500">{car.seats} مقعد</span>
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

                  <div className="flex flex-wrap gap-2 mb-5">
                    {car.features.slice(0, 3).map((f) => (
                      <span key={f} className="flex items-center gap-1 bg-[hsl(30,15%,97%)] text-gray-600 text-xs px-2.5 py-1.5 rounded-lg">
                        <CheckCircle size={12} className="text-[hsl(40,88%,48%)]" />
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-[hsl(30,15%,92%)] pt-4">
                    <div>
                      <span className="text-2xl font-black text-gradient-gold">{car.dailyPrice}</span>
                      <span className="text-[hsl(22,85%,18%)] font-bold text-lg"> ⃁</span>
                      <span className="text-gray-400 text-sm"> / {language === "ar" ? "يوم" : "day"}</span>
                    </div>
                    {car.available ? (
                      <Link href="/booking" className="btn-gold px-5 py-2.5 rounded-lg text-sm font-bold">
                        احجز الآن
                      </Link>
                    ) : (
                      <span className="px-5 py-2.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
                        غير متاح
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl font-semibold">لا توجد سيارات في هذه الفئة حالياً</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
