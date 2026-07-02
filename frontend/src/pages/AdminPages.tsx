import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import { SvgIconComponent } from '@mui/icons-material';
import { CompetencyRadarChart, FunnelBlock, LineChartBlock, MetricGrid, PieChartBlock, BarChartBlock } from '../components/AnalyticsCharts';
import { LoadingBlock } from '../components/LoadingBlock';
import { PageHeader } from '../components/PageHeader';
import { GradientIcon } from '../components/GradientIcon';
import { useApi } from '../hooks/useApi';
import { AdminDashboard } from '../types';
import { get, platformApi } from '../api/client';
import { agentStatusLabels, displayStatus, roleLabels, userStatusLabels } from '../shared/labels';

export function AdminDashboardPage() {
  const { data, loading } = useApi(async () => {
    const [dashboard, analytics] = await Promise.all([
      get<AdminDashboard>('/admin/dashboard'),
      platformApi.analytics.adminDashboard()
    ]);
    return { dashboard, analytics };
  }, []);
  if (loading || !data) return <LoadingBlock />;
  const stats = data.dashboard.statistics;
  const managementMetrics: Array<{ label: string; value: number; Icon: SvgIconComponent }> = [
    { label: 'Участники', value: stats.usersCount, Icon: PeopleAltRoundedIcon },
    { label: 'Организации', value: data.analytics.metrics.find((item) => item.label === 'organizations')?.value ?? 0, Icon: BusinessRoundedIcon },
    { label: 'Треки', value: stats.tracksCount, Icon: RouteRoundedIcon },
    { label: 'Кейсы', value: stats.casesCount, Icon: WorkRoundedIcon },
    { label: 'Отправленные решения', value: stats.submissionsCount, Icon: SendRoundedIcon },
    { label: 'Витрина кандидатов', value: stats.cvBookCandidatesCount, Icon: BadgeRoundedIcon },
    { label: 'ИИ-наставники', value: stats.activeAgentsCount, Icon: SmartToyRoundedIcon },
    { label: 'Обратная связь', value: data.dashboard.submissions.reduce((sum, item) => sum + item.feedbackIds.length, 0), Icon: FeedbackRoundedIcon }
  ];
  return (
    <Box>
      <PageHeader hero title="Системная панель" subtitle="Управление участниками, организациями, кейсами, наставниками и системными метриками." />
      <Box sx={{ mb: 2 }}><MetricGrid metrics={data.analytics.metrics} /></Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={3}><PieChartBlock title="Пользователи по ролям" data={data.analytics.usersByRole} /></Grid>
        <Grid item xs={12} lg={3}><BarChartBlock title="Кейсы по статусам" data={data.analytics.casesByStatus} /></Grid>
        <Grid item xs={12} lg={3}><LineChartBlock title="Активность платформы" data={data.analytics.activityDynamics} /></Grid>
        <Grid item xs={12} lg={3}><CompetencyRadarChart title="Средняя карта компетенций платформы" data={data.analytics.platformCompetencies} /></Grid>
        <Grid item xs={12}><FunnelBlock title="Воронка участия" data={data.analytics.participationFunnel} /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {managementMetrics.map(({ label, value, Icon }, index) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>{label}</Typography>
                    <Typography variant="h4" fontWeight={800}>{value}</Typography>
                  </Box>
                  <GradientIcon icon={<Icon />} variant={(['brand', 'blue', 'amber', 'violet'] as const)[index % 4]} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Участники</Typography>
              <Table size="small">
                <TableHead><TableRow><TableCell>ФИО</TableCell><TableCell>Роль</TableCell><TableCell>Организация</TableCell><TableCell>Статус</TableCell></TableRow></TableHead>
                <TableBody>
                  {data.dashboard.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell><Chip size="small" label={roleLabels[user.role]} /></TableCell>
                      <TableCell>{user.organizationName}</TableCell>
                      <TableCell><Chip size="small" label={userStatusLabels[user.status]} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Кейсы и решения</Typography>
              <Table size="small">
                <TableHead><TableRow><TableCell>Кейс</TableCell><TableCell>Статус</TableCell><TableCell>Заказчик</TableCell></TableRow></TableHead>
                <TableBody>
                  {data.dashboard.cases.slice(0, 8).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell><Chip size="small" label={displayStatus(item.status)} /></TableCell>
                      <TableCell>{item.customerName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>Отправленные решения</Typography>
              <Stack spacing={1}>{data.dashboard.submissions.slice(0, 5).map((item) => <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}><Stack direction="row" justifyContent="space-between"><Typography>{item.title}</Typography><Chip size="small" label={displayStatus(item.status)} /></Stack></Paper>)}</Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>ИИ-наставники</Typography>
              <Stack spacing={1}>
                {data.dashboard.agents.map((agent) => (
                  <Paper key={agent.id} variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography fontWeight={900}>{agent.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{agent.description}</Typography>
                      </Box>
                      <Chip size="small" label={agentStatusLabels[agent.status]} />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Блоки управления</Typography>
              <Grid container spacing={1}>
                {['Участники', 'Организации', 'Заказчики', 'Модераторы', 'Треки', 'Кейсы', 'ИИ-наставники', 'Обратная связь', 'Системные метрики'].map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Paper variant="outlined" sx={{ p: 1.25 }}>
                      <Typography fontWeight={800}>{item}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
