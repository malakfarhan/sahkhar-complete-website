import { AdminCar, AdminLocation, AdminSlide } from "../types";

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const blankCar = (): Omit<AdminCar, "id"> => ({
  name: "",
  nameEn: "",
  category: "",
  categoryEn: "",  // ✅  English category
  dailyPrice: 150,
  seats: 5,
  transmission: "أوتوماتيك",
  fuel: "بنزين",
  year: new Date().getFullYear(),
  features: [],
  image: "",
  available: true,
  active: true,
});

export const blankLocation = (city = ""): Omit<AdminLocation, "id"> => ({
  city,
  cityEn: "",
  branch: "",
  branchEn: "",
  address: "",
  addressEn: "",
  phone: "920017014",
  hours: "8:00 ص - 10:00 م",
  hoursEn: "8:00 AM - 10:00 PM",
  isMain: false,
  lat: 24.7136,
  lng: 46.6753,
  mapUrl: "",
  mapEmbed: "",
  description: "",
  descriptionEn: "",
  services: ["تسليم واستلام السيارات"],
  active: true,
});

export const blankSlide = (): Omit<AdminSlide, "id"> => ({
  bg: "",
  badge: "جديد",
  badgeEn: "New",
  heading: "العنوان هنا",
  headingEn: "Heading Here",
  sub: "النص التوضيحي للشريحة",
  subEn: "Description text for the slide",
  ctaLabel: "احجز الآن",
  ctaLabelEn: "Book Now",
  ctaHref: "/booking",
  cta2Label: "تصفح الأسطول",
  cta2LabelEn: "Browse Fleet",
  active: true,
});