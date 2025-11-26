export function HandcuffsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left cuff */}
      <circle cx="6" cy="12" r="4" />
      <path d="M6 8V6" />

      {/* Right cuff */}
      <circle cx="18" cy="12" r="4" />
      <path d="M18 8V6" />

      {/* Chain */}
      <path d="M10 12h4" />

      {/* Keyholes */}
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
