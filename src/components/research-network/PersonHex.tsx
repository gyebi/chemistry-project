import Image from "next/image";
import type { Person } from "./types";

type PersonHexProps = {
  person: Person;
  onSelect: (person: Person) => void;
};

export default function PersonHex({ person, onSelect }: PersonHexProps) {
  const name = person.title.rendered || "Researcher";
  const imageUrl = person._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <button
      className="hex-button person-hex"
      type="button"
      onClick={() => onSelect(person)}
      aria-label={`Open profile for ${name}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="140px"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="person-hex-fallback" aria-hidden="true">
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <span className="person-name">{name}</span>
    </button>
  );
}
