// NSIB digital business cards — single source of truth.
// To add a person, copy a block and change the fields. `slug` becomes the URL: /c/<slug>
// Swap this file for a Firebase/Supabase fetch later without touching the components.

export const company = {
  name: "New Shield Insurance Brokers",
  short: "NSIB",
  tagline: "15+ years of trusted coverage in the UAE",
  website: "https://nsib.ae",
  address: "One by Omniyat, Suite 2801, Al Mustaqbal St, Business Bay, Dubai, UAE",
  phone: "+971 4 705 8000",
  email: "enquiry@nsib.ae",
};

export const cards = [
  {
    slug: "sachin",
    name: "Sachin",
    title: "IT Lead",
    department: "Information Technology",
    phone: "+971 4 705 8000",
    mobile: "+971 50 000 0000",
    email: "sachin@nsib.ae",
    whatsapp: "+971500000000",
    linkedin: "",
    website: "https://nsib.ae",
    location: "Dubai, UAE",
  },
  {
    slug: "kavya",
    name: "Kavya",
    title: "Operations",
    department: "Operations",
    phone: "+971 4 705 8000",
    mobile: "",
    email: "kavya@nsib.ae",
    whatsapp: "",
    linkedin: "",
    website: "https://nsib.ae",
    location: "Dubai, UAE",
  },
  {
    slug: "demo",
    name: "Your Name",
    title: "Insurance Advisor",
    department: "Medical Insurance",
    phone: "+971 4 705 8000",
    mobile: "+971 55 123 4567",
    email: "you@nsib.ae",
    whatsapp: "+971551234567",
    linkedin: "https://linkedin.com/in/yourprofile",
    website: "https://nsib.ae",
    location: "Business Bay, Dubai, UAE",
  },
];

export function getCard(slug) {
  return cards.find((c) => c.slug === slug);
}
