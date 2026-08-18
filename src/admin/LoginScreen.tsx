import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertTriangle, Globe } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import { AdminUser } from "./types";
import { findUser } from "@/store/adminStore";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  onLogin: (user: AdminUser) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { language, isEnglish, toggleLanguage, refreshKey } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    title: isEnglish ? "Dashboard" : "لوحة التحكم",
    subtitle: isEnglish 
      ? "Enter your credentials to continue"
      : "أدخل بيانات الدخول للمتابعة",
    username: isEnglish ? "Username" : "اسم المستخدم",
    usernamePlaceholder: "username",
    password: isEnglish ? "Password" : "كلمة المرور",
    passwordPlaceholder: "••••••••",
    login: isEnglish ? "Login" : "دخول",
    error: isEnglish 
      ? "Invalid username or password"
      : "اسم المستخدم أو كلمة المرور غير صحيحة",
    languageToggle: isEnglish ? "عربي" : "English",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await findUser(username.trim(), password);
    if (user) {
      localStorage.setItem("admin_user", JSON.stringify(user));
      onLogin(user);
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div 
      key={refreshKey}
      className={`min-h-screen bg-[#3d1a06] flex items-center justify-center px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl relative"
      >
        {/* Language Toggle Button - Top Right */}
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[hsl(40,88%,52%)] transition-colors border border-gray-200 hover:border-[hsl(40,88%,52%)] px-3 py-1.5 rounded-lg bg-white"
          title={isEnglish ? "Switch to Arabic" : "التبديل للعربية"}
        >
          <Globe size={16} />
          <span>{t.languageToggle}</span>
        </button>

        <div className="flex justify-center mb-4">
          <LogoIcon size={64} />
        </div>
        <h1 className={`text-2xl font-black text-[hsl(22,85%,18%)] mb-1 text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h1>
        <p className="text-gray-400 text-sm mb-8 text-center">
          {t.subtitle}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 mb-1 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernamePlaceholder}
              dir="ltr"
              className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all ${
                error ? "border-red-400 bg-red-50" : "border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)]"
              }`}
            />
          </div>

          {/* Password Field with Dynamic Eye Position */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 mb-1 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                dir="ltr"
                className={`w-full border-2 rounded-xl px-4 py-3 text-base outline-none transition-all ${
                  language === 'ar' ? 'pl-10' : 'pr-10'
                } ${
                  error ? "border-red-400 bg-red-50 text-red-600" : "border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)]"
                }`}
              />
              {/* 🔥 Eye Button - Position changes with language */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${
                  language === 'ar' ? 'left-3' : 'right-3'
                }`}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertTriangle size={14} /> {t.error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 mt-2"
          >
            <Lock size={16} />
            {t.login}
          </button>
        </form>
      </motion.div>
    </div>
  );
}