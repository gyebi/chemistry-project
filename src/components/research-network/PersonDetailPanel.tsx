"use client";

import { useEffect } from "react";
import Image from "next/image";
import { normalizeWordPressUrl } from "@/lib/wordpress";
import type { Person } from "./types";

type PersonDetailPanelProps = {
  person: Person | null;
  onClose: () => void;
};

export default function PersonDetailPanel({ person, onClose }: PersonDetailPanelProps) {
  useEffect(() => {
    if (!person) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [person, onClose]);

  if (!person) return null;

  const name = person.title.rendered || "Researcher";
  const rawImageUrl =
    person._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const imageUrl = normalizeWordPressUrl(rawImageUrl);
  const { role, research_area: researchArea, qualifications, short_bio: shortBio, email, orcid } = person.acf;

  const isLocalImage = imageUrl?.startsWith("http://localhost:");


  return (
    <div className="profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-name">
        <button className="panel-close" type="button" onClick={onClose} aria-label="Close profile" autoFocus>×</button>
        <div className="profile-heading">
          {imageUrl ? (
            <Image 
            src={imageUrl} 
            alt={name} 
            width={80} 
            height={80} 
            unoptimized={isLocalImage}/>
            
          ) : (
            <div className="profile-image-fallback" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</div>
          )}
          <div>
            <p className="profile-kicker">Research community</p>
            <h2 id="profile-name">{name}</h2>
            {role && <p>{role}</p>}
          </div>
        </div>
        <dl className="profile-details">
          {researchArea && <><dt>Research area</dt><dd>{researchArea}</dd></>}
          {qualifications && <><dt>Qualifications</dt><dd>{qualifications}</dd></>}
          {shortBio && <><dt>About</dt><dd>{shortBio}</dd></>}
          {orcid && <><dt>ORCID</dt><dd><a href={orcid.startsWith("http") ? orcid : `https://orcid.org/${orcid}`}>View ORCID record</a></dd></>}
        </dl>
        {email && <a className="email-action" href={`mailto:${email}`}>Email {name}</a>}
      </section>
    </div>
  );
}
