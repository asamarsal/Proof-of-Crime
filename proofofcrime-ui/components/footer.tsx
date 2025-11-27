import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Facebook, Instagram, Music } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/50">
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
