import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Wrench,
  Shield,
  Building2,
  UserCog,
  Key,
  GitBranch,
  Landmark,
  ChevronDown,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/crm/leads', icon: Users, label: 'Leads' },
  { to: '/crm/funil', icon: GitPullRequest, label: 'Funil' },
  { to: '/crm/propostas', icon: FileText, label: 'Propostas' },
  { to: '/crm/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/configuracoes/servicos', icon: Wrench, label: 'Serviços' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
]

const adminItems = [
  { to: '/admin/organizacoes', icon: Building2, label: 'Organizações' },
  { to: '/admin/departamentos', icon: GitBranch, label: 'Departamentos' },
  { to: '/admin/equipes', icon: Users, label: 'Equipes' },
  { to: '/admin/centros-custo', icon: Landmark, label: 'Centros de Custo' },
  { to: '/admin/cargos', icon: Shield, label: 'Cargos' },
  { to: '/admin/permissoes', icon: Key, label: 'Permissões' },
  { to: '/admin/delegacoes', icon: UserCog, label: 'Delegações' },
  { to: '/admin/configuracao', icon: Settings, label: 'Configuração' },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { logout } = useAuthStore()
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300',
        'bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)]',
        sidebarOpen ? 'w-20 sm:w-64' : 'w-20'
      )}
      style={{ borderRight: '1px solid var(--sidebar-border)' }}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <span className="hidden sm:inline text-lg font-bold" style={{ color: 'var(--sidebar-primary)' }}>
            ImperPoços
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="hidden sm:inline-flex rounded-lg p-2 transition-colors hover:bg-[var(--sidebar-accent)]"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-8 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
                  : 'text-[var(--sidebar-foreground)] opacity-70 hover:bg-[var(--sidebar-accent)] hover:opacity-100'
              )
            }
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="hidden sm:inline">{item.label}</span>}
          </NavLink>
        ))}

        {/* Administração group */}
        <div className="pt-2">
          <button
            onClick={() => setAdminOpen(!adminOpen)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              adminOpen
                ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
                : 'text-[var(--sidebar-foreground)] opacity-70 hover:bg-[var(--sidebar-accent)] hover:opacity-100'
            )}
          >
            <Shield size={20} />
            {sidebarOpen && (
              <>
                <span className="hidden sm:inline flex-1 text-left">Administração</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'hidden sm:inline transition-transform duration-200',
                    adminOpen && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>

          {adminOpen && sidebarOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-[var(--sidebar-border)] pl-3">
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
                        : 'text-[var(--sidebar-foreground)] opacity-70 hover:bg-[var(--sidebar-accent)] hover:opacity-100'
                    )
                  }
                >
                  <item.icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-foreground)] opacity-70 transition-colors hover:bg-[var(--sidebar-accent)] hover:opacity-100"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="hidden sm:inline">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
