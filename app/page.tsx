import HoneycombNetwork from "@/components/HoneycombNetwork";
import type { Person, PersonAcf } from "@/components/research-network/types";
import { normalizeWordPressUrl } from "@/lib/wordpress";

const wordpressBaseUrl =
  process.env.WORDPRESS_API_URL ?? "http://localhost:8080";

type PeopleResult = {
  people: Person[];
  unavailable: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeAcf(value: unknown): PersonAcf {
  const acf = asRecord(value);
  if (!acf) return {};

  return {
    role: asText(acf.role),
    research_area: asText(acf.research_area),
    qualifications: asText(acf.qualifications),
    email: asText(acf.email),
    short_bio: asText(acf.short_bio),
    honeycomb_group: asText(acf.honeycomb_group),
    display_order: asNumber(acf.display_order),
    active: acf.active === true,
    orcid: asText(acf.orcid),
  };
}

function normalizePerson(value: unknown): Person | null {
  const item = asRecord(value);
  if (!item || typeof item.id !== "number") return null;
  const title = asRecord(item.title);
  const embedded = asRecord(item._embedded);
  const media = embedded && Array.isArray(embedded["wp:featuredmedia"])
    ? embedded["wp:featuredmedia"]
      .map(asRecord)
      .filter((entry): entry is Record<string, unknown> => entry !== null)
      .map((entry) => ({
        source_url: normalizeWordPressUrl(asText(entry.source_url)) ?? "",
      }))
    : undefined;

  return {
    id: item.id,
    slug: asText(item.slug),
    title: { rendered: asText(title?.rendered) },
    acf: normalizeAcf(item.acf),
    _embedded: media ? { "wp:featuredmedia": media } : undefined,
  };
}

async function getPeople(): Promise<PeopleResult> {
  try {
    const response = await fetch(
      `${wordpressBaseUrl}/?rest_route=/wp/v2/people&_embed&per_page=100`,
      {
        cache: "no-store",
      }
    ); if (!response.ok) return { people: [], unavailable: true };

    const payload: unknown = await response.json();
    const people = Array.isArray(payload)
      ? payload.map(normalizePerson).filter((person): person is Person => person !== null)
      : [];

    return { people, unavailable: false };
  } catch {
    return { people: [], unavailable: true };
  }
}

export default async function Home() {
  const { people, unavailable } = await getPeople();

  return (
    <main className="page-shell">
      <section className="hero-copy">
        <p className="eyebrow">Chemistry Department</p>
        <h1>Research Community</h1>
        <p>Explore faculty, researchers, postdoctoral fellows, PhD and MSc students across the department&apos;s research areas.</p>
      </section>
      <HoneycombNetwork people={people} dataUnavailable={unavailable} />
    </main>
  );
}
