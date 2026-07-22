import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, MessageCircle, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { usePublicServices } from '@/hooks/usePublicServices'
import api from '@/services/api'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  company: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  service: z.string().optional(),
  message: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

export function ContactSection() {
  const { data: services } = usePublicServices()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  // Pre-fill service from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const servico = params.get('servico')
    if (servico) setValue('service', servico)
  }, [setValue])

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    try {
      await api.post('/integrations/lead', {
        ...data,
        source: 'formulario',
      })
      setSubmitted(true)
      reset()
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappLink = `https://wa.me/5535999994663?text=${encodeURIComponent(
    'Olá! Gostaria de solicitar um orçamento de impermeabilização.'
  )}`

  return (
    <section id="contato" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Entre em Contato
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Solicite seu orçamento sem compromisso. Responderemos o mais rápido possível.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-foreground">Mensagem enviada!</h3>
                <p className="mt-2 text-muted-foreground">
                  Entraremos em contato em breve. Obrigado!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Nome *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                    Empresa
                  </label>
                  <input
                    id="company"
                    type="text"
                    {...register('company')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                    placeholder="Nome da sua empresa (opcional)"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Telefone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-foreground mb-1.5">
                    Serviço desejado
                  </label>
                  <select
                    id="service"
                    {...register('service')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                  >
                    <option value="">Selecione um serviço</option>
                    {services?.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all resize-none"
                    placeholder="Descreva sua necessidade..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* WhatsApp CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Fale conosco pelo WhatsApp
                </div>
                <div className="text-sm text-muted-foreground">
                  Resposta rápida para seu orçamento
                </div>
              </div>
            </a>

            {/* Instagram CTA */}
            <a
              href="https://www.instagram.com/imperpocos/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  Siga-nos no Instagram
                </div>
                <div className="text-sm text-muted-foreground">
                  Acompanhe nossas obras e novidades
                </div>
              </div>
            </a>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">Telefone</div>
                  <div className="text-sm text-muted-foreground">(35) 3721-1674</div>
                  <div className="text-sm text-muted-foreground">(35) 99999-4663 (WhatsApp)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">Email</div>
                  <div className="text-sm text-muted-foreground">comercial@imperpocos.com.br</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">Endereço</div>
                  <div className="text-sm text-muted-foreground">
                    Rua São Paulo, 511 - Centro<br />
                    Poços de Caldas - MG
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3706.5!2d-46.563213!3d-21.787265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDQ3JzE0LjIiUyA0NsKwMzMnNDcuNiJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização ImperPoços"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
