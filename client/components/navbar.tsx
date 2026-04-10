'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // 🔐 Check login state
  useEffect(() => {
    const token = localStorage.getItem('github_token')
    setIsLoggedIn(!!token)
  }, [])

  // 🔓 Logout handler
  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem('github_token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <nav className="fixed w-full top-0 z-50 border-b border-border/50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="wrathops logo" className="h-12" />
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WrathOps
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            
            <Link href="#workflow" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Product
            </Link>
            <Link href="#features" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Features
            </Link>
            <a
              href="https://docs.wrathops.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Docs
            </a>
            <Link href="#pricing" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">

            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

            {!isLoggedIn ? (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">

            <Link href="#workflow" className="block text-sm text-foreground/70 hover:text-primary">
              Product
            </Link>

            <Link href="#features" className="block text-sm text-foreground/70 hover:text-primary">
              Features
            </Link>

            <a
              href="https://docs.wrathops.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-foreground/70 hover:text-primary"
            >
              Docs
            </a>

            <Link href="#pricing" className="block text-sm text-foreground/70 hover:text-primary">
              Pricing
            </Link>

            {!isLoggedIn ? (
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}