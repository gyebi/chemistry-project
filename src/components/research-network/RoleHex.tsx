import type { RoleVariant } from "./types";

type RoleHexProps = { label: string; variant: RoleVariant };

export default function RoleHex({ label, variant }: RoleHexProps) {
  return <div className={`hex-surface role-hex role-${variant}`}>{label}</div>;
}
