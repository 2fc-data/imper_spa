import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useColaborador, useDeleteColaborador, useColaboradorEmergencia, useColaboradorEpi } from '@/hooks/useColaboradores'
import { formatDate } from '@/lib/utils'

const statusColors: Record<string, string> = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-gray-100 text-gray-700',
  afastado: 'bg-yellow-100 text-yellow-700',
  desligado: 'bg-red-100 text-red-700',
}

const tipoLabels: Record<string, string> = {
  funcionario: 'Funcionário',
  terceiro: 'Terceiro',
}

export function ColaboradorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useColaborador(id!)
  const deleteColaborador = useDeleteColaborador()
  const { data: emergencia } = useColaboradorEmergencia(id!)
  const { data: epis } = useColaboradorEpi(id!)

  if (isLoading) return <div className="py-12 text-center text-[var(--muted-foreground)]">Carregando...</div>
  if (!data?.data) return <div className="py-12 text-center text-[var(--muted-foreground)]">Colaborador não encontrado</div>

  const c = data.data

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    await deleteColaborador.mutateAsync(id!)
    navigate('/admin/colaboradores')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/colaboradores" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{c.nome}</h1>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status] || ''}`}>
            {c.status}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {tipoLabels[c.tipo] || c.tipo}
          </span>
        </div>
        <div className="flex gap-2">
          <Link to={`/admin/colaboradores/${id}/editar`} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--secondary)]">
            <Pencil size={14} /> Editar
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>

      {/* Dados Pessoais */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Dados Pessoais</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Email" value={c.email} />
          <Info label="Telefone" value={c.telefone} />
          <Info label="Contrato" value={c.contrato} />
          <Info label="Endereço" value={c.endereco} />
          <Info label="Data de Nascimento" value={formatDate(c.dataNascimento ?? '')} />
          <Info label="Data de Admissão" value={formatDate(c.dataAdmissao ?? '')} />
        </div>
      </section>

      {/* Documentos */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Documentos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.tipo === 'funcionario' && (
            <>
              <Info label="CPF" value={c.cpf} />
              <Info label="RG" value={c.rg} />
              <Info label="Órgão Emissor" value={c.orgaoEmissor} />
              <Info label="CNH" value={c.cnh} />
              <Info label="Categoria CNH" value={c.categoriaCnh} />
            </>
          )}
          {c.tipo === 'terceiro' && (
            <>
              <Info label="Razão Social" value={c.razaoSocial} />
              <Info label="CNPJ" value={c.cnpj} />
              <Info label="Inscrição Estadual" value={c.inscricaoEstadual} />
            </>
          )}
        </div>
      </section>

      {/* Contatos de Emergência */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contatos de Emergência</h2>
        {emergencia?.data?.length ? (
          <div className="space-y-3">
            {emergencia.data.map((e) => (
              <div key={e.id} className="rounded-lg border border-[var(--border)] p-4">
                <p className="font-medium">{e.nome}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{e.parentesco} — {e.telefone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Nenhum contato cadastrado</p>
        )}
      </section>

      {/* EPIs */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Registro de EPIs</h2>
        {epis?.data?.length ? (
          <div className="space-y-3">
            {epis.data.map((e) => (
              <div key={e.id} className="rounded-lg border border-[var(--border)] p-4">
                <p className="font-medium">{e.nome}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {e.tipo} — Entrega: {formatDate(e.dataEntrega)} — Status: {e.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Nenhum EPI registrado</p>
        )}
      </section>

      {/* Observações */}
      {c.observacoes && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Observações</h2>
          <p className="text-sm whitespace-pre-wrap">{c.observacoes}</p>
        </section>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      <p className="text-sm font-medium">{value || '-'}</p>
    </div>
  )
}
