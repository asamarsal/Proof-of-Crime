"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Menu, X, Wallet, ChevronDown, FileCode, Globe, Users, ChevronUp } from "lucide-react"
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
  const [isBountyOpen, setIsBountyOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50">
      <div className="mx-auto sm:px-4 lg:px-4">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center ml-2">
            <Link href="/">
              <Image 
                src="/logopoc4.png" 
                alt="Logo" 
                height={40} 
                width={140} 
                className="cursor-pointer"
              />
            </Link>
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className={`text-sm transition-colors duration-300 ${pathname === '/dashboard' ? 'text-primary neon-text-cyan font-medium' : 'text-white hover:text-primary'}`}>
              Dashboard
            </Link>

            {/* <Link href="/cases" className={`text-sm transition-colors duration-300 ${pathname === '/cases' ? 'text-primary neon-text-cyan font-medium' : 'text-white hover:text-primary'}`}>
              Cases
            </Link> */}

            {/* Desktop Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 text-sm transition-colors duration-300 outline-none ${pathname?.startsWith('/smart-contract-audit') || pathname?.startsWith('/web3-website-hacking') || pathname?.startsWith('/people-bounty') ? 'text-primary neon-text-cyan font-medium' : 'text-white hover:text-primary'}`}>
                Bounties <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-md border-border">
                <DropdownMenuItem asChild>
                  <Link href="/smart-contract-audit" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer group">
                    <FileCode className="w-5 h-5 mr-3 text-secondary mt-0.5 transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-primary group-hover:neon-text-cyan transition-colors">Smart Contract Audit</span>
                      <span className="text-xs text-muted-foreground mt-1">Find vulnerabilities in smart contracts</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/web3-website-hacking" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer group">
                    <Globe className="w-5 h-5 mr-3 text-secondary mt-0.5 transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-primary group-hover:neon-text-cyan transition-colors">Web3 Website Hacking</span>
                      <span className="text-xs text-muted-foreground mt-1">Discover security flaws in Web3 platforms</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/people-bounty" className="flex items-start p-3 focus:bg-primary/10 cursor-pointer group">
                    <Users className="w-5 h-5 mr-3 text-secondary mt-0.5 transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-primary group-hover:neon-text-cyan transition-colors">People/Suspected Name Bounty</span>
                      <span className="text-xs text-muted-foreground mt-1">Report criminals and submit evidence</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/analytics" className={`text-sm transition-colors duration-300 ${pathname === '/analytics' ? 'text-primary neon-text-cyan font-medium' : 'text-white hover:text-primary'}`}>
              Analytics
            </Link>

            <Link href="/submit-case" className={`text-sm transition-colors duration-300 ${pathname === '/submit-case' ? 'text-primary neon-text-cyan font-medium' : 'text-white hover:text-primary'}`}>
              Submit Case
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

            <Link href="/dashboard" className={`block text-sm transition-colors ${pathname === '/dashboard' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
              Dashboard
            </Link>

            {/* <Link href="/cases" className={`block text-sm transition-colors ${pathname === '/cases' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
              Cases
            </Link> */}

            {/* Mobile Dropdown */}
            <button
              onClick={() => setIsBountyOpen(!isBountyOpen)}
              className={`flex items-center justify-between w-full text-sm ${pathname?.startsWith('/smart-contract-audit') || pathname?.startsWith('/web3-website-hacking') || pathname?.startsWith('/people-bounty') ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}
            >
              <span>Bounties</span>
              {isBountyOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isBountyOpen && (
              <div className="pl-4 space-y-2">
                <Link href="/smart-contract-audit" className={`block text-sm ${pathname === '/smart-contract-audit' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                  • Smart Contract Audit
                </Link>

                <Link href="/web3-website-hacking" className={`block text-sm ${pathname === '/web3-website-hacking' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                  • Web3 Website Hacking
                </Link>

                <Link href="/people-bounty" className={`block text-sm ${pathname === '/people-bounty' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
                  • People/Suspected Name Bounty
                </Link>
              </div>
            )}

            <Link href="/analytics" className={`block text-sm transition-colors ${pathname === '/analytics' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
              Analytics
            </Link>

            <Link href="/submit-case" className={`block text-sm transition-colors ${pathname === '/submit-case' ? 'text-primary neon-text-cyan font-medium' : 'text-muted-foreground hover:text-primary'}`}>
              Submit Case
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
