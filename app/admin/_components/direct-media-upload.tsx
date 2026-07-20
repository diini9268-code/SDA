"use client";

import { ImageIcon, RefreshCw, UploadCloud, X } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { validateUploadMetadata } from "@/lib/blog/media-file-validation";
import type { SharedMediaDestination } from "@/lib/media/media-service";

type MediaAssetValue = {
  id: string;
  url: string;
  originalName: string;
  altText: string | null;
  mimeType: string;
  sizeBytes: number;
};

type SignedUpload = {
  path: string;
  signedUrl: string;
};

type DirectMediaUploadProps = {
  destination: SharedMediaDestination;
  assetName: string;
  urlName: string;
  label: string;
  initialAsset?: MediaAssetValue | null;
  initialUrl?: string | null;
  imagesOnly?: boolean;
};

function formatBytes(value: number): string {
  return value < 1024 * 1024
    ? `${Math.max(1, Math.round(value / 1024))} KB`
    : `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

async function responseError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? `Upload failed with status ${response.status}.`;
}

function uploadToSignedUrl(
  upload: SignedUpload,
  file: File,
  onProgress: (value: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const body = new FormData();
    body.append("cacheControl", "31536000");
    body.append("", file);
    request.open("PUT", upload.signedUrl);
    request.setRequestHeader("x-upsert", "false");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Storage rejected the file with status ${request.status}.`));
      }
    });
    request.addEventListener("error", () =>
      reject(new Error("The upload was interrupted.")),
    );
    request.send(body);
  });
}

export function DirectMediaUpload({
  destination,
  assetName,
  urlName,
  label,
  initialAsset,
  initialUrl,
  imagesOnly = true,
}: DirectMediaUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [asset, setAsset] = useState<MediaAssetValue | null>(
    initialAsset ?? null,
  );
  const [legacyUrl, setLegacyUrl] = useState(initialUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState(
    initialAsset?.url ?? initialUrl ?? "",
  );
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setError("");
    const validated = validateUploadMetadata({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    if (imagesOnly && !validated.data.type.startsWith("image/")) {
      setError(`${file.name} must be an image.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setProgress(0);

    try {
      const signResponse = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          destination,
        }),
      });

      if (!signResponse.ok) {
        throw new Error(await responseError(signResponse));
      }

      const signed = (await signResponse.json()) as SignedUpload;
      await uploadToSignedUrl(signed, file, setProgress);
      const finalizeResponse = await fetch("/api/admin/media/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validated.data,
          path: signed.path,
          destination,
          altText: "",
        }),
      });

      if (!finalizeResponse.ok) {
        throw new Error(await responseError(finalizeResponse));
      }

      const result = (await finalizeResponse.json()) as {
        asset: MediaAssetValue;
      };
      setAsset(result.asset);
      setLegacyUrl(result.asset.url);
      setPreviewUrl(result.asset.url);
      setProgress(null);
    } catch (uploadError) {
      setProgress(null);
      setPreviewUrl(asset?.url ?? legacyUrl);
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      URL.revokeObjectURL(localPreview);
    }
  }

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void upload(file);
    event.target.value = "";
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void upload(file);
  }

  function clear() {
    setAsset(null);
    setLegacyUrl("");
    setPreviewUrl("");
    setError("");
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold">{label}</legend>
      <input name={assetName} type="hidden" value={asset?.id ?? ""} />
      <input name={urlName} type="hidden" value={legacyUrl} />
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={imagesOnly ? ".jpg,.jpeg,.png,.webp,.gif,image/*" : undefined}
        className="sr-only"
        onChange={chooseFiles}
      />
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={`grid min-h-40 place-items-center rounded-[8px] border border-dashed p-4 transition ${
          dragging
            ? "border-[#1f78b4] bg-[#eaf5fc]"
            : "border-[#b8c9d8] bg-[#f6f9fc]"
        }`}
      >
        {previewUrl ? (
          <div className="flex w-full items-center gap-4">
            <span className="relative block size-24 shrink-0 overflow-hidden rounded-[8px] bg-[#e7f1f8]">
              {/* Admin previews include local object URLs and should not be optimized. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="size-full object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {asset?.originalName ?? "Current image"}
              </p>
              {asset ? (
                <p className="mt-1 text-sm text-[#718196]">
                  {formatBytes(asset.sizeBytes)}
                </p>
              ) : null}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-[#ced9e3] bg-white px-3 text-sm font-semibold text-[#1f78b4]"
                >
                  <RefreshCw className="size-4" /> Replace
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
                >
                  <X className="size-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="grid place-items-center gap-2 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-[#e7f1f8] text-[#1f78b4]">
              <UploadCloud className="size-6" />
            </span>
            <span className="font-semibold">Drop an image here or browse</span>
            <span className="text-sm font-normal text-[#718196]">
              JPG, PNG, WebP, or GIF. Maximum 10 MB.
            </span>
          </button>
        )}
      </div>
      {progress != null ? (
        <div className="grid gap-1" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-[#dfe8f0]">
            <span
              className="block h-full bg-[#1f78b4] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[#52657c]">Uploading {progress}%</span>
        </div>
      ) : null}
      {error ? (
        <p className="flex items-center gap-2 text-sm text-red-700" role="alert">
          <ImageIcon className="size-4" /> {error}
        </p>
      ) : null}
    </fieldset>
  );
}
