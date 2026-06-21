export type Theme = "light" | "dark";

export interface NavItem {
  label: string;
  href: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  phoneLink: string;
}
