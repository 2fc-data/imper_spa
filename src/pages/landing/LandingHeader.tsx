import { useUIStore } from '@/stores/ui.store'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import logoImper from '@/assets/logo_imper.jpg'

const navLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export function LandingHeader() {
  const { darkMode, toggleDarkMode } = useUIStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-1 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/70 backdrop-blur-lg shadow-lg shadow-foreground/5 border-b border-border/40'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center group h-16">
            <div className="h-16 w-48 min-w-[190px] rounded-md overflow-hidden border-y border-x border-border/40 bg-white group-hover:border-primary transition-all duration-300 group-hover:scale-102 group-hover:shadow-md group-hover:shadow-primary/10">
              <img
                src={logoImper}
                alt="Imper Engenharia"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-muted transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
