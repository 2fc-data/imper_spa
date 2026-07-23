import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateColaborador } from '@/hooks/useColaboradores'
import type { Colaborador } from '@/services/colaboradores.service'

const TIPOS = [
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'terceiro', label: 'Terceiro' },
]

const STATUS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'afastado', label: 'Afastado' },
  { value: 'desligado', label: 'Desligado' },
]

const CONTRATOS = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'estagio', label: 'Estágio' },
  { value: 'temporario', label: 'Temporário' },
  { value: 'terceirizado', label: 'Terceirizado' },
]

export function CreateColaboradorPage() {
  const navigate = useNavigate()
  const createColaborador = useCreateColaborador()
  const [form, setForm] = useState({
    nome: '',
    tipo: 'funcionario',
    status: 'ativo',
    contrato: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf: '',
    rg: '',
    orgaoEmissor: '',
    cnh: '',
    categoriaCnh: '',
    razaoSocial: '',
    cnpj: '',
    observacoes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createColaborador.mutateAsync(form as Partial<Colaborador>)
      navigate('/admin/colaboradores')
    } catch (err) {
      console.error('Erro ao criar colaborador:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/colaboradores" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Novo Colaborador</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dados Pessoais */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dados Pessoais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contrato</label>
              <select name="contrato" value={form.contrato} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                <option value="">Selecione</option>
                {CONTRATOS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endereço</label>
            <input name="endereco" value={form.endereco} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
          </div>
        </section>

        {/* Documentos - Funcionário */}
        {form.tipo === 'funcionario' && (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Documentos (Funcionário)</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input name="cpf" value={form.cpf} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RG</label>
                <input name="rg" value={form.rg} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Órgão Emissor</label>
                <input name="orgaoEmissor" value={form.orgaoEmissor} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CNH</label>
                <input name="cnh" value={form.cnh} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoria CNH</label>
                <input name="categoriaCnh" value={form.categoriaCnh} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
            </div>
          </section>
        )}

        {/* Documentos - Terceiro */}
        {form.tipo === 'terceiro' && (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Dados Empresariais (Terceiro)</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">Razão Social</label>
                <input name="razaoSocial" value={form.razaoSocial} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CNPJ</label>
                <input name="cnpj" value={form.cnpj} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
              </div>
            </div>
          </section>
        )}

        {/* Observações */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Observações</h2>
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} rows={3} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
        </section>

        <div className="flex justify-end gap-3">
          <Link to="/admin/colaboradores" className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]">Cancelar</Link>
          <button type="submit" disabled={createColaborador.isPending} className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50">
            {createColaborador.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
