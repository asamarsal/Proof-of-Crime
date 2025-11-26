"use client"

export default function NeonWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave 1 - Cyan */}
      <svg
        className="absolute bottom-0 w-[200%] h-64 animate-wave opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(0, 255, 255)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(0, 200, 255)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(0, 255, 255)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave1)"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Wave 2 - Magenta */}
      <svg
        className="absolute bottom-0 w-[200%] h-48 animate-wave opacity-20"
        style={{ animationDelay: "-5s", animationDuration: "20s" }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(255, 0, 255)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(255, 0, 200)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(255, 0, 255)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave2)"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
    </div>
  )
}
