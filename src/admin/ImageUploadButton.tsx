import { useRef } from "react";
import { Upload } from "lucide-react";
import { readFileAsDataURL } from "./utils/helpers";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  onUpload: (url: string) => void;
  small?: boolean;
}

export default function ImageUploadButton({ onUpload, small }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { isEnglish } = useLanguage();

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    uploadImage: isEnglish ? "Upload Image" : "رفع صورة",
    changeImage: isEnglish ? "Change Image" : "تغيير الصورة",
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    onUpload(url);
    e.target.value = "";
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-1.5 bg-white border-2 border-dashed border-[hsl(40,88%,52%)] text-[hsl(22,85%,18%)] font-bold rounded-lg hover:bg-[hsl(40,88%,97%)] transition-colors ${
          small ? "text-xs px-2.5 py-1.5" : "text-sm px-3 py-2"
        }`}
      >
        <Upload size={small ? 12 : 14} />
        {small ? t.changeImage : t.uploadImage}
      </button>
    </>
  );
}