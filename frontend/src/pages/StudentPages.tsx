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
      <PageHeader
        title={`Здравствуйте, ${session?.user.fullName ?? 'участник'}`}
        subtitle="Ваш аналитический центр развития: траектория, компетенции, решения и следующий шаг."
      />

      <Card sx={{ mb: 2, overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                <Chip color="primary" label={data.analytics.trajectoryTitle} />
                <Chip variant="outlined" label={data.analytics.currentLevel} />
                <Chip color="secondary" variant="outlined" label={data.analytics.goal} />
              </Stack>
              <Typography variant="h4">Движение к роли “маяк профессии”</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
                Ближайший кейс: {nearestCase?.title}. Текущий этап дорожной карты: {currentStep?.title}. Следующий шаг помогает усилить компетенции и добавить новый артефакт в портфолио.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" fontWeight={800}>Общий прогресс по roadmap</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{data.analytics.roadmapProgress}%</Typography>
              <LinearProgress variant="determinate" value={data.analytics.roadmapProgress} sx={{ height: 10, borderRadius: 999, mt: 1.5 }} />
              <Button variant="contained" startIcon={<TimelineRoundedIcon />} sx={{ mt: 2 }} onClick={() => navigate('/student/roadmap')}>
                Открыть дорожную карту
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <MetricGrid metrics={data.analytics.metrics} />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h6">Рекомендация следующего шага</Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>{nearestCase?.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{data.analytics.recommendation}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                    {nearestCase && topCompetencies(nearestCase.competencyWeights).map((competency) => (
                      <Chip key={competency} label={competencyLabels[competency]} color="primary" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <Stack spacing={1} minWidth={210}>
                  <Button variant="contained" onClick={() => nearestCase && navigate(`/student/cases/${nearestCase.id}`)}>
                    Перейти к кейсу
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/student/trajectories')}>
                    Выбрать траекторию
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Последняя обратная связь</Typography>
              {data.portfolio.feedbackHighlights.length ? (
                data.portfolio.feedbackHighlights.slice(0, 3).map((text) => <Alert key={text} severity="success" sx={{ mb: 1 }}>{text}</Alert>)
              ) : (
                <Typography color="text.secondary">Обратная связь появится после проверки решения.</Typography>
              )}
              {latestSubmission && (
                <Chip sx={{ mt: 1 }} label={`Последний статус: ${submissionStatusLabels[latestSubmission.status]}`} />
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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField select label="Сложность" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | '')} fullWidth>
                <MenuItem value="">Все</MenuItem>
                {Object.entries(difficultyLabels).map(([value, label]) => <MenuItem value={value} key={value}>{label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField label="Аудитория" value={audience} onChange={(event) => setAudience(event.target.value)} fullWidth /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Компетенция" value={competency} onChange={(event) => setCompetency(event.target.value as Competency | '')} fullWidth>
                <MenuItem value="">Все</MenuItem>
                {competencyKeys.map((item) => <MenuItem value={item} key={item}>{competencyLabels[item]}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField label="Заказчик" value={customer} onChange={(event) => setCustomer(event.target.value)} fullWidth /></Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading || !data ? <LoadingBlock /> : (
        <Grid container spacing={2}>
          {data.map((track) => (
            <Grid item xs={12} md={6} lg={4} key={track.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={track.customerName} />
                    <Chip label={difficultyLabels[track.difficulty]} color="primary" variant="outlined" />
                  </Stack>
                  <Typography variant="h6">{track.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{track.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}><b>{track.caseIds.length}</b> кейсов</Typography>
                </CardContent>
                <CardActions><Button onClick={() => navigate(`/student/tracks/${track.id}`)}>Открыть</Button></CardActions>
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
      <PageHeader title={data.track.title} subtitle={data.track.description} />
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip label={data.track.customerName} />
        <Chip label={difficultyLabels[data.track.difficulty]} color="primary" variant="outlined" />
        <Chip label={data.track.targetAudience} variant="outlined" />
      </Stack>
      <Grid container spacing={2}>
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
        actions={<Button variant="contained" onClick={() => navigate(`/student/workspace/${item.id}`)}>Начать выполнение</Button>}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Описание</Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{item.fullDescription}</Typography>
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Ожидаемый результат</Typography>
              <Typography>{item.expectedResult}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Chip label={displayStatus(item.status)} color="primary" />
                <Typography><b>Дедлайн:</b> {new Date(item.deadline).toLocaleDateString('ru-RU')}</Typography>
                <Typography><b>Лимит участников:</b> {item.participantLimit}</Typography>
                <Typography><b>Формат обратной связи:</b> {feedbackModeLabels[item.feedbackMode]}</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>{item.tags.map((tag) => <Chip size="small" key={tag} label={tag} />)}</Stack>
                <CompetencyBars values={item.competencyWeights} compact />
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
        subtitle="Выбери, к какому маяку профессии ты хочешь двигаться."
        actions={<Button variant="contained" startIcon={<TimelineRoundedIcon />} onClick={() => selectTrajectory(activeTrajectory)}>Выбрать траекторию</Button>}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ overflow: 'hidden' }}>
            <CardContent>
              <Tabs value={data.activeId} onChange={(_, value) => { setTrajectoryId(value); setSelectedNode(null); }} variant="scrollable" sx={{ mb: 2 }}>
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
              <Typography variant="h6">{activeTrajectory.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{activeTrajectory.description}</Typography>
              <Divider sx={{ my: 2 }} />
              {selectedNode ? (
                <Stack spacing={1.5}>
                  <Chip label={trajectoryNodeTypeLabels[selectedNode.type]} color="primary" />
                  <Typography variant="h5">{selectedNode.title}</Typography>
                  <Typography color="text.secondary">{selectedNode.description}</Typography>
                  <Typography variant="subtitle2">Развивает компетенции</Typography>
                  <CompetencyBars values={selectedNode.requiredCompetencies} compact />
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
        minHeight: 164,
        p: 1.6,
        cursor: 'pointer',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        border: selectedState ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(statusColor, 0.34)}`,
        background: isLocked
          ? 'linear-gradient(145deg, rgba(255,255,255,0.88), rgba(244,247,249,0.92))'
          : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,250,247,0.95))',
        boxShadow: selectedState
          ? `0 22px 56px ${alpha(theme.palette.primary.main, 0.28)}`
          : `0 18px 44px ${alpha(statusColor, isLocked ? 0.1 : 0.18)}`,
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
        opacity: isLocked ? 0.82 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 24px 64px ${alpha(statusColor, 0.25)}`,
          borderColor: alpha(statusColor, 0.76)
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 18% 14%, ${alpha(statusColor, 0.22)}, transparent 32%)`,
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, ${statusColor}, ${alpha(theme.palette.secondary.main, 0.9)})`
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, borderColor: 'white', background: statusColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, borderColor: 'white', background: statusColor }}
      />

      <Stack spacing={1.1} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Chip
            size="small"
            label={trajectoryNodeTypeLabels[node.type]}
            sx={{
              bgcolor: alpha(statusColor, 0.12),
              color: statusColor,
              fontWeight: 900,
              border: `1px solid ${alpha(statusColor, 0.28)}`
            }}
          />
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              background: `linear-gradient(135deg, ${statusColor}, ${theme.palette.secondary.main})`,
              boxShadow: `0 10px 28px ${alpha(statusColor, 0.28)}`
            }}
          >
            {node.type === 'FINAL_PROJECT' ? <WorkspacePremiumRoundedIcon fontSize="small" /> : <AccountTreeRoundedIcon fontSize="small" />}
          </Box>
        </Stack>

        <Box>
          <Typography variant="subtitle1" fontWeight={950} lineHeight={1.2}>
            {node.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.75,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {node.description}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap', rowGap: 0.7 }}>
          <Chip
            size="small"
            label={roadmapStatusLabels[node.status]}
            variant={isLocked ? 'outlined' : 'filled'}
            sx={{
              bgcolor: isLocked ? 'transparent' : alpha(statusColor, 0.13),
              color: statusColor,
              borderColor: alpha(statusColor, 0.34),
              fontWeight: 800
            }}
          />
          {topRequiredCompetencies.map((competency) => (
            <Chip
              key={competency}
              size="small"
              label={competencyLabels[competency]}
              variant="outlined"
              sx={{ maxWidth: 190, bgcolor: alpha(theme.palette.background.paper, 0.74) }}
            />
          ))}
        </Stack>
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

  return (
    <Box>
      <PageHeader title="Мой roadmap" subtitle={data.roadmap.title} />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={900}>Прогресс дорожной карты</Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>{data.roadmap.progressPercent}%</Typography>
              <LinearProgress variant="determinate" value={data.roadmap.progressPercent} sx={{ height: 10, borderRadius: 999, mt: 1 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Ожидаемое завершение</Typography>
              <Typography fontWeight={900}>{new Date(data.roadmap.expectedFinishDate).toLocaleDateString('ru-RU')}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(7, minmax(140px, 1fr))' }, gap: 2 }}>
            {data.roadmap.steps.map((step, index) => {
              const linkedCase = step.caseId ? casesById.get(step.caseId) : undefined;
              const isFinal = index === data.roadmap.steps.length - 1;
              return (
                <Box key={step.id} sx={{ mt: { xs: 0, md: index % 2 ? 8 : 0 }, position: 'relative' }}>
                  <RoadmapStepCard
                    step={step}
                    title={isFinal ? 'Маяк профессии' : step.title}
                    linkedCase={linkedCase}
                    onOpenCase={() => linkedCase && navigate(`/student/cases/${linkedCase.id}`)}
                    onStart={() => startStep(data.roadmap, step.id)}
                    onComplete={() => completeStep(data.roadmap, step.id)}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
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
      <PageHeader title="Песочница ИИ-наставников" subtitle="Наставники помогают думать, проверять гипотезы и структурировать работу." />
      <Tabs value={selected} onChange={(_, value) => { setSelected(value); setAgentSession(null); }} variant="scrollable" sx={{ mb: 2 }}>
        {data.agents.map((item) => <Tab key={item.id} label={item.name} />)}
      </Tabs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{agent.name}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{agent.description}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}><b>Специализация:</b> {agentSpecializationLabels[agent.specialization]}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                {agent.capabilities.map((capability) => <Chip size="small" key={capability} label={agentCapabilityLabels[capability] ?? capability} />)}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <TextField select label="Кейс" value={selectedCase.id} onChange={(event) => { setCaseId(event.target.value); setAgentSession(null); }} fullWidth sx={{ mb: 2 }}>
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
              >
                {artifactOptions.map((artifact) => (
                  <MenuItem key={artifact} value={artifact}>
                    <Checkbox checked={artifacts.includes(artifact)} />
                    <ListItemText primary={artifact} />
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Ссылка на артефакт или название файла" value={artifactLink} onChange={(event) => setArtifactLink(event.target.value)} fullWidth />
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
  const artifacts = data.portfolio.artifacts.map((artifact, index) => ({
    artifact,
    caseTitle: data.portfolio.completedCases[index % Math.max(data.portfolio.completedCases.length, 1)] ?? 'Кейс в работе',
    type: index % 2 ? 'Документ' : 'Схема',
    date: `0${index + 2}.07.2026`,
    status: index % 2 ? 'Готово к демонстрации' : 'Портфолио развивается'
  }));

  return (
    <Box>
      <PageHeader title="Моё портфолио" subtitle={data.portfolio.summary} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {['Портфолио развивается', 'Готово к демонстрации', 'Есть рекомендации от заказчика', 'Есть завершённые кейсы'].map((label, index) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <StatCard title={label} value={index === 3 ? data.portfolio.completedCases.length : 'Да'} icon={<WorkspacePremiumRoundedIcon />} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <CompetencyRadarChart data={radar} />
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Матрица компетенций</Typography>
              <CompetencyExplanationCards />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Артефакты</Typography>
              <Stack spacing={1}>
                {artifacts.map((item) => (
                  <Paper key={item.artifact} variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography fontWeight={900}>{item.artifact}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.caseTitle} · {item.type} · {item.date}</Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Chip label={item.status} color="primary" variant="outlined" />
                        <Button size="small">Открыть</Button>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Ключевые выводы обратной связи</Typography>
              {data.portfolio.feedbackHighlights.map((item) => <Alert key={item} severity="success" sx={{ mb: 1 }}>{item}</Alert>)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Рост по кейсам</Typography>
              <Stack spacing={1}>
                {data.portfolio.completedCases.map((item, index) => (
                  <Paper key={item} variant="outlined" sx={{ p: 1.5 }}>
                    <Typography fontWeight={900}>{item}</Typography>
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

export function ReflectionPage() {
  const { submissionId } = useParams();
  const { session } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({
    'Что получилось?': '',
    'Что было сложно?': '',
    'Как использовался ИИ?': '',
    'Что сделал сам?': '',
    'Что улучшить в следующей итерации?': ''
  });
  const [summary, setSummary] = useState('');
  const [saved, setSaved] = useState(false);
  const { data: submissions } = useApi(() => get<Submission[]>('/submissions', { studentId: session?.user.id }), [session?.user.id]);
  const effectiveSubmissionId = submissionId ?? submissions?.[0]?.id;
  const questions = useMemo(() => Object.keys(answers), [answers]);

  async function submitReflection() {
    if (!effectiveSubmissionId) return;
    await post('/reflections', { submissionId: effectiveSubmissionId, studentId: session?.user.id, answers, summary });
    setSaved(true);
  }

  return (
    <Box>
      <PageHeader title="Рефлексия" subtitle="Итоговая фиксация собственного вклада, работы с ИИ и следующей итерации." />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            {saved && <Alert severity="success">Рефлексия сохранена</Alert>}
            {!effectiveSubmissionId && <Alert severity="info">Сначала отправьте решение, чтобы связать рефлексию с кейсом.</Alert>}
            {questions.map((question) => (
              <TextField key={question} label={question} value={answers[question]} onChange={(event) => setAnswers({ ...answers, [question]: event.target.value })} multiline minRows={2} fullWidth />
            ))}
            <TextField label="Краткий итог" value={summary} onChange={(event) => setSummary(event.target.value)} multiline minRows={3} fullWidth />
            <Button variant="contained" onClick={submitReflection} disabled={!effectiveSubmissionId}>Сохранить рефлексию</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function CaseCard({ item, onOpen }: { item: PracticalCase; onOpen: () => void }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={difficultyLabels[item.difficulty]} color="primary" variant="outlined" />
          <Chip size="small" label={feedbackModeLabels[item.feedbackMode]} />
        </Stack>
        <Typography variant="h6">{item.title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{item.shortDescription}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">Вклад в компетенции</Typography>
          <LinearProgress variant="determinate" value={Math.max(...Object.values(item.competencyWeights))} sx={{ mt: 0.5, height: 6, borderRadius: 3 }} />
        </Box>
      </CardContent>
      <CardActions><Button onClick={onOpen}>Открыть кейс</Button></CardActions>
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
        <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'primary.light' }}>
          <Typography variant="caption" fontWeight={900}>Контекст наставника</Typography>
          <Typography variant="body2"><b>Кейс:</b> {caseTitle}</Typography>
          <Typography variant="body2"><b>Наработки:</b> {artifacts.length ? artifacts.join(', ') : 'Не выбраны'}</Typography>
        </Paper>
        <Stack spacing={1.5} sx={{ minHeight: 360, maxHeight: 500, overflow: 'auto', mb: 2 }}>
          {(session?.messages ?? []).map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1.5, bgcolor: item.role === 'AGENT' ? 'primary.light' : 'background.paper' }}>
              <Typography variant="caption" fontWeight={900}>{item.role === 'AGENT' ? 'Наставник' : 'Вы'}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{item.content}</Typography>
            </Paper>
          ))}
          {!session && <EmptyState title="Чат готов" description="Задайте вопрос по цели, структуре решения или проверке гипотез." />}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField value={message} onChange={(event) => onMessage(event.target.value)} placeholder="Помоги проверить структуру решения" fullWidth />
          <Button variant="contained" onClick={onSend}><SendRoundedIcon /></Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RoadmapStepCard({
  step,
  title,
  linkedCase,
  onOpenCase,
  onStart,
  onComplete
}: {
  step: { status: RoadmapStatus; title: string; description: string; caseId?: string | null };
  title: string;
  linkedCase?: PracticalCase;
  onOpenCase: () => void;
  onStart: () => void;
  onComplete: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 230, borderRadius: 2 }}>
      <Stack spacing={1.25}>
        <Box sx={{ width: 42, height: 42, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: nodeColor(step.status), color: 'white', fontWeight: 900 }}>
          <TimelineRoundedIcon fontSize="small" />
        </Box>
        <Chip size="small" label={roadmapStatusLabels[step.status]} />
        <Typography fontWeight={900}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{step.description}</Typography>
        {linkedCase && <Typography variant="body2"><b>Кейс:</b> {linkedCase.title}</Typography>}
        {linkedCase && <CompetencyBars values={linkedCase.competencyWeights} compact />}
        {step.status === 'AVAILABLE' && linkedCase && <Button size="small" variant="contained" onClick={onOpenCase}>Перейти к кейсу</Button>}
        {step.status === 'AVAILABLE' && !linkedCase && <Button size="small" variant="contained" onClick={onStart}>Начать этап</Button>}
        {step.status === 'IN_PROGRESS' && <Button size="small" variant="outlined" onClick={onComplete}>Завершить этап</Button>}
      </Stack>
    </Paper>
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
