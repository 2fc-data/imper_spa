import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { useClient } from '@/hooks/useClients'
import { formatDate } from '@/lib/utils'

const statusColors: Record<string, string> = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-gray-100 text-gray-700',
  bloqueado: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado',
}

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useClient(id!)

  const client = data?.data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--muted-foreground)]">Carregando...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-[var(--muted-foreground)]">Cliente não encontrado</p>
        <Link to="/admin/clientes" className="mt-4 text-sm text-[var(--primary)] hover:underline">
          Voltar para clientes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/clientes"
          className="rounded-lg border border-[var(--border)] p-2 hover:bg-[var(--secondary)]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{client.name}</h1>
          {client.companyName && (
            <p className="text-[var(--muted-foreground)]">{client.companyName}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[client.status] || ''}`}
        >
          {statusLabels[client.status] || client.status}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Contato</h3>
          <div className="space-y-2">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-[var(--muted-foreground)]" />
                {client.email}
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-[var(--muted-foreground)]" />
                {client.phone}
              </div>
            )}
            {client.whatsapp && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-green-600" />
                WhatsApp: {client.whatsapp}
              </div>
            )}
            {client.contactPerson && (
              <div className="text-sm">
                <span className="text-[var(--muted-foreground)]">Contato: </span>
                {client.contactPerson}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Endereço</h3>
          <div className="space-y-2">
            {client.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-[var(--muted-foreground)]" />
                {client.address}
              </div>
            )}
            {client.city && client.state && (
              <div className="text-sm">
                {client.city} - {client.state}
              </div>
            )}
            {client.cpfCnpj && (
              <div className="text-sm">
                <span className="text-[var(--muted-foreground)]">CPF/CNPJ: </span>
                {client.cpfCnpj}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Estatísticas</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={14} className="text-[var(--muted-foreground)]" />
              <span>{client.completedProjects} projetos concluídos</span>
            </div>
            <div className="text-sm">
              <span className="text-[var(--muted-foreground)]">Compras: </span>
              {client.totalPurchases}
            </div>
            <div className="text-sm">
              <span className="text-[var(--muted-foreground)]">Criado em: </span>
              {formatDate(client.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Notas</h3>
          <p className="whitespace-pre-wrap text-sm">{client.notes}</p>
        </div>
      )}

      {/* Tags */}
      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
