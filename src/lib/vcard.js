// Builds a downloadable .vcf (vCard 3.0) so a tap on "Save contact"
// drops the person straight into the visitor's phone contacts.

export function buildVCard(card, company) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${card.name};;;;`,
    `FN:${card.name}`,
    `ORG:${company.name}`,
    card.title ? `TITLE:${card.title}` : "",
    card.phone ? `TEL;TYPE=WORK,VOICE:${card.phone}` : "",
    card.mobile ? `TEL;TYPE=CELL:${card.mobile}` : "",
    card.email ? `EMAIL;TYPE=WORK:${card.email}` : "",
    card.website ? `URL:${card.website}` : "",
    card.location ? `ADR;TYPE=WORK:;;${card.location};;;;` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function downloadVCard(card, company) {
  const blob = new Blob([buildVCard(card, company)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.slug}-nsib.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
