import Image from "next/image";

const LEGACY_ADMIN_NAMES = new Set([
  "SSDU Administrator",
  "SSDU Sample Administrator",
  "Somali Student Diplomacy Union Administrator",
]);

export function getAdminDisplayName(value?: string | null) {
  const name = value?.trim();

  if (!name) {
    return "Administrator";
  }

  return LEGACY_ADMIN_NAMES.has(name) ? "SDA Administrator" : name;
}

export function AdminBrand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative size-12 shrink-0 overflow-hidden rounded-[8px] bg-white">
        <Image
          src="/official/sda-logo.png"
          alt=""
          width={180}
          height={180}
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-[40%] scale-[0.8]"
        />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-bold">SDA Admin</p>
        <p className="text-sm text-[#27b3f4]">Administrator</p>
      </div>
    </div>
  );
}
