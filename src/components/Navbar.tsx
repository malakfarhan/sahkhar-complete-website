import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoIcon from "./LogoIcon";
import { useLanguage } from "@/i18n/LanguageContext";

// 📝 Nav Links with translations
const getNavLinks = (isEnglish: boolean) => [
  { href: "/", label: isEnglish ? "Home" : "الرئيسية" },
  { href: "/cars", label: isEnglish ? "Our Fleet" : "أسطولنا" },
  { href: "/locations", label: isEnglish ? "Locations" : "مواقعنا" },
  { href: "/contact", label: isEnglish ? "Contact" : "تواصل معنا" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { language, isEnglish, toggleLanguage } = useLanguage();

  const navLinks = getNavLinks(isEnglish);

  // Translations
  const t = {
    brand: isEnglish ? "Sakher" : "صخـر",
    brandSub: isEnglish ? "Sakher Rent" : "Sakher Rent",
    phone: "920017014",
    booking: isEnglish ? "Book Now" : "احجز الآن",
    languageToggle: isEnglish ? "AR" : "EN",
    languageFull: isEnglish ? "العربية" : "English",
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#3d1a06] shadow-xl shadow-black/30"
          : "bg-[#3d1a06]"
      } ${language === 'ar' ? 'rtl' : 'ltr'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <LogoIcon size={42} />
            <div>
              <div className="text-white font-black text-xl leading-tight tracking-wide">
                {t.brand}
              </div>
              <div className="text-[hsl(40,88%,60%)] text-[10px] font-semibold tracking-widest uppercase">
                {t.brandSub}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location === link.href
                    ? "bg-[hsl(40,88%,52%)] text-[hsl(22,60%,12%)]"
                    : "text-[hsl(30,30%,88%)] hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone + Language + CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="tel:920017014"
              className="flex items-center gap-2 text-[hsl(40,88%,60%)] font-bold text-sm hover:text-white transition-colors"
            >
              <Phone size={15} />
              <span>{t.phone}</span>
            </a>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-[hsl(40,88%,60%)] font-bold text-sm hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              title={isEnglish ? "التبديل للعربية" : "Switch to English"}
            >
              <Globe size={15} />
              <span>{t.languageToggle}</span>
            </button>
            
            <Link
              href="/booking"
              className="btn-gold px-5 py-2.5 rounded-lg text-sm font-bold"
            >
              {t.booking}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-white p-2 shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0e0b07] border-t border-white/10"
          >
            <nav className={`px-4 py-4 flex flex-col gap-2 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    location === link.href
                      ? "bg-[hsl(40,88%,52%)] text-[hsl(22,60%,12%)]"
                      : "text-[hsl(30,30%,80%)] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-[hsl(30,30%,80%)] hover:bg-white/10 hover:text-white transition-all"
              >
                <Globe size={15} />
                <span>{t.languageFull}</span>
              </button>
              
              <Link
                href="/booking"
                className="btn-gold px-4 py-3 rounded-lg font-bold text-center mt-2"
              >
                {t.booking}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}