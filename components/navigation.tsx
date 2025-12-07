"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, Globe, AlertCircle } from "lucide-react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">Dwarzark</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  English
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Krio</DropdownMenuItem>
                <DropdownMenuItem>Mende</DropdownMenuItem>
                <DropdownMenuItem>Limba</DropdownMenuItem>
                <DropdownMenuItem>Themne</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/report">
              <Button>Report Problem</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link href="/report" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Report Problem</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
