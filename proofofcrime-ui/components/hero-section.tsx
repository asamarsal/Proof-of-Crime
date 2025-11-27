"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Shield, Zap, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import NeonWaves from "@/components/neon-waves"
import { HandcuffsIcon } from "@/components/icons/handcuffs-icon"
import DecryptedText from './DecryptedText';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { clientX, clientY } = e
      const { width, height } = containerRef.current.getBoundingClientRect()
      const x = (clientX / width - 0.5) * 20
      const y = (clientY / height - 0.5) * 20
      containerRef.current.style.setProperty("--mouse-x", `${x}px`)
      containerRef.current.style.setProperty("--mouse-y", `${y}px`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >

      {/* Hero Content */}
      <div className="pt-8 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm text-primary font-mono">BLOCKCHAIN-VERIFIED JUSTICE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="block text-foreground">Join decentralized fight</span>
          <span className="block text-primary neon-text-cyan">against global</span>
          <span className="block text-foreground">web3 crime.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Criminal case around the world, Crypto crime alert, and many more
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 px-8 py-6 text-lg font-semibold transition-all duration-300 neon-glow-cyan group"
            >
              Launch App
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-secondary/50 text-secondary hover:bg-secondary/10 px-8 py-6 text-lg font-semibold bg-transparent"
          >
            View
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "$47M", label: "Bounties Claimed", icon: Zap },
            { value: "12,847", label: "Cases Solved", icon: Shield },
            { value: "98.7%", label: "AI Accuracy", icon: Lock },
            { value: "156K", label: "Active Agents", icon: HandcuffsIcon },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass glass-hover rounded-xl p-4 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-5 h-5 text-primary mb-2 mx-auto" />
              <div className="text-2xl sm:text-3xl font-bold text-primary neon-text-cyan">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
