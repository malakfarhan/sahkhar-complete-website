import { useState, useEffect } from "react";
import { cars as defaultCars, type Car } from "@/data/cars";
import {
  apiGetCars, apiAddCar, apiUpdateCar, apiDeleteCar,
  apiGetLocations, apiAddLocation, apiUpdateLocation, apiDeleteLocation,
  apiGetSlides, apiAddSlide, apiUpdateSlide, apiDeleteSlide,
  apiLogin, apiGetUsers, apiAddUser, apiDeleteUser, apiUpdateUserPassword,
} from "@/lib/api";

// في الإنتاج (Bluehost) نستخدم API، في التطوير نستخدم localStorage
//const USE_API = import.meta.env.PROD;
const USE_API = true;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "superadmin" | "admin";
  createdAt: string;
}

export interface AdminSlide {
  id: number;
  badge: string;
  heading: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  cta2Label: string;
  bg: string;
  active: boolean;
}

export interface AdminLocation {
  id: string;
  city: string;
  branch: string;
  address: string;
  phone: string;
  hours: string;
  isMain: boolean;
  lat: number;
  lng: number;
  mapUrl?: string;
  mapEmbed?: string;
  description: string;
  services: string[];
  active: boolean;
}

export interface AdminCar extends Car {
  active: boolean;
}

export interface AdminStore {
  cars: AdminCar[];
  locations: AdminLocation[];
  slides: AdminSlide[];
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const defaultAdminCars: AdminCar[] = defaultCars.map((c) => ({
  ...c,
  active: true,
}));

export const defaultSlides: AdminSlide[] = [
  {
    id: 0,
    bg: "/images/hero-bg.png",
    badge: "أسطول متنوع وحديث",
    heading: "رحلتك تبدأ من صخـر",
    sub: "اختر من بين أفضل السيارات الاقتصادية والعائلية والفاخرة بأسعار تنافسية تناسب جميع الميزانيات",
    ctaLabel: "احجز الآن",
    ctaHref: "/booking",
    cta2Label: "تصفح الأسطول",
    active: true,
  },
  {
    id: 1,
    bg: "/images/car-landcruiser.png",
    badge: "SUV فاخرة",
    heading: "ادخل البراري بثقة",
    sub: "لاند كروزر، باترول، هايلاندر، يوكون — أقوى الـ SUV بدفع رباعي وتجهيزات كاملة لكل رحلة",
    ctaLabel: "اكتشف الـ SUV",
    ctaHref: "/cars",
    cta2Label: "احجز الآن",
    active: true,
  },
  {
    id: 2,
    bg: "/images/car-lexus.png",
    badge: "سيارات فاخرة",
    heading: "الفخامة في كل تفصيل",
    sub: "مرسيدس E-Class، لكزس ES — تجربة قيادة لا مثيل لها لرجال الأعمال والمناسبات الرسمية",
    ctaLabel: "السيارات الفاخرة",
    ctaHref: "/cars",
    cta2Label: "احجز الآن",
    active: true,
  },
  {
    id: 3,
    bg: "/images/car-camry.png",
    badge: "عروض خاصة",
    heading: "خصومات حصرية لا تفوتك",
    sub: "خصم 20% على الحجوزات الأسبوعية — كيلومترات غير محدودة — اليوم الأول مجاناً مع الإيجار الشهري",
    ctaLabel: "احجز واستفد",
    ctaHref: "/booking",
    cta2Label: "العروض كاملة",
    active: true,
  },
];

export const defaultLocations: AdminLocation[] = [
  {
    id: "riyadh-main",
    city: "الرياض",
    branch: "الفرع الرئيسي",
    address: "الرياض",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: true,
    lat: 24.7275519,
    lng: 46.7655743,
    description: "المقر الرئيسي لشركة صخر لتأجير السيارات في الرياض",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل للمطار", "خدمة الشركات", "صيانة طارئة"],
    active: true,
  },
  {
    id: "riyadh-qairawan",
    city: "الرياض",
    branch: "فرع القيروان",
    address: "حي القيروان، الرياض",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 24.8492722,
    lng: 46.572742,
    description: "فرع صخر في حي القيروان شمال الرياض",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل", "خدمة الشركات"],
    active: true,
  },
  {
    id: "riyadh-uqaiq",
    city: "الرياض",
    branch: "فرع العقيق",
    address: "حي العقيق، الرياض",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 24.7895899,
    lng: 46.6212964,
    description: "فرع صخر في حي العقيق غرب الرياض",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل", "تأجير للمجموعات"],
    active: true,
  },
  {
    id: "riyadh-shifa",
    city: "الرياض",
    branch: "فرع الشفاء",
    address: "حي الشفاء، الرياض",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 24.5454964,
    lng: 46.7127038,
    description: "فرع صخر في حي الشفاء جنوب الرياض",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل", "خدمة الشركات"],
    active: true,
  },
  {
    id: "ras-tanura",
    city: "رأس تنورة",
    branch: "فرع رأس تنورة",
    address: "رأس تنورة، المنطقة الشرقية",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 26.7081668,
    lng: 50.0656479,
    description: "فرع صخر في رأس تنورة لخدمة عملاء المنطقة الشرقية",
    services: ["تسليم واستلام السيارات", "خدمة الشركات", "خدمة التوصيل"],
    active: true,
  },
  {
    id: "jeddah-1",
    city: "جدة",
    branch: "فرع جدة الأول",
    address: "جدة",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 21.5817322,
    lng: 39.1975231,
    description: "فرع صخر الأول في جدة لخدمة عملاء المنطقة الغربية",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل للمطار", "تأجير للمجموعات"],
    active: true,
  },
  {
    id: "jeddah-2",
    city: "جدة",
    branch: "فرع جدة الثاني",
    address: "جدة",
    phone: "920017014",
    hours: "8:00 ص - 10:00 م",
    isMain: false,
    lat: 21.5362646,
    lng: 39.2142087,
    description: "فرع صخر الثاني في جدة لخدمة جنوب المدينة",
    services: ["تسليم واستلام السيارات", "خدمة التوصيل", "خدمة الشركات"],
    active: true,
  },
];

// ─── localStorage helpers (dev only) ─────────────────────────────────────────

const STORAGE_KEY = "sakhr_admin_store";
const USERS_KEY   = "sakhr_admin_users";

function loadStore(): AdminStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { cars: defaultAdminCars, locations: defaultLocations, slides: defaultSlides };
}

