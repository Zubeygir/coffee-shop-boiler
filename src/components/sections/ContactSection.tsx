import { site } from "@/content/site";

// Links that leave the page open a new tab and carry the arrow suffix (design-language.md → Links).
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
      {children} <span aria-hidden="true">→</span>
      <span className="sr-only"> {site.newTabNote}</span>
    </a>
  );
}

export function ContactSection() {
  const contact = site.contact;

  return (
    <footer id="iletisim" className="px-4 pt-section pb-10 md:px-10">
      <div className="mx-auto max-w-[80rem]">
        <h2 className="type-headline">{contact.title}</h2>

        <div className="type-body mt-16 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="type-label text-char">{contact.addressLabel}</h3>
            <address className="mt-2 not-italic">{contact.address}</address>
            <p className="mt-2">
              <ExternalLink href={contact.mapUrl}>{contact.mapLabel}</ExternalLink>
            </p>
          </div>

          <div>
            <h3 className="type-label text-char">{contact.hoursLabel}</h3>
            <p className="mt-2">{site.hours}</p>
          </div>

          <div>
            <h3 className="type-label text-char">{contact.reachLabel}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-link">
                  {contact.phone}
                </a>
              </li>
              <li>
                <ExternalLink href={contact.instagram.url}>{contact.instagram.handle}</ExternalLink>
              </li>
            </ul>
          </div>
        </div>

        <p className="type-label mt-26 text-char">{contact.copyright}</p>
      </div>
    </footer>
  );
}
