import HexagonPerson from "./HexagonPerson";

type Person = {
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

type HoneycombNetworkProps = {
  people: Person[];
};

type LayoutNode =
  | {
      id: string;
      type: "person";
      personIndex: number;
      x: number;
      y: number;
    }
  | {
      id: string;
      type: "role";
      label: string;
      x: number;
      y: number;
      variant: "phd" | "msc" | "postdoc";
    }
  | {
      id: string;
      type: "research";
      label: string;
      x: number;
      y: number;
    }
  | {
      id: string;
      type: "empty";
      x: number;
      y: number;
    };

const nodes: LayoutNode[] = [
  // Cluster 1
  { id: "p1", type: "person", personIndex: 0, x: 70, y: 80 },
  { id: "postdoc1", type: "role", label: "Postdoc", x: 165, y: 135, variant: "postdoc" },
  { id: "p2", type: "person", personIndex: 1, x: 260, y: 80 },
  { id: "phd1", type: "role", label: "PhD", x: 260, y: 190, variant: "phd" },
  { id: "p3", type: "person", personIndex: 2, x: 355, y: 135 },
  {
    id: "research1",
    type: "research",
    label: "Catalysis &\nSynthesis",
    x: 450,
    y: 190,
  },

  // connector / lattice
  { id: "e1", type: "empty", x: 545, y: 135 },
  { id: "e2", type: "empty", x: 640, y: 190 },

  // Cluster 2
  { id: "p4", type: "person", personIndex: 3, x: 735, y: 135 },
  { id: "msc1", type: "role", label: "MSc", x: 830, y: 190, variant: "msc" },
  { id: "p5", type: "person", personIndex: 4, x: 925, y: 135 },

  // lower branch
  {
    id: "research2",
    type: "research",
    label: "Electro-\nchemistry",
    x: 355,
    y: 300,
  },
  { id: "p6", type: "person", personIndex: 5, x: 450, y: 355 },
  { id: "phd2", type: "role", label: "PhD", x: 545, y: 300, variant: "phd" },
];

const connections = [
  ["p1", "postdoc1"],
  ["postdoc1", "p2"],
  ["p2", "phd1"],
  ["phd1", "p3"],
  ["p3", "research1"],
  ["research1", "e1"],
  ["e1", "e2"],
  ["e2", "p4"],
  ["p4", "msc1"],
  ["msc1", "p5"],
  ["p3", "research2"],
  ["research2", "p6"],
  ["p6", "phd2"],
];

function getNode(id: string) {
  return nodes.find((node) => node.id === id);
}

export default function HoneycombNetwork({
  people,
}: HoneycombNetworkProps) {
  const activePeople = people
    .filter((person) => person.acf.active)
    .sort(
      (a, b) =>
        (a.acf.display_order ?? 999) -
        (b.acf.display_order ?? 999)
    );

  return (
    <section className="network-shell">
      <div className="network-canvas">
        <svg
          className="network-lines"
          viewBox="0 0 1100 520"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connections.map(([fromId, toId]) => {
            const from = getNode(fromId);
            const to = getNode(toId);

            if (!from || !to) return null;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x + 70}
                y1={from.y + 80}
                x2={to.x + 70}
                y2={to.y + 80}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          if (node.type === "person") {
            const person = activePeople[node.personIndex];

            if (!person) return null;

            const imageUrl =
              person._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <div
                key={node.id}
                className="network-node"
                style={{
                  left: node.x,
                  top: node.y,
                }}
              >
                <HexagonPerson
                  name={person.title.rendered}
                  role={person.acf.role}
                  researchArea={person.acf.research_area}
                  imageUrl={imageUrl}
                />
              </div>
            );
          }

          if (node.type === "role") {
            return (
              <div
                key={node.id}
                className={`network-node chemistry-node role-node ${node.variant}`}
                style={{
                  left: node.x,
                  top: node.y,
                }}
              >
                <span>{node.label}</span>
              </div>
            );
          }

          if (node.type === "research") {
            return (
              <div
                key={node.id}
                className="network-node chemistry-node research-node"
                style={{
                  left: node.x,
                  top: node.y,
                }}
              >
                <span>
                  {node.label.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>
              </div>
            );
          }

          return (
            <div
              key={node.id}
              className="network-node chemistry-node empty-node"
              style={{
                left: node.x,
                top: node.y,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}