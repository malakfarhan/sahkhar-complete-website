import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const contactInfo = [
  { icon: Phone, label: "الهاتف", value: "920017014", href: "tel:920017014" },
  { icon: MessageCircle, label: "واتساب", value: "+966920017014", href: "https://wa.me/966920017014" },
  { icon: Mail, label: "البريد الإلكتروني", value: "info@sakhr-rent.com", href: "mailto:info@sakhr-rent.com" },
  { icon: MapPin, label: "العنوان", value: "الرياض، حي العليا، شارع العروبة", href: "#" },
  { icon: Clock, label: "ساعات العمل", value: "السبت - الخميس: 8ص - 10م", href: "#" },
];

export default function Contact() {
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

  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-[hsl(22,85%,18%)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            تواصل معنا
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="text-[hsl(30,20%,80%)] text-lg max-w-2xl mx-auto"
          >
            نحن هنا للإجابة على استفساراتك ومساعدتك في اختيار السيارة المناسبة
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-[hsl(30,15%,96%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-black text-[hsl(22,85%,18%)] mb-2">معلومات التواصل</h2>
                <p className="text-gray-500 text-sm mb-6">
                  تواصل معنا عبر أي من الوسائل التالية وسنرد عليك في أقرب وقت ممكن
                </p>
              </motion.div>

              {contactInfo.map((item) => (
                <motion.a
                  key={item.label}
                  variants={fadeUp}
                  href={item.href}
                  className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[hsl(30,15%,90%)] shadow-sm hover:border-[hsl(40,88%,52%)] hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="text-[hsl(22,60%,12%)]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-[hsl(22,85%,18%)] font-semibold text-sm group-hover:text-[hsl(40,88%,40%)] transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}

              <motion.div variants={fadeUp} className="bg-[hsl(22,85%,18%)] rounded-2xl p-6 text-white mt-2">
                <h3 className="font-bold mb-2">هل تحتاج دعماً فورياً؟</h3>
                <p className="text-[hsl(30,20%,75%)] text-sm mb-4">
                  للمساعدة العاجلة والطوارئ على الطريق، اتصل بنا مباشرة
                </p>
                <a
                  href="tel:920017014"
                  className="btn-gold px-5 py-3 rounded-xl font-bold text-sm inline-block w-full text-center"
                >
                  اتصل الآن: 920017014
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-2xl p-8 border border-[hsl(30,15%,90%)] shadow-sm"
            >
              <h2 className="text-2xl font-black text-[hsl(22,85%,18%)] mb-6">أرسل لنا رسالة</h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium"
                >
                  تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">الاسم الكامل *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="أدخل اسمك الكامل"
                      className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">رقم الجوال *</label>
                    <input
                      type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                      placeholder="05xxxxxxxx"
                      className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">موضوع الرسالة *</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleChange} required
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all bg-white"
                  >
                    <option value="">اختر موضوع الرسالة</option>
                    <option>استفسار عن الأسعار</option>
                    <option>حجز سيارة</option>
                    <option>شكوى</option>
                    <option>اقتراح</option>
                    <option>عقود شركات</option>
                    <option>أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">الرسالة *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange} required rows={5}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full border border-[hsl(30,15%,88%)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(40,88%,52%)]/40 focus:border-[hsl(40,88%,52%)] transition-all resize-none"
                  />
                </div>
                <button type="submit" className="btn-gold w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md">
                  <Send size={18} />
                  إرسال الرسالة
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
