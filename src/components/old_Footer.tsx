import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import LogoIcon from "./LogoIcon";

export default function Footer() {
  return (
    <footer className="bg-[#3d1a06] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <LogoIcon size={40} />
              <div>
                <div className="text-white font-black text-xl">صخـر</div>
                <div className="text-[hsl(40,88%,58%)] text-[10px] tracking-widest uppercase font-semibold">Sakher Rent</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              شركة صخر لتأجير السيارات، نقدم خدمات تأجير متميزة بأسطول حديث وبأسعار تنافسية في جميع أنحاء المملكة العربية السعودية.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/cars", label: "أسطولنا" },
                { href: "/locations", label: "مواقعنا" },
                { href: "/booking", label: "احجز الآن" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[hsl(40,88%,58%)] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Phone size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>920017014</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>info@sakhr-rent.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>الرياض، حي العليا</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={15} className="text-[hsl(40,88%,58%)] shrink-0" />
                <span>24 ساعة / 7 أيام</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">فئات السيارات</h3>
            <ul className="space-y-2">
              {["اقتصادية", "عائلية", "فاخرة", "SUV", "ميني باص"].map((cat) => (
                <li key={cat}>
                  <Link href="/cars" className="text-gray-400 hover:text-[hsl(40,88%,58%)] transition-colors text-sm">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 صخر لتأجير السيارات. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-[hsl(40,88%,58%)] transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-[hsl(40,88%,58%)] transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
