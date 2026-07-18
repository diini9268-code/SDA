"use client";

import Link from "next/link";
import {
  FileText,
  ImageIcon,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  BLOG_MEDIA_ACCEPT,
  BLOG_MEDIA_MAX_FILES,
} from "@/lib/blog/media-constants";
import { validateUploadMetadata } from "@/lib/blog/media-file-validation";
import type { BlogStatusValue } from "@/lib/blog/validation";

export type BlogFormInitialData = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  status: BlogStatusValue;
  media: Array<{
    id: string;
    url: string;
    altText: string;
    mimeType: string;
    sizeBytes: number | null;
  }>;
};

type SelectedMedia = {
  id: string;
  file: File;
  altText: string;
  previewUrl: string | null;
};

type ExistingMedia = BlogFormInitialData["media"][number];

type SignedUpload = {
  path: string;
  signedUrl: string;
};

const statuses: BlogStatusValue[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const fieldClass =
  "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

function statusLabel(status: BlogStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function formatBytes(value: number | null): string {
  if (value == null) {
    return "Size unavailable";
  }

  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function createSelectedMedia(file: File): SelectedMedia {
  return {
    id: crypto.randomUUID(),
    file,
    altText: "",
    previewUrl: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null,
  };
}

async function readResponseError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? `Request failed with status ${response.status}.`;
}

function uploadToSignedUrl(
  upload: SignedUpload,
  file: File,
  onProgress: (progress: number) => void,
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
        reject(
          new Error(
            `Storage rejected ${file.name} with status ${request.status}.`,
          ),
        );
      }
    });
    request.addEventListener("error", () => {
      reject(new Error(`The upload for ${file.name} was interrupted.`));
    });
    request.addEventListener("abort", () => {
      reject(new Error(`The upload for ${file.name} was cancelled.`));
    });
    request.send(body);
  });
}

function MediaPreview({
  source,
  mimeType,
  alt,
}: {
  source: string | null;
  mimeType: string;
  alt: string;
}) {
  if (!source || mimeType === "application/pdf") {
    return (
      <span className="flex size-full items-center justify-center bg-[#eef3f8] text-[#62758d]">
        <FileText className="size-9" aria-hidden="true" />
      </span>
    );
  }

  return (
    // Local object URLs and authenticated admin previews should not use image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={alt}
      className="size-full object-cover"
      loading="lazy"
    />
  );
}

