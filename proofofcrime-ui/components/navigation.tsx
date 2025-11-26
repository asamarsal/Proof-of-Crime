"use client"

import { useState } from "react"
import { Shield, Menu, X, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 w-8 h-8 bg-primary/30 blur-lg" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary neon-text-cyan">Proof</span>
              <span className="text-foreground"> of </span>
              <span className="text-secondary neon-text-magenta">Crime</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Dashboard", "Cases", "Bounties", "Analytics", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center gap-4">
            <appkit-button />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {["Dashboard", "Cases", "Bounties", "Analytics", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="mt-4 flex justify-center">
              <appkit-button />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
