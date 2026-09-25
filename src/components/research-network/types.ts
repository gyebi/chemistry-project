export type PersonAcf = {
  role?: string;
  research_area?: string;
  qualifications?: string;
  email?: string;
  short_bio?: string;
  honeycomb_group?: string;
  display_order?: number;
  active?: boolean;
  orcid?: string;
};

export type Person = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: PersonAcf;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
};

export type RoleVariant = "faculty" | "postdoc" | "phd" | "msc" | "intern";
export type NetworkNodeType = "person" | "role" | "research" | "empty";

export type AxialCoordinate = {
  q: number;
  r: number;
};

type BaseNetworkNode = AxialCoordinate & {
  id: string;
  type: NetworkNodeType;
};

export type PersonNode = BaseNetworkNode & {
  type: "person";
  person: Person;
};

export type RoleNode = BaseNetworkNode & {
  type: "role";
  label: string;
  variant: RoleVariant;
};

export type ResearchNode = BaseNetworkNode & {
  type: "research";
  label: string;
};

export type EmptyNode = BaseNetworkNode & {
  type: "empty";
};

export type NetworkNode = PersonNode | RoleNode | ResearchNode | EmptyNode;

export type ResearchCluster = {
  id: string;
  title: string;
  origin: { x: number; y: number };
  nodes: Array<Exclude<NetworkNode, PersonNode>>;
};
