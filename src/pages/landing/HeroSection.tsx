import { motion } from 'framer-motion'
import { ArrowDown, Shield, Clock, MapPin } from 'lucide-react'

const trustBadges = [
  { icon: Clock, label: '30+ Anos de Experiência' },
  { icon: Shield, label: 'CNPJ 71.189.955/0001-87' },
  { icon: MapPin, label: 'Poços de Caldas - MG' },
]

export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToServices = () => {
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[90vh] pt-12 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Engenharia de Impermeabilização
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mt-6 font-bold tracking-tight text-foreground">
            <span className="text-gradient-primary">Qualidade e Confiança</span>{' '}
            há mais de 30 anos
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Soluções profissionais para proteger seu patrimônio em Poços de Caldas e região.
          Telhados, piscinas, fachadas, fundações e muito mais.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToForm}
            className="px-8 py-3.5 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            Solicitar Orçamento Grátis
          </button>
          <button
            onClick={scrollToServices}
            className="px-8 py-3.5 text-base font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Nossos Serviços
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
              <badge.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16"
        >
          <a href="#servicos" className="inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs font-medium">Saiba mais</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
