import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Facebook, Instagram, Music } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image 
              src="/logopoc4.png" 
              alt="Proof of Crime Logo" 
              height={40} 
              width={120} 
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Link href="/features" className="text-sm text-white hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/solution" className="text-sm text-white hover:text-primary transition-colors">
            Solution
          </Link>
          <Link href="/cases" className="text-sm text-white hover:text-primary transition-colors">
            Cases
          </Link>
          <Link href="/analytics" className="text-sm text-white hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm text-white hover:text-primary transition-colors">
            Help
          </Link>
          <Link href="/about" className="text-sm text-white hover:text-primary transition-colors">
            About
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://threads.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="Threads"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.186 3.998a8.998 8.998 0 1 0 0 17.996 8.998 8.998 0 0 0 0-17.996zm4.598 7.183c-.054-1.336-.445-2.453-1.162-3.32-.717-.867-1.71-1.373-2.953-1.504a6.45 6.45 0 0 0-.869-.044c-1.285 0-2.354.356-3.177 1.058-.823.702-1.307 1.696-1.438 2.955a.75.75 0 0 0 1.493.15c.094-.905.396-1.586.898-2.023.502-.437 1.183-.656 2.024-.656.22 0 .437.013.65.038.893.104 1.554.423 1.966 1.003.412.58.62 1.37.62 2.35 0 .14-.003.278-.01.415-.33-.11-.686-.166-1.062-.166-1.363 0-2.512.48-3.417 1.426-.905.946-1.362 2.164-1.362 3.622 0 1.458.457 2.676 1.362 3.622.905.946 2.054 1.426 3.417 1.426 1.363 0 2.512-.48 3.417-1.426.905-.946 1.362-2.164 1.362-3.622 0-.14-.003-.278-.01-.415.33.11.686.166 1.062.166 1.363 0 2.512-.48 3.417-1.426.905-.946 1.362-2.164 1.362-3.622 0-1.458-.457-2.676-1.362-3.622-.905-.946-2.054-1.426-3.417-1.426-.376 0-.732.056-1.062.166.007-.137.01-.275.01-.415z"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label="TikTok"
          >
            <Music className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-white">
            © {new Date().getFullYear()} Proof of Crime. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
