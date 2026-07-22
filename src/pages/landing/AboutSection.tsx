import { motion } from 'framer-motion'
import { Award, Users, Calendar, CheckCircle } from 'lucide-react'

const highlights = [
  { icon: Calendar, label: 'Fundada em 1993', value: '30+ Anos' },
  { icon: Users, label: 'Clientes Atendidos', value: 'Milhares' },
  { icon: Award, label: 'Experiência Comprovada', value: 'Qualidade' },
  { icon: CheckCircle, label: 'Garantia de Serviço', value: 'Confiança' },
]

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 sm:py-28 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Sobre a{' '}
              <span className="text-gradient-primary">ImperPoços</span>
            </h2>
            <div className="mt-6 space-y-4 text-justify text-muted-foreground">
              <p>
                Fundada em 1993 pelo Engenheiro Civil <strong className="text-foreground">Valdinei dos Santos Oliveira</strong>,
                a ImperPoços é referência em serviços de impermeabilização em Poços de Caldas e região.
              </p>
              <p>
                Com mais de 30 anos de experiência, atendemos desde residências até grandes construções comerciais e industriais,
                sempre com foco na qualidade dos materiais e na excelência do serviço executado.
              </p>
              <p>
                Nosso compromisso é proteger o seu patrimônio com soluções duradouras e eficientes,
                utilizando as melhores técnicas e materiais do mercado.
              </p>
            </div>
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground">{item.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
