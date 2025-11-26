"use client"

import { useEffect, useState } from "react"
import { Lock, Shield, AlertTriangle, Fingerprint } from "lucide-react"
import { HandcuffsIcon } from "@/components/icons/handcuffs-icon"
import { PadlockIcon } from "@/components/icons/padlock-icon"

const floatingIcons = [
  { Icon: HandcuffsIcon, delay: 0, x: "10%", y: "20%" },
  { Icon: PadlockIcon, delay: 1, x: "85%", y: "30%" },
  { Icon: Shield, delay: 2, x: "15%", y: "70%" },
  { Icon: Lock, delay: 3, x: "80%", y: "75%" },
  { Icon: AlertTriangle, delay: 4, x: "5%", y: "45%" },
  { Icon: Fingerprint, delay: 5, x: "92%", y: "55%" },
]

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <div
          key={index}
          className="absolute opacity-20 hover:opacity-40 transition-opacity"
          style={{
            left: x,
            top: y,
            animationDelay: `${delay}s`,
          }}
        >
          <div className={`animate-float${index % 2 === 0 ? "" : "-delayed"}`}>
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>
      ))}

      {/* Holographic floating cards */}
      <div
        className="absolute top-1/4 right-[5%] w-32 h-20 glass rounded-lg border border-primary/20 animate-float opacity-30"
        style={{ animationDelay: "-3s" }}
      >
        <div className="p-2 font-mono text-[8px] text-primary/80">
          <div>0x7f4d...</div>
          <div className="text-secondary">SUSPECT</div>
        </div>
      </div>

      <div className="absolute bottom-1/3 left-[3%] w-28 h-16 glass rounded-lg border border-secondary/20 animate-float-delayed opacity-30">
        <div className="p-2 font-mono text-[8px] text-secondary/80">
          <div>BOUNTY</div>
          <div className="text-primary">$50,000</div>
        </div>
      </div>
    </div>
  )
}
