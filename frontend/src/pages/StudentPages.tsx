import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, platformApi, post, put } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import {
  BarChartBlock,
  CompetencyExplanationCards,
  CompetencyRadarChart,
  FunnelBlock,
  LineChartBlock,
  MetricGrid,
  PieChartBlock
} from '../components/AnalyticsCharts';
import { CompetencyBars } from '../components/CompetencyBars';
import { EmptyState } from '../components/EmptyState';
import { LoadingBlock } from '../components/LoadingBlock';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useApi } from '../hooks/useApi';
import { brand } from '../theme/theme';
import {
  AgentDefinition,
  AgentSession,
  Competency,
  Difficulty,
  Portfolio,
  PracticalCase,
  RoadmapStatus,
  StudentRoadmap,
  Submission,
  Track,
  Trajectory,
  TrajectoryNode
} from '../types';
import {
  agentCapabilityLabels,
  agentSpecializationLabels,
  competencyDescriptions,
  competencyLabels,
  difficultyLabels,
  displayStatus,
  feedbackModeLabels,
  roadmapStatusLabels,
  submissionStatusLabels,
  trajectoryNodeTypeLabels
} from '../shared/labels';

type TrajectoryFlowNodeData = Record<string, unknown> & {
  node: TrajectoryNode;
  selected: boolean;
  onSelect: (node: TrajectoryNode) => void;
};

type TrajectoryFlowNodeModel = Node<TrajectoryFlowNodeData, 'trajectoryNode'>;

const artifactOptions = [
  'Описание решения',
  'Архитектурная схема',
  'Финансовая модель',
  'Прототип интерфейса',
  'Результаты исследования'
];

