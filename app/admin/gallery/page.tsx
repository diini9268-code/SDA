import Link from "next/link";
import { CalendarDays, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { DirectMediaUpload } from "@/app/admin/_components/direct-media-upload";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
  updateGalleryItemAction,
} from "@/app/admin/gallery/actions";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import type { ArchiveRecord } from "@/lib/archive/archive-service";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const fieldClass =
  "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] outline-none focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function dateInput(value?: Date): string {
  return value ? value.toISOString().slice(0, 10) : "";
}

function GalleryForm({
  item,
}: {
  item?: ArchiveRecord;
}) {
  const media = item?.media?.[0]?.asset;
  return (
    <form
      action={
        item
          ? updateGalleryItemAction.bind(null, item.id)
          : createGalleryItemAction
      }
      className="grid gap-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Activity title
          <input name="title" required maxLength={220} defaultValue={item?.title} className={fieldClass} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Activity date
          <input name="activityDate" type="date" required defaultValue={dateInput(item?.activityDate)} className={fieldClass} />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Summary
        <textarea name="summary" required rows={4} maxLength={5000} defaultValue={item?.summary} className={`${fieldClass} py-3`} />
      </label>
      <DirectMediaUpload
        destination="archive"
        assetName="mediaAssetId"
        urlName="imageUrl"
        label="Activity image"
        initialAsset={media}
        initialUrl={item?.images[0]}
      />
      <div className="flex flex-wrap gap-3">
        <SubmitButton className="min-h-11 bg-[#1f78b4] px-6 hover:bg-[#155f91]">
          {item ? "Save gallery item" : "Create gallery item"}
        </SubmitButton>
        <Link href="/admin/gallery" className="inline-flex min-h-11 items-center px-4 font-semibold text-[#52657c]">Cancel</Link>
      </div>
    </form>
  );
}

export default async function GalleryAdminPage({ searchParams }: Props) {
  const session = await requireAdminPageSession();
  const params = (await searchParams) ?? {};
  const items = await prismaArchiveRepository.listAll();
  const editId = first(params.edit);
  const editing = items.find((item) => item.id === editId);
  const showForm = first(params.create) === "1" || Boolean(editing);
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d]">
      <header className="border-b border-[#dfe5eb] bg-white">
        <div className="mx-auto flex min-h-[88px] max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <AdminBrand />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Activity Gallery</h1>
              <p className="text-sm text-[#52657c]">Images published on the About page</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden rounded-[8px] border border-[#d5dee6] px-4 py-2 text-sm font-semibold sm:block">Dashboard</Link>
            <span className="hidden text-sm font-semibold md:block">{adminName}</span>
            <LogoutButton compact />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1600px] gap-6 p-5 sm:p-8">
        {first(params.error) ? <p className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-red-800" role="alert">{first(params.error)}</p> : null}
        {first(params.success) ? <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-800" role="status">{first(params.success)}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Published activity images</h2>
            <p className="mt-1 text-sm text-[#718196]">{items.length} gallery records</p>
          </div>
          <Link href={showForm ? "/admin/gallery" : "/admin/gallery?create=1"} className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white">
            {showForm ? <X className="size-5" /> : <Plus className="size-5" />}
            {showForm ? "Close form" : "Add image"}
          </Link>
        </div>
        {showForm ? (
          <section className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-7">
            <h2 className="text-xl font-bold">{editing ? `Edit ${editing.title}` : "Add gallery image"}</h2>
            <div className="mt-6"><GalleryForm item={editing} /></div>
          </section>
        ) : null}
        <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white">
          {items.length ? (
            <div className="grid gap-px bg-[#dfe5eb] sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const image = item.media?.[0]?.asset.url ?? item.images[0];
                return (
                  <article key={item.id} className="bg-white p-5">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] bg-[#e7f1f8]">
                      {image ? <OptimizedFillImage src={image} alt={item.title} className="size-full object-cover" sizes="(min-width: 1280px) 33vw, 50vw" /> : null}
                    </div>
                    <h3 className="mt-4 font-bold">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[#52657c]">{item.summary}</p>
                    <p className="mt-3 flex items-center gap-2 text-xs text-[#718196]"><CalendarDays className="size-4" />{item.activityDate.toLocaleDateString()}</p>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/admin/gallery?edit=${item.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-[#ced9e3] px-3 text-sm font-semibold"><Pencil className="size-4" /> Edit</Link>
                      <form action={deleteGalleryItemAction.bind(null, item.id)}>
                        <button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-red-200 px-3 text-sm font-semibold text-red-700"><Trash2 className="size-4" /> Delete</button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="p-12 text-center text-[#52657c]">No administrator-managed gallery images yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
