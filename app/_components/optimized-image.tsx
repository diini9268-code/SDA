import Image from "next/image";

const optimizedImageHosts = new Set([
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  (() => {
    try {
      return process.env.SUPABASE_URL
        ? new URL(process.env.SUPABASE_URL).hostname
        : "";
    } catch {
      return "";
    }
  })(),
]);

function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" && optimizedImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export function OptimizedFillImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  loading,
}: OptimizedImageProps) {
  if (!canOptimizeImage(src)) {
    return (
      // Admin-entered URLs can point to hosts not known at build time.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : loading ?? "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : loading}
      className={className}
    />
  );
}
