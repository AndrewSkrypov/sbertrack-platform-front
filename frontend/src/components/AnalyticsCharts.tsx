import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import { ChartPoint, CompetencyAnalyticsPoint, Competency, Metric } from '../types';
import { competencyDescriptions, competencyLabels, displayStatus, roleLabels } from '../shared/labels';

const chartColors = ['#0b7a64', '#20a67a', '#2563eb', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

export function MetricCard({ metric, accent = '#0b7a64' }: { metric: Metric; accent?: string }) {
  const theme = useTheme();
  const trend = metric.trend;
  const hasTrend = trend !== null && trend !== undefined;
  const positive = hasTrend && trend >= 0;
  const trendColor = positive ? theme.palette.success.main : theme.palette.error.main;
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Цветная акцентная кромка — метрики перестают быть «серой таблицей». */}
      <Box aria-hidden sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: accent }} />
      <CardContent sx={{ pl: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accent }} />
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            {humanizeLabel(metric.label)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>
            {metric.value}
          </Typography>
          {metric.unit && <Typography color="text.secondary">{metric.unit}</Typography>}
        </Stack>
        {hasTrend && (
          <Box
            sx={{
              mt: 1.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              bgcolor: alpha(trendColor, 0.12),
              color: trendColor,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {positive ? <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />}
            {Math.abs(trend)}%
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>к прошлому периоду</Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

const metricAccents = ['#0b7a64', '#2563eb', '#f59e0b', '#8b5cf6'];

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} lg={3} key={metric.label}>
          <MetricCard metric={metric} accent={metricAccents[index % metricAccents.length]} />
        </Grid>
      ))}
    </Grid>
  );
}

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ height: 280, mt: subtitle ? 0 : 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

