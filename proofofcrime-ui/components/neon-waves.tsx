"use client"

export default function NeonWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ===========================
          WAVE 1 — High Cyan Wave
      ============================ */}
      <svg
        className="absolute bottom-0 w-[200%] h-72 animate-seamless-wave opacity-40"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(0,255,255)" stopOpacity="0.7" />
            <stop offset="50%" stopColor="rgb(0,180,255)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(0,255,255)" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Wave pattern 1 */}
        <path
          fill="url(#wave1)"
          d="
            M0,200 
            C180,260 340,120 520,160 
            C700,200 880,320 1100,260 
            C1300,220 1420,150 1440,120
            V320 H0 Z
          "
        />

        {/* Duplicate for seamless loop */}
        <path
          fill="url(#wave1)"
          transform="translate(1440, 0)"
          d="
            M0,200 
            C180,260 340,120 520,160 
            C700,200 880,320 1100,260 
            C1300,220 1420,150 1440,120
            V320 H0 Z
          "
        />
      </svg>

      {/* ===========================
          WAVE 2 — Magenta Middle Wave
      ============================ */}
      <svg
        className="absolute bottom-0 w-[200%] h-64 animate-seamless-wave-slow opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(255,0,255)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="rgb(255,0,200)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(255,0,255)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          fill="url(#wave2)"
          d="
            M0,160
            C200,200 340,280 540,220
            C720,170 900,90 1080,160
            C1260,230 1390,260 1440,240
            V320 H0 Z
          "
        />

        <path
          fill="url(#wave2)"
          transform="translate(1440, 0)"
          d="
            M0,160
            C200,200 340,280 540,220
            C720,170 900,90 1080,160
            C1260,230 1390,260 1440,240
            V320 H0 Z
          "
        />
      </svg>

      {/* ===========================
          WAVE 3 — Deep Blue Low Wave
      ============================ */}
      <svg
        className="absolute bottom-0 w-[200%] h-56 animate-seamless-wave-fast opacity-25 blur-[1px]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(0,120,255)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(0,90,255)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(0,120,255)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <path
          fill="url(#wave3)"
          d="
            M0,140
            C180,180 350,110 500,150
            C700,210 850,300 1100,260
            C1300,220 1400,180 1440,170
            V320 H0 Z
          "
        />

        <path
          fill="url(#wave3)"
          transform="translate(1440, 0)"
          d="
            M0,140
            C180,180 350,110 500,150
            C700,210 850,300 1100,260
            C1300,220 1400,180 1440,170
            V320 H0 Z
          "
        />
      </svg>

      {/* GRID OVERLAY */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* RADIAL NEON GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
    </div>
  )
}
