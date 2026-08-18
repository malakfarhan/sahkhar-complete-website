import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Shield, Clock, CreditCard, Headphones, Star, ChevronLeft, CheckCircle, ChevronRight } from "lucide-react";
import { usePublicCars, usePublicSlides, type AdminSlide } from "@/store/adminStore";
import { useLanguage, localized } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Helper ──────────────────────────────────────────────────────────────────
function cleanHref(href: string): string {
  return "/" + href.replace(/^[#/]+/, "");
}

// ─── Translation Objects ────────────────────────────────────────────────────

// Features Translations
const getFeatures = (isEnglish: boolean) => [
  {
    icon: Shield,
    title: isEnglish ? "Comprehensive Insurance" : "تأمين شامل",
    desc: isEnglish 
      ? "All our cars are fully insured for your peace of mind" 
      : "جميع سياراتنا مؤمنة تأميناً شاملاً لراحة بالك"
  },
  {
    icon: Clock,
    title: isEnglish ? "24/7 Service" : "خدمة 24/7",
    desc: isEnglish 
      ? "Support team available around the clock every day" 
      : "فريق الدعم متاح على مدار الساعة طوال أيام الأسبوع"
  },
  {
    icon: CreditCard,
    title: isEnglish ? "Flexible Payment" : "دفع مرن",
    desc: isEnglish 
      ? "Multiple payment methods: cash, card, or bank transfer" 
      : "طرق دفع متعددة نقداً أو بطاقة أو تحويل بنكي"
  },
  {
    icon: Headphones,
    title: isEnglish ? "Instant Support" : "دعم فوري",
    desc: isEnglish 
      ? "Roadside assistance and excellent customer service anytime" 
      : "مساعدة على الطريق وخدمة عملاء متميزة في أي وقت"
  },
];

// Offers Translations
const getOffers = (isEnglish: boolean) => [
  {
    title: isEnglish ? "20% Off on Weekly Rentals" : "خصم 20% على الحجوزات الأسبوعية",
    desc: isEnglish 
      ? "Book for a week or more and enjoy 20% off on total booking" 
      : "احجز لمدة أسبوع أو أكثر واستمتع بخصم 20% على إجمالي الحجز",
    badge: isEnglish ? "Limited Offer" : "عرض محدود",
    gradient: "from-[hsl(22,85%,22%)] to-[hsl(22,85%,16%)]",
  },
  {
    title: isEnglish ? "Unlimited Mileage for Families" : "كيلومترات لامحدودة للعائلات",
    desc: isEnglish 
      ? "Book any family car and travel without distance limits" 
      : "احجز أي سيارة عائلية وسافر بدون قيود على المسافة",
    badge: isEnglish ? "For Families" : "للعائلات",
    gradient: "from-[hsl(18,80%,20%)] to-[hsl(22,85%,16%)]",
  },
  {
    title: isEnglish ? "Special Corporate Discount" : "خصم خاص لعملاء الشركات",
    desc: isEnglish 
      ? "Customized rental agreements for companies at best rates" 
      : "اتفاقيات تأجير مخصصة للشركات بأفضل الأسعار وخدمة متميزة",
    badge: isEnglish ? "For Companies" : "للشركات",
    gradient: "from-[hsl(25,70%,18%)] to-[hsl(22,85%,13%)]",
  },
  {
    title: isEnglish ? "First Day Free with Monthly Rental" : "اليوم الأول مجاناً مع الإيجار الشهري",
    desc: isEnglish 
      ? "With every monthly rental, get the first day free automatically" 
      : "مع كل إيجار شهري، تحصل على أول يوم مجاناً تلقائياً",
    badge: isEnglish ? "Monthly" : "شهري",
    gradient: "from-[hsl(22,85%,20%)] to-[hsl(22,70%,25%)]",
  },
];

// Testimonials Translations
const getTestimonials = (isEnglish: boolean) => [
  {
    name: isEnglish ? "Mohammed Al-Otaibi" : "محمد العتيبي",
    role: isEnglish ? "Businessman" : "رجل أعمال",
    text: isEnglish 
      ? "Excellent experience with Sakher. The car was clean and organized, fast and professional service. Highly recommend." 
      : "تجربة ممتازة مع صخر. السيارة كانت نظيفة ومرتبة، والخدمة سريعة واحترافية. أنصح بهم بشدة.",
    rating: 5,
  },
  {
    name: isEnglish ? "Fatima Al-Shammari" : "فاطمة الشمري",
    role: isEnglish ? "Government Employee" : "موظفة حكومية",
    text: isEnglish 
      ? "Rented a family car for a trip to Taif and it was amazing. Reasonable prices and unlimited mileage." 
      : "استأجرت سيارة عائلية لرحلة إلى الطائف وكانت التجربة رائعة. الأسعار معقولة والكيلومترات غير محدودة.",
    rating: 5,
  },
  {
    name: isEnglish ? "Ahmed Al-Baqmi" : "أحمد البقمي",
    role: isEnglish ? "Company Manager" : "مدير شركة",
    text: isEnglish 
      ? "We deal with Sakher for company cars since years. Reliable service and very competitive prices." 
      : "نتعامل مع صخر لتأمين سيارات الشركة منذ سنوات. الخدمة موثوقة والأسعار تنافسية جداً.",
    rating: 5,
  },
];

// Stats Translations
const getStats = (isEnglish: boolean) => [
  { value: "+5500", label: isEnglish ? "Cars" : "سيارة" },
  { value: "+10K", label: isEnglish ? "Customers" : "عميل" },
  { value: "25", label: isEnglish ? "Branches" : "فروع" },
  { value: "24/7", label: isEnglish ? "Support" : "خدمة" },
];

// ─── Hero Slider ────────────────────────────────────────────────────────────
function HeroSlider() {
  const slides: AdminSlide[] = usePublicSlides().filter((s) => s.active !== false);
  const { language, isEnglish, refreshKey } = useLanguage(); // 🔑 ADD refreshKey
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  const safeLen = slides.length || 1;

  // Translations for fallback/loading
  const t = {
    loading: isEnglish ? "Loading..." : "جاري التحميل...",
  };

  const goTo = (idx: number) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => goTo((current - 1 + safeLen) % safeLen);
  const next = () => goTo((current + 1) % safeLen);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % safeLen);
    }, 5500);
    return () => clearInterval(t);
  }, [safeLen]);

  if (slides.length === 0) {
    return (
      <section key={refreshKey} className="relative h-screen min-h-[600px] max-h-[900px] bg-[hsl(22,85%,18%)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(40,88%,52%)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">{t.loading}</p>
        </div>
      </section>
    );
  }

  const slide = slides[current] ?? slides[0];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] as const } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80, transition: { duration: 0.45 } }),
  };

  return (
    <section key={refreshKey} className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden"> {/* 🔑 ADD key */}
      {/* Background layers */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={slide.id}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${slide.bg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[hsl(22,85%,8%)]/95 via-[hsl(22,75%,12%)]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(22,85%,8%)]/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.25 } }}
                className="inline-flex items-center gap-2 bg-[hsl(40,88%,52%)]/20 border border-[hsl(40,88%,52%)]/50 rounded-full px-4 py-1.5 mb-5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(40,88%,52%)]" />
                <span className="text-[hsl(40,88%,65%)] text-sm font-semibold">
                  {localized(slide, "badge", language)}
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-5 drop-shadow-lg">
                {localized(slide, "heading", language)}
              </h1>

              <p className="text-[hsl(30,20%,80%)] text-lg mb-8 leading-relaxed max-w-xl">
                {localized(slide, "sub", language)}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={cleanHref(slide.ctaHref)}
                  className="btn-gold px-8 py-4 rounded-xl font-bold text-lg inline-block shadow-lg"
                >
                  {localized(slide, "ctaLabel", language)}
                </Link>
                <Link
                  href={cleanHref(slide.ctaHref) === "/booking" ? "/cars" : "/booking"}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  {localized(slide, "cta2Label", language)}
                  <ChevronLeft size={20} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows - Direction handled by RTL/LTR */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[hsl(40,88%,52%)] hover:text-[hsl(22,60%,12%)] hover:border-transparent transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronRight size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[hsl(40,88%,52%)] hover:text-[hsl(22,60%,12%)] hover:border-transparent transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-[hsl(40,88%,52%)]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[hsl(22,85%,13%)]/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {getStats(isEnglish).map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black text-[hsl(40,88%,58%)]">{s.value}</div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const { language, isEnglish, refreshKey } = useLanguage(); // 🔑 ADD refreshKey
  const featuredCars = usePublicCars().filter((c) => c.available && c.active !== false).slice(0, 3);
  
  const features = getFeatures(isEnglish);
  const offers = getOffers(isEnglish);
  const testimonials = getTestimonials(isEnglish);
  const stats = getStats(isEnglish);

  // Section Titles
  const sectionTitles = {
    whyChoose: isEnglish ? "Why Choose Sakher?" : "لماذا تختار صخر؟",
    exclusiveOffers: isEnglish ? "Exclusive Offers" : "عروض حصرية",
    offersSub: isEnglish 
      ? "Book now and get the best deals and discounts" 
      : "احجز الآن واستفد من أفضل العروض والخصومات",
    featuredCars: isEnglish ? "Featured Cars" : "سيارات مميزة",
    viewAll: isEnglish ? "View All" : "عرض الكل",
    whatsOurClientsSay: isEnglish ? "What Our Clients Say" : "ماذا يقول عملاؤنا",
    readyToStart: isEnglish ? "Ready to Start Your Journey?" : "جاهز لبدء رحلتك؟",
    readySub: isEnglish 
      ? "Book your car now and enjoy unmatched service everywhere in the Kingdom" 
      : "احجز سيارتك الآن واستمتع بخدمة لا مثيل لها في كل مكان بالمملكة",
    bookNow: isEnglish ? "Book Your Car Now" : "احجز سيارتك الآن",
    callUs: isEnglish ? "Call Us: 920017014" : "اتصل بنا: 920017014",
    bookNowShort: isEnglish ? "Book Now" : "احجز الآن",
    perDay: isEnglish ? "/ day" : "/ يوم",
  };

  return (
    <div 
      key={refreshKey} // 🔑 ADD THIS - Force re-render on language change
      className={`pt-16 md:pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <HeroSlider />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[hsl(22,85%,18%)] section-title">
              {sectionTitles.whyChoose}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="text-center p-8 rounded-2xl bg-[hsl(30,15%,97%)] hover:bg-[hsl(22,85%,18%)] group transition-all duration-300 card-hover"
              >
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
                  <f.icon className="text-[hsl(22,60%,12%)]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-[hsl(22,85%,18%)] group-hover:text-white mb-3 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-20 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[hsl(22,85%,18%)] section-title">
              {sectionTitles.exclusiveOffers}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-4 text-lg">
              {sectionTitles.offersSub}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {offers.map((offer) => (
              <motion.div
                key={offer.title}
                variants={fadeUp}
                className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-8 text-white relative overflow-hidden card-hover`}
              >
                <div className="absolute top-4 left-4">
                  <span className="bg-[hsl(40,88%,52%)] text-[hsl(22,60%,12%)] text-xs font-bold px-3 py-1 rounded-full">
                    {offer.badge}
                  </span>
                </div>
                <div className="absolute -left-6 -bottom-6 w-28 h-28 hexagon bg-white/5" />
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3">{offer.title}</h3>
                  <p className="text-[hsl(30,20%,80%)] text-sm leading-relaxed mb-5">{offer.desc}</p>
                  <Link href="/booking" className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-lg text-sm font-bold">
                    {sectionTitles.bookNowShort}
                    <ChevronLeft size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex items-center justify-between mb-14"
          >
            <div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[hsl(22,85%,18%)] section-title">
                {sectionTitles.featuredCars}
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/cars" className="flex items-center gap-2 text-[hsl(22,85%,18%)] font-semibold hover:text-[hsl(40,88%,44%)] transition-colors">
                {sectionTitles.viewAll}
                <ChevronLeft size={18} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredCars.map((car) => (
              <motion.div
                key={car.id}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden border border-[hsl(30,15%,90%)] shadow-sm card-hover"
              >
                <div className="relative h-48 bg-[hsl(30,15%,96%)] overflow-hidden">
                  <img
                    src={car.image}
                    alt={isEnglish ? (car.nameEn || car.name) : car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x200/5c2301/d4a017?text=${(car.nameEn || car.name).replace(" ", "+")}`;
                    }}
                  />
                  {/* ✅ FIXED: Dynamically displays English or Arabic category */}
                  <span className="absolute top-3 right-3 bg-[hsl(22,85%,18%)] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isEnglish ? (car.categoryEn || car.category) : car.category}
                  </span>
                </div>
                <div className="p-6">
                  {/* ✅ FIXED: Dynamically displays English or Arabic car name */}
                  <h3 className="text-xl font-bold text-[hsl(22,85%,18%)] mb-1">
                    {isEnglish ? (car.nameEn || car.name) : car.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{car.year}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {car.features.slice(0, 3).map((f) => (
                      <span key={f} className="flex items-center gap-1 bg-[hsl(30,15%,96%)] text-gray-600 text-xs px-2 py-1 rounded-lg">
                        <CheckCircle size={12} className="text-[hsl(40,88%,48%)]" />
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-gradient-gold">{car.dailyPrice}</span>
                      <span className="text-[hsl(22,85%,18%)] font-bold text-lg"> ⃁</span>
                      <span className="text-gray-400 text-sm">{sectionTitles.perDay}</span>
                    </div>
                    <Link href="/booking" className="btn-gold px-4 py-2 rounded-lg text-sm font-bold">
                      {sectionTitles.bookNowShort}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredCars.map((car) => (
              <motion.div
                key={car.id}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden border border-[hsl(30,15%,90%)] shadow-sm card-hover"
              >
                <div className="relative h-48 bg-[hsl(30,15%,96%)] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x200/5c2301/d4a017?text=${car.nameEn.replace(" ", "+")}`;
                    }}
                  />
                  <span className="absolute top-3 right-3 bg-[hsl(22,85%,18%)] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {car.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[hsl(22,85%,18%)] mb-1">{car.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{car.year}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {car.features.slice(0, 3).map((f) => (
                      <span key={f} className="flex items-center gap-1 bg-[hsl(30,15%,96%)] text-gray-600 text-xs px-2 py-1 rounded-lg">
                        <CheckCircle size={12} className="text-[hsl(40,88%,48%)]" />
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-gradient-gold">{car.dailyPrice}</span>
                      <span className="text-[hsl(22,85%,18%)] font-bold text-lg"> ⃁</span>
                      <span className="text-gray-400 text-sm">{sectionTitles.perDay}</span>
                    </div>
                    <Link href="/booking" className="btn-gold px-4 py-2 rounded-lg text-sm font-bold">
                      {sectionTitles.bookNowShort}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[hsl(22,85%,18%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white section-title">
              {sectionTitles.whatsOurClientsSay}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10 card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-[hsl(40,88%,52%)] fill-[hsl(40,88%,52%)]" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div>
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-gray-400 text-sm">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[hsl(22,85%,18%)] mb-4">
              {sectionTitles.readyToStart}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-8">
              {sectionTitles.readySub}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/booking" className="btn-gold px-8 py-4 rounded-xl font-bold text-lg inline-block shadow-md">
                {sectionTitles.bookNow}
              </Link>
              <a
                href="tel:920017014"
                className="px-8 py-4 rounded-xl border-2 border-[hsl(22,85%,18%)] text-[hsl(22,85%,18%)] font-bold text-lg hover:bg-[hsl(22,85%,18%)] hover:text-white transition-colors"
              >
                {sectionTitles.callUs}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}