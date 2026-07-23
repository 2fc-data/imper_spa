import { useQuery } from '@tanstack/react-query'
import { Key } from 'lucide-react'
import { permissionApi, type Permission } from '@/services/admin-api'

export function PermissionsPage() {
  const { data: permissions, isLoading } = useQuery<Permission[]>({
    queryKey: ['admin-permissions'],
    queryFn: permissionApi.list,
  })

  const grouped = (permissions || []).reduce<Record<string, Permission[]>>((acc, p) => {
    const [resource] = p.name.split(':')
    if (!acc[resource]) acc[resource] = []
    acc[resource].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Permissões</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Visualize todas as permissões disponíveis no sistema.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Carregando...</div>
        ) : permissions?.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Key className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm font-medium">Nenhuma permissão encontrada.</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Execute o seed de IAM para popular as permissões.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {Object.entries(grouped).map(([resource, perms]) => (
              <div key={resource}>
                <h3 className="text-sm font-semibold uppercase text-[var(--muted-foreground)] mb-3">
                  {resource}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--secondary)] text-[var(--muted-foreground)] uppercase text-xs">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Permissão</th>
                        <th className="px-4 py-2 font-semibold">Descrição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {perms.map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--secondary)]/20 transition-colors">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded bg-[var(--secondary)] px-2.5 py-1 text-xs font-mono font-semibold">
                              {p.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
