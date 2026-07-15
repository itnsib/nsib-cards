// Simple embossed shield mark used across the app (hero + favicon feel).
// Kept as inline SVG so it scales crisply and inherits the accent color.

export default function ShieldMark({ size = 44, accent = "#12a29f" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 3 6 9v13c0 11 7.6 18.6 18 23 10.4-4.4 18-12 18-23V9L24 3Z"
        fill="url(#sg)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <path
        d="M24 12v22c-6-3-10-8-10-15v-4l10-3Z"
        fill="rgba(255,255,255,0.10)"
      />
      <path
        d="M18 24.5l4.2 4.2L31 20"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="sg" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#163a6b" />
          <stop offset="1" stopColor="#0A1F3C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
