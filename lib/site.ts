/**
 * بيانات التواصل الخاصة بالأكاديمية.
 * تيليغرام يفتح محادثة الرقم 0542574841 مباشرة.
 * صور الورشة في public/academy.
 */
export const academyPhotos = [
  { src: "/academy/bench.jpg", key: "bench" },
  { src: "/academy/phone.jpg", key: "phone" },
  { src: "/academy/banner.jpg", key: "banner" },
  { src: "/academy/oran.jpg", key: "oran" },
  { src: "/academy/oran-2.jpg", key: "oran2" },
  { src: "/academy/group.jpg", key: "group" },
  { src: "/academy/algiers.jpg", key: "algiers" },
  { src: "/academy/sidi-bel-abbes.jpg", key: "sidiBelAbbes" },
  { src: "/academy/skikda.jpg", key: "skikda" },
  { src: "/academy/laghouat.jpg", key: "laghouat" },
  { src: "/academy/pair.jpg", key: "pair" },
  { src: "/academy/stand.jpg", key: "stand" },
] as const;

export const site = {
  name: "OMT",
  fullName: "Optima Mobile Team",
  phoneDisplay: "0540190559",
  phoneE164: "213540190559",
  whatsappUrl: "https://wa.me/213540190559",
  telegramDisplay: "0542574841",
  telegramE164: "213542574841",
  telegramUrl: "https://t.me/+213542574841",
  location: "الحراش، الجزائر",
  mapsUrl: "https://maps.app.goo.gl/o4L167tkwBsZMGhj8",
  mapsEmbed: "https://maps.google.com/maps?q=36.7350136,3.1750384&z=16&output=embed",
};

export function whatsappLink(message: string) {
  return `${site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
