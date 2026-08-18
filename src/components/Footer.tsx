import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import LogoIcon from "./LogoIcon";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { language, isEnglish, refreshKey } = useLanguage();

  // ============================================
  // 📝 ALL TRANSLATIONS
  // ============================================
  const t = {
    // Brand
    brandName: isEnglish ? "Sakher" : "صخـر",
    brandSub: "Sakher Rent",
    
    // Description
    description: isEnglish 
      ? "Sakher car rental company provides premium rental services with a modern fleet and competitive prices across the Kingdom of Saudi Arabia."
      : "شركة صخر لتأجير السيارات، نقدم خدمات تأجير متميزة بأسطول حديث وبأسعار تنافسية في جميع أنحاء المملكة العربية السعودية.",
    
    // Quick Links
    quickLinks: isEnglish ? "Quick Links" : "روابط سريعة",
    links: [
      { href: "/", label: isEnglish ? "Home" : "الرئيسية" },
      { href: "/cars", label: isEnglish ? "Our Fleet" : "أسطولنا" },
      { href: "/locations", label: isEnglish ? "Locations" : "مواقعنا" },
      { href: "/booking", label: isEnglish ? "Book Now" : "احجز الآن" },
      { href: "/contact", label: isEnglish ? "Contact" : "تواصل معنا" },
    ],
    
    // Contact
    contact: isEnglish ? "Contact" : "تواصل معنا",
    phone: "920017014",
    email: "info@sakhr-rent.com",
    address: isEnglish ? "Riyadh, Al-Olaya" : "الرياض، حي العليا",
    hours: isEnglish ? "24/7 Support" : "24 ساعة / 7 أيام",
    
    // Car Categories
    carCategories: isEnglish ? "Car Categories" : "فئات السيارات",
    categories: [
      { ar: "اقتصادية", en: "Economy" },
      { ar: "عائلية", en: "Family" },
      { ar: "فاخرة", en: "Luxury" },
      { ar: "SUV", en: "SUV" },
      { ar: "ميني باص", en: "Minibus" },
    ],
    
    // Footer Bottom
    copyright: isEnglish 
      ? "© 2024 Sakher Car Rental. All rights reserved."
      : "© 2024 صخر لتأجير السيارات. جميع الحقوق محفوظة.",
    privacy: isEnglish ? "Privacy Policy" : "سياسة الخصوصية",
    terms: isEnglish ? "Terms & Conditions" : "الشروط والأحكام",
  };

  // Get category label based on language
  const getCategoryLabel = (cat: { ar: string; en: string }) => {
    return isEnglish ? cat.en : cat.ar;
  };

  return (
    <footer 
      key={refreshKey} // 🔑 ADD THIS
      className={`bg-[#3d1a06] text-gray-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* ===== BRAND & DESCRIPTION ===== */}
          <div>
            <div className={`flex items-center gap-3 mb-5 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
              <LogoIcon size={40} />
              <div>
                <div className="text-white font-black text-xl">{t.brandName}</div>
                <div className="text-[hsl(40,88%,58%)] text-[10px] tracking-widest uppercase font-semibold">
                  {t.brandSub}
                </div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.description}
            </p>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div>
            <h3 className={`text-white font-bold text-lg mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.quickLinks}
            </h3>
            <ul className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-[hsl(40,88%,58%)] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== CONTACT ===== */}
          <div>
            <h3 className={`text-white font-bold text-lg mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.contact}
            </h3>
            <ul className={`space-y-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <li className={`flex items-center gap-3 text-sm ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                <Phone size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>{t.phone}</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                <Mail size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>{t.email}</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                <MapPin size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                <Clock size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>{t.hours}</span>
              </li>
            </ul>
          </div>

          {/* ===== CAR CATEGORIES ===== */}
          <div>
            <h3 className={`text-white font-bold text-lg mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.carCategories}
            </h3>
            <ul className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.categories.map((cat) => (
                <li key={cat.ar}>
                  <Link 
                    href="/cars" 
                    className="text-gray-400 hover:text-[hsl(40,88%,58%)] transition-colors text-sm"
                  >
                    {getCategoryLabel(cat)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== FOOTER BOTTOM ===== */}
        <div className={`border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${language === 'ar' ? 'flex-row-reverse sm:flex-row-reverse' : ''}`}>
          <p className={`text-gray-500 text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t.copyright}
          </p>
          <div className={`flex items-center gap-4 text-sm text-gray-500 ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
            <a href="#" className="hover:text-[hsl(40,88%,58%)] transition-colors">
              {t.privacy}
            </a>
            <a href="#" className="hover:text-[hsl(40,88%,58%)] transition-colors">
              {t.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}