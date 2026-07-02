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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, platformApi, post } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import {
  BarChartBlock,
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
  Competency,
  CvBookCandidate,
  Difficulty,
  Feedback,
  Portfolio,
  PracticalCase,
  Submission,
  Track
} from '../types';
import {
  competencyLabels,
  difficultyLabels,
  displayStatus,
  feedbackModeLabels,
  priorityStatusLabels,
  submissionStatusLabels
} from '../shared/labels';

const competencyKeys = Object.keys(competencyLabels) as Competency[];

const defaultWeights: Record<Competency, number> = {
  ABSTRACT_THINKING: 20,
  AUTONOMY: 20,
  COLLABORATION: 20,
  HUMAN_AI_SYNERGY: 20,
  HYPOTHESIS_AND_PRODUCT_THINKING: 20
};

export function CustomerDashboardPage() {
  const navigate = useNavigate();
  const { data, loading } = useApi(async () => {
    const [analytics, tracks, cases, submissions, candidates] = await Promise.all([
      platformApi.analytics.customerDashboard(),
      get<Track[]>('/tracks'),
      get<PracticalCase[]>('/cases'),
      get<Submission[]>('/submissions'),
      get<CvBookCandidate[]>('/cv-book/candidates')
    ]);
    return { analytics, tracks, cases, submissions, candidates };
  }, []);

  if (loading || !data) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader
        title="Панель заказчика"
        subtitle="Треки, кейсы, решения, аудитория траекторий и витрина кандидатов."
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<AddCircleRoundedIcon />} onClick={() => navigate('/customer/tracks/create')}>Создать трек</Button>
            <Button variant="contained" startIcon={<WorkRoundedIcon />} onClick={() => navigate('/customer/cases/create')}>Создать кейс</Button>
          </Stack>
        }
      />
      <Box sx={{ mb: 2 }}>
        <MetricGrid metrics={data.analytics.metrics} />
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} lg={4}><PieChartBlock title="Статусы решений" data={data.analytics.submissionStatuses} /></Grid>
        <Grid item xs={12} lg={4}><BarChartBlock title="Участники по трекам" data={data.analytics.participantsByTrack} /></Grid>
        <Grid item xs={12} lg={4}><CompetencyRadarChart title="Средняя карта аудитории" data={data.analytics.averageCompetencies} /></Grid>
        <Grid item xs={12} lg={6}><LineChartBlock title="Активность по неделям" data={data.analytics.activityDynamics} /></Grid>
        <Grid item xs={12} lg={6}><FunnelBlock title="Воронка участия" data={data.analytics.funnel} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Новые решения</Typography>
              <SubmissionTable submissions={data.submissions.slice(0, 6)} onOpen={() => navigate('/customer/submissions')} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Витрина кандидатов</Typography>
              <Stack spacing={1}>
                {data.candidates.slice(0, 4).map((candidate) => (
                  <Paper key={candidate.id} variant="outlined" sx={{ p: 1.5, cursor: 'pointer' }} onClick={() => navigate(`/customer/cv-book/${candidate.id}`)}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography fontWeight={900}>{candidate.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">{candidate.organizationName}</Typography>
                      </Box>
                      <Chip label={priorityStatusLabels[candidate.priorityStatus]} color={candidate.priorityStatus === 'PRIORITY' ? 'success' : 'default'} />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h6">Режим траекторий</Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Треки и кейсы заказчика могут становиться узлами дерева возможностей: от вводного этапа до итоговой защиты и приоритетного кандидата.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip icon={<AccountTreeRoundedIcon />} label="Ветка траектории" />
                  <Chip label={`${data.tracks.length} треков`} />
                  <Chip label={`${data.cases.length} кейсов`} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export function TrackCreatePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('INTERMEDIATE');
  const [targetAudience, setTargetAudience] = useState('Студенты проектных программ');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const created = await post<Track>('/tracks', {
      title,
      description,
      customerId: session?.user.id,
      customerName: session?.user.organizationName ?? session?.user.fullName,
      difficulty,
      targetAudience
    });
    navigate(`/student/tracks/${created.id}`);
  }

  return (
    <FormCard title="Создать трек" onSubmit={submit} submitLabel="Создать трек">
      <TextField label="Название" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth required />
      <TextField label="Описание" value={description} onChange={(event) => setDescription(event.target.value)} multiline minRows={4} fullWidth required />
      <TextField select label="Сложность" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} fullWidth>
        {Object.entries(difficultyLabels).map(([value, label]) => <MenuItem value={value} key={value}>{label}</MenuItem>)}
      </TextField>
      <TextField label="Целевая аудитория" value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} fullWidth />
    </FormCard>
  );
}

