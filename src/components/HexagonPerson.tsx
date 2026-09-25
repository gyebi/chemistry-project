type HexagonPersonProps = {
  name: string;
  role: string;
  researchArea: string;
  imageUrl?: string;
};

export default function HexagonPerson({
  name,
  role,
  researchArea,
  imageUrl,
}: HexagonPersonProps) {
  return (
    <article className="hex-card">
      <div className="hex-shape">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <div className="hex-placeholder">{name.charAt(0)}</div>
        )}
      </div>

      <div className="hex-info">
        <strong>{name}</strong>
        <span>{role}</span>
        <small>{researchArea}</small>
      </div>
    </article>
  );
}