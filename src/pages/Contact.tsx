import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Contact() {
  const { language, isEnglish, refreshKey } = useLanguage(); // 🔑 ADD refreshKey

  // ============================================
  // 📝 ALL TRANSLATIONS
  // ============================================
  const t = {
    // Hero Section
    pageTitle: isEnglish ? "Contact Us" : "تواصل معنا",
    pageSub: isEnglish 
      ? "We are here to answer your questions and help you choose the right car"
      : "نحن هنا للإجابة على استفساراتك ومساعدتك في اختيار السيارة المناسبة",
    
    // Contact Info Section
    contactTitle: isEnglish ? "Contact Information" : "معلومات التواصل",
    contactSub: isEnglish 
      ? "Contact us through any of the following methods and we will get back to you as soon as possible"
      : "تواصل معنا عبر أي من الوسائل التالية وسنرد عليك في أقرب وقت ممكن",
    
    // Contact Labels
    phone: isEnglish ? "Phone" : "الهاتف",
    whatsapp: isEnglish ? "WhatsApp" : "واتساب",
    email: isEnglish ? "Email" : "البريد الإلكتروني",
    address: isEnglish ? "Address" : "العنوان",
    hours: isEnglish ? "Working Hours" : "ساعات العمل",
    
    // Contact Values (Dynamic)
    phoneValue: "920017014",
    whatsappValue: "+966920017014",
    emailValue: "info@sakhr-rent.com",
    addressValue: isEnglish 
      ? "Riyadh, Al-Olaya, Al-Urubah Street" 
      : "الرياض، حي العليا، شارع العروبة",
    hoursValue: isEnglish 
      ? "Sat - Thu: 8AM - 10PM" 
      : "السبت - الخميس: 8ص - 10م",
    
    // Emergency Support
    needSupport: isEnglish ? "Need Immediate Support?" : "هل تحتاج دعماً فورياً؟",
    supportDesc: isEnglish 
      ? "For urgent assistance and roadside emergencies, call us directly"
      : "للمساعدة العاجلة والطوارئ على الطريق، اتصل بنا مباشرة",
    callNow: isEnglish ? "Call Now: 920017014" : "اتصل الآن: 920017014",
    
    // Form Section
    formTitle: isEnglish ? "Send Us a Message" : "أرسل لنا رسالة",
    formSuccess: isEnglish 
      ? "Your message has been sent successfully! We will contact you soon."
      : "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
    
    // Form Labels
    fullName: isEnglish ? "Full Name *" : "الاسم الكامل *",
    namePlaceholder: isEnglish ? "Enter your full name" : "أدخل اسمك الكامل",
    phoneNumber: isEnglish ? "Phone Number *" : "رقم الجوال *",
    phonePlaceholder: isEnglish ? "05xxxxxxxx" : "05xxxxxxxx",
    emailLabel: isEnglish ? "Email Address" : "البريد الإلكتروني",
    emailPlaceholder: isEnglish ? "example@email.com" : "example@email.com",
    
    subject: isEnglish ? "Subject *" : "موضوع الرسالة *",
    subjectPlaceholder: isEnglish ? "Select a subject" : "اختر موضوع الرسالة",
    subjectOptions: {
      pricing: isEnglish ? "Pricing Inquiry" : "استفسار عن الأسعار",
      booking: isEnglish ? "Car Booking" : "حجز سيارة",
      complaint: isEnglish ? "Complaint" : "شكوى",
      suggestion: isEnglish ? "Suggestion" : "اقتراح",
      corporate: isEnglish ? "Corporate Contracts" : "عقود شركات",
      other: isEnglish ? "Other" : "أخرى",
    },
    
    message: isEnglish ? "Message *" : "الرسالة *",
    messagePlaceholder: isEnglish ? "Write your message here..." : "اكتب رسالتك هنا...",
    sendButton: isEnglish ? "Send Message" : "إرسال الرسالة",
  };

  // ============================================
  // 🔥 CONTACT INFO - DYNAMIC (Component ke ANDAR)
  // ============================================
  const contactInfo = [
    { 
      icon: Phone, 
      label: t.phone, 
      value: t.phoneValue, 
      href: `tel:${t.phoneValue}` 
    },
    { 
      icon: MessageCircle, 
      label: t.whatsapp, 
      value: t.whatsappValue, 
      href: `https://wa.me/${t.whatsappValue.replace(/[^0-9]/g, '')}` 
    },
    { 
      icon: Mail, 
      label: t.email, 
      value: t.emailValue, 
      href: `mailto:${t.emailValue}` 
    },
    { 
      icon: MapPin, 
      label: t.address, 
      value: t.addressValue, 
      href: "#" 
    },
    { 
      icon: Clock, 
      label: t.hours, 
      value: t.hoursValue, 
      href: "#" 
    },
  ];

  // ============================================
  // 📝 FORM STATE
  // ============================================
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  // ============================================
  // 🎨 RENDER
  // ============================================
  return (
    <div 
      key={refreshKey} // 🔑 ADD THIS - Force re-render on language change
      className={`pt-16 md:pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* ===== HERO SECTION ===== */}
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

      {/* ===== CONTACT SECTION ===== */}
      <section className="py-16 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* ===== LEFT: CONTACT INFO ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              <motion.div variants={fadeUp}>
                <h2 className={`text-2xl font-black text-[hsl(22,85%,18%)] mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t.contactTitle}
                </h2>
                <p className={`text-gray-500 text-sm mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t.contactSub}
                </p>
              </motion.div>

              {/* 🔥 DYNAMIC CONTACT INFO */}
              {contactInfo.map((item) => (
                <motion.a
                  key={item.label}
                  variants={fadeUp}
                  href={item.href}
                  className={`flex items-center gap-4 bg-white p-5 rounded-2xl border border-[hsl(30,15%,90%)] shadow-sm hover:border-[hsl(40,88%,52%)] hover:shadow-md transition-all group ${
                    language === 'ar' ? 'flex-row' : 'flex-row'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="text-[hsl(22,60%,12%)]" size={20} />
                  </div>
                  <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-[hsl(22,85%,18%)] font-semibold text-sm group-hover:text-[hsl(40,88%,40%)] transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Emergency Support */}
              <motion.div variants={fadeUp} className="bg-[hsl(22,85%,18%)] rounded-2xl p-6 text-white mt-2">
                <h3 className={`font-bold mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t.needSupport}
                </h3>
                <p className={`text-[hsl(30,20%,75%)] text-sm mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t.supportDesc}
                </p>
                <a
                  href="tel:920017014"
                  className="btn-gold px-5 py-3 rounded-xl font-bold text-sm inline-block w-full text-center"
                >
                  {t.callNow}
                </a>
              </motion.div>
            </motion.div>

            {/* ===== RIGHT: CONTACT FORM ===== */}
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-2xl p-8 border border-[hsl(30,15%,90%)] shadow-sm"
            >
              <h2 className={`text-2xl font-black text-[hsl(22,85%,18%)] mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {t.formTitle}
              </h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium"
                >
                  {t.formSuccess}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-semibold text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t.fullName}
                    </label>
                    <input
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required
                      placeholder={t.namePlaceholder}
                      className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t.phoneNumber}
                    </label>
                    <input
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required
                      placeholder={t.phonePlaceholder}
                      className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t.emailLabel}
                  </label>
                  <input
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t.subject}
                  </label>
                  <select
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all bg-white"
                  >
                    <option value="">{t.subjectPlaceholder}</option>
                    <option value={t.subjectOptions.pricing}>{t.subjectOptions.pricing}</option>
                    <option value={t.subjectOptions.booking}>{t.subjectOptions.booking}</option>
                    <option value={t.subjectOptions.complaint}>{t.subjectOptions.complaint}</option>
                    <option value={t.subjectOptions.suggestion}>{t.subjectOptions.suggestion}</option>
                    <option value={t.subjectOptions.corporate}>{t.subjectOptions.corporate}</option>
                    <option value={t.subjectOptions.other}>{t.subjectOptions.other}</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t.message}
                  </label>
                  <textarea
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    rows={5}
                    placeholder={t.messagePlaceholder}
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all resize-none"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={18} />
                  {t.sendButton}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}