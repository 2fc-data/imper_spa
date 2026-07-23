import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage'
import { PublicForm } from './pages/public/PublicForm'
import { ProposalView } from './pages/public/ProposalView'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { LeadsPage } from './pages/crm/leads/LeadsPage'
import { LeadDetailPage } from './pages/crm/leads/LeadDetailPage'
import { CreateLeadPage } from './pages/crm/leads/CreateLeadPage'
import { FunnelPage } from './pages/crm/funil/FunnelPage'
import { ProposalsPage } from './pages/crm/propostas/ProposalsPage'
import { ProposalDetailPage } from './pages/crm/propostas/ProposalDetailPage'
import { CreateProposalPage } from './pages/crm/propostas/CreateProposalPage'
import { AgendaPage } from './pages/crm/agenda/AgendaPage'
import { ClientsPage } from './pages/crm/clientes/ClientsPage'
import { ClientDetailPage } from './pages/crm/clientes/ClientDetailPage'
import { CreateClientPage } from './pages/crm/clientes/CreateClientPage'
import { AuditPage } from './pages/crm/audit/AuditPage'
import { SettingsPage } from './pages/configuracoes/SettingsPage'
import { ServicesManagementPage } from './pages/configuracoes/ServicesManagementPage'
import { NotificationsPage } from './pages/notificacoes/NotificationsPage'
import { OrganizationsPage } from './pages/admin/organization/OrganizationsPage'
import { DepartmentsPage } from './pages/admin/organization/DepartmentsPage'
import { TeamsPage } from './pages/admin/organization/TeamsPage'
import { CostCentersPage } from './pages/admin/organization/CostCentersPage'
import { RolesPage } from './pages/admin/iam/RolesPage'
import { PermissionsPage } from './pages/admin/iam/PermissionsPage'
import { DelegationsPage } from './pages/admin/iam/DelegationsPage'
import { ConfigurationPage } from './pages/admin/configuration/ConfigurationPage'
import { ColaboradoresPage } from './pages/infra/colaboradores/ColaboradoresPage'
import { CreateColaboradorPage } from './pages/infra/colaboradores/CreateColaboradorPage'
import { ColaboradorDetailPage } from './pages/infra/colaboradores/ColaboradorDetailPage'
import { PatrimonioPage } from './pages/infra/patrimonio/PatrimonioPage'
import { CreateAssetPage } from './pages/infra/patrimonio/CreateAssetPage'
import { AssetDetailPage } from './pages/infra/patrimonio/AssetDetailPage'
import { useDarkMode } from './hooks/useDarkMode'

const queryClient = new QueryClient()

function DarkModeSync() {
  useDarkMode()
  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeSync />
      <BrowserRouter>
        <Routes>
          {/* Public — Landing & auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/formulario" element={<PublicForm />} />
          <Route path="/propostas/:token/view" element={<ProposalView />} />

          {/* Protected */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* CRM */}
            <Route path="/crm/leads" element={<LeadsPage />} />
            <Route path="/crm/leads/novo" element={<CreateLeadPage />} />
            <Route path="/crm/leads/:id" element={<LeadDetailPage />} />
            <Route path="/crm/funil" element={<FunnelPage />} />
            <Route path="/crm/propostas" element={<ProposalsPage />} />
            <Route path="/crm/propostas/novo" element={<CreateProposalPage />} />
            <Route path="/crm/propostas/:id" element={<ProposalDetailPage />} />
            <Route path="/crm/agenda" element={<AgendaPage />} />

            {/* Config */}
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />

            {/* Admin — Organização */}
            <Route path="/admin/organizacoes" element={<OrganizationsPage />} />
            <Route path="/admin/departamentos" element={<DepartmentsPage />} />
            <Route path="/admin/equipes" element={<TeamsPage />} />
            <Route path="/admin/centros-custo" element={<CostCentersPage />} />

            {/* Admin — IAM */}
            <Route path="/admin/cargos" element={<RolesPage />} />
            <Route path="/admin/permissoes" element={<PermissionsPage />} />
            <Route path="/admin/delegacoes" element={<DelegationsPage />} />

            {/* Admin — Configuração */}
            <Route path="/admin/configuracao" element={<ConfigurationPage />} />
            <Route path="/admin/servicos" element={<ServicesManagementPage />} />

            {/* Admin — Clientes & Auditoria */}
            <Route path="/admin/clientes" element={<ClientsPage />} />
            <Route path="/admin/clientes/novo" element={<CreateClientPage />} />
            <Route path="/admin/clientes/:id" element={<ClientDetailPage />} />
            <Route path="/admin/audit" element={<AuditPage />} />

            {/* Admin — Colaboradores */}
            <Route path="/admin/colaboradores" element={<ColaboradoresPage />} />
            <Route path="/admin/colaboradores/novo" element={<CreateColaboradorPage />} />
            <Route path="/admin/colaboradores/:id" element={<ColaboradorDetailPage />} />

            {/* Infra — Patrimônio */}
            <Route path="/infra/patrimonio" element={<PatrimonioPage />} />
            <Route path="/infra/patrimonio/novo" element={<CreateAssetPage />} />
            <Route path="/infra/patrimonio/:id" element={<AssetDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
