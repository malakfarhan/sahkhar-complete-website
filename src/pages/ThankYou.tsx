import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface BookingData {
  name: string;
  phone: string;
}

export default function ThankYou() {
  const [, navigate] = useLocation();
  const [bookingData] = useState<BookingData>(() => {
    try {
      const lastBooking = localStorage.getItem("lastBooking");
      if (!lastBooking) return { name: "", phone: "" };

      const parsed: unknown = JSON.parse(lastBooking);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        typeof (parsed as BookingData).name === "string" &&
        typeof (parsed as BookingData).phone === "string"
      ) {
        return parsed as BookingData;
      }
    } catch (error) {
      console.error("Could not read lastBooking from localStorage", error);
    }

    return { name: "", phone: "" };
  });

  return (
    // Main container ki top padding barha di hai taake content neechay shift ho jaye
    <div className="pt-32 md:pt-40 min-h-screen bg-gray-50 pb-20 flex items-center justify-center relative">
      
      {/* Black section ko absolute rakha hai lekin top-20 ya top-24 se neechay kar diya hai */}
      <section className="bg-stone-900 py-12 w-full absolute top-15 md:top-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">تأكيد الحجز</h1>
          <p className="text-stone-400 text-base">شكراً لاختيارك خدماتنا</p>
        </div>
      </section>

      <div
        className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-xl border border-gray-100 mt-12 relative z-10"
      >
        <div
          className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <CheckCircle size={40} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
          تم استلام طلب حجزك بنجاح
        </h2>

        <p className="text-gray-600 mb-2">
          شكراً لك يا <strong>{bookingData.name || "عميلنا العزيز"}</strong>!
        </p>

        <p className="text-gray-500 text-sm mb-8">
          سيتواصل معك فريقنا على الرقم{" "}
          <strong>{bookingData.phone || ""}</strong> لتأكيد الحجز في أقرب وقت.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-gray-600">
            يمكنك متابعة حالة حجزك من خلال بريدك الإلكتروني أو بالاتصال بنا مباشرة.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("lastBooking");
              navigate("/booking");
            }}
            className="block w-full py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md text-base cursor-pointer"
          >
            حجز جديد
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("lastBooking");
              navigate("/");
            }}
            className="block w-full py-3.5 rounded-xl font-bold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}