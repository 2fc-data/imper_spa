import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateAsset } from '@/hooks/usePatrimonio'

const TIPOS = [
  { value: 'veiculo', label: 'Veículo' },
  { value: 'equipamento', label: 'Equipamento' },
  { value: 'imovel', label: 'Imóvel' },
  { value: 'mobilario', label: 'Mobiliário' },
]

const ESTADOS = [
  { value: 'otimo', label: 'Ótimo' },
  { value: 'bom', label: 'Bom' },
  { value: 'regular', label: 'Regular' },
  { value: 'ruim', label: 'Ruim' },
  { value: 'pessimo', label: 'Péssimo' },
]

const STATUS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'em_uso', label: 'Em Uso' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'aposentado', label: 'Aposentado' },
]

const COMBUSTIVEIS = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'alcool', label: 'Álcool' },
  { value: 'flex', label: 'Flex' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' },
]

export function CreateAssetPage() {
  const navigate = useNavigate()
  const createAsset = useCreateAsset()
  const [tipo, setTipo] = useState('veiculo')
  const [form, setForm] = useState({
    nome: '',
    tipo: 'veiculo',
    descricao: '',
    dataAquisicao: '',
    valorInvestido: '',
    valorAtual: '',
    estado: 'bom',
    status: 'disponivel',
    observacoes: '',
    // Veículo
    placa: '',
    chassi: '',
    marca: '',
    modelo: '',
    ano: '',
    renavam: '',
    cor: '',
    combustivel: '',
    km: '',
    seguro: '',
    licenciamento: '',
    dataVencSeguro: '',
    // Equipamento
    nroSerie: '',
    garantia: '',
    manualUrl: '',
    localizacao: '',
    material: '',
    // Imóvel
    endereco: '',
    matricula: '',
    area: '',
    finalidade: '',
    situacao: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = { ...form, tipo }
    if (payload.valorInvestido) payload.valorInvestido = Number(payload.valorInvestido)
    if (payload.valorAtual) payload.valorAtual = Number(payload.valorAtual)
    if (payload.ano) payload.ano = Number(payload.ano)
    if (payload.km) payload.km = Number(payload.km)
    if (payload.area) payload.area = Number(payload.area)
    try {
      await createAsset.mutateAsync(payload)
      navigate('/infra/patrimonio')
    } catch (err) {
      console.error('Erro ao criar ativo:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/infra/patrimonio" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Novo Ativo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dados Gerais */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dados Gerais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select value={tipo} onChange={(e) => { setTipo(e.target.value); setForm((p) => ({ ...p, tipo: e.target.value })) }} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Aquisição</label>
              <input name="dataAquisicao" type="date" value={form.dataAquisicao} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Investido</label>
              <input name="valorInvestido" type="number" value={form.valorInvestido} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Atual</label>
              <input name="valorAtual" type="number" value={form.valorAtual} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={2} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
          </div>
        </section>

        {/* Veículo */}
        {tipo === 'veiculo' && (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Dados do Veículo</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><label className="block text-sm font-medium mb-1">Placa</label><input name="placa" value={form.placa} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Marca</label><input name="marca" value={form.marca} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Modelo</label><input name="modelo" value={form.modelo} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Ano</label><input name="ano" type="number" value={form.ano} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Cor</label><input name="cor" value={form.cor} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Combustível</label><select name="combustivel" value={form.combustivel} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"><option value="">Selecione</option>{COMBUSTIVEIS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">KM</label><input name="km" type="number" value={form.km} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Chassi</label><input name="chassi" value={form.chassi} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">RENAVAM</label><input name="renavam" value={form.renavam} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Seguro</label><input name="seguro" value={form.seguro} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Licenciamento</label><input name="licenciamento" type="date" value={form.licenciamento} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
            </div>
          </section>
        )}

        {/* Equipamento */}
        {tipo === 'equipamento' && (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Dados do Equipamento</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><label className="block text-sm font-medium mb-1">Nº Série</label><input name="nroSerie" value={form.nroSerie} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Marca</label><input name="marca" value={form.marca} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Modelo</label><input name="modelo" value={form.modelo} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Garantia</label><input name="garantia" type="date" value={form.garantia} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Localização</label><input name="localizacao" value={form.localizacao} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Material</label><input name="material" value={form.material} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
            </div>
          </section>
        )}

        {/* Imóvel */}
        {tipo === 'imovel' && (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Dados do Imóvel</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><label className="block text-sm font-medium mb-1">Endereço</label><input name="endereco" value={form.endereco} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Matrícula</label><input name="matricula" value={form.matricula} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Área (m²)</label><input name="area" type="number" value={form.area} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Finalidade</label><input name="finalidade" value={form.finalidade} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Situação</label><input name="situacao" value={form.situacao} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" /></div>
            </div>
          </section>
        )}

        <div className="flex justify-end gap-3">
          <Link to="/infra/patrimonio" className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]">Cancelar</Link>
          <button type="submit" disabled={createAsset.isPending} className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50">
            {createAsset.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
