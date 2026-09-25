import type { AxialCoordinate, ResearchCluster } from "./types";

// A flat-top regular hexagon: width = 2 × side and height = √3 × side.
export const HEX_SIDE = 70;
export const HEX_WIDTH = HEX_SIDE * 2;
export const HEX_HEIGHT = Math.sqrt(3) * HEX_SIDE;

export const NETWORK_CANVAS = { width: 1420, height: 820 };

export function flatTopPosition(
  origin: { x: number; y: number },
  coordinate: AxialCoordinate
) {
  return {
    x: origin.x + HEX_SIDE * 1.5 * coordinate.q,
    y: origin.y + HEX_HEIGHT * (coordinate.r + coordinate.q / 2),
  };
}

export const researchClusters: ResearchCluster[] = [
  {
    id: "catalysis",
    title: "Catalysis & Synthesis",
    origin: { x: 100, y: 190 },
    nodes: [
      { id: "catalysis-research", type: "research", label: "Catalysis & Synthesis", q: 0, r: 0 },
      { id: "catalysis-faculty", type: "role", label: "Faculty", variant: "faculty", q: -1, r: 0 },
      { id: "catalysis-postdoc", type: "role", label: "Postdoc", variant: "postdoc", q: -1, r: 1 },
      { id: "catalysis-empty", type: "empty", q: 0, r: 1 },
    ],
  },
  {
    id: "electrochemistry",
    title: "Electrochemistry",
    origin: { x: 380, y: 490 },
    nodes: [
      { id: "electrochemistry-research", type: "research", label: "Electrochemistry", q: 0, r: 0 },
      { id: "electrochemistry-msc", type: "role", label: "MSc", variant: "msc", q: -1, r: 0 },
      { id: "electrochemistry-phd", type: "role", label: "PhD", variant: "phd", q: -1, r: 1 },
      { id: "electrochemistry-empty", type: "empty", q: 0, r: 1 },
    ],
  },
  {
    id: "atmospheric",
    title: "Atmospheric Chemistry",
    origin: { x: 770, y: 100 },
    nodes: [
      { id: "atmospheric-research", type: "research", label: "Atmospheric Chemistry", q: 0, r: 0 },
      { id: "atmospheric-postdoc", type: "role", label: "Postdoc", variant: "postdoc", q: -1, r: 0 },
      { id: "atmospheric-phd", type: "role", label: "PhD", variant: "phd", q: -1, r: 1 },
      { id: "atmospheric-empty", type: "empty", q: 0, r: 1 },
    ],
  },
  {
    id: "hydrometallurgy",
    title: "Hydrometallurgy",
    origin: { x: 1000, y: 450 },
    nodes: [
      { id: "hydrometallurgy-research", type: "research", label: "Hydrometallurgy", q: 0, r: 0 },
      { id: "hydrometallurgy-intern", type: "role", label: "Intern", variant: "intern", q: -1, r: 0 },
      { id: "hydrometallurgy-msc", type: "role", label: "MSc", variant: "msc", q: -1, r: 1 },
      { id: "hydrometallurgy-empty", type: "empty", q: 0, r: 1 },
    ],
  },
];

// Only these separated cluster bonds need SVG lines; touching neighbours use axial geometry.
export const intentionalBonds: Array<[string, string]> = [
  ["catalysis-research", "electrochemistry-research"],
  ["catalysis-research", "atmospheric-research"],
  ["atmospheric-research", "hydrometallurgy-research"],
];

export function personCoordinate(index: number): AxialCoordinate {
  const rows = [-1, 0, 1] as const;
  return { q: 1 + Math.floor(index / rows.length), r: rows[index % rows.length] };
}
