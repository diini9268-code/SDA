import Image from "next/image";

const LEGACY_ADMIN_PREFIXES = [
  ["S", "SDU"].join(""),
  ["Somali Student", "Diplomacy Union"].join(" "),
];

export function getAdminDisplayName(value?: string | null) {
  const name = value?.trim();

  if (!name) {
    return "Administrator";
  }

  return LEGACY_ADMIN_PREFIXES.some((prefix) => name.startsWith(prefix))
    ? "SDA Administrator"
    : name;
}

export function AdminBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-[8px] bg-white">
        <Image
          src="/official/sda-emblem.png"
          alt=""
          width={1200}
          height={1200}
          sizes="40px"
          className="h-full w-full object-contain"
        />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[16px] font-bold">SDA Admin</p>
        <p className="text-[13px] text-[#27b3f4]">Administrator</p>
      </div>
    </div>
  );
}