const competencyKeys = Object.keys(competencyLabels) as Competency[];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data, loading } = useApi(async () => {
    const [analytics, tracks, cases, portfolio, submissions, roadmap] = await Promise.all([
      platformApi.analytics.studentDashboard(),
      get<Track[]>('/tracks'),
      get<PracticalCase[]>('/cases', { status: 'PUBLISHED' }),
      get<Portfolio>('/portfolio/me'),
      get<Submission[]>('/submissions', { studentId: session?.user.id }),
      platformApi.roadmaps.me()
    ]);
    return { analytics, tracks, cases, portfolio, submissions, roadmap };
  }, [session?.user.id]);

  if (loading || !data) return <LoadingBlock />;
  const recommendedTrack = data.tracks[0];
  const nearestCase = data.cases.find((item) => item.title === data.analytics.nearestCaseTitle) ?? data.cases[0];
  const currentStep = data.roadmap.steps.find((step) => step.nodeId === data.roadmap.currentNodeId) ?? data.roadmap.steps[0];
  const latestSubmission = data.submissions[0];

  return (
    <Box>
      <PageHeader title={`Здравствуйте, ${session?.user.fullName ?? 'участник'}`} subtitle="Ваш аналитический центр развития" />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          color: 'white',
          background: `linear-gradient(135deg, ${brand.forest} 0%, ${brand.teal} 62%, ${brand.lime} 100%)`
        }}
      >
        <Box aria-hidden sx={{ position: 'absolute', right: -120, top: -120, width: 360, height: 360, borderRadius: '50%', background: alpha('#fff', 0.07) }} />
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative' }}>
          <Grid item xs={12} md={8}>
            <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block', color: alpha('#fff', 0.72) }}>
              Текущий трек
            </Typography>
            <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: { xs: 24, md: 30 }, mb: 2 }}>
              {data.analytics.trajectoryTitle}
            </Typography>
            <Typography sx={{ color: alpha('#fff', 0.85), mb: 2 }}>
              Ближайший кейс: <Typography component="span" fontWeight={700} sx={{ color: '#fff' }}>{nearestCase?.title}</Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.72) }}>
              Текущий этап: {currentStep?.title}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1, color: alpha('#fff', 0.72) }}>Прогресс roadmap</Typography>
            <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 44, mb: 2 }}>{data.analytics.roadmapProgress}%</Typography>
            <LinearProgress
              variant="determinate"
              value={data.analytics.roadmapProgress}
              sx={{ height: 6, borderRadius: 3, mb: 3, bgcolor: alpha('#fff', 0.22), '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 3 } }}
            />
            <Button
              startIcon={<TimelineRoundedIcon />}
              onClick={() => navigate('/student/roadmap')}
              fullWidth
              sx={{ bgcolor: '#fff', color: brand.forest, '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
            >
              Открыть дорожную карту
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <MetricGrid metrics={data.analytics.metrics} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={4}>
          <PieChartBlock title="Выполненные кейсы по направлениям" data={data.analytics.completedCasesByDirection} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <BarChartBlock title="Рост компетенций по последним кейсам" data={data.analytics.competencyGrowth} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <CompetencyRadarChart data={data.analytics.competencyRadar} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LineChartBlock title="Динамика качества решений" data={data.analytics.qualityDynamics} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FunnelBlock title="Мини-воронка прогресса" data={data.analytics.funnel} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>Рекомендация следующего шага</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>{nearestCase?.title}</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{data.analytics.recommendation}</Typography>
              {nearestCase && topCompetencies(nearestCase.competencyWeights).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Развиваемые компетенции</Typography>
                  <Stack direction="row" spacing={1}>
                    {topCompetencies(nearestCase.competencyWeights).map((competency) => (
                      <Chip key={competency} label={competencyLabels[competency]} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => nearestCase && navigate(`/student/cases/${nearestCase.id}`)}>
                  Перейти к кейсу
                </Button>
                <Button variant="outlined" onClick={() => navigate('/student/trajectories')}>
                  Выбрать траекторию
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Последняя обратная связь</Typography>
              {data.portfolio.feedbackHighlights.length ? (
                data.portfolio.feedbackHighlights.slice(0, 3).map((text) => <Alert key={text} severity="success" sx={{ mb: 1 }}>{text}</Alert>)
              ) : (
                <Typography color="text.secondary">Обратная связь появится после проверки решения.</Typography>
              )}
              {latestSubmission && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">Статус последнего решения</Typography>
                  <Typography variant="body1" fontWeight={600}>{submissionStatusLabels[latestSubmission.status]}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export function TrackCatalogPage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [audience, setAudience] = useState('');
  const [competency, setCompetency] = useState<Competency | ''>('');
  const [customer, setCustomer] = useState('');
  const { data, loading } = useApi(() => get<Track[]>('/tracks', {
    difficulty: difficulty || undefined,
    targetAudience: audience || undefined,
    competency: competency || undefined,
    customerName: customer || undefined
  }), [difficulty, audience, competency, customer]);

  return (
    <Box>
      <PageHeader title="Каталог треков" subtitle="Фильтры по сложности, аудитории, компетенциям и заказчику" />
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField select label="Сложность" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | '')} fullWidth size="small">
                <MenuItem value="">Все</MenuItem>
                {Object.entries(difficultyLabels).map(([value, label]) => <MenuItem value={value} key={value}>{label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField label="Аудитория" value={audience} onChange={(event) => setAudience(event.target.value)} fullWidth size="small" /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Компетенция" value={competency} onChange={(event) => setCompetency(event.target.value as Competency | '')} fullWidth size="small">
                <MenuItem value="">Все</MenuItem>
                {competencyKeys.map((item) => <MenuItem value={item} key={item}>{competencyLabels[item]}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField label="Заказчик" value={customer} onChange={(event) => setCustomer(event.target.value)} fullWidth size="small" /></Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading || !data ? <LoadingBlock /> : (
        <Grid container spacing={3}>
          {data.map((track) => (
            <Grid item xs={12} md={6} lg={4} key={track.id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => navigate(`/student/tracks/${track.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                    {track.customerName}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{track.title}</Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>{track.description}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Typography variant="body2" fontWeight={600}>{difficultyLabels[track.difficulty]}</Typography>
                    <Typography variant="body2" color="text.secondary">·</Typography>
                    <Typography variant="body2" color="text.secondary">{track.caseIds.length} кейсов</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export function TrackDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useApi(async () => {
    const [track, cases] = await Promise.all([
      get<Track>(`/tracks/${id}`),
      get<PracticalCase[]>('/cases', { trackId: id })
    ]);
    return { track, cases };
  }, [id]);

  if (loading || !data) return <LoadingBlock />;
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>{data.track.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{data.track.description}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">{data.track.customerName}</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2" fontWeight={600}>{difficultyLabels[data.track.difficulty]}</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2" color="text.secondary">{data.track.targetAudience}</Typography>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {data.cases.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <CaseCard item={item} onOpen={() => navigate(`/student/cases/${item.id}`)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function CaseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, loading } = useApi(() => get<PracticalCase>(`/cases/${id}`), [id]);
  if (loading || !item) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader
        title={item.title}
        subtitle={item.shortDescription}
        actions={
          <Button variant="contained" size="large" onClick={() => navigate(`/student/workspace/${item.id}`)}>
            Начать выполнение
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>Описание</Typography>
              <Typography sx={{ whiteSpace: 'pre-line', mb: 4 }}>{item.fullDescription}</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>Ожидаемый результат</Typography>
              <Typography>{item.expectedResult}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Статус</Typography>
                  <Typography variant="body1" fontWeight={600}>{displayStatus(item.status)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Дедлайн</Typography>
                  <Typography variant="body1" fontWeight={600}>{new Date(item.deadline).toLocaleDateString('ru-RU')}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Лимит участников</Typography>
                  <Typography variant="body1" fontWeight={600}>{item.participantLimit}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Формат обратной связи</Typography>
                  <Typography variant="body1" fontWeight={600}>{feedbackModeLabels[item.feedbackMode]}</Typography>
                </Box>
                {item.tags.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Теги</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {item.tags.map((tag) => (
                        <Chip size="small" key={tag} label={tag} />
                      ))}
                    </Stack>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Компетенции</Typography>
                  <CompetencyBars values={item.competencyWeights} compact />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export function StudentWorkspacePage() {
  const { caseId } = useParams();
  const { session } = useAuth();
  const [solution, setSolution] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>(['Описание решения']);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [message, setMessage] = useState('');
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);
  const { data, loading } = useApi(async () => {
    const [item, agents] = await Promise.all([
      get<PracticalCase>(`/cases/${caseId}`),
      get<AgentDefinition[]>('/agents')
    ]);
    return { item, agents };
  }, [caseId]);
  const mentor = data?.agents[0];

  async function ensureSubmission(): Promise<Submission> {
    if (submission) return submission;
    const created = await post<Submission>('/submissions', {
      caseId,
      studentId: session?.user.id,
      teamName: 'Команда участника',
      title: data?.item.title ?? 'Решение кейса',
      description: solution,
      artifactUrl: artifactUrl || null
    });
    setSubmission(created);
    return created;
  }

  async function saveDraft() {
    const current = await ensureSubmission();
    const saved = await put<Submission>(`/submissions/${current.id}`, {
      teamName: current.teamName,
      title: current.title,
      description: solution,
      artifactUrl: artifactUrl || null
    });
    setSubmission(saved);
  }

  async function submitSolution() {
    const current = await ensureSubmission();
    const saved = await put<Submission>(`/submissions/${current.id}`, {
      teamName: current.teamName,
      title: current.title,
      description: solution,
      artifactUrl: artifactUrl || null
    });
    const submitted = await post<Submission>(`/submissions/${saved.id}/submit`);
    setSubmission(submitted);
  }

  async function sendAgentMessage() {
    if (!message.trim() || !mentor || !data) return;
    const currentSession = agentSession ?? await post<AgentSession>('/agents/sessions', {
      studentId: session?.user.id,
      caseId,
      agentId: mentor.id
    });
    const artifacts = artifactUrl ? [...selectedArtifacts, artifactUrl] : selectedArtifacts;
    const nextSession = await platformApi.agents.sendMessage(currentSession.id, {
      content: message,
      caseTitle: data.item.title,
      artifacts
    });
    setAgentSession(nextSession);
    setMessage('');
  }

  if (loading || !data || !mentor) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader title="Рабочая зона кейса" subtitle={data.item.title} />
      <Alert severity="info" sx={{ mb: 2 }}>
        ИИ-наставник помогает мыслить, проверять гипотезы и структурировать работу. Итоговое решение оформляет сам участник.
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Описание кейса</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{data.item.fullDescription}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Заметки и решение" value={solution} onChange={(event) => setSolution(event.target.value)} multiline minRows={9} fullWidth />
                <TextField label="Ссылка на артефакт" value={artifactUrl} onChange={(event) => setArtifactUrl(event.target.value)} fullWidth />
                <TextField
                  select
                  label="Наработки"
                  value={selectedArtifacts}
                  onChange={(event) => setSelectedArtifacts(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value as string[])}
                  SelectProps={{ multiple: true, renderValue: (selected) => (selected as string[]).join(', ') }}
                  fullWidth
                >
                  {artifactOptions.map((artifact) => (
                    <MenuItem key={artifact} value={artifact}>
                      <Checkbox checked={selectedArtifacts.includes(artifact)} />
                      <ListItemText primary={artifact} />
                    </MenuItem>
                  ))}
                </TextField>
                {submission && <Alert severity="success">Статус решения: {submissionStatusLabels[submission.status]}</Alert>}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button variant="outlined" startIcon={<SaveRoundedIcon />} onClick={saveDraft}>Сохранить черновик</Button>
                  <Button variant="contained" startIcon={<SendRoundedIcon />} onClick={submitSolution}>Отправить на проверку</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <MentorChatPanel
            title={mentor.name}
            caseTitle={data.item.title}
            artifacts={artifactUrl ? [...selectedArtifacts, artifactUrl] : selectedArtifacts}
            session={agentSession}
            message={message}
            onMessage={setMessage}
            onSend={sendAgentMessage}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function StudentTrajectoryTreePage() {
  const theme = useTheme();
  const [trajectoryId, setTrajectoryId] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<TrajectoryNode | null>(null);
  const { data, loading, reload } = useApi(async () => {
    const trajectories = await platformApi.trajectories.list();
    const id = trajectoryId || trajectories[0]?.id;
    const nodes = id ? await platformApi.trajectories.nodes(id) : [];
    return { trajectories, nodes, activeId: id };
  }, [trajectoryId]);
  const activeTrajectory = data?.trajectories.find((item) => item.id === data.activeId);

  async function selectTrajectory(item: Trajectory) {
    await platformApi.trajectories.select(item.id);
    await reload();
  }

  if (loading || !data || !activeTrajectory) return <LoadingBlock />;

  return (
    <Box>
      <PageHeader
        title="Дерево траекторий"
        subtitle="Выбери, к какому маяку профессии ты хочешь двигаться"
        actions={
          <Button variant="contained" startIcon={<TimelineRoundedIcon />} onClick={() => selectTrajectory(activeTrajectory)}>
            Выбрать траекторию
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ overflow: 'hidden' }}>
            <CardContent>
              <Tabs value={data.activeId} onChange={(_, value) => { setTrajectoryId(value); setSelectedNode(null); }} variant="scrollable" sx={{ mb: 3 }}>
                {data.trajectories.map((trajectory) => <Tab key={trajectory.id} value={trajectory.id} label={trajectory.title} />)}
              </Tabs>
              <TrajectoryFlowCanvas
                nodes={data.nodes}
                selectedNodeId={selectedNode?.id}
                onSelectNode={setSelectedNode}
                primaryColor={theme.palette.primary.main}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>{activeTrajectory.title}</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{activeTrajectory.description}</Typography>
              {selectedNode ? (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Тип</Typography>
                    <Typography variant="body1" fontWeight={600}>{trajectoryNodeTypeLabels[selectedNode.type]}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>{selectedNode.title}</Typography>
                    <Typography color="text.secondary">{selectedNode.description}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Развивает компетенции</Typography>
                    <CompetencyBars values={selectedNode.requiredCompetencies} compact />
                  </Box>
                  <Button variant="contained" onClick={() => selectTrajectory(activeTrajectory)}>Выбрать траекторию</Button>
                </Stack>
              ) : (
                <EmptyState title="Выберите узел дерева" description="Кликните по этапу, чтобы увидеть описание и вклад в компетенции." />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function TrajectoryFlowCanvas({
  nodes: trajectoryNodes,
  selectedNodeId,
  onSelectNode,
  primaryColor
}: {
  nodes: TrajectoryNode[];
  selectedNodeId?: string;
  onSelectNode: (node: TrajectoryNode) => void;
  primaryColor: string;
}) {
  const flowNodes = useMemo<TrajectoryFlowNodeModel[]>(() => trajectoryNodes.map((node, index) => ({
    id: node.id,
    type: 'trajectoryNode',
    position: {
      x: node.positionX * 1.05,
      y: node.positionY + (index % 2 === 0 ? 22 : 76)
    },
    data: {
      node,
      selected: selectedNodeId === node.id,
      onSelect: onSelectNode
    }
  })), [trajectoryNodes, selectedNodeId, onSelectNode]);

  const flowEdges = useMemo<Edge[]>(() => {
    const nodeIds = new Set(trajectoryNodes.map((node) => node.id));
    return trajectoryNodes.flatMap((node) => node.nextNodeIds
      .filter((nextId) => nodeIds.has(nextId))
      .map((nextId) => ({
        id: `${node.id}-${nextId}`,
        source: node.id,
        target: nextId,
        type: 'smoothstep',
        animated: node.status === 'IN_PROGRESS' || node.status === 'AVAILABLE',
        markerEnd: { type: MarkerType.ArrowClosed, color: primaryColor },
        style: {
          stroke: node.status === 'LOCKED' ? '#94a3b8' : primaryColor,
          strokeWidth: node.status === 'LOCKED' ? 1.8 : 3,
          opacity: node.status === 'LOCKED' ? 0.48 : 0.86
        }
      })));
  }, [trajectoryNodes, primaryColor]);

  const [nodes, setNodes, onNodesChange] = useNodesState<TrajectoryFlowNodeModel>(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(flowEdges);

  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  return (
    <Box
      sx={{
        height: { xs: 560, lg: 650 },
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(11, 122, 100, 0.18)',
        background:
          'radial-gradient(circle at 18% 18%, rgba(11,122,100,0.16), transparent 30%), radial-gradient(circle at 88% 28%, rgba(37,99,235,0.12), transparent 32%), linear-gradient(135deg, #f6fbf8 0%, #edf7f5 52%, #f7fbff 100%)',
        '& .react-flow__controls': {
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 14px 36px rgba(23,33,43,0.12)'
        },
        '& .react-flow__minimap': {
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(11,122,100,0.16)',
          boxShadow: '0 14px 36px rgba(23,33,43,0.12)'
        },
        '& .react-flow__attribution': {
          bgcolor: 'rgba(255,255,255,0.72)'
        }
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={trajectoryNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => onSelectNode((node.data as TrajectoryFlowNodeData).node)}
          fitView
          fitViewOptions={{ padding: 0.22, minZoom: 0.55, maxZoom: 1.05 }}
          minZoom={0.35}
          maxZoom={1.35}
          panOnScroll
          selectionOnDrag
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={26} size={1.15} color="rgba(11,122,100,0.22)" />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            nodeColor={(node) => nodeColor((node.data as TrajectoryFlowNodeData).node.status)}
            nodeStrokeWidth={3}
            maskColor="rgba(7, 32, 28, 0.08)"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
}

const TrajectoryFlowNodeCard = memo(function TrajectoryFlowNodeCard({
  data,
  selected
}: NodeProps<TrajectoryFlowNodeModel>) {
  const theme = useTheme();
  const node = data.node;
  const statusColor = nodeColor(node.status);
  const selectedState = selected || data.selected;
  const topRequiredCompetencies = topCompetencies(node.requiredCompetencies);
  const isLocked = node.status === 'LOCKED';

  return (
    <Paper
      elevation={0}
      onClick={() => data.onSelect(node)}
      sx={{
        width: 270,
        minHeight: 140,
        p: 2.5,
        cursor: 'pointer',
        borderRadius: 2,
        position: 'relative',
        border: selectedState ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        transition: 'all 150ms ease',
        opacity: isLocked ? 0.6 : 1,
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 8, height: 8, borderColor: theme.palette.divider, background: statusColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 8, height: 8, borderColor: theme.palette.divider, background: statusColor }}
      />

      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {trajectoryNodeTypeLabels[node.type]}
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: 'grid',
              placeItems: 'center',
              color: statusColor,
              bgcolor: alpha(statusColor, 0.08),
              border: `1px solid ${alpha(statusColor, 0.12)}`
            }}
          >
            {node.type === 'FINAL_PROJECT' ? <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} /> : <AccountTreeRoundedIcon sx={{ fontSize: 18 }} />}
          </Box>
        </Stack>

        <Box>
          <Typography variant="body1" fontWeight={600} lineHeight={1.3} sx={{ mb: 0.5 }}>
            {node.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {node.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={600} color={statusColor}>
            {roadmapStatusLabels[node.status]}
          </Typography>
          {topRequiredCompetencies.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {topRequiredCompetencies.map(c => competencyLabels[c]).join(', ')}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
});

const trajectoryNodeTypes = {
  trajectoryNode: TrajectoryFlowNodeCard
};

export function StudentRoadmapPage() {
  const navigate = useNavigate();
  const { data, loading, reload } = useApi(async () => {
    const [roadmap, cases] = await Promise.all([
      platformApi.roadmaps.me(),
      get<PracticalCase[]>('/cases')
    ]);
    return { roadmap, cases };
  }, []);

  async function startStep(roadmap: StudentRoadmap, stepId: string) {
    await platformApi.roadmaps.startStep(roadmap.id, stepId);
    await reload();
  }

  async function completeStep(roadmap: StudentRoadmap, stepId: string) {
    await platformApi.roadmaps.completeStep(roadmap.id, stepId);
    await reload();
  }

  if (loading || !data) return <LoadingBlock />;
  const casesById = new Map(data.cases.map((item) => [item.id, item]));
  const steps = data.roadmap.steps;
  const completed = steps.filter((s) => s.status === 'COMPLETED').length;

  return (
    <Box>
      <PageHeader title="Мой roadmap" subtitle={data.roadmap.title} />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          color: 'white',
          background: `linear-gradient(135deg, ${brand.forest} 0%, ${brand.teal} 62%, ${brand.lime} 100%)`
        }}
      >
        <Box aria-hidden sx={{ position: 'absolute', right: -120, top: -120, width: 360, height: 360, borderRadius: '50%', background: alpha('#fff', 0.07) }} />
        <Grid container spacing={4} alignItems="flex-end" sx={{ position: 'relative' }}>
          <Grid item xs={12} md={8}>
            <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block', color: alpha('#fff', 0.72) }}>
              Прогресс дорожной карты
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 44 }}>{data.roadmap.progressPercent}%</Typography>
              <Typography sx={{ color: alpha('#fff', 0.72) }}>{completed} из {steps.length} этапов</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={data.roadmap.progressPercent}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha('#fff', 0.22),
                '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 3 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha('#fff', 0.12), border: `1px solid ${alpha('#fff', 0.18)}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FlagRoundedIcon sx={{ color: '#fff' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.72) }}>Ожидаемое завершение</Typography>
                  <Typography fontWeight={700} sx={{ color: '#fff' }}>{new Date(data.roadmap.expectedFinishDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Stack spacing={0}>
        {steps.map((step, index) => {
          const linkedCase = step.caseId ? casesById.get(step.caseId) : undefined;
          const isFinal = index === steps.length - 1;
          return (
            <RoadmapTimelineRow
              key={step.id}
              step={step}
              index={index}
              isFinal={isFinal}
              title={isFinal ? 'Маяк профессии' : step.title}
              linkedCase={linkedCase}
              onOpenCase={() => linkedCase && navigate(`/student/cases/${linkedCase.id}`)}
              onStart={() => startStep(data.roadmap, step.id)}
              onComplete={() => completeStep(data.roadmap, step.id)}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export function AgentSandboxPage() {
  const { session } = useAuth();
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState('Помоги структурировать решение кейса');
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);
  const [caseId, setCaseId] = useState('');
  const [artifacts, setArtifacts] = useState<string[]>(['Описание решения']);
  const [artifactLink, setArtifactLink] = useState('');
  const { data, loading } = useApi(async () => {
    const [agents, cases] = await Promise.all([
      get<AgentDefinition[]>('/agents'),
      get<PracticalCase[]>('/cases', { status: 'PUBLISHED' })
    ]);
    return { agents, cases };
  }, []);
  const agent = data?.agents[selected];
  const selectedCase = data?.cases.find((item) => item.id === caseId) ?? data?.cases[0];

  async function send() {
    if (!agent || !text.trim() || !selectedCase) return;
    const currentSession = agentSession ?? await post<AgentSession>('/agents/sessions', {
      studentId: session?.user.id,
      caseId: selectedCase.id,
      agentId: agent.id
    });
    const next = await platformApi.agents.sendMessage(currentSession.id, {
      content: text,
      caseTitle: selectedCase.title,
      artifacts: artifactLink ? [...artifacts, artifactLink] : artifacts
    });
    setAgentSession(next);
    setText('');
  }

  if (loading || !data || !agent || !selectedCase) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader title="Песочница ИИ-наставников" subtitle="Наставники помогают думать, проверять гипотезы и структурировать работу — но не решают за вас" />
      <Tabs value={selected} onChange={(_, value) => { setSelected(value); setAgentSession(null); }} variant="scrollable" sx={{ mb: 3 }}>
        {data.agents.map((item) => <Tab key={item.id} label={item.name} />)}
      </Tabs>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>{agent.name}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block' }}>
                {agentSpecializationLabels[agent.specialization]}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>{agent.description}</Typography>
              {agent.capabilities.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Возможности</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {agent.capabilities.map((capability) => (
                      <Chip size="small" key={capability} label={agentCapabilityLabels[capability] ?? capability} />
                    ))}
                  </Stack>
                </Box>
              )}
              <TextField select label="Кейс" value={selectedCase.id} onChange={(event) => { setCaseId(event.target.value); setAgentSession(null); }} fullWidth sx={{ mb: 2 }} size="small">
                {data.cases.map((item) => <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)}
              </TextField>
              <TextField
                select
                label="Наработки"
                value={artifacts}
                onChange={(event) => setArtifacts(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value as string[])}
                SelectProps={{ multiple: true, renderValue: (selectedItems) => (selectedItems as string[]).join(', ') }}
                fullWidth
                sx={{ mb: 2 }}
                size="small"
              >
                {artifactOptions.map((artifact) => (
                  <MenuItem key={artifact} value={artifact}>
                    <Checkbox checked={artifacts.includes(artifact)} />
                    <ListItemText primary={artifact} />
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Ссылка на артефакт или название файла" value={artifactLink} onChange={(event) => setArtifactLink(event.target.value)} fullWidth size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <MentorChatPanel
            title={agent.name}
            caseTitle={selectedCase.title}
            artifacts={artifactLink ? [...artifacts, artifactLink] : artifacts}
            session={agentSession}
            message={text}
            onMessage={setText}
            onSend={send}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function PortfolioPage() {
  const { session } = useAuth();
  const { data, loading } = useApi(async () => {
    const [portfolio, submissions, cases] = await Promise.all([
      get<Portfolio>('/portfolio/me'),
      get<Submission[]>('/submissions'),
      get<PracticalCase[]>('/cases')
    ]);
    return { portfolio, submissions, cases };
  }, []);
  if (loading || !data) return <LoadingBlock />;
  const radar = competencyKeys.map((competency) => ({ competency, value: data.portfolio.competencyProfile[competency] ?? 0 }));
  const topCompetency = [...radar].sort((a, b) => b.value - a.value)[0];
  const artifacts = data.portfolio.artifacts.map((artifact, index) => ({
    artifact,
    caseTitle: data.portfolio.completedCases[index % Math.max(data.portfolio.completedCases.length, 1)] ?? 'Кейс в работе',
    type: index % 2 ? 'Документ' : 'Схема',
    date: `0${index + 2}.07.2026`,
    status: index % 2 ? 'Готово к демонстрации' : 'Портфолио развивается'
  }));

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Моё портфолио</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{data.portfolio.summary}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">{data.portfolio.completedCases.length} завершённых кейсов</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2" color="text.secondary">{data.portfolio.artifacts.length} артефактов</Typography>
          {topCompetency && (
            <>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Typography variant="body2" fontWeight={600}>Сильная сторона: {competencyLabels[topCompetency.competency]}</Typography>
            </>
          )}
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {['Портфолио развивается', 'Готово к демонстрации', 'Есть рекомендации от заказчика', 'Есть завершённые кейсы'].map((label, index) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <StatCard
              title={label}
              value={index === 3 ? data.portfolio.completedCases.length : 'Да'}
              icon={<WorkspacePremiumRoundedIcon />}
              color="primary"
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <CompetencyRadarChart data={radar} />
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Матрица компетенций</Typography>
              <CompetencyExplanationCards />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Артефакты</Typography>
              <Stack spacing={2}>
                {artifacts.map((item, index) => {
                  const isDoc = item.type === 'Документ';
                  const ready = item.status === 'Готово к демонстрации';
                  return (
                    <Paper
                      key={item.artifact}
                      variant="outlined"
                      sx={{ p: 2.5, transition: 'border-color .15s', '&:hover': { borderColor: 'primary.main' } }}
                    >
                      <Stack direction="row" spacing={2.5} alignItems="center">
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'background.default',
                          color: 'primary.main'
                        }}>
                          {isDoc ? <DescriptionRoundedIcon /> : <SchemaRoundedIcon />}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography fontWeight={600} noWrap>{item.artifact}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>{item.caseTitle} · {item.type} · {item.date}</Typography>
                        </Box>
                        <Typography variant="body2" color={ready ? 'success.main' : 'text.secondary'} fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                          {item.status}
                        </Typography>
                        <Button size="small" endIcon={<ArrowForwardRoundedIcon />}>Открыть</Button>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Ключевые выводы обратной связи</Typography>
              {data.portfolio.feedbackHighlights.map((item) => <Alert key={item} severity="success" sx={{ mb: 1 }}>{item}</Alert>)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Рост по кейсам</Typography>
              <Stack spacing={1.5}>
                {data.portfolio.completedCases.map((item, index) => (
                  <Paper key={item} variant="outlined" sx={{ p: 2 }}>
                    <Typography fontWeight={700}>{item}</Typography>
                    <Typography variant="body2" color="text.secondary">Усилены: {competencyLabels[competencyKeys[index % competencyKeys.length]]}, {competencyLabels[competencyKeys[(index + 1) % competencyKeys.length]]}</Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const reflectionQuestions: { key: string; hint: string }[] = [
  { key: 'Что получилось?', hint: 'Конкретный результат: что заработало, какую задачу закрыли, что стало понятнее.' },
  { key: 'Что было сложно?', hint: 'Где застряли, что заняло больше всего времени, какие места пришлось переделывать.' },
  { key: 'Как использовался ИИ?', hint: 'В чём именно помог наставник — идеи, проверка гипотез, рутина. Где не помог.' },
  { key: 'Что сделал сам?', hint: 'Ваш собственный вклад: решения, которые приняли и обосновали лично.' },
  { key: 'Что улучшить в следующей итерации?', hint: 'Один-два вывода, которые заберёте в следующий кейс.' }
];

export function ReflectionPage() {
  const { submissionId } = useParams();
  const { session } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(reflectionQuestions.map((q) => [q.key, '']))
  );
  const [summary, setSummary] = useState('');
  const [saved, setSaved] = useState(false);
  const { data: submissions } = useApi(() => get<Submission[]>('/submissions', { studentId: session?.user.id }), [session?.user.id]);
  const effectiveSubmissionId = submissionId ?? submissions?.[0]?.id;
  const filledCount = reflectionQuestions.filter((q) => answers[q.key].trim()).length;

  async function submitReflection() {
    if (!effectiveSubmissionId) return;
    await post('/reflections', { submissionId: effectiveSubmissionId, studentId: session?.user.id, answers, summary });
    setSaved(true);
  }

  const progress = Math.round((filledCount / reflectionQuestions.length) * 100);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Рефлексия по кейсу</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Итоговая фиксация собственного вклада, работы с ИИ и следующей итерации
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Заполнено</Typography>
            <Typography variant="h4">{progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: 'primary.light', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 3 } }}
          />
        </Stack>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Рефлексия сохранена</Alert>}
      {!effectiveSubmissionId && <Alert severity="info" sx={{ mb: 3 }}>Сначала отправьте решение, чтобы связать рефлексию с кейсом.</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={2.5}>
            {reflectionQuestions.map((q, index) => {
              const filled = answers[q.key].trim().length > 0;
              return (
                <Card key={q.key} variant="outlined" sx={{ borderColor: filled ? 'primary.main' : 'divider', transition: 'border-color .15s' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2.5} alignItems="flex-start">
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600} sx={{ mb: 0.5 }}>{q.key}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{q.hint}</Typography>
                        <TextField
                          value={answers[q.key]}
                          onChange={(event) => setAnswers({ ...answers, [q.key]: event.target.value })}
                          multiline
                          minRows={2}
                          fullWidth
                          placeholder="Ваш ответ…"
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={600} sx={{ mb: 0.5 }}>Краткий итог</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Одно-два предложения — суть того, что вы забираете из кейса
                </Typography>
                <TextField value={summary} onChange={(event) => setSummary(event.target.value)} multiline minRows={4} fullWidth placeholder="Главный вывод…" size="small" />
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">Заполнено вопросов</Typography>
                    <Typography fontWeight={600}>{filledCount} / {reflectionQuestions.length}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(filledCount / reflectionQuestions.length) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Button variant="contained" size="large" onClick={submitReflection} disabled={!effectiveSubmissionId}>
                    Сохранить рефлексию
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function CaseCard({ item, onOpen }: { item: PracticalCase; onOpen: () => void }) {
  return (
    <Card sx={{
      height: '100%',
      cursor: 'pointer',
      transition: 'all 150ms ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        borderColor: 'primary.main'
      }
    }}
    onClick={onOpen}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{item.title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{item.shortDescription}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>{difficultyLabels[item.difficulty]}</Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <Typography variant="body2" color="text.secondary">{feedbackModeLabels[item.feedbackMode]}</Typography>
        </Stack>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Вклад в компетенции</Typography>
          <LinearProgress variant="determinate" value={Math.max(...Object.values(item.competencyWeights))} sx={{ height: 6, borderRadius: 3 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

function MentorChatPanel({
  title,
  caseTitle,
  artifacts,
  session,
  message,
  onMessage,
  onSend
}: {
  title: string;
  caseTitle: string;
  artifacts: string[];
  session: AgentSession | null;
  message: string;
  onMessage: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
            Контекст наставника
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}><Typography component="span" fontWeight={600}>Кейс:</Typography> {caseTitle}</Typography>
          <Typography variant="body2"><Typography component="span" fontWeight={600}>Наработки:</Typography> {artifacts.length ? artifacts.join(', ') : 'Не выбраны'}</Typography>
        </Paper>
        <Stack spacing={2} sx={{ minHeight: 360, maxHeight: 500, overflow: 'auto', mb: 3 }}>
          {(session?.messages ?? []).map((item) => {
            const isAgent = item.role === 'AGENT';
            return (
              <Stack
                key={item.id}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{ flexDirection: isAgent ? 'row' : 'row-reverse', alignSelf: isAgent ? 'flex-start' : 'flex-end', maxWidth: '88%' }}
              >
                {isAgent ? (
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <SmartToyRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                ) : (
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: 'secondary.main', color: 'white', fontWeight: 700, fontSize: 14 }}>Вы</Box>
                )}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isAgent ? 'background.default' : 'primary.main',
                    color: isAgent ? 'text.primary' : 'white',
                    border: '1px solid',
                    borderColor: isAgent ? 'divider' : 'transparent'
                  }}
                >
                  <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5, color: isAgent ? 'text.secondary' : alpha('#fff', 0.85) }}>
                    {isAgent ? 'Наставник' : 'Вы'}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{item.content}</Typography>
                </Box>
              </Stack>
            );
          })}
          {!session && <EmptyState title="Чат готов" description="Задайте вопрос по цели, структуре решения или проверке гипотез." />}
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <TextField value={message} onChange={(event) => onMessage(event.target.value)} placeholder="Помоги проверить структуру решения" fullWidth size="small" />
          <Button variant="contained" onClick={onSend} sx={{ px: 3 }}><SendRoundedIcon /></Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RoadmapTimelineRow({
  step,
  index,
  isFinal,
  title,
  linkedCase,
  onOpenCase,
  onStart,
  onComplete
}: {
  step: { status: RoadmapStatus; title: string; description: string; caseId?: string | null };
  index: number;
  isFinal: boolean;
  title: string;
  linkedCase?: PracticalCase;
  onOpenCase: () => void;
  onStart: () => void;
  onComplete: () => void;
}) {
  const color = nodeColor(step.status);
  const done = step.status === 'COMPLETED';
  const locked = step.status === 'LOCKED';
  const active = step.status === 'IN_PROGRESS' || step.status === 'AVAILABLE';

  const NodeIcon = isFinal
    ? WorkspacePremiumRoundedIcon
    : done
      ? CheckRoundedIcon
      : locked
        ? LockRoundedIcon
        : step.status === 'IN_PROGRESS'
          ? PlayArrowRoundedIcon
          : TimelineRoundedIcon;

  return (
    <Stack direction="row" spacing={3} sx={{ opacity: locked ? 0.6 : 1 }}>
      <Stack alignItems="center" sx={{ pt: 0.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            color: 'white',
            bgcolor: color,
            border: active ? `3px solid ${alpha(color, 0.2)}` : 'none'
          }}
        >
          <NodeIcon fontSize="small" />
        </Box>
        {!isFinal && (
          <Box
            sx={{
              flexGrow: 1,
              width: 2,
              minHeight: 32,
              my: 1.5,
              borderRadius: 1,
              bgcolor: done ? nodeColor('COMPLETED') : 'divider'
            }}
          />
        )}
      </Stack>

      <Card
        variant="outlined"
        sx={{
          flexGrow: 1,
          mb: 3,
          borderColor: active ? 'primary.main' : 'divider',
          transition: 'border-color .2s'
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5, display: 'block' }}>
                Этап {String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="h6">{title}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600} color={color}>
              {roadmapStatusLabels[step.status]}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: linkedCase ? 2 : 0 }}>{step.description}</Typography>

          {linkedCase && (
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                Связанный кейс
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>{linkedCase.title}</Typography>
              <CompetencyBars values={linkedCase.competencyWeights} compact />
            </Box>
          )}

          {(active) && (
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              {step.status === 'AVAILABLE' && linkedCase && (
                <Button size="small" variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={onOpenCase}>Перейти к кейсу</Button>
              )}
              {step.status === 'AVAILABLE' && !linkedCase && (
                <Button size="small" variant="contained" onClick={onStart}>Начать этап</Button>
              )}
              {step.status === 'IN_PROGRESS' && (
                <Button size="small" variant="outlined" onClick={onComplete}>Завершить этап</Button>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

function topCompetencies(values: Partial<Record<Competency, number>>) {
  return competencyKeys
    .slice()
    .sort((left, right) => (values[right] ?? 0) - (values[left] ?? 0))
    .slice(0, 2);
}

function nodeColor(status: RoadmapStatus) {
  const colors: Record<RoadmapStatus, string> = {
    LOCKED: '#94a3b8',
    AVAILABLE: '#2563eb',
    IN_PROGRESS: '#0b7a64',
    COMPLETED: '#16803c'
  };
  return colors[status];
}
