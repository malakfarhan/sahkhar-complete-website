import sakhrIcon from "@assets/sakhr-icon.png";

export default function LogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={sakhrIcon}
      alt="شعار صخر"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
