"use client"

export default function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 opacity-30">
      <div
        className="absolute left-0 right-0 h-px bg-primary/50 animate-scan"
        style={{ boxShadow: "0 0 20px 5px rgba(0, 255, 255, 0.3)" }}
      />
    </div>
  )
}
