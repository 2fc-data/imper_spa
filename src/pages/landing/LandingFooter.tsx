import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/40">

          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              ImperPoços
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Excelência e alta performance em engenharia de impermeabilização. Protegendo seu patrimônio há mais de 30 anos com qualidade e garantia técnica.
            </p>
          </div>

          {/* Coluna 2: Sitemap - Navegação */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre a Empresa
                </a>
              </li>
              <li>
                <a href="#contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Fale Conosco
                </a>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Portal do Cliente / CRM
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato Rápido */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>(35) 3721-1674 / 99999-4663</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="break-all">comercial@imperpocos.com.br</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Rua São Paulo, 511 - Centro, Poços de Caldas - MG</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legal & LGPD */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Privacidade e Segurança
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/lgpd" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Portal de Privacidade LGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} ImperPoços - Engenharia de Impermeabilização. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <a href="mailto:2fc.data@gmail.com" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>2fc.data</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