export function BlogForm({
  initialData,
}: {
  initialData?: BlogFormInitialData;
}) {
  const router = useRouter();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<SelectedMedia[]>([]);
  const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>(
    initialData?.media ?? [],
  );
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const totalMedia = existingMedia.length + selectedMedia.length;

  useEffect(() => {
    selectedRef.current = selectedMedia;
  }, [selectedMedia]);

  useEffect(
    () => () => {
      selectedRef.current.forEach((media) => {
        if (media.previewUrl) {
          URL.revokeObjectURL(media.previewUrl);
        }
      });
    },
    [],
  );

  const defaultPublicationDate = useMemo(
    () => initialData?.publishedAt ?? new Date().toISOString().slice(0, 10),
    [initialData?.publishedAt],
  );

  function addFiles(files: File[]) {
    setError(null);
    const availableSlots =
      BLOG_MEDIA_MAX_FILES - existingMedia.length - selectedMedia.length;

    if (files.length > availableSlots) {
      setError(
        `A blog post can have at most ${BLOG_MEDIA_MAX_FILES} media attachments.`,
      );
      return;
    }

    const additions: SelectedMedia[] = [];

    for (const file of files) {
      const result = validateUploadMetadata({
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!result.ok) {
        additions.forEach((media) => {
          if (media.previewUrl) URL.revokeObjectURL(media.previewUrl);
        });
        setError(result.error);
        return;
      }

      additions.push(createSelectedMedia(file));
    }

    setSelectedMedia((current) => [...current, ...additions]);
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeSelected(id: string) {
    setSelectedMedia((current) => {
      const removed = current.find((media) => media.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((media) => media.id !== id);
    });
  }

  function replaceSelected(id: string, file: File | undefined) {
    if (!file) return;
    const result = validateUploadMetadata({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    setSelectedMedia((current) =>
      current.map((media) => {
        if (media.id !== id) return media;
        if (media.previewUrl) URL.revokeObjectURL(media.previewUrl);
        return {
          ...createSelectedMedia(file),
          id,
          altText: media.altText,
        };
      }),
    );
  }

  function replaceExisting(media: ExistingMedia, file: File | undefined) {
    if (!file) return;
    const result = validateUploadMetadata({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    setExistingMedia((current) =>
      current.filter((item) => item.id !== media.id),
    );
    setSelectedMedia((current) => [
      ...current,
      { ...createSelectedMedia(file), altText: media.altText },
    ]);
  }

  async function cleanupPending(paths: string[]) {
    if (paths.length === 0) return;
    await fetch("/api/admin/blog/media/cleanup", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    }).catch(() => null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    setError(null);
    setProgress(selectedMedia.length ? 1 : 85);
    setIsSubmitting(true);
    const uploadedPaths: string[] = [];

    try {
      const uploads = [];

      for (const [index, media] of selectedMedia.entries()) {
        const signResponse = await fetch("/api/admin/blog/media/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: media.file.name,
            type: media.file.type,
            size: media.file.size,
          }),
        });

        if (!signResponse.ok) {
          throw new Error(await readResponseError(signResponse));
        }

        const signed = (await signResponse.json()) as SignedUpload;
        uploadedPaths.push(signed.path);
        await uploadToSignedUrl(signed, media.file, (fileProgress) => {
          setProgress(
            Math.round(
              ((index + fileProgress / 100) /
                Math.max(1, selectedMedia.length)) *
                80,
            ),
          );
        });
        uploads.push({
          path: signed.path,
          name: media.file.name,
          type: media.file.type,
          size: media.file.size,
          altText: media.altText,
        });
      }

      const formData = new FormData(form);
      const payload = {
        title: String(formData.get("title") ?? ""),
        category: String(formData.get("category") ?? ""),
        excerpt: String(formData.get("excerpt") ?? ""),
        content: String(formData.get("content") ?? ""),
        publishedAt: String(formData.get("publishedAt") ?? ""),
        status: String(formData.get("status") ?? "DRAFT"),
        uploads,
        retainedMedia: existingMedia.map((media) => ({
          id: media.id,
          altText: media.altText,
        })),
      };
      setProgress(88);

      const response = await fetch(
        initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog",
        {
          method: initialData ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(await readResponseError(response));
      }

      setProgress(100);
      const message = initialData ? "Blog post updated." : "Blog post created.";
      router.push(`/admin/blog?success=${encodeURIComponent(message)}`);
      router.refresh();
    } catch (caughtError) {
      await cleanupPending(uploadedPaths);
      setProgress(0);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The blog post could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
        <label className="grid gap-2 text-sm font-semibold">
          Post title
          <input
            name="title"
            required
            maxLength={220}
            defaultValue={initialData?.title}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Category
          <input
            name="category"
            required
            maxLength={120}
            defaultValue={initialData?.category}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Excerpt
        <textarea
          name="excerpt"
          rows={2}
          maxLength={500}
          defaultValue={initialData?.excerpt}
          className={`${fieldClass} py-3`}
        />
        <span className="text-xs font-normal text-[#718196]">
          Optional summary, up to 500 characters.
        </span>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Content
        <textarea
          name="content"
          required
          rows={9}
          maxLength={20000}
          defaultValue={initialData?.content}
          className={`${fieldClass} py-3`}
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Publication date
          <input
            name="publishedAt"
            type="date"
            required
            defaultValue={defaultPublicationDate}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Status
          <select
            name="status"
            defaultValue={initialData?.status ?? "DRAFT"}
            className={fieldClass}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="grid gap-4">
        <legend className="text-sm font-semibold">Blog media</legend>
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          className={`rounded-[8px] border-2 border-dashed px-5 py-8 text-center transition-colors ${
            isDragging
              ? "border-[#1f78b4] bg-[#e7f1f8]"
              : "border-[#c8d4df] bg-[#f8fafc]"
          }`}
        >
          <UploadCloud
            className="mx-auto size-10 text-[#1f78b4]"
            aria-hidden="true"
          />
          <p className="mt-3 font-semibold text-[#0a294d]">
            Drag and drop files here
          </p>
          <p className="mt-1 text-sm text-[#718196]">
            JPG, PNG, WebP, GIF, or PDF. Up to 10 MB each and 10 files total.
          </p>
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={BLOG_MEDIA_ACCEPT}
            multiple
            onChange={handleFileSelection}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || totalMedia >= BLOG_MEDIA_MAX_FILES}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white transition hover:bg-[#155f91] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadCloud className="size-5" aria-hidden="true" />
            Upload image or file
          </button>
        </div>

        {totalMedia > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {existingMedia.map((media) => (
              <article
                key={media.id}
                className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-[8px] border border-[#dfe5eb] bg-white p-3"
              >
                <div className="h-[88px] overflow-hidden rounded-[6px]">
                  <MediaPreview
                    source={media.url}
                    mimeType={media.mimeType}
                    alt={media.altText || "Existing blog media"}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        Existing {media.mimeType.split("/")[1]?.toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-xs text-[#718196]">
                        {formatBytes(media.sizeBytes)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <label className="flex size-9 cursor-pointer items-center justify-center rounded-md text-[#62758d] hover:bg-[#e7f1f8] hover:text-[#1f78b4]">
                        <RefreshCw className="size-4" aria-hidden="true" />
                        <span className="sr-only">Replace existing media</span>
                        <input
                          type="file"
                          accept={BLOG_MEDIA_ACCEPT}
                          className="sr-only"
                          disabled={isSubmitting}
                          onChange={(event) => {
                            replaceExisting(media, event.target.files?.[0]);
                            event.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setExistingMedia((current) =>
                            current.filter((item) => item.id !== media.id),
                          )
                        }
                        disabled={isSubmitting}
                        className="flex size-9 items-center justify-center rounded-md text-[#62758d] hover:bg-red-50 hover:text-red-700"
                        aria-label="Remove existing media"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <input
                    value={media.altText}
                    onChange={(event) =>
                      setExistingMedia((current) =>
                        current.map((item) =>
                          item.id === media.id
                            ? { ...item, altText: event.target.value }
                            : item,
                        ),
                      )
                    }
                    maxLength={220}
                    placeholder="Alternative text"
                    aria-label="Alternative text for existing media"
                    className="mt-2 min-h-9 w-full rounded-md border border-[#ced9e3] px-3 text-sm outline-none focus:border-[#1f78b4]"
                  />
                </div>
              </article>
            ))}
            {selectedMedia.map((media) => (
              <article
                key={media.id}
                className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-[8px] border border-[#b9d5e7] bg-[#f8fbfd] p-3"
              >
                <div className="h-[88px] overflow-hidden rounded-[6px]">
                  <MediaPreview
                    source={media.previewUrl}
                    mimeType={media.file.type}
                    alt=""
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {media.file.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#718196]">
                        {formatBytes(media.file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelected(media.id)}
                      disabled={isSubmitting}
                      className="flex size-9 shrink-0 items-center justify-center rounded-md text-[#62758d] hover:bg-red-50 hover:text-red-700"
                      aria-label={`Remove ${media.file.name}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={media.altText}
                      onChange={(event) =>
                        setSelectedMedia((current) =>
                          current.map((item) =>
                            item.id === media.id
                              ? { ...item, altText: event.target.value }
                              : item,
                          ),
                        )
                      }
                      maxLength={220}
                      placeholder="Alternative text"
                      aria-label={`Alternative text for ${media.file.name}`}
                      className="min-h-9 min-w-0 flex-1 rounded-md border border-[#ced9e3] px-3 text-sm outline-none focus:border-[#1f78b4]"
                    />
                    <label className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#ced9e3] bg-white text-[#62758d] hover:border-[#1f78b4] hover:text-[#1f78b4]">
                      <RefreshCw className="size-4" aria-hidden="true" />
                      <span className="sr-only">Replace {media.file.name}</span>
                      <input
                        type="file"
                        accept={BLOG_MEDIA_ACCEPT}
                        className="sr-only"
                        disabled={isSubmitting}
                        onChange={(event) => {
                          replaceSelected(media.id, event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-[8px] border border-[#dfe5eb] bg-white px-4 py-3 text-sm text-[#718196]">
            <ImageIcon className="size-5" aria-hidden="true" />
            No media selected. The public blog will show its existing no-image
            state.
          </div>
        )}
      </fieldset>

      {error ? (
        <div
          role="alert"
          className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {isSubmitting ? (
        <div aria-live="polite" className="grid gap-2">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Uploading and saving</span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-[#dfe7ee]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span
              className="block h-full rounded-full bg-[#1f78b4] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-6 font-semibold text-white transition hover:bg-[#155f91] disabled:cursor-wait disabled:opacity-60"
        >
          <UploadCloud className="size-5" aria-hidden="true" />
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Create blog post"}
        </button>
        <Link
          href="/admin/blog"
          className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
