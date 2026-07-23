import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useAsset, useDeleteAsset, useAssetAssignments } from '@/hooks/usePatrimonio'
import { formatDate, formatCurrency } from '@/lib/utils'

const tipoLabels: Record<string, string> = { veiculo: 'Veículo', equipamento: 'Equipamento', imovel: 'Imóvel', mobilario: 'Mobiliário' }
const estadoLabels: Record<string, string> = { otimo: 'Ótimo', bom: 'Bom', regular: 'Regular', ruim: 'Ruim', pessimo: 'Péssimo' }
const statusLabels: Record<string, string> = { disponivel: 'Disponível', em_uso: 'Em Uso', manutencao: 'Manutenção', inativo: 'Inativo', aposentado: 'Aposentado' }

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useAsset(id!)
  const deleteAsset = useDeleteAsset()
  const { data: assignments } = useAssetAssignments(id!)

  if (isLoading) return <div className="py-12 text-center text-[var(--muted-foreground)]">Carregando...</div>
  if (!data?.data) return <div className="py-12 text-center text-[var(--muted-foreground)]">Ativo não encontrado</div>

  const a = data.data

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    await deleteAsset.mutateAsync(id!)
    navigate('/infra/patrimonio')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/infra/patrimonio" className="rounded-lg p-2 hover:bg-[var(--secondary)]"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">{a.nome}</h1>
          <span className="font-mono text-sm text-[var(--muted-foreground)]">{a.codigo}</span>
        </div>
        <div className="flex gap-2">
          <Link to={`/infra/patrimonio/${id}/editar`} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--secondary)]"><Pencil size={14} /> Editar</Link>
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Excluir</button>
        </div>
      </div>

      {/* Dados Gerais */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Dados Gerais</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Tipo" value={tipoLabels[a.tipo]} />
          <Info label="Estado" value={estadoLabels[a.estado ?? ''] || '-'} />
          <Info label="Status" value={statusLabels[a.status ?? ''] || '-'} />
          <Info label="Data Aquisição" value={a.dataAquisicao ? formatDate(a.dataAquisicao) : '-'} />
          <Info label="Valor Investido" value={a.valorInvestido != null ? formatCurrency(a.valorInvestido) : '-'} />
          <Info label="Valor Atual" value={a.valorAtual != null ? formatCurrency(a.valorAtual) : '-'} />
        </div>
        {a.descricao && <p className="text-sm text-[var(--muted-foreground)]">{a.descricao}</p>}
      </section>

      {/* Veículo */}
      {a.tipo === 'veiculo' && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dados do Veículo</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Placa" value={a.placa} />
            <Info label="Marca" value={a.marca} />
            <Info label="Modelo" value={a.modelo} />
            <Info label="Ano" value={a.ano} />
            <Info label="Cor" value={a.cor} />
            <Info label="Combustível" value={a.combustivel} />
            <Info label="KM" value={a.km?.toLocaleString()} />
            <Info label="Chassi" value={a.chassi} />
            <Info label="RENAVAM" value={a.renavam} />
            <Info label="Seguro" value={a.seguro} />
            <Info label="Licenciamento" value={a.licenciamento ? formatDate(a.licenciamento) : '-'} />
          </div>
        </section>
      )}

      {/* Equipamento */}
      {a.tipo === 'equipamento' && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dados do Equipamento</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Nº Série" value={a.nroSerie} />
            <Info label="Marca" value={a.marca} />
            <Info label="Modelo" value={a.modelo} />
            <Info label="Garantia" value={a.garantia ? formatDate(a.garantia) : '-'} />
            <Info label="Localização" value={a.localizacao} />
            <Info label="Material" value={a.material} />
          </div>
        </section>
      )}

      {/* Imóvel */}
      {a.tipo === 'imovel' && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dados do Imóvel</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Endereço" value={a.endereco} />
            <Info label="Matrícula" value={a.matricula} />
            <Info label="Área" value={a.area ? `${a.area} m²` : undefined} />
            <Info label="Finalidade" value={a.finalidade} />
            <Info label="Situação" value={a.situacao} />
          </div>
        </section>
      )}

      {/* Alocações */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Alocações</h2>
        {assignments?.data?.length ? (
          <div className="space-y-3">
            {assignments.data.map((al) => (
              <div key={al.id} className="rounded-lg border border-[var(--border)] p-4">
                <p className="font-medium">{al.colaborador?.nome || al.colaboradorId}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {formatDate(al.startDate)} — {al.endDate ? formatDate(al.endDate) : 'Atual'}
                  {al.motivo ? ` — ${al.motivo}` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Nenhuma alocação registrada</p>
        )}
      </section>

      {a.observacoes && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Observações</h2>
          <p className="text-sm whitespace-pre-wrap">{a.observacoes}</p>
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