function saveStore(data: AdminStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ─── Public hooks (used by visitor pages) ────────────────────────────────────

export function usePublicCars(): AdminCar[] {
  const [cars, setCars] = useState<AdminCar[]>(() =>
    USE_API ? [] : (getStoredCars())
  );
  useEffect(() => {
    if (!USE_API) return;
    apiGetCars().then((data) => setCars(data as AdminCar[])).catch(() => setCars(defaultAdminCars));
  }, []);
  return cars;
}

export function usePublicLocations(): AdminLocation[] {
  const [locations, setLocations] = useState<AdminLocation[]>(() =>
    USE_API ? [] : getStoredLocations()
  );
  useEffect(() => {
    if (!USE_API) return;
    apiGetLocations().then((data) => setLocations(data as AdminLocation[])).catch(() => setLocations(defaultLocations));
  }, []);
  return locations;
}

// export function usePublicSlides(): AdminSlide[] {
//   const [slides, setSlides] = useState<AdminSlide[]>(() =>
//     USE_API ? [] : getStoredSlides()
//   );
//   useEffect(() => {
//     if (!USE_API) return;
//     apiGetSlides().then((data) => setSlides(data as AdminSlide[])).catch(() => setSlides(defaultSlides));
//   }, []);
//   return slides;
// }
// export function usePublicSlides(): AdminSlide[] {
//   const [slides, setSlides] = useState<AdminSlide[]>([]);
//   useEffect(() => {
//     if (!USE_API) return;
//     apiGetSlides().then((data) => {
//       // Yahan hum data ko process kar rahe hain
//       const modifiedSlides = (data as AdminSlide[]).map(s => ({
//         ...s,
//         // Sirf test ke liye hum path ke aage ?test=1 laga rahe hain
//         bg: `${s.bg}?test=1` 
//       }));
//       setSlides(modifiedSlides);
//     });
//   }, []);
//   return slides;
// }
 export function usePublicSlides(): AdminSlide[] {
  const [slides, setSlides] = useState<AdminSlide[]>(() =>
    USE_API ? [] : getStoredSlides()
  );

  useEffect(() => {
    if (!USE_API) return;
    
    apiGetSlides()
      .then((data) => {
        console.log("DB slides data:", data); // Yahan check karein
        setSlides(data as AdminSlide[]);
      })
      .catch((err) => {
        console.error("DB fail ho gaya, local default use kar rahe hain:", err);
        setSlides(defaultSlides);
      });
  }, []);

  return slides;
}

// ─── Admin store hook ─────────────────────────────────────────────────────────

export function useAdminStore() {
  const [store, setStore] = useState<AdminStore>(() =>
    USE_API ? { cars: [], locations: [], slides: [] } : loadStore()
  );
  const [loading, setLoading] = useState(USE_API);

  const reload = async () => {
    if (!USE_API) return;
    try {
      const [cars, locations, slides] = await Promise.all([
        apiGetCars(), apiGetLocations(), apiGetSlides(),
      ]);
      setStore({ cars: cars as AdminCar[], locations: locations as AdminLocation[], slides: slides as AdminSlide[] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const localUpdate = (next: AdminStore) => {
    setStore(next);
    if (!USE_API) saveStore(next);
  };

  const updateCar = async (id: number, patch: Partial<AdminCar>) => {
    const previousCars = store.cars;
    setStore((prev) => ({
      ...prev,
      cars: prev.cars.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

    try {
      if (USE_API) {
        const car = previousCars.find((c) => c.id === id);
        if (car) await apiUpdateCar(id, { ...car, ...patch });
        await reload();
      } else {
        localUpdate({ ...store, cars: store.cars.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
      }
    } catch (error) {
      console.error("Failed to update car:", error);
      setStore((prev) => ({ ...prev, cars: previousCars }));
    }
  };

  const updateLocation = async (id: string, patch: Partial<AdminLocation>) => {
    const previousLocations = store.locations;
    setStore((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

    try {
      if (USE_API) {
        const loc = previousLocations.find((l) => l.id === id);
        if (loc) await apiUpdateLocation(id, { ...loc, ...patch });
        await reload();
      } else {
        localUpdate({ ...store, locations: store.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
      }
    } catch (error) {
      console.error("Failed to update location:", error);
      setStore((prev) => ({ ...prev, locations: previousLocations }));
    }
  };

  const updateSlide = async (id: number, patch: Partial<AdminSlide>) => {
    const previousSlides = store.slides;
    setStore((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));

    try {
      if (USE_API) {
        const slide = previousSlides.find((s) => s.id === id);
        if (slide) await apiUpdateSlide(id, { ...slide, ...patch });
        await reload();
      } else {
        localUpdate({ ...store, slides: store.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
      }
    } catch (error) {
      console.error("Failed to update slide:", error);
      setStore((prev) => ({ ...prev, slides: previousSlides }));
    }
  };

  const addCar = async (car: Omit<AdminCar, "id">) => {
    if (USE_API) { await apiAddCar(car); await reload(); }
    else {
      const maxId = store.cars.reduce((m, c) => Math.max(m, c.id), 0);
      localUpdate({ ...store, cars: [...store.cars, { ...car, id: maxId + 1 }] });
    }
  };

  const deleteCar = async (id: number) => {
    if (USE_API) { await apiDeleteCar(id); await reload(); }
    else localUpdate({ ...store, cars: store.cars.filter((c) => c.id !== id) });
  };

  const addSlide = async (slide: Omit<AdminSlide, "id">) => {
    if (USE_API) { await apiAddSlide(slide); await reload(); }
    else {
      const maxId = store.slides.reduce((m, s) => Math.max(m, s.id), 0);
      localUpdate({ ...store, slides: [...store.slides, { ...slide, id: maxId + 1 }] });
    }
  };

  const deleteSlide = async (id: number) => {
    if (USE_API) { await apiDeleteSlide(id); await reload(); }
    else localUpdate({ ...store, slides: store.slides.filter((s) => s.id !== id) });
  };

  const addLocation = async (loc: Omit<AdminLocation, "id">) => {
    if (USE_API) { await apiAddLocation(loc); await reload(); }
    else {
      const id = `loc_${Date.now()}`;
      localUpdate({ ...store, locations: [...store.locations, { ...loc, id }] });
    }
  };

  const deleteLocation = async (id: string) => {
    if (USE_API) { await apiDeleteLocation(id); await reload(); }
    else localUpdate({ ...store, locations: store.locations.filter((l) => l.id !== id) });
  };

  const resetAll = () => {
    localUpdate({ cars: defaultAdminCars, locations: defaultLocations, slides: defaultSlides });
  };

  return {
    store, loading, reload,
    updateCar, updateLocation, updateSlide,
    addCar, deleteCar, addSlide, deleteSlide, addLocation, deleteLocation,
    resetAll,
  };
}

// ─── Shared read-only helpers (dev fallback for public pages) ────────────────

export function getStoredCars(): AdminCar[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw).cars ?? defaultAdminCars;
  } catch {}
  return defaultAdminCars;
}

export function getStoredLocations(): AdminLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw).locations ?? defaultLocations;
  } catch {}
  return defaultLocations;
}

export function getStoredSlides(): AdminSlide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw).slides ?? defaultSlides;
  } catch {}
  return defaultSlides;
}

// ─── Users (API or localStorage) ─────────────────────────────────────────────

const defaultUsers: AdminUser[] = [
  { id: "root", username: "admin", password: "1234", role: "superadmin", createdAt: "2024-01-01T00:00:00.000Z" },
];

export function getStoredUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) { const p: AdminUser[] = JSON.parse(raw); if (p.length > 0) return p; }
  } catch {}
  return defaultUsers;
}

function saveUsers(users: AdminUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

export async function findUser(username: string, password: string): Promise<AdminUser | null> {
  if (USE_API) {
    try { return (await apiLogin(username, password)) as AdminUser; } catch { return null; }
  }
  const users = getStoredUsers();
  return users.find((u) => u.username === username && u.password === password) ?? null;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const reload = async () => {
    if (USE_API) {
      try { setUsers((await apiGetUsers()) as AdminUser[]); } catch {}
    } else {
      setUsers(getStoredUsers());
    }
  };
  useEffect(() => { reload(); }, []);

  const addUser = async (user: Omit<AdminUser, "id" | "createdAt">) => {
    if (USE_API) { await apiAddUser(user); }
    else {
      const newUser: AdminUser = { ...user, id: `user_${Date.now()}`, createdAt: new Date().toISOString() };
      saveUsers([...getStoredUsers(), newUser]);
    }
    await reload();
  };

  const deleteUser = async (id: string) => {
    if (USE_API) { await apiDeleteUser(id); }
    else { saveUsers(getStoredUsers().filter((u) => u.id !== id)); }
    await reload();
  };

  const updateUserPassword = async (id: string, password: string) => {
    if (USE_API) { await apiUpdateUserPassword(id, password); }
    else { saveUsers(getStoredUsers().map((u) => u.id === id ? { ...u, password } : u)); }
    await reload();
  };

  return { users, addUser, deleteUser, updateUserPassword, reload };
}