export function CompetencyRadarChart({
  data,
  title = 'Компас компетенций',
  subtitle = 'Проекция роста по пяти ключевым компетенциям'
}: {
  data: CompetencyAnalyticsPoint[];
  title?: string;
  subtitle?: string;
}) {
  const theme = useTheme();
  const chartData = data.map((item) => ({
    competency: competencyLabels[item.competency],
    value: item.value,
    description: competencyDescriptions[item.competency]
  }));
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke={alpha(theme.palette.primary.main, 0.22)} />
          <PolarAngleAxis dataKey="competency" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            allowEscapeViewBox={{ x: false, y: false }}
            wrapperStyle={{ zIndex: 10, maxWidth: 240 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as { competency: string; value: number; description: string };
              return (
                <Box sx={{ maxWidth: 240, p: 1.25, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 24px rgba(23,33,43,0.12)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={700}>{point.competency}</Typography>
                    <Typography variant="body2" fontWeight={800} color="primary.main">{point.value}%</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal' }}>
                    {point.description}
                  </Typography>
                </Box>
              );
            }}
          />
          <Radar
            name="Текущий уровень"
            dataKey="value"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
            fillOpacity={0.32}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PieChartBlock({ title, subtitle, data }: { title: string; subtitle?: string; data: ChartPoint[] }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={formatPoints(data)} dataKey="value" nameKey="label" innerRadius={58} outerRadius={96} paddingAngle={3}>
            {data.map((_, index) => (
              <Cell key={index} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BarChartBlock({ title, subtitle, data }: { title: string; subtitle?: string; data: ChartPoint[] }) {
  const theme = useTheme();
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatPoints(data)} margin={{ top: 8, right: 16, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.16)} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={50} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" name="Значение" radius={[8, 8, 0, 0]} fill={theme.palette.primary.main} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function LineChartBlock({ title, subtitle, data }: { title: string; subtitle?: string; data: ChartPoint[] }) {
  const theme = useTheme();
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatPoints(data)} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.16)} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" name="Качество" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function FunnelBlock({ title, subtitle, data }: { title: string; subtitle?: string; data: ChartPoint[] }) {
  const theme = useTheme();
  const max = Math.max(...data.map((point) => point.value), 1);
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {data.map((point, index) => (
            <Box key={point.label}>
              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="body2" fontWeight={800}>
                  {humanizeLabel(point.label)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {point.value}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(point.value / max) * 100}
                sx={{
                  height: 12,
                  borderRadius: 999,
                  bgcolor: alpha(chartColors[index % chartColors.length], 0.12),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    bgcolor: chartColors[index % chartColors.length]
                  }
                }}
              />
            </Box>
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Воронка помогает увидеть, где участники теряют темп и где нужна поддержка.
        </Typography>
      </CardContent>
    </Card>
  );
}

export function CompetencyExplanationCards() {
  return (
    <Grid container spacing={1.5}>
      {(Object.keys(competencyLabels) as Competency[]).map((competency, index) => {
        const accent = chartColors[index % chartColors.length];
        return (
          <Grid item xs={12} sm={6} key={competency}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color .15s, box-shadow .15s',
                '&:hover': { borderColor: alpha(accent, 0.5), boxShadow: `0 6px 18px ${alpha(accent, 0.12)}` }
              }}
            >
              {/* Небольшой фирменный «маяк»-акцент: мягкое свечение из угла карточки. */}
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(accent, 0.28)} 0%, ${alpha(accent, 0)} 70%)`
                }}
              />
              <CardContent sx={{ p: 2, position: 'relative' }}>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: 1.5,
                      flexShrink: 0,
                      display: 'grid',
                      placeItems: 'center',
                      color: 'white',
                      background: `linear-gradient(135deg, ${accent} 0%, ${alpha(accent, 0.7)} 100%)`,
                      boxShadow: `0 3px 8px ${alpha(accent, 0.35)}`
                    }}
                  >
                    <WbIncandescentRoundedIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                  </Box>
                  <Typography fontWeight={800}>{competencyLabels[competency]}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {competencyDescriptions[competency]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

function formatPoints(data: ChartPoint[]) {
  return data.map((point) => ({ ...point, label: humanizeLabel(point.label) }));
}

export function humanizeLabel(label: string): string {
  const normalized = displayStatus(label);
  if (normalized !== label) return normalized;
  if (label in roleLabels) return roleLabels[label as keyof typeof roleLabels];
  const known: Record<string, string> = {
    completedCases: 'Завершено кейсов',
    activeSubmissions: 'В работе',
    averageFeedbackScore: 'Средний балл по обратной связи',
    roadmapProgress: 'Прогресс траектории',
    usedAgents: 'Использовано ИИ-наставников',
    portfolioArtifacts: 'Артефакты в портфолио',
    participantsTotal: 'Всего участников',
    activeParticipants: 'Активные участники',
    submissionsSent: 'Решений отправлено',
    submissionsAccepted: 'Решений принято',
    needsImprovement: 'Решений на доработке',
    priorityCandidates: 'Приоритетных кандидатов',
    averageCompetency: 'Средний уровень компетенций',
    moderatedCases: 'Одобрено кейсов',
    rejectedCases: 'Отклонено кейсов',
    mentorSessions: 'Сессий с наставниками',
    feedbackCreated: 'Создано обратной связи',
    agentUsefulness: 'Полезность наставников',
    usersTotal: 'Участники',
    organizations: 'Организации',
    customers: 'Заказчики',
    students: 'Студенты',
    schoolStudents: 'Школьники',
    moderators: 'Модераторы',
    activeCases: 'Активные кейсы',
    activeTracks: 'Активные треки',
    submissionsTotal: 'Отправленные решения',
    agentActivity: 'Активность ИИ-наставников',
    trackSelected: 'Выбран трек',
    caseStarted: 'Начат кейс',
    submitted: 'Отправлено решение',
    feedbackReceived: 'Получена обратная связь',
    portfolioAdded: 'Добавлено в портфолио',
    caseViewed: 'Просмотр кейса',
    accepted: 'Принятие',
    priority: 'Приоритетный кандидат'
  };
  return known[label] ?? label;
}
