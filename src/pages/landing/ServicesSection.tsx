import { motion } from 'framer-motion'
import {
  Home, Waves, Building, Layers, Bath, Wrench, Grid3x3, HardHat,
} from 'lucide-react'
import { usePublicServices } from '@/hooks/usePublicServices'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Waves, Building, Layers, Bath, Wrench, Grid3x3, HardHat,
}

export function ServicesSection() {
  const { data: services, isLoading } = usePublicServices()

  const handleServiceClick = (serviceName: string) => {
    const form = document.getElementById('contato')
    form?.scrollIntoView({ behavior: 'smooth' })
    // Set service in URL params for the form to pick up
    const url = new URL(window.location.href)
    url.searchParams.set('servico', serviceName)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <section id="servicos" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Nossos Serviços
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas em impermeabilização e engenharia civil
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services?.map((service, index) => {
              const Icon = iconMap[service.icon] || Home
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleServiceClick(service.name)}
                  className="group text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