export function CaseCreatePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: tracks, loading } = useApi(() => get<Track[]>('/tracks'), []);
  const [trackId, setTrackId] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('INTERMEDIATE');
  const [participantLimit, setParticipantLimit] = useState(20);
  const [feedbackMode, setFeedbackMode] = useState('MIXED');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [tags, setTags] = useState('продукт, backend, ИИ');
  const [weights, setWeights] = useState<Record<Competency, number>>(defaultWeights);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const created = await post<PracticalCase>('/cases', {
      trackId: trackId || tracks?.[0]?.id,
      title,
      shortDescription,
      fullDescription,
      customerId: session?.user.id,
      customerName: session?.user.organizationName ?? session?.user.fullName,
      difficulty,
      participantLimit,
      expectedResult,
      feedbackMode,
      competencyWeights: weights,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      deadline
    });
    await post(`/cases/${created.id}/send-to-moderation`);
    navigate('/customer/dashboard');
  }

  if (loading || !tracks) return <LoadingBlock />;
  return (
    <FormCard title="Создать кейс" onSubmit={submit} submitLabel="Создать кейс">
      <TextField select label="Трек" value={trackId || tracks[0]?.id || ''} onChange={(event) => setTrackId(event.target.value)} fullWidth>
        {tracks.map((track) => <MenuItem key={track.id} value={track.id}>{track.title}</MenuItem>)}
      </TextField>
      <TextField label="Название" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth required />
      <TextField label="Краткое описание" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} fullWidth required />
      <TextField label="Полное описание" value={fullDescription} onChange={(event) => setFullDescription(event.target.value)} multiline minRows={5} fullWidth required />
      <TextField label="Ожидаемый результат" value={expectedResult} onChange={(event) => setExpectedResult(event.target.value)} multiline minRows={3} fullWidth required />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField select label="Сложность" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} fullWidth>
            {Object.entries(difficultyLabels).map(([value, label]) => <MenuItem value={value} key={value}>{label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}><TextField label="Лимит участников" type="number" value={participantLimit} onChange={(event) => setParticipantLimit(Number(event.target.value))} fullWidth /></Grid>
        <Grid item xs={12} md={4}>
          <TextField select label="Формат обратной связи" value={feedbackMode} onChange={(event) => setFeedbackMode(event.target.value)} fullWidth>
            {Object.entries(feedbackModeLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <TextField label="Дедлайн" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} fullWidth />
      <TextField label="Теги кейса" value={tags} onChange={(event) => setTags(event.target.value)} fullWidth />
      <Typography variant="h6">Вклад в компетенции</Typography>
      <Grid container spacing={2}>
        {competencyKeys.map((competency) => (
          <Grid item xs={12} md={6} key={competency}>
            <TextField label={competencyLabels[competency]} type="number" value={weights[competency]} onChange={(event) => setWeights({ ...weights, [competency]: Number(event.target.value) })} fullWidth />
          </Grid>
        ))}
      </Grid>
    </FormCard>
  );
}

export function SubmissionReviewPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('Решение принято к дальнейшей проработке. Уточните метрики и добавьте артефакты проверки.');
  const { data, loading, reload } = useApi(async () => {
    const [submissions, cases] = await Promise.all([get<Submission[]>('/submissions'), get<PracticalCase[]>('/cases')]);
    return { submissions, cases };
  }, []);
  const selected = useMemo(() => data?.submissions.find((item) => item.id === selectedId) ?? data?.submissions[0], [data, selectedId]);
  const selectedCase = data?.cases.find((item) => item.id === selected?.caseId);

  async function createFeedback(status: string) {
    if (!selected) return;
    await post<Feedback>(`/submissions/${selected.id}/feedback`, {
      submissionId: selected.id,
      authorType: 'CUSTOMER',
      authorName: 'Ревьюер заказчика',
      text: feedbackText,
      recommendations: ['Уточнить гипотезы', 'Добавить критерии приёмки'],
      competencyDelta: { AUTONOMY: 3, HYPOTHESIS_AND_PRODUCT_THINKING: 4 },
      targetSubmissionStatus: status
    });
    await reload();
  }

  async function markPriority() {
    if (!selected) return;
    await post(`/submissions/${selected.id}/mark-priority`);
    await reload();
  }

  if (loading || !data) return <LoadingBlock />;
  return (
    <Box>
      <PageHeader title="Проверка решений" subtitle="Список решений, карточка работы и форма обратной связи." />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card><CardContent><SubmissionTable submissions={data.submissions} selectedId={selected?.id} onOpen={(id) => setSelectedId(id)} /></CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          {selected ? (
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} flexWrap="wrap"><Chip label={submissionStatusLabels[selected.status]} color="primary" /><Chip label={selectedCase?.title ?? 'Кейс'} /></Stack>
                  <Typography variant="h5">{selected.title}</Typography>
                  <Typography color="text.secondary">{selected.description}</Typography>
                  {selected.artifactUrl && <Alert severity="info">{selected.artifactUrl}</Alert>}
                  <CompetencyBars values={selected.competencyScores} compact />
                  <TextField label="Обратная связь" value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} multiline minRows={4} fullWidth />
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button variant="contained" onClick={() => createFeedback('ACCEPTED')}>Принять</Button>
                    <Button variant="outlined" onClick={() => createFeedback('NEEDS_IMPROVEMENT')}>На доработку</Button>
                    <Button color="error" variant="outlined" onClick={() => createFeedback('REJECTED')}>Отклонить</Button>
                    <Button color="success" variant="outlined" onClick={markPriority}>Отметить как приоритетного кандидата</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ) : <EmptyState title="Нет решений" />}
        </Grid>
      </Grid>
    </Box>
  );
}

