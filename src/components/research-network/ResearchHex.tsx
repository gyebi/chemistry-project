type ResearchHexProps = { label: string };

export default function ResearchHex({ label }: ResearchHexProps) {
  return <div className="hex-surface research-hex">{label}</div>;
}
