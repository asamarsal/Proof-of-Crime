export function PadlockIcon({ className }: { className?: string }) {
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
      {/* Lock body */}
      <rect x="5" y="11" width="14" height="10" rx="2" />

      {/* Shackle */}
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />

      {/* Keyhole */}
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      <path d="M12 17.5v2" />
    </svg>
  )
}
