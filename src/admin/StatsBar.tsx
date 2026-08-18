import { AdminCar, AdminLocation, AdminSlide } from "./types";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  cars: AdminCar[];
  locations: AdminLocation[];
  slides: AdminSlide[];
}

export default function StatsBar({ cars, locations, slides }: Props) {
  const { isEnglish } = useLanguage();

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    availableCars: isEnglish ? "Available Cars" : "السيارات المتاحة",
    activeLocations: isEnglish ? "Active Locations" : "الفروع المفعّلة",
    activeSlides: isEnglish ? "Active Slides" : "الشرائح المفعّلة",
  };

  const stats = [
    {
      label: t.availableCars,
      value: cars.filter((c) => c.available).length,
      total: cars.length,
      color: "text-green-600"
    },
    {
      label: t.activeLocations,
      value: locations.filter((l) => l.active).length,
      total: locations.length,
      color: "text-blue-600"
    },
    {
      label: t.activeSlides,
      value: slides.filter((s) => s.active).length,
      total: slides.length,
      color: "text-[hsl(40,88%,44%)]"
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-[hsl(30,15%,88%)] text-center">
          <div className={`text-3xl font-black ${s.color}`}>
            {s.value}
            <span className="text-gray-300 text-lg">/{s.total}</span>
          </div>
          <div className="text-gray-500 text-xs mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}