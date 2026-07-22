import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'

export function SettingsPage() {
  const { user } = useAuthStore()
  const { darkMode, toggleDarkMode } = useUIStore()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Perfil */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
                Nome
              </label>
              <p className="text-sm">{user?.name || '-'}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
                Email
              </label>
              <p className="text-sm">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
                Cargo
              </label>
              <p className="text-sm capitalize">{user?.role?.toLowerCase().replace('_', ' ') || '-'}</p>
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Aparência</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Modo Escuro</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Alterar entre tema claro e escuro
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  darkMode ? 'bg-[var(--primary)]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">Versão</p>
              <p className="text-sm font-medium">1.0.0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">API</p>
              <p className="text-sm font-medium">ImperPoços API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
