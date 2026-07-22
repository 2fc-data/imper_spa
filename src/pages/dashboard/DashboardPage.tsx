import { Users, TrendingUp, FileText, DollarSign } from 'lucide-react'
import {
  useDashboardSummary,
  useDashboardPipeline,
  useDashboardOrigins,
  useDashboardPerformers,
  useDashboardActivities,
} from '@/hooks/useDashboard'
import { formatCurrency } from '@/lib/utils'

export function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useDashboardSummary()
  const { data: pipeline, isLoading: loadingPipeline } = useDashboardPipeline()
  const { data: origins, isLoading: loadingOrigins } = useDashboardOrigins()
  const { data: performers, isLoading: loadingPerformers } = useDashboardPerformers()
  const { data: activities, isLoading: loadingActivities } = useDashboardActivities()

  const summaryData = summary?.data
  const pipelineData = pipeline?.data?.stages || []
  const originsData = origins?.data?.origins || []
  const performersData = performers?.data?.performers || []
  const activitiesData = activities?.data?.recent || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Leads"
          value={summaryData?.totalLeads ?? 0}
          icon={Users}
          loading={loadingSummary}
        />
        <KPICard
          title="Pipeline"
          value={formatCurrency(summaryData?.opportunitiesValue ?? 0)}
          icon={DollarSign}
          loading={loadingSummary}
        />
        <KPICard
          title="Taxa de Conversão"
          value={`${summaryData?.conversionRate ?? 0}%`}
          icon={TrendingUp}
          loading={loadingSummary}
        />
        <KPICard
          title="Oportunidades"
          value={summaryData?.totalOpportunities ?? 0}
          icon={FileText}
          loading={loadingSummary}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pipeline */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Pipeline por Estágio</h2>
          {loadingPipeline ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              {pipelineData.map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm capitalize">{item.status}</span>
                  <div className="flex-1">
                    <div className="h-6 rounded bg-[var(--secondary)]">
                      <div
                        className="h-6 rounded bg-[var(--primary)]"
                        style={{
                          width: `${Math.min((item.count / (pipelineData[0]?.count || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Origins */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Leads por Origem</h2>
          {loadingOrigins ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              {originsData.map((item) => (
                <div key={item.source} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm">{item.source}</span>
                  <div className="flex-1">
                    <div className="h-6 rounded bg-[var(--secondary)]">
                      <div
                        className="h-6 rounded bg-[var(--primary)]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Performers</h2>
          {loadingPerformers ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              {performersData.map((item, index) => (
                <div key={item.userId} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {item.leadsCount} leads
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.wonValue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Últimas Atividades</h2>
          {loadingActivities ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              {activitiesData.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)]">
                    <FileText size={14} className="text-[var(--muted-foreground)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {item.leadName} • {new Date(item.scheduledAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KPICard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string
  value: string | number
  icon: any
  loading: boolean
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
        <Icon size={20} className="text-[var(--muted-foreground)]" />
      </div>
      <p className="mt-2 text-2xl font-bold">
        {loading ? (
          <span className="inline-block h-7 w-20 animate-pulse rounded bg-[var(--secondary)]" />
        ) : (
          value
        )}
      </p>
    </div>
  )
}
