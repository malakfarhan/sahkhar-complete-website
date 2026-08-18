import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Building2 } from "lucide-react";
import { usePublicLocations } from "@/store/adminStore";
import { useLanguage, localized } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function buildEmbedUrl(lat: number, lng: number, mapUrl?: string, mapEmbed?: string): string {
  if (mapEmbed && mapEmbed.trim()) return mapEmbed.trim();

  if (mapUrl && mapUrl.trim()) {
    const u = mapUrl.trim();
    if (u.includes("output=embed")) return u;
    if (u.includes("google.com/maps") && !u.includes("maps.app.goo.gl")) {
      const sep = u.includes("?") ? "&" : "?";
      return u + sep + "output=embed&hl=ar";
    }
  }
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=ar`;
}

export default function Locations() {
  const { language, isEnglish, refreshKey } = useLanguage(); // 🔑 ADD refreshKey
  const allLocations = usePublicLocations().filter((l) => l.active !== false);

  // Group locations by city
  const grouped = allLocations.reduce<Record<string, typeof allLocations>>((acc, loc) => {
    const cityName = localized(loc, "city", language);
    if (!acc[cityName]) acc[cityName] = [];
    acc[cityName].push(loc);
    return acc;
  }, {});

  const cities = Object.keys(grouped);

  // Translations
  const t = {
    pageTitle: isEnglish ? "Our Locations" : "فروعنا",
    pageSub: isEnglish 
      ? `${allLocations.length} branches in ${cities.length} cities — we serve you nearby`
      : `${allLocations.length} فرع في ${cities.length} مدن — نخدمك قريباً منك دائماً`,
    branch: isEnglish ? "branch" : "فرع",
    branches: isEnglish ? "branches" : "فروع",
    mainBranch: isEnglish ? "Main Branch" : "المقر الرئيسي",
    services: isEnglish ? "Available Services" : "الخدمات المتاحة",
    openInMaps: isEnglish ? "Open in Google Maps" : "فتح في خرائط Google",
    noLocations: isEnglish 
      ? "No locations available at the moment"
      : "لا توجد فروع متاحة حالياً",
  };

  return (
    <div 
      key={refreshKey} // 🔑 ADD THIS - Force re-render on language change
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
            {allLocations.length > 0 
              ? `${allLocations.length} ${allLocations.length === 1 ? t.branch : t.branches} ${isEnglish ? 'in' : 'في'} ${cities.length} ${isEnglish ? 'cities' : 'مدن'} — ${isEnglish ? 'we serve you nearby' : 'نخدمك قريباً منك دائماً'}`
              : t.noLocations
            }
          </motion.p>
        </div>
      </section>

      {/* City Chips */}
      {cities.length > 0 && (
        <section className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`flex flex-wrap justify-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[hsl(30,15%,96%)] border border-[hsl(30,15%,88%)]"
                >
                  <MapPin size={15} className="text-[hsl(40,88%,48%)]" />
                  <span className="font-bold text-[hsl(22,85%,18%)] text-sm">{city}</span>
                  <span className="bg-[hsl(22,85%,18%)] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {grouped[city].length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Locations Grid */}
      <section className="py-16 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          {cities.map((city) => (
            <div key={city}>
              {/* City Header */}
              <motion.div
                initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex items-center gap-4 mb-8 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}
              >
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="text-[hsl(22,60%,12%)]" size={18} />
                </div>
                <h2 className="text-2xl font-black text-[hsl(22,85%,18%)]">{city}</h2>
                <div className="flex-1 h-px bg-[hsl(30,15%,88%)]" />
                <span className="text-sm text-gray-400">
                  {grouped[city].length} {grouped[city].length === 1 ? t.branch : t.branches}
                </span>
              </motion.div>

              {/* Location Cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-8"
              >
                {grouped[city].map((loc) => (
                  <motion.div
                    key={loc.id}
                    variants={fadeUp}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[hsl(30,15%,90%)]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Map */}
                      <div className="h-72 lg:h-auto min-h-[280px]">
                        <iframe
                          src={buildEmbedUrl(loc.lat, loc.lng, loc.mapUrl, loc.mapEmbed)}
                          width="100%"
                          height="100%"
                          style={{ border: 0, minHeight: "280px" }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map ${loc.branch}`}
                        />
                      </div>

                      {/* Details */}
                      <div className={`p-8 lg:p-10 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-sm shrink-0">
                            <Building2 className="text-[hsl(22,60%,12%)]" size={22} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-[hsl(22,85%,18%)]">
                              {localized(loc, "branch", language)}
                            </h3>
                            {loc.isMain && (
                              <span className="text-[hsl(40,88%,44%)] text-xs font-bold bg-[hsl(40,88%,95%)] px-2 py-0.5 rounded-full">
                                {t.mainBranch}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-5">
                          {localized(loc, "description", language)}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                            <MapPin size={16} className="text-[hsl(40,88%,48%)] shrink-0" />
                            <span className="text-[hsl(22,85%,18%)] font-medium text-sm">
                              {localized(loc, "address", language)}
                            </span>
                          </div>
                          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                            <Phone size={16} className="text-[hsl(40,88%,48%)] shrink-0" />
                            <a 
                              href={`tel:${loc.phone}`} 
                              className="text-[hsl(22,85%,18%)] font-medium text-sm hover:text-[hsl(40,88%,44%)] transition-colors"
                            >
                              {loc.phone}
                            </a>
                          </div>
                          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                            <Clock size={16} className="text-[hsl(40,88%,48%)] shrink-0" />
                            <span className="text-[hsl(22,85%,18%)] font-medium text-sm">
                              {localized(loc, "hours", language)}
                            </span>
                          </div>
                        </div>

                        {/* Services */}
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                            {t.services}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {loc.services.map((s) => (
                              <span
                                key={s}
                                className="flex items-center gap-1.5 bg-[hsl(30,15%,96%)] text-gray-600 text-xs px-3 py-1.5 rounded-full border border-[hsl(30,15%,88%)]"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(40,88%,52%)]" />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Open in Maps Button */}
                        <a
                          href={loc.mapUrl && loc.mapUrl.trim() ? loc.mapUrl : `https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-6 inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold ${
                            language === 'ar' ? 'flex-row' : 'flex-row'
                          }`}
                        >
                          <MapPin size={15} />
                          {t.openInMaps}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}

          {/* No Locations Message */}
          {allLocations.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold">{t.noLocations}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}