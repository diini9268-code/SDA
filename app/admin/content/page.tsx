import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  ImageIcon,
  Save,
} from "lucide-react";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { DirectMediaUpload } from "@/app/admin/_components/direct-media-upload";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  savePartnerLogoAction,
  saveWebsiteContentAction,
} from "@/app/admin/content/actions";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import {
  getSiteCmsContent,
  type CmsSection,
} from "@/lib/site/cms-content";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const fieldClass =
  "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function initials(value: string): string {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD"
  );
}

function TextField({
  label,
  name,
  value,
  required = true,
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input name={name} required={required} defaultValue={value ?? ""} className={fieldClass} />
    </label>
  );
}

function TextArea({
  help,
  label,
  name,
  value,
  rows = 4,
}: {
  help?: string;
  label: string;
  name: string;
  value?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea
        name={name}
        required
        rows={rows}
        defaultValue={value ?? ""}
        className={`${fieldClass} py-3`}
      />
      {help ? <span className="font-normal text-[#718196]">{help}</span> : null}
    </label>
  );
}

function PageCopyFields({
  prefix,
  section,
}: {
  prefix: string;
  section: CmsSection;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Eyebrow" name={`${prefix}Eyebrow`} value={section.content.eyebrow} />
        <TextField label="Heading" name={`${prefix}Title`} value={section.content.title} />
      </div>
      <TextArea label="Description" name={`${prefix}Description`} value={section.content.description} rows={3} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Primary button label" name={`${prefix}PrimaryLabel`} value={section.content.primaryLabel} required={false} />
        <TextField label="Secondary button label" name={`${prefix}SecondaryLabel`} value={section.content.secondaryLabel} required={false} />
      </div>
    </div>
  );
}

function SectionCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-[#718196]">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function WebsiteContentPage({ searchParams }: PageProps) {
  const session = await requireAdminPageSession();
  const content = await getSiteCmsContent();
  const params = (await searchParams) ?? {};
  const adminName = getAdminDisplayName(session?.fullName);
  const global = content.global.content;

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d]">
      <header className="border-b border-[#dfe5eb] bg-white">
        <div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <AdminBrand />
            <span className="hidden h-10 w-px bg-[#dfe5eb] sm:block" />
            <div>
              <h1 className="text-[20px] font-bold">Website Content</h1>
              <p className="mt-1 text-[14px] text-[#52657c]">
                Edit public copy, navigation, partners, and key images
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden min-h-10 items-center gap-2 rounded-[8px] border border-[#d5dee6] px-4 text-sm font-semibold text-[#52657c] sm:inline-flex">
              <ArrowLeft className="size-4" /> Dashboard
            </Link>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>
              {initials(adminName)}
            </span>
            <LogoutButton compact />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-5 sm:p-8">
        {first(params.error) ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{first(params.error)}</div> : null}
        {first(params.success) ? <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{first(params.success)}</div> : null}

        <div className="rounded-[8px] border border-[#c9dce9] bg-[#eaf5fc] p-4 text-sm leading-6 text-[#174e73]">
          <p className="flex items-center gap-2 font-semibold"><Globe2 className="size-5" /> Published website content</p>
          <p className="mt-1">Saving publishes these fields to the public website and records a revision. Application forms, authentication, and dashboard data are not changed here.</p>
        </div>

        <form action={saveWebsiteContentAction} className="grid gap-6">
          <SectionCard title="Organization" description="Official identity and shared content used across public pages.">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Organization name" name="organizationName" value={global.organizationName} />
                <TextField label="Short name" name="shortName" value={global.shortName} />
                <TextField label="Motto" name="motto" value={global.motto} />
                <TextField label="Founded" name="founded" value={global.founded} />
                <TextField label="Location" name="location" value={global.location} />
              </div>
              <TextArea label="Mission" name="mission" value={global.mission} rows={5} />
              <DirectMediaUpload destination="site" assetName="globalHeroAssetId" urlName="globalLogoUrl" label="Official logo" initialAsset={content.global.media.hero} initialUrl="/official/sda-logo-mark.png" />
            </div>
          </SectionCard>

          <SectionCard title="Homepage" description="Main hero copy and background image. The current visual layout stays unchanged.">
            <div className="grid gap-6">
              <PageCopyFields prefix="home" section={content.home} />
              <DirectMediaUpload destination="site" assetName="homeHeroAssetId" urlName="homeHeroUrl" label="Homepage hero image" initialAsset={content.home.media.hero} initialUrl="/official/sda-official-venue-group.jpg" />
              <DirectMediaUpload destination="site" assetName="homeFeatureAssetId" urlName="homeFeatureUrl" label="Homepage membership call-to-action image" initialAsset={content.home.media.feature} initialUrl="/official/sda-workshop-provided.jpg" />
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="About page" description="About page introduction and hero image.">
              <div className="grid gap-6">
                <PageCopyFields prefix="about" section={content.about} />
                <DirectMediaUpload destination="site" assetName="aboutHeroAssetId" urlName="aboutHeroUrl" label="About hero image" initialAsset={content.about.media.hero} />
                <DirectMediaUpload destination="site" assetName="aboutFeatureAssetId" urlName="aboutFeatureUrl" label="About purpose image" initialAsset={content.about.media.feature} initialUrl="/official/sda-diplomacy-workshop.jpg" />
              </div>
            </SectionCard>
            <SectionCard title="Membership page" description="Membership introduction and optional hero image.">
              <div className="grid gap-6">
                <PageCopyFields prefix="membership" section={content.membership} />
                <DirectMediaUpload destination="site" assetName="membershipHeroAssetId" urlName="membershipHeroUrl" label="Membership hero image" initialAsset={content.membership.media.hero} />
              </div>
            </SectionCard>
            <SectionCard title="Blog page" description="Blog page introduction. Blog posts remain managed in the Blog module.">
              <PageCopyFields prefix="blog" section={content.blog} />
            </SectionCard>
            <SectionCard title="Leadership page" description="Leadership page introduction. Profiles remain managed in the Leadership module.">
              <PageCopyFields prefix="leadership" section={content.leadership} />
            </SectionCard>
          </div>

          <SectionCard title="Contact page" description="Contact page introduction and optional hero image.">
            <div className="grid gap-6">
              <PageCopyFields prefix="contact" section={content.contact} />
              <DirectMediaUpload destination="site" assetName="contactHeroAssetId" urlName="contactHeroUrl" label="Contact hero image" initialAsset={content.contact.media.hero} />
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Official lists" description="One entry per line. Membership categories use Title | Description.">
              <div className="grid gap-5">
                <TextArea label="Mission aims" name="missionAims" value={global.missionAims?.join("\n")} rows={7} />
                <TextArea label="Strategic objectives" name="objectives" value={global.objectives?.join("\n")} rows={8} />
                <TextArea
                  label="Values"
                  name="values"
                  value={(global.valueDetails ?? global.values?.map((title) => ({ title, description: "" })))
                    ?.map((item) => `${item.title} | ${item.description}`)
                    .join("\n")}
                  rows={10}
                  help="Format: Value title | Description"
                />
                <TextArea label="Membership categories" name="membershipCategories" value={global.membershipCategories?.map((item) => `${item.title} | ${item.description}`).join("\n")} rows={5} help="Format: Category title | Description" />
                <TextArea label="Membership requirements" name="membershipRequirements" value={global.membershipRequirements?.join("\n")} rows={6} />
              </div>
            </SectionCard>
            <SectionCard title="Navigation and partners" description="Reorder entries by moving lines. Links must be internal paths or HTTPS.">
              <div className="grid gap-5">
                <TextArea label="Header navigation" name="navigation" value={content.navigation.map((item) => `${item.label} | ${item.href}`).join("\n")} rows={9} help="Format: Label | /internal-path" />
                <TextArea label="Trusted partners" name="partners" value={content.partners.map((item) => item.website ? `${item.name} | ${item.website}` : item.name).join("\n")} rows={12} help="One name per line; optional website: Name | https://..." />
              </div>
            </SectionCard>
          </div>

          <div className="sticky bottom-4 z-10 flex justify-end rounded-[8px] border border-[#dfe5eb] bg-white/95 p-4 shadow-lg backdrop-blur">
            <SubmitButton className="min-h-12 bg-[#1f78b4] px-7 hover:bg-[#155f91]">
              <Save className="size-5" /> Publish website changes
            </SubmitButton>
          </div>
        </form>

        <SectionCard
          title="Partner logos"
          description="Upload or replace each trusted partner logo. Save the partner list above first when adding a new organization."
        >
          {content.partners.some((partner) => partner.id) ? (
            <div className="grid gap-5 md:grid-cols-2">
              {content.partners
                .filter((partner) => partner.id)
                .map((partner) => (
                  <form
                    key={partner.id}
                    action={savePartnerLogoAction.bind(null, partner.id!)}
                    className="grid gap-4 rounded-[8px] border border-[#dfe5eb] p-4"
                  >
                    <div>
                      <h3 className="font-bold">{partner.name}</h3>
                      <p className="mt-1 truncate text-xs text-[#718196]">
                        {partner.website ?? "No website link"}
                      </p>
                    </div>
                    <DirectMediaUpload
                      destination="site"
                      assetName="logoAssetId"
                      urlName="partnerLogoUrl"
                      label={`${partner.name} logo`}
                      initialAsset={partner.logoAsset}
                    />
                    <SubmitButton className="min-h-11 bg-[#1f78b4] px-5 hover:bg-[#155f91]">
                      <ImageIcon className="size-4" /> Save logo
                    </SubmitButton>
                  </form>
                ))}
            </div>
          ) : (
            <p className="rounded-[8px] border border-dashed border-[#b8c9d8] bg-[#f6f9fc] p-5 text-sm text-[#52657c]">
              Save the partner list to create editable partner records.
            </p>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
