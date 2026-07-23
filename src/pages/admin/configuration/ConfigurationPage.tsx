import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Settings, Eye, EyeOff } from 'lucide-react'
import { configApi, type ConfigCategory, type ConfigKey } from '@/services/admin-api'

export function ConfigurationPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const { data: categories } = useQuery<ConfigCategory[]>({
    queryKey: ['admin-config-categories'],
    queryFn: configApi.listCategories,
  })

  const { data: keys, isLoading: keysLoading } = useQuery<ConfigKey[]>({
    queryKey: ['admin-config-keys', selectedCategoryId],
    queryFn: () => configApi.listKeys(selectedCategoryId || undefined),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuração</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Visualize as chaves de configuração do sistema.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Categoria:</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="">Todas</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {keysLoading ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Carregando...</div>
        ) : keys?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Settings className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhuma chave encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Categoria</th>
                  <th className="px-6 py-3 font-semibold">Chave</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Tipo</th>
                  <th className="px-6 py-3 font-semibold">Cript.</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {keys?.map((key) => (
                  <tr key={key.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{key.category?.name || '-'}</td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-[var(--card-foreground)]">{key.key}</td>
                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{key.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium">
                        {key.type || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {key.isEncrypted ? (
                        <EyeOff size={16} className="text-orange-500" />
                      ) : (
                        <Eye size={16} className="text-[var(--muted-foreground)]" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {key.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-600">
                          Inativa
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
