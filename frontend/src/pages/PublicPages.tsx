import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { post } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import heroPlatform from '../assets/hero-platform.png';
import { Role, StudentType, UserSession } from '../types';
import { competencyDescriptions, competencyLabels } from '../shared/labels';

const demoAccounts = [
  { label: 'Войти как студент', email: 'student@example.com' },
  { label: 'Войти как заказчик', email: 'customer@example.com' },
  { label: 'Войти как модератор', email: 'moderator@example.com' },
  { label: 'Войти как администратор', email: 'admin@example.com' }
];

const workSteps = [
  ['Выбираешь траекторию', AccountTreeRoundedIcon],
  ['Получаешь дорожную карту', TimelineRoundedIcon],
  ['Выполняешь кейсы', AssignmentTurnedInRoundedIcon],
  ['Работаешь с ИИ-наставниками', PsychologyRoundedIcon],
  ['Получаешь обратную связь', WorkspacePremiumRoundedIcon],
  ['Собираешь портфолио', ArrowForwardRoundedIcon]
];

export function PublicLandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          minHeight: { xs: 720, md: 760 },
          display: 'flex',
          alignItems: 'stretch',
          backgroundImage: `linear-gradient(90deg, rgba(4,31,27,0.92) 0%, rgba(6,55,48,0.78) 44%, rgba(6,55,48,0.18) 76%), url(${heroPlatform})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <LogoMark light />
            <Stack direction="row" spacing={1}>
              <Button color="inherit" variant="outlined" onClick={() => navigate('/sign-in')} sx={{ color: 'white', borderColor: alpha('#fff', 0.5) }}>
                Войти
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate('/sign-up')}>
                Создать аккаунт
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ maxWidth: 790, color: 'white', py: { xs: 6, md: 10 } }}>
            <Chip
              label="Платформа траекторий развития"
              sx={{ mb: 2, bgcolor: alpha('#fff', 0.16), color: 'white', border: `1px solid ${alpha('#fff', 0.24)}` }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 72 }, lineHeight: 1.02, mb: 2 }}>
              СберТрек
            </Typography>
            <Typography variant="h5" sx={{ color: alpha('#fff', 0.88), maxWidth: 720, mb: 4 }}>
              Реальные кейсы от заказчиков, выбор маяка профессии, дорожная карта студента, ИИ-наставники и портфолио из реальных кейсов.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/sign-in')}>
                Открыть демо-версию
              </Button>
              <Button size="large" variant="outlined" color="inherit" onClick={() => navigate('/sign-up')} sx={{ borderColor: alpha('#fff', 0.45), color: 'white' }}>
                Стать участником
              </Button>
            </Stack>
          </Box>
          <Grid container spacing={2} sx={{ pb: 1 }}>
            {[
              ['Траектории развития', 'Студент выбирает направление и видит путь к состоянию “маяк профессии”.'],
              ['Портфолио из реальных кейсов', 'В портфолио попадают артефакты, решения и ключевые выводы обратной связи.'],
              ['Витрина кандидатов', 'Заказчики видят сильных участников и могут отмечать приоритетных кандидатов.']
            ].map(([title, text]) => (
              <Grid item xs={12} md={4} key={title}>
                <Paper sx={{ p: 2, bgcolor: alpha('#fff', 0.12), color: 'white', border: `1px solid ${alpha('#fff', 0.18)}`, borderRadius: 1, backdropFilter: 'blur(10px)' }}>
                  <Typography fontWeight={900}>{title}</Typography>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.76), mt: 0.5 }}>{text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <Typography variant="h3">Как работает СберТрек</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Платформа ведёт участника не по случайному списку задач, а по понятной ветке роста: от вводных этапов до итоговой защиты и портфолио.
            </Typography>
          </Grid>
          <Grid item xs={12} lg={7}>
            <Grid container spacing={1.5}>
              {workSteps.map(([title, Icon], index) => (
                <Grid item xs={12} sm={6} md={4} key={title as string}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ width: 44, height: 44, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                          <Icon />
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>Шаг {index + 1}</Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ mt: 2 }}>{title as string}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl" sx={{ pb: 7 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Пять компетенций лидера будущего</Typography>
        <Grid container spacing={2}>
          {Object.entries(competencyLabels).map(([competency, title]) => (
            <Grid item xs={12} sm={6} md={2.4} key={competency}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {competencyDescriptions[competency as keyof typeof competencyDescriptions]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
    } catch {
      setError('Не удалось выполнить вход. Проверьте email и пароль.');
    }
  }

  return (
    <AuthPageFrame title="Вход" subtitle="Платформа практических кейсов и траекторий развития.">
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h5">Обычный вход</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Введите данные своей учётной записи.
              </Typography>
              <Stack component="form" spacing={2} onSubmit={submit}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth required />
                <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth required />
                <Button type="submit" variant="contained" startIcon={<LoginRoundedIcon />}>Войти</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h5">Демо-версия</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Демо-доступы используют тестовый пароль.
              </Typography>
              <Stack spacing={1}>
                {demoAccounts.map((account) => (
                  <Button key={account.email} fullWidth variant="outlined" onClick={() => signIn(account.email)}>
                    {account.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button component={RouterLink} to="/sign-up" startIcon={<PersonAddAltRoundedIcon />} sx={{ mt: 2 }}>
        Создать аккаунт
      </Button>
    </AuthPageFrame>
  );
}

export function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [organizationName, setOrganizationName] = useState('');
  const [studentType, setStudentType] = useState<StudentType>('UNIVERSITY_STUDENT');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const session = await post<UserSession>('/auth/sign-up', {
        fullName,
        email,
        password: 'password',
        role,
        organizationName: role === 'CUSTOMER' ? organizationName : organizationName || 'Самостоятельный участник',
        studentType: role === 'STUDENT' ? studentType : 'NONE'
      });
      localStorage.setItem('sbertrack.session', JSON.stringify(session));
      window.location.assign(role === 'STUDENT' ? '/student/dashboard' : '/customer/dashboard');
    } catch {
      setError('Регистрация не выполнена. Проверьте заполнение формы.');
    }
  }

  return (
    <AuthPageFrame title="Создать аккаунт" subtitle="Публичная регистрация открыта для студентов, школьников и заказчиков.">
      <Card variant="outlined" sx={{ boxShadow: 'none' }}>
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={submit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="ФИО" value={fullName} onChange={(event) => setFullName(event.target.value)} fullWidth required />
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth required />
            <TextField select label="Роль" value={role} onChange={(event) => setRole(event.target.value as Role)} fullWidth>
              <MenuItem value="STUDENT">Студент/школьник</MenuItem>
              <MenuItem value="CUSTOMER">Заказчик</MenuItem>
            </TextField>
            {role === 'STUDENT' && (
              <TextField select label="Тип участника" value={studentType} onChange={(event) => setStudentType(event.target.value as StudentType)} fullWidth>
                <MenuItem value="UNIVERSITY_STUDENT">Студент</MenuItem>
                <MenuItem value="SCHOOL_STUDENT">Школьник</MenuItem>
              </TextField>
            )}
            <TextField label={role === 'CUSTOMER' ? 'Организация' : 'Вуз или школа'} value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} fullWidth />
            <Button type="submit" variant="contained" startIcon={<PersonAddAltRoundedIcon />}>Создать аккаунт</Button>
          </Stack>
        </CardContent>
      </Card>
      <Button component={RouterLink} to="/sign-in" startIcon={<LoginRoundedIcon />} sx={{ mt: 2 }}>
        Уже есть аккаунт? Войти
      </Button>
    </AuthPageFrame>
  );
}

export function AccessDeniedPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="flex-start">
            <Chip color="error" label="Нет доступа" />
            <Typography variant="h4">Нет доступа к странице</Typography>
            <Typography color="text.secondary">Откройте страницу, доступную для вашей роли, или войдите под другим демонстрационным профилем.</Typography>
            <Button component={RouterLink} to="/sign-in" variant="contained">Перейти ко входу</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

function AuthPageFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 1040, width: '100%', overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: '100%',
                minHeight: 420,
                p: 4,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: `linear-gradient(145deg, ${theme.palette.primary.dark}, #0f766e 58%, ${theme.palette.secondary.dark})`
              }}
            >
              <LogoMark light />
              <Box>
                <Typography variant="h3" sx={{ mb: 1 }}>{title}</Typography>
                <Typography sx={{ color: alpha('#fff', 0.82), maxWidth: 360 }}>{subtitle}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.72) }}>
                СберТрек помогает участнику двигаться по траектории развития, собирать портфолио и получать содержательную обратную связь.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>{children}</CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 900,
          bgcolor: light ? alpha('#fff', 0.16) : 'primary.light',
          color: light ? 'white' : 'primary.main',
          border: light ? `1px solid ${alpha('#fff', 0.24)}` : 'none'
        }}
      >
        СТ
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={900} color={light ? 'white' : 'text.primary'}>СберТрек</Typography>
        <Typography variant="caption" color={light ? alpha('#fff', 0.76) : 'text.secondary'}>
          Платформа практических кейсов и траекторий развития
        </Typography>
      </Box>
    </Stack>
  );
}
