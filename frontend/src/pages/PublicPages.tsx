import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { FormEvent, ReactNode, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { post } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import heroPlatform from '../assets/hero-platform.png';
import { Role, StudentType, UserSession } from '../types';
import { competencyDescriptions, competencyLabels } from '../shared/labels';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { GradientIcon } from '../components/GradientIcon';

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
            <Typography 
              variant="h5" 
              fontWeight={900} 
              sx={{ 
                color: 'white', 
                letterSpacing: '-0.01em',
                fontFamily: '"SB Sans Display", sans-serif'
              }}
            >
              Трек
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<LoginRoundedIcon />}
                onClick={() => navigate('/sign-in')}
                sx={{ bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
              >
                Войти
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/sign-up')}
                sx={{ bgcolor: alpha('#0066FF', 0.8), color: 'white', borderColor: alpha('#fff', 0.6), '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.8) } }}
              >
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
              Трек
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
            <Typography variant="h3">Как работает Трек</Typography>
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
                        <GradientIcon icon={<Icon />} variant={(['brand', 'blue', 'amber', 'violet'] as const)[index % 4]} />
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

      <Box component="footer" sx={{ position: 'relative', overflow: 'hidden', borderTop: 1, borderColor: 'divider' }}>
        <BrandBackdrop preset="landing" />
        <Container maxWidth="xl" sx={{ position: 'relative', py: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
            <Typography variant="body2" color="text.secondary">Трек — демонстрационный прототип</Typography>
            <Typography variant="body2" color="text.secondary">2026</Typography>
          </Stack>
        </Container>
      </Box>
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
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={900}>Обычный вход</Typography>
        <Typography variant="body2" color="text.secondary">Введите данные своей учётной записи.</Typography>
      </Stack>
      <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ maxWidth: 520 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormField label="Email">
          <TextField
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
            type="email"
            placeholder="name@example.com"
          />
        </FormField>
        <FormField label="Пароль">
          <TextField
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
            type="password"
            placeholder="••••••••"
          />
        </FormField>
        <Button type="submit" variant="contained" size="large" startIcon={<LoginRoundedIcon />}>Войти</Button>
        <Button component={RouterLink} to="/sign-up" startIcon={<PersonAddAltRoundedIcon />} color="inherit">
          Создать аккаунт
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>ИЛИ ДЕМО-ДОСТУП</Typography>
      </Divider>

      <Stack spacing={1.25} sx={{ maxWidth: 520 }}>
        <Typography variant="body2" color="text.secondary">
          Демо-профили используют тестовый пароль — можно сразу посмотреть платформу с ролью.
        </Typography>
        <Grid container spacing={1.5}>
          {demoAccounts.map((account) => (
            <Grid item xs={12} sm={6} key={account.email}>
              <Button
                fullWidth
                onClick={() => signIn(account.email)}
                disableElevation
                sx={{
                  height: 88,
                  borderRadius: 2,

                  bgcolor: '#F8FAFC',
                  border: '1px solid',
                  borderColor: '#E5E7EB',

                  color: '#111827',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  textTransform: 'none',

                  transition: 'all .2s ease',

                  '&:hover': {
                    bgcolor: '#F1F5F9',
                    borderColor: '#CBD5E1',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(15,23,42,.08)'
                  }
                }}
              >
                {account.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AuthPageFrame>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={0.75}>
      <Typography variant="body2" fontWeight={700} color="text.primary">{label}</Typography>
      {children}
    </Stack>
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
      <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ maxWidth: 440 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <FormField label="ФИО">
          <TextField value={fullName} onChange={(event) => setFullName(event.target.value)} fullWidth required placeholder="Иван Иванов" />
        </FormField>

        <FormField label="Email">
          <TextField value={email} onChange={(event) => setEmail(event.target.value)} fullWidth required type="email" placeholder="name@example.com" />
        </FormField>

        <Divider sx={{ my: 0.5 }} />

        <FormField label="Роль">
          <TextField select value={role} onChange={(event) => setRole(event.target.value as Role)} fullWidth>
            <MenuItem value="STUDENT">Студент/школьник</MenuItem>
            <MenuItem value="CUSTOMER">Заказчик</MenuItem>
          </TextField>
        </FormField>

        {role === 'STUDENT' && (
          <FormField label="Тип участника">
            <TextField select value={studentType} onChange={(event) => setStudentType(event.target.value as StudentType)} fullWidth>
              <MenuItem value="UNIVERSITY_STUDENT">Студент</MenuItem>
              <MenuItem value="SCHOOL_STUDENT">Школьник</MenuItem>
            </TextField>
          </FormField>
        )}

        <FormField label={role === 'CUSTOMER' ? 'Организация' : 'Вуз или школа'}>
          <TextField
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            fullWidth
            placeholder={role === 'CUSTOMER' ? 'Название компании' : 'Необязательно'}
          />
        </FormField>

        <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAltRoundedIcon />}>Создать аккаунт</Button>
        <Button component={RouterLink} to="/sign-in" startIcon={<LoginRoundedIcon />} color="inherit">
          Уже есть аккаунт? Войти
        </Button>
      </Stack>
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

function AuthPageFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, overflow: 'hidden', background: 'radial-gradient(circle at 0% 100%, rgba(22,163,74,0.12), transparent 35%), radial-gradient(circle at 100% 0%, rgba(20,184,166,0.08), transparent 35%), linear-gradient(135deg, #f8fafc 0%, #eefbf7 50%, #f3faf7 100%)' }}>
      <BrandBackdrop preset="auth" fixed />
      <Card sx={{ position: 'relative', maxWidth: 1040, width: '100%', overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                minHeight: 460,
                p: 4,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(150deg, #075747 0%, #0b7a64 58%, #16803c 100%)'
              }}
            >
              <Box aria-hidden sx={{ position: 'absolute', right: -90, top: -90, width: 260, height: 260, borderRadius: '50%', background: alpha('#fff', 0.08) }} />
              <Box aria-hidden sx={{ position: 'absolute', left: -70, bottom: -110, width: 240, height: 240, borderRadius: '50%', background: alpha('#fff', 0.06) }} />
              <Box sx={{ position: 'relative' }}><LogoMark light /></Box>
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>{title}</Typography>
                <Typography sx={{ color: alpha('#fff', 0.82), maxWidth: 360 }}>{subtitle}</Typography>
              </Box>
              <Stack spacing={1.25} sx={{ position: 'relative' }}>
                {[
                  'Траектория развития до «маяка профессии»',
                  'Портфолио из реальных кейсов',
                  'ИИ-наставники и содержательная обратная связь'
                ].map((line) => (
                  <Stack key={line} direction="row" spacing={1.25} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 20, color: alpha('#fff', 0.9) }} />
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>{line}</Typography>
                  </Stack>
                ))}
              </Stack>
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
      {/* <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 900,
          color: 'white',
          // На тёмном фоне — белая стеклянная плашка; на светлом — фирменный
          // градиент (тот же язык, что у hero-блоков и иконок платформы).
          background: light ? alpha('#fff', 0.16) : 'linear-gradient(135deg, #075747 0%, #0b7a64 60%, #16803c 100%)',
          border: light ? `1px solid ${alpha('#fff', 0.28)}` : 'none',
          boxShadow: light ? 'none' : '0 4px 12px rgba(11, 122, 100, 0.28)'
        }}
      >
        СТ */}
      {/* </Box> */}
      <Box>
        <Typography variant="h5" fontWeight={900} color={light ? 'white' : 'text.primary'}
          sx={{
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            mb: 1}}>
         Трек
        </Typography>
        <Typography variant="caption" color={light ? alpha('#fff', 0.76) : 'text.secondary'}>
          Платформа практических кейсов <br /> и траекторий развития
        </Typography>
      </Box>
    </Stack>
  );
}
