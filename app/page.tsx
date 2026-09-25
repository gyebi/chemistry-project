import HoneycombNetwork from "@/components/HoneycombNetwork";

export type Person = {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  acf: {
    role: string;
    research_area: string;
    qualifications: string;
    email: string;
    short_bio: string;
    honeycomb_group: string;
    display_order: number;
    active: boolean;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
};

async function getPeople(): Promise<Person[]> {
  const response = await fetch(
    "http://localhost:8080/?rest_route=/wp/v2/people&_embed&per_page=100",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch people");
  }

  return response.json();
}

export default async function Home() {
  const people = await getPeople();

  return (
    <main className="page-shell">
      <section className="hero-copy">
        <p className="eyebrow">Chemistry Department</p>

        <h1>Research Community</h1>

        <p>
          Explore faculty, researchers, postdoctoral fellows, PhD and MSc
          students across the department&apos;s research areas.
        </p>
      </section>

      <HoneycombNetwork people={people} />
    </main>
  );
}