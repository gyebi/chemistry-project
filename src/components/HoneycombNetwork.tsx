"use client";

import { useMemo, useState } from "react";
import EmptyHex from "./research-network/EmptyHex";
import PersonDetailPanel from "./research-network/PersonDetailPanel";
import PersonHex from "./research-network/PersonHex";
import ResearchHex from "./research-network/ResearchHex";
import RoleHex from "./research-network/RoleHex";
import {
  HEX_HEIGHT,
  HEX_WIDTH,
  NETWORK_CANVAS,
  flatTopPosition,
  intentionalBonds,
  personCoordinate,
  researchClusters,
} from "./research-network/networkLayout";
import type { NetworkNode, Person } from "./research-network/types";

type HoneycombNetworkProps = {
  people: Person[];
  dataUnavailable?: boolean;
};

const clusterIds = researchClusters.map((cluster) => cluster.id);

function clusterForPerson(person: Person, index: number) {
  const researchText = `${person.acf.honeycomb_group ?? ""} ${person.acf.research_area ?? ""}`.toLowerCase();

  if (researchText.includes("electro")) return "electrochemistry";
  if (researchText.includes("atmos")) return "atmospheric";
  if (researchText.includes("hydro") || researchText.includes("metal")) return "hydrometallurgy";
  if (researchText.includes("catal") || researchText.includes("synth")) return "catalysis";

  return clusterIds[index % clusterIds.length];
}

function buildNodes(people: Person[]) {
  const staticNodes = researchClusters.flatMap((cluster) =>
    cluster.nodes.map((node) => ({ ...node, ...flatTopPosition(cluster.origin, node) }))
  );
  const counts = new Map<string, number>();

  const personNodes = people.map((person, index) => {
    const clusterId = clusterForPerson(person, index);
    const cluster = researchClusters.find((item) => item.id === clusterId) ?? researchClusters[0];
    const personIndex = counts.get(cluster.id) ?? 0;
    counts.set(cluster.id, personIndex + 1);
    const coordinate = personCoordinate(personIndex);

    return {
      id: `person-${person.id}`,
      type: "person" as const,
      person,
      q: coordinate.q,
      r: coordinate.r,
      ...flatTopPosition(cluster.origin, coordinate),
    };
  });

  return [...staticNodes, ...personNodes];
}

function centerOf(node: { x: number; y: number }) {
  return { x: node.x + HEX_WIDTH / 2, y: node.y + HEX_HEIGHT / 2 };
}

export default function HoneycombNetwork({ people, dataUnavailable = false }: HoneycombNetworkProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const activePeople = useMemo(
    () =>
      people
        .filter((person) => person.acf.active === true)
        .sort((first, second) => (first.acf.display_order ?? Number.MAX_SAFE_INTEGER) - (second.acf.display_order ?? Number.MAX_SAFE_INTEGER)),
    [people]
  );
  const nodes = useMemo(() => buildNodes(activePeople), [activePeople]);
  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <section className="network-section" aria-labelledby="network-title">
      <div className="network-heading">
        <p className="eyebrow">Research map</p>
        <h2 id="network-title">A connected community of chemical research</h2>
      </div>
      {dataUnavailable && <p className="network-notice" role="status">Researcher profiles are temporarily unavailable. The research map will return when the CMS connection is restored.</p>}
      {!dataUnavailable && activePeople.length === 0 && <p className="network-notice" role="status">Researcher profiles will appear here as they are published in the department CMS.</p>}
      <div className="network-shell" tabIndex={0} aria-label="Scrollable research community map">
        <div className="network-canvas" style={{ width: NETWORK_CANVAS.width, height: NETWORK_CANVAS.height }}>
          <svg className="network-lines" viewBox={`0 0 ${NETWORK_CANVAS.width} ${NETWORK_CANVAS.height}`} aria-hidden="true">
            {intentionalBonds.map(([fromId, toId]) => {
              const from = nodesById.get(fromId);
              const to = nodesById.get(toId);
              if (!from || !to) return null;
              const start = centerOf(from);
              const end = centerOf(to);
              return <line key={`${fromId}-${toId}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
            })}
          </svg>
          {nodes.map((node) => (
            <div key={node.id} className="network-node" style={{ left: node.x, top: node.y }}>
              <NetworkNodeView node={node} onSelectPerson={setSelectedPerson} />
            </div>
          ))}
        </div>
      </div>
      <PersonDetailPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </section>
  );
}

function NetworkNodeView({ node, onSelectPerson }: { node: NetworkNode & { x: number; y: number }; onSelectPerson: (person: Person) => void }) {
  switch (node.type) {
    case "person":
      return <PersonHex person={node.person} onSelect={onSelectPerson} />;
    case "role":
      return <RoleHex label={node.label} variant={node.variant} />;
    case "research":
      return <ResearchHex label={node.label} />;
    case "empty":
      return <EmptyHex />;
  }
}
