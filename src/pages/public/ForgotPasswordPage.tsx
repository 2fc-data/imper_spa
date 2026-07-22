import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simula envio — backend ainda não tem endpoint de recuperação
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1500)
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
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-primary">ImperPoços</h1>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-xl font-semibold text-card-foreground mb-2">E-mail enviado!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover-lift transition-elegant"
              >
                <ArrowLeft size={16} />
                Voltar ao login
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-card-foreground mb-1">Esqueceu a senha?</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Informe seu e-mail e enviaremos instruções para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant"
                    />
                  </div>
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
                    'Enviar instruções'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
