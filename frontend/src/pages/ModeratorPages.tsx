import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, platformApi, post, put } from '../api/client';
import { BarChartBlock, LineChartBlock, MetricGrid, PieChartBlock } from '../components/AnalyticsCharts';
import { EmptyState } from '../components/EmptyState';
import { LoadingBlock } from '../components/LoadingBlock';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useApi } from '../hooks/useApi';
import { AgentDefinition, Feedback, MasterPrompt, PracticalCase } from '../types';
import {
  agentCapabilityLabels,
  agentSpecializationLabels,
  agentStatusLabels,
  displayStatus
} from '../shared/labels';

export function ModeratorDashboardPage() {
  const navigate = useNavigate();
  const { data, loading, reload } = useApi(async () => {
    const [analytics, cases, agents, prompts, feedback] = await Promise.all([
      platformApi.analytics.moderatorDashboard(),
      get<PracticalCase[]>('/moderation/cases'),
      get<AgentDefinition[]>('/moderation/agents'),
      get<MasterPrompt[]>('/master-prompts'),
      get<Feedback[]>('/moderation/feedback')
    ]);
    return { analytics, cases, agents, prompts, feedback };
  }, []);

  async function approve(id: string) {
    await post(`/moderation/cases/${id}/approve`);
    await reload();
  }

  async function reject(id: string) {
    await post(`/moderation/cases/${id}/reject`);
    await reload();
  }

  if (loading || !data) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader title="Панель модератора" subtitle="Качество кейсов, сценариев помощи и обратной связи." />
      <Box sx={{ mb: 2 }}><MetricGrid metrics={data.analytics.metrics} /></Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={6}><BarChartBlock title="Самые востребованные наставники" data={data.analytics.agentUsage} /></Grid>
        <Grid item xs={12} lg={6}><PieChartBlock title="Оценка полезности наставников" data={data.analytics.agentUsefulness} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Кейсы на модерации</Typography>
              {!data.cases.length ? <EmptyState title="Нет кейсов на модерации" /> : (
                <Stack spacing={1}>
                  {data.cases.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                        <Box>
                          <Typography variant="h6">{item.title}</Typography>
                          <Typography color="text.secondary">{item.shortDescription}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button variant="contained" onClick={() => approve(item.id)}>Одобрить</Button>
                          <Button color="error" variant="outlined" onClick={() => reject(item.id)}>Отклонить</Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6">Быстрые действия</Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button variant="outlined" startIcon={<SmartToyRoundedIcon />} onClick={() => navigate('/moderator/agents')}>Открыть ИИ-наставников</Button>
                  <Button variant="outlined" startIcon={<TuneRoundedIcon />} onClick={() => navigate('/moderator/master-prompts')}>Открыть мастер-промпты</Button>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Качество обратной связи</Typography>
                {data.feedback.slice(0, 3).map((item) => <Alert key={item.id} severity="info" sx={{ mb: 1 }}>{item.text}</Alert>)}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function AgentManagementPage() {
  const { data, loading } = useApi(async () => {
    const [agents, analytics, prompts] = await Promise.all([
      get<AgentDefinition[]>('/agents'),
      platformApi.analytics.moderatorDashboard(),
      get<MasterPrompt[]>('/master-prompts')
    ]);
    return { agents, analytics, prompts };
  }, []);
  if (loading || !data) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader title="ИИ-наставники" subtitle="Настройка ИИ-наставников и сценариев помощи." />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}><StatCard title="Активных наставников" value={data.agents.filter((item) => item.status === 'ACTIVE').length} icon={<SmartToyRoundedIcon />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Сессий с наставниками" value={data.analytics.metrics.find((item) => item.label === 'mentorSessions')?.value ?? 0} icon={<InsightsRoundedIcon />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Средняя полезность" value={`${data.analytics.metrics.find((item) => item.label === 'agentUsefulness')?.value ?? 0}%`} icon={<FactCheckRoundedIcon />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Шаблонов поведения" value={data.prompts.length} icon={<TuneRoundedIcon />} /></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={6}><BarChartBlock title="Использование наставников" data={data.analytics.agentUsage} /></Grid>
        <Grid item xs={12} lg={6}><LineChartBlock title="Полезность по оценкам участников" data={data.analytics.agentUsefulness} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        {data.agents.map((agent, index) => {
          const usage = data.analytics.agentUsage[index % Math.max(data.analytics.agentUsage.length, 1)]?.value ?? 0;
          const usefulness = data.analytics.agentUsefulness[index % Math.max(data.analytics.agentUsefulness.length, 1)]?.value ?? 0;
          const prompt = data.prompts.find((item) => item.agentId === agent.id);
          return (
            <Grid item xs={12} md={6} lg={4} key={agent.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography variant="h6">{agent.name}</Typography>
                    <Chip label={agentStatusLabels[agent.status]} color={agent.status === 'ACTIVE' ? 'success' : 'default'} />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{agent.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}><b>Специализация:</b> {agentSpecializationLabels[agent.specialization]}</Typography>
                  <Typography variant="body2"><b>Мастер-промпт:</b> {prompt?.title ?? 'Не назначен'}</Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={4}><MetricMini label="Использований" value={usage} /></Grid>
                    <Grid item xs={4}><MetricMini label="Полезность" value={`${usefulness}%`} /></Grid>
                    <Grid item xs={4}><MetricMini label="Активность" value="Сегодня" /></Grid>
                  </Grid>
                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                    {agent.capabilities.map((capability) => <Chip size="small" key={capability} label={agentCapabilityLabels[capability] ?? capability} />)}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Последние сессии</Typography>
          <Stack spacing={1}>
            {data.analytics.recentSessions.map((session) => <Paper key={session} variant="outlined" sx={{ p: 1.5 }}>{session}</Paper>)}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export function MasterPromptManagementPage() {
  const { data, loading, reload } = useApi(async () => {
    const [prompts, agents] = await Promise.all([get<MasterPrompt[]>('/master-prompts'), get<AgentDefinition[]>('/agents')]);
    return { prompts, agents };
  }, []);
  const [selected, setSelected] = useState<MasterPrompt | null>(null);
  const [agentId, setAgentId] = useState('');
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (data?.agents.length && !agentId) setAgentId(data.agents[0].id);
  }, [data, agentId]);

  function edit(prompt: MasterPrompt) {
    setSelected(prompt);
    setAgentId(prompt.agentId);
    setTitle(prompt.title);
    setPromptText(prompt.promptText);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (selected) {
      await put<MasterPrompt>(`/master-prompts/${selected.id}`, { title, promptText });
      setNotice('Изменения сохранены');
    } else {
      await post<MasterPrompt>('/master-prompts', { agentId, title, promptText });
      setNotice('Мастер-промпт создан');
    }
    setSelected(null);
    setTitle('');
    setPromptText('');
    await reload();
  }

  async function activate(id: string) {
    await post(`/master-prompts/${id}/activate`);
    await reload();
  }

  async function archive(id: string) {
    await post(`/master-prompts/${id}/archive`);
    await reload();
  }

  if (loading || !data) return <LoadingBlock />;
  const agentsById = new Map(data.agents.map((agent) => [agent.id, agent]));
  return (
    <Box>
      <PageHeader title="Мастер-промпты наставников" subtitle="Шаблоны поведения наставников: версии, статусы и сценарии помощи." />
      <Alert severity="warning" sx={{ mb: 2 }}>
        Наставник должен помогать участнику думать и проверять решение, а не выполнять кейс вместо него.
      </Alert>
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>{selected ? 'Редактировать шаблон' : 'Создать шаблон'}</Typography>
              <Stack component="form" spacing={2} onSubmit={submit}>
                <TextField select label="Наставник" value={agentId} onChange={(event) => setAgentId(event.target.value)} fullWidth>
                  {data.agents.map((agent) => <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>)}
                </TextField>
                <TextField label="Название" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth required />
                <TextField label="Текст шаблона поведения" value={promptText} onChange={(event) => setPromptText(event.target.value)} multiline minRows={8} fullWidth required />
                <Button variant="contained" type="submit">{selected ? 'Сохранить изменения' : 'Создать шаблон'}</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Stack spacing={1}>
            {data.prompts.map((prompt) => (
              <Paper key={prompt.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Версия ${prompt.version}`} />
                      <Chip label={displayStatus(prompt.status)} color={prompt.status === 'ACTIVE' ? 'success' : 'default'} />
                      <Chip label={agentsById.get(prompt.agentId)?.name ?? 'Наставник'} variant="outlined" />
                    </Stack>
                    <Typography variant="h6">{prompt.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Изменил: {prompt.createdBy} · {new Date(prompt.updatedAt).toLocaleDateString('ru-RU')}</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line', mt: 1 }}>{prompt.promptText}</Typography>
                  </Box>
                  <Stack spacing={1} minWidth={160}>
                    <Button size="small" onClick={() => edit(prompt)}>Редактировать</Button>
                    <Button size="small" variant="outlined" onClick={() => activate(prompt.id)}>Активировать</Button>
                    <Button size="small" color="error" onClick={() => archive(prompt.id)}>Архивировать</Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function MetricMini({ label, value }: { label: string; value: string | number }) {
  return (
    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={900}>{value}</Typography>
    </Paper>
  );
}
