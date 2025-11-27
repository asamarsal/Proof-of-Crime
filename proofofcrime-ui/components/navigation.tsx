"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Menu, X, Wallet, ChevronDown, FileCode, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50">
      <div className="mx-auto sm:px-4 lg:px-4">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center ml-2">
            <Image src="/logopoc3.png" alt="Logo" height={50} width={140} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Dashboard
            </Link>
            <Link
              href="/cases"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Cases
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 outline-none">
                Bounties <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-md border-border">
                <DropdownMenuItem asChild>
                  <Link href="/smart-contract-audit" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer">
                    <FileCode className="w-5 h-5 mr-3 text-primary mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">Smart Contract Audit</span>
                      <span className="text-xs text-muted-foreground mt-1">Find vulnerabilities in smart contracts</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/web3-website-hacking" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer">
                    <Globe className="w-5 h-5 mr-3 text-primary mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">Web3 Website Hacking</span>
                      <span className="text-xs text-muted-foreground mt-1">Discover security flaws in Web3 platforms</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/people-bounty" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer">
                    <Users className="w-5 h-5 mr-3 text-primary mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">People/Suspected Name Bounty</span>
                      <span className="text-xs text-muted-foreground mt-1">Report criminals and submit evidence</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/analytics"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Analytics
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Docs
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center gap-4">
            <appkit-button />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 mr-4" /> : <Menu className="w-6 h-6 mr-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/cases"
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Cases
            </Link>
            <Link
              href="/bounties"
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Bounties
            </Link>
            <Link
              href="/analytics"
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/docs"
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Docs
            </Link>
            <div className="mt-4 flex justify-center">
              <appkit-button />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
