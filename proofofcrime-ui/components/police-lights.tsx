"use client"

export default function PoliceLights() {
  return (
    <>
      {/* Red police light glow - left */}
      <div
        className="fixed top-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-police-red pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Blue police light glow - right */}
      <div
        className="fixed top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-police-blue pointer-events-none"
        style={{ transform: "translate(50%, -50%)" }}
      />

      {/* Secondary red glow - bottom left */}
      <div
        className="fixed bottom-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-2xl animate-police-red pointer-events-none"
        style={{ animationDelay: "-0.5s" }}
      />

      {/* Secondary blue glow - bottom right */}
      <div
        className="fixed bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-police-blue pointer-events-none"
        style={{ animationDelay: "-0.5s" }}
      />
    </>
  )
}
