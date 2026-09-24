export type NavLink = {
  label: string;
  href: `#${string}`;
};

/** One hero headline row: `[left | cup slot | right]`. */
export type HeadlineRow = {
  left: string;
  right: string;
};

export type MenuItem = {
  slug: string;
  name: string;
  description: string;
  price: number;
  imageAlt: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type ContactInfo = {
  title: string;
  addressLabel: string;
  address: string;
  mapLabel: string;
  mapUrl: string;
  hoursLabel: string;
  reachLabel: string;
  phone: string;
  instagram: {
    handle: string;
    url: string;
  };
  copyright: string;
};

export type SiteContent = {
  metadata: {
    siteName: string;
    title: string;
    description: string;
  };
  skipLink: string;
  navLabel: string;
  /** Screen-reader note appended to links that open a new tab. */
  newTabNote: string;
  wordmark: string;
  location: string;
  hours: string;
  nav: NavLink[];
  hero: {
    rows: HeadlineRow[];
    scrollCue: string;
  };
  reveal: {
    title: string;
    paragraph: string;
  };
  menu: {
    title: string;
    categories: MenuCategory[];
  };
  contact: ContactInfo;
  errorPage: {
    title: string;
    text: string;
    retry: string;
    home: string;
  };
  notFoundPage: {
    title: string;
    text: string;
    home: string;
  };
};
