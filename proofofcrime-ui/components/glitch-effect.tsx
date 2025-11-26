"use client"

export default function GlitchEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      <div className="absolute inset-0 bg-scanlines-vertical opacity-[0.04]" />

      {/* RGB Split / Chromatic Aberration Layer */}
      <div className="absolute inset-0 glitch-rgb-vertical mix-blend-screen opacity-30" />

      {/* Static/Noise Columns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="static-column-1 absolute top-0 bottom-0 w-[30px] bg-noise-vertical opacity-[0.08]" />
        <div className="static-column-2 absolute top-0 bottom-0 w-[20px] bg-noise-vertical opacity-[0.06]" />
        <div className="static-column-3 absolute top-0 bottom-0 w-[40px] bg-noise-vertical opacity-[0.05]" />
      </div>

      {/* Screen Flicker */}
      <div className="absolute inset-0 screen-flicker bg-white/[0.01]" />

      {/* CRT Vignette */}
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  )
}
