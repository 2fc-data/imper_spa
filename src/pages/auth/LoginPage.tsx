import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import logoImper from '@/assets/logo_imper.jpg'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setSubmissionStatus(null)
    try {
      await login(data.email, data.password)
      setSubmissionStatus({ type: 'success', message: 'Login realizado com sucesso!' })
      setTimeout(() => navigate('/dashboard'), 600)
    } catch {
      setSubmissionStatus({ type: 'error', message: 'E-mail ou senha inválidos. Tente novamente.' })
    }
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return
    setSubmissionStatus({ type: 'success', message: 'Se este e-mail estiver cadastrado, um link de recuperação foi enviado.' })
    setIsForgotPassword(false)
    setForgotEmail('')
  }

  const inputCls =
    'w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-gold transition-elegant'
  const labelCls = 'block text-sm font-semibold text-card-foreground mb-1.5'

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center"
        >
          <img
            src={logoImper}
            alt="ImperPoços"
            className="w-80 rounded-3xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          />
          <h2 className="mt-12 text-4xl font-black text-primary tracking-tight drop-shadow-md">
            Bem-vindo ao Sistema
          </h2>
          <p className="mt-3 text-lg text-foreground/80 font-medium drop-shadow">
            Engenharia em Impermeabilização
          </p>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:p-12 relative overflow-hidden">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-64 max-w-full mx-auto p-2 bg-primary/5 rounded-3xl flex items-center justify-center shadow-inner mb-3 lg:hidden"
          >
            <img src={logoImper} alt="ImperPoços" className="w-full rounded-xl" />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center space-y-3 mb-8"
          >

            {isForgotPassword ? (
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shadow-inner transition-elegant hover-lift">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            ) : ("")}

            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {isForgotPassword ? 'Recuperar Senha' : 'Acesse sua conta'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isForgotPassword
                ? 'Siga as instruções por e-mail'
                : 'Entre com suas credenciais'}
            </p>
          </motion.div>

          {/* Back to Home Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex justify-start px-2"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar para a Home</span>
            </Link>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-4xl p-8 sm:p-10 backdrop-blur-xl"
          >
            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>E-mail</label>
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className={inputCls}
                        {...register('email')}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Senha</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={inputCls}
                        {...register('password')}
                      />
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={false}
                      className="h-14 font-black uppercase tracking-widest text-sm rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 hover-lift transition-elegant disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Acessar Sistema
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset()
                        setSubmissionStatus(null)
                      }}
                      className="h-12 font-bold uppercase tracking-widest text-xs rounded-2xl border border-border bg-transparent text-foreground hover:bg-muted transition-elegant"
                    >
                      Limpar Campos
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleForgotSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <label className={labelCls}>Seu E-mail Cadastrado</label>
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="exemplo@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className={inputCls}
                        required
                        autoComplete="email"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      className="h-14 font-black uppercase tracking-widest text-sm rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 hover-lift transition-elegant"
                    >
                      Enviar Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="h-12 font-bold uppercase tracking-widest text-xs rounded-2xl border border-border bg-transparent text-foreground hover:bg-muted transition-elegant"
                    >
                      Voltar para Login
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Forgot password link (only on login form) */}
            {!isForgotPassword && (
              <div className="flex items-center justify-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true)
                    setSubmissionStatus(null)
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            {/* Divider */}
            {!isForgotPassword && (
              <>
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 font-semibold text-muted-foreground">
                      ou entre com
                    </span>
                  </div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-1 gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = `${API_URL}/auth/google`)
                    }
                    className="h-14 rounded-2xl border border-border bg-transparent hover:bg-muted font-bold text-xs uppercase tracking-widest transition-elegant hover-lift flex items-center justify-center gap-2"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                </div>
              </>
            )}

            {/* Status message */}
            <AnimatePresence>
              {submissionStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mt-8 p-4 rounded-2xl text-center text-sm font-bold shadow-inner flex items-center justify-center gap-2 ${submissionStatus.type === 'error'
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                >
                  {submissionStatus.type === 'error' ? (
                    <AlertCircle size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  {submissionStatus.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs text-muted-foreground"
          >
            Não tem acesso?{' '}
            <button
              type="button"
              onClick={() =>
              (window.location.href =
                'mailto:contato@imperpocos.com.br?subject=Solicitação de acesso - ImperCRM')
              }
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Solicite ao administrador
            </button>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