export function CvBookPage() {
  const navigate = useNavigate();
  const [competency, setCompetency] = useState<Competency | ''>('');
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [completedCasesMin, setCompletedCasesMin] = useState(0);
  const [caseTag, setCaseTag] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [minScore, setMinScore] = useState(0);
  const { data, loading } = useApi(() => get<CvBookCandidate[]>('/cv-book/candidates', {
    competency: competency || undefined,
    priorityOnly: priorityOnly || undefined,
    completedCasesMin: completedCasesMin || undefined,
    caseTag: caseTag || undefined,
    organizationName: organizationName || undefined,
    minScore: minScore || undefined
  }), [competency, priorityOnly, completedCasesMin, caseTag, organizationName, minScore]);
  const filtered = useMemo(() => (data ?? []).filter((candidate) => {
    if (organizationName && !(candidate.organizationName ?? '').toLowerCase().includes(organizationName.toLowerCase())) return false;
    if (caseTag && !candidate.tags.some((tag) => tag.toLowerCase().includes(caseTag.toLowerCase()))) return false;
    if (minScore && candidate.averageScore < minScore) return false;
    return true;
  }), [data, organizationName, caseTag, minScore]);

  return (
    <Box>
      <PageHeader title="Витрина кандидатов" subtitle="Фильтрация по компетенциям, приоритету, кейсам, организации и баллу." />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField select label="Компетенция" value={competency} onChange={(event) => setCompetency(event.target.value as Competency | '')} fullWidth>
                <MenuItem value="">Все</MenuItem>
                {competencyKeys.map((item) => <MenuItem key={item} value={item}>{competencyLabels[item]}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select label="Только приоритетные" value={priorityOnly ? 'yes' : 'no'} onChange={(event) => setPriorityOnly(event.target.value === 'yes')} fullWidth>
                <MenuItem value="no">Все кандидаты</MenuItem>
                <MenuItem value="yes">Только приоритетные</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}><TextField label="Минимум завершённых кейсов" type="number" value={completedCasesMin} onChange={(event) => setCompletedCasesMin(Number(event.target.value))} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="Тег кейса" value={caseTag} onChange={(event) => setCaseTag(event.target.value)} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="Организация" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="Минимальный балл" type="number" value={minScore} onChange={(event) => setMinScore(Number(event.target.value))} fullWidth /></Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading ? <LoadingBlock /> : (
        <Grid container spacing={2}>
          {filtered.map((candidate) => (
            <Grid item xs={12} md={6} lg={4} key={candidate.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Box>
                      <Typography variant="h6">{candidate.fullName}</Typography>
                      <Typography color="text.secondary">{candidate.organizationName}</Typography>
                    </Box>
                    <Chip label={priorityStatusLabels[candidate.priorityStatus]} color={candidate.priorityStatus === 'PRIORITY' ? 'success' : 'default'} />
                  </Stack>
                  <Typography sx={{ mt: 2 }}><b>{candidate.completedCasesCount}</b> кейсов, средний балл <b>{candidate.averageScore}%</b></Typography>
                  <CompetencyBars values={candidate.competencyProfile} compact />
                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>{candidate.tags.map((tag) => <Chip size="small" key={tag} label={tag} />)}</Stack>
                </CardContent>
                <CardContent sx={{ pt: 0 }}><Button onClick={() => navigate(`/customer/cv-book/${candidate.id}`)}>Открыть профиль</Button></CardContent>
              </Card>
            </Grid>
          ))}
          {!filtered.length && <Grid item xs={12}><EmptyState title="Кандидаты не найдены" description="Попробуйте изменить фильтры." /></Grid>}
        </Grid>
      )}
    </Box>
  );
}

export function CandidateProfilePage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<string | null>(null);
  const { data, loading, reload } = useApi(async () => {
    const candidate = await get<CvBookCandidate>(`/cv-book/candidates/${id}`);
    const [portfolio, submissions] = await Promise.all([
      get<Portfolio>(`/portfolio/${candidate.studentId}`),
      get<Submission[]>('/submissions', { studentId: candidate.studentId })
    ]);
    return { candidate, portfolio, submissions };
  }, [id]);

  async function liveFeedback() {
    const submission = data?.submissions[0];
    if (!submission) return;
    await post<Feedback>(`/submissions/${submission.id}/feedback`, {
      submissionId: submission.id,
      authorType: 'CUSTOMER',
      authorName: 'Ревьюер заказчика',
      text: 'Сильный профиль: стоит подробнее раскрыть собственный вклад и проверку гипотез.',
      recommendations: ['Добавить измеримые результаты', 'Уточнить роль ИИ в процессе'],
      competencyDelta: { COLLABORATION: 2, AUTONOMY: 3 },
      targetSubmissionStatus: submission.status
    });
    setNotice('Обратная связь сохранена');
    await reload();
  }

  async function markPriority() {
    const submission = data?.submissions[0];
    if (!submission) return;
    await post(`/submissions/${submission.id}/mark-priority`);
    setNotice('Кандидат отмечен как приоритетный');
    await reload();
  }

  if (loading || !data) return <LoadingBlock />;
  const radar = competencyKeys.map((competency) => ({ competency, value: data.candidate.competencyProfile[competency] ?? 0 }));
  const dynamics = data.submissions.map((submission, index) => ({ label: `Кейс ${index + 1}`, value: Math.min(100, 72 + index * 6) }));
  return (
    <Box>
      <PageHeader
        title={data.candidate.fullName}
        subtitle={data.portfolio.summary}
        actions={<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button variant="outlined" onClick={liveFeedback}>Выдать обратную связь</Button><Button variant="contained" onClick={markPriority}>Отметить как приоритетного кандидата</Button></Stack>}
      />
      {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}><CompetencyRadarChart data={radar} /></Grid>
        <Grid item xs={12} lg={7}><LineChartBlock title="Динамика качества решений" data={dynamics.length ? dynamics : [{ label: 'Старт', value: data.candidate.averageScore }]} /></Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6">Выполненные кейсы</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>{data.portfolio.completedCases.map((item) => <Paper variant="outlined" sx={{ p: 1.5 }} key={item}>{item}</Paper>)}</Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Сильные стороны</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {data.candidate.tags.map((tag) => <Chip key={tag} label={tag} color="primary" variant="outlined" />)}
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6">Зоны роста и история обратной связи</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {data.portfolio.feedbackHighlights.map((item) => <Alert key={item} severity="success">{item}</Alert>)}
                <Alert severity="info">Уточнить метрики результата и роль каждого участника команды.</Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function SubmissionTable({ submissions, selectedId, onOpen }: { submissions: Submission[]; selectedId?: string; onOpen: (id: string) => void }) {
  if (!submissions.length) return <EmptyState title="Решений пока нет" />;
  return (
    <Table size="small">
      <TableHead><TableRow><TableCell>Название</TableCell><TableCell>Статус</TableCell><TableCell /></TableRow></TableHead>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id} selected={submission.id === selectedId} hover>
            <TableCell><Typography fontWeight={700}>{submission.title}</Typography><Typography variant="caption" color="text.secondary">{submission.teamName}</Typography></TableCell>
            <TableCell><Chip size="small" label={submissionStatusLabels[submission.status]} /></TableCell>
            <TableCell align="right"><Button size="small" onClick={() => onOpen(submission.id)}>Открыть</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FormCard({ title, children, submitLabel, onSubmit }: { title: string; children: React.ReactNode; submitLabel: string; onSubmit: (event: FormEvent) => void }) {
  return (
    <Box>
      <PageHeader title={title} />
      <Card>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            {children}
            <Button type="submit" variant="contained">{submitLabel}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
