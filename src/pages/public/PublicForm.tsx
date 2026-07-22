import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Droplets, Send, CheckCircle2, Loader2 } from 'lucide-react'
import api from '@/services/api'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  company: z.string().optional(),
  service: z.string().min(1, 'Selecione um serviço'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type LeadFormData = z.infer<typeof leadSchema>

const services = [
  'Impermeabilização de Telhados',
  'Impermeabilização de Piscinas',
  'Impermeabilização de Fundações',
  'Impermeabilização de Banheiros',
  'Infiltração e Vazamentos',
  'Revestimento Cerâmico',
  'Outro',
]

export function PublicForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/integrations/lead', data)
      setSubmitted(true)
      reset()
    } catch {
      setError('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
            <Droplets className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-primary">ImperPoços</h1>
          <p className="text-muted-foreground text-sm mt-1">Solicite seu orçamento</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Formulário enviado!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Recebemos sua solicitação. Entraremos em contato em breve.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover-lift transition-elegant"
              >
                Enviar outra solicitação
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Preencha os dados</h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1">
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="João da Silva"
                    className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant"
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant"
                      {...register('email')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-1">
                      Telefone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-card-foreground mb-1">
                    Empresa
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Nome da empresa (opcional)"
                    className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant"
                    {...register('company')}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-card-foreground mb-1">
                    Serviço desejado *
                  </label>
                  <select
                    id="service"
                    className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus-gold transition-elegant"
                    {...register('service')}
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Descreva sua necessidade..."
                    className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant resize-none"
                    {...register('message')}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover-lift focus-gold disabled:opacity-50 transition-elegant"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send size={18} />
                      Enviar solicitação
                    </span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Imper - Engenharia em Impermeabilização © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}
