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
  Stack,
  TextField,
  Typography,
  alpha
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { post } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { Role, StudentType, UserSession } from '../types';
import { BrandBackdrop } from '../components/BrandBackdrop';
import { brand, fontMono, fontSber } from '../theme/theme';
import { ProcessScrollSection, ProcessStep } from './landing/ProcessScrollSection';
import { CompetencyGrid, CompetencyCardData } from './landing/CompetencyGrid';
import { SignInIllustration } from './landing/SignInIllustration';
import {
  AiSynergyIcon,
  ArrowRightIcon,
  CaseIcon,
  CollaborationIcon,
  FeedbackIcon,
  MentorIcon,
  PortfolioIcon,
  ResultIcon,
  RoadmapIcon,
  SystemsThinkingIcon,
  TrajectoryIcon,
  UncertaintyIcon
} from './landing/icons';

const demoAccounts = [
  { label: 'Войти как студент', email: 'student@example.com' },
  { label: 'Войти как заказчик', email: 'customer@example.com' },
  { label: 'Войти как модератор', email: 'moderator@example.com' },
  { label: 'Войти как администратор', email: 'admin@example.com' }
];

const processSteps: ProcessStep[] = [
  { title: 'Выбираешь траекторию', Icon: TrajectoryIcon, description: 'Смотришь на карту направлений, соотносишь со своим опытом и выбираешь трек, который приведёт к конкретной профессиональной цели.' },
  { title: 'Получаешь дорожную карту', Icon: RoadmapIcon, description: 'Платформа собирает индивидуальный план: от вводных этапов до финальной защиты, с понятными контрольными точками.' },
  { title: 'Выполняешь кейсы', Icon: CaseIcon, description: 'Берёшь реальные задачи от компаний-заказчиков — не учебные симуляции, а рабочие брифы с настоящими ограничениями.' },
  { title: 'Работаешь с ИИ-наставниками', Icon: MentorIcon, description: 'ИИ-наставник разбирает решение, задаёт уточняющие вопросы и подсказывает, куда копать глубже.' },
  { title: 'Получаешь обратную связь', Icon: FeedbackIcon, description: 'Обратная связь приходит не оценкой, а конкретными выводами — что усилило кейс, а что стоит пересобрать.' },
  { title: 'Собираешь портфолио', Icon: PortfolioIcon, description: 'Лучшие решения и выводы автоматически попадают в портфолио, которое видят заказчики на витрине кандидатов.' }
];

const competencyItems: CompetencyCardData[] = [
  { key: 'systems', title: 'Системное мышление', Icon: SystemsThinkingIcon, description: 'Видит задачу как часть более крупного процесса и предсказывает последствия решений.' },
  { key: 'uncertainty', title: 'Работа с неопределённостью', Icon: UncertaintyIcon, description: 'Принимает решения при неполных данных и не останавливается перед нестандартной задачей.' },
  { key: 'collaboration', title: 'Коммуникация и обратная связь', Icon: CollaborationIcon, description: 'Формулирует мысль так, чтобы её поняли, и умеет принимать критику по делу.' },
  { key: 'result', title: 'Ориентация на результат', Icon: ResultIcon, description: 'Доводит кейс до конечного артефакта, а не до половины плана.' },
  { key: 'ai', title: 'Работа с данными и ИИ', Icon: AiSynergyIcon, description: 'Использует ИИ-инструменты как рабочий инструмент, а не как замену собственному выводу.' }
];

const heroTiles = [
  { title: 'Траектории развития', text: 'Студент выбирает направление и видит путь к состоянию «маяк профессии».', Icon: TrajectoryIcon },
  { title: 'Портфолио из реальных кейсов', text: 'В портфолио попадают артефакты, решения и ключевые выводы обратной связи.', Icon: PortfolioIcon },
  { title: 'Витрина кандидатов', text: 'Заказчики видят сильных участников и могут отмечать приоритетных кандидатов.', Icon: CaseIcon }
];

export function PublicLandingPage() {
  const navigate = useNavigate();
  const [tilesIn, setTilesIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTilesIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ---------- NAV ---------- */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: alpha('#fff', 0.6),
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${alpha(brand.forest, 0.1)}`
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Typography sx={{ color: brand.forest, fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
            Трек
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate('/sign-in')}
              sx={{ color: brand.forest, borderColor: alpha(brand.forest, 0.3), '&:hover': { borderColor: brand.forest, bgcolor: alpha(brand.forest, 0.06) } }}
            >
              Войти
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/sign-up')}
              sx={{ bgcolor: brand.blue, '&:hover': { bgcolor: '#0048b0' } }}
            >
              Создать аккаунт
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ---------- HERO ---------- */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          pt: { xs: 6, md: 8 },
          pb: { xs: 5, md: 7 },
          borderRadius: '0 0 32px 32px',
          mb: '-32px',
          background: `
            radial-gradient(ellipse 1000px 600px at 12% -10%, ${alpha('#21A038', 0.14)}, transparent 60%),
            radial-gradient(ellipse 900px 600px at 100% 0%, ${alpha('#149137', 0.12)}, transparent 55%),
            linear-gradient(160deg, #d0f7e0 0%, #e8fdf1 45%, #eff7f7 100%)
          `
        }}
      >
        <Container maxWidth="xl">
          <Chip
            label="Платформа траекторий развития"
            icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: brand.lime, ml: '10px !important' }} />}
            sx={{ mb: 3.5, bgcolor: alpha('#fff', 0.7), color: brand.forest, border: `1px solid ${alpha(brand.forest, 0.16)}` }}
          />
          <Typography
            sx={{
              color: '#0f2a22',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontSize: { xs: 40, sm: 56, md: 'clamp(40px, 6vw, 76px)' },
              lineHeight: 0.98,
              maxWidth: 820,
              mb: 3
            }}
          >
            Путь от старта{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${brand.forest}, ${brand.teal})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              до маяка профессии
            </Box>
          </Typography>
          <Typography sx={{ color: alpha('#0f2a22', 0.68), fontSize: 19, lineHeight: 1.55, maxWidth: 600, mb: 4.5 }}>
            Реальные кейсы от заказчиков, дорожная карта студента, ИИ-наставники и портфолио, которое действительно смотрят работодатели.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75} sx={{ mb: { xs: 6, md: 8 } }}>
            <Button
              size="large"
              endIcon={<ArrowRightIcon />}
              onClick={() => navigate('/sign-in')}
              sx={{ bgcolor: brand.forest, color: '#fff', px: 3, py: 1.5, fontSize: 15, '&:hover': { bgcolor: brand.ink } }}
            >
              Открыть демо-версию
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate('/sign-up')}
              sx={{ color: brand.forest, borderColor: alpha(brand.forest, 0.35), px: 3, py: 1.5, fontSize: 15, '&:hover': { borderColor: brand.forest, bgcolor: alpha(brand.forest, 0.06) } }}
            >
              Стать участником
            </Button>
          </Stack>
          <Grid container spacing={1.75}>
            {heroTiles.map((tile, index) => {
              const Icon = tile.Icon;
              return (
                <Grid item xs={12} md={4} key={tile.title}>
                  <Box
                    sx={{
                      bgcolor: alpha('#fff', 0.55),
                      border: `1px solid ${alpha(brand.forest, 0.12)}`,
                      borderRadius: 2,
                      p: 2.5,
                      backdropFilter: 'blur(6px)',
                      opacity: tilesIn ? 1 : 0,
                      transform: tilesIn ? 'translateY(0)' : 'translateY(16px)',
                      transition: `opacity .6s ease ${index * 0.14}s, transform .6s ease ${index * 0.14}s`
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha(brand.teal, 0.16),
                        color: brand.forest,
                        mb: 1.5
                      }}
                    >
                      <Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ color: '#0f2a22', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 16, mb: 0.75 }}>
                      {tile.title}
                    </Typography>
                    <Typography sx={{ color: alpha('#0f2a22', 0.62), fontSize: 13.5, lineHeight: 1.5 }}>{tile.text}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ---------- SIGNATURE STICKY-SCROLL PROCESS ---------- */}
      <ProcessScrollSection steps={processSteps} />

      {/* Светлая секция «наезжает» скруглёнными краями сверху и снизу —
          сверху на тёмный sticky-scroll блок, снизу на тёмный футер —
          тот же приём, что на референсе Сбера. Скругление всегда
          принадлежит светлому слою, лежащему поверх тёмного. */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          bgcolor: brand.paper,
          borderRadius: '32px',
          mt: '-32px',
          mb: '-32px'
        }}
      >
        {/* ---------- COMPETENCY GRID ---------- */}
        <Container maxWidth="xl" sx={{ pt: { xs: 7, md: 9 }, pb: { xs: 7, md: 12 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'flex-end' }}
            spacing={2}
            sx={{ mb: 6 }}
          >
            <Box>
              <Typography sx={{ fontFamily: fontMono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: brand.teal, mb: 1.25 }}>
                Профиль роста
              </Typography>
              <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: { xs: 28, md: 'clamp(28px, 3.4vw, 42px)' }, maxWidth: 600 }}>
                Пять компетенций лидера будущего
              </Typography>
            </Box>
            <Typography sx={{ color: brand.stone, fontSize: 16, lineHeight: 1.55, maxWidth: 380 }}>
              Каждый кейс на платформе развивает конкретную компетенцию — прогресс виден в профиле, а не только в оценке.
            </Typography>
          </Stack>
          <CompetencyGrid items={competencyItems} />
        </Container>

        {/* ---------- CTA BAND ---------- */}
        <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 12 } }}>
          <Box
            sx={{
              background: `linear-gradient(120deg, ${brand.forest}, ${brand.teal} 70%, ${brand.lime})`,
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Box>
              <Typography sx={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: { xs: 24, md: 'clamp(24px, 3vw, 34px)' }, maxWidth: 480 }}>
                Готов пройти путь до маяка профессии?
              </Typography>
              <Typography sx={{ color: alpha('#fff', 0.78), fontSize: 15, maxWidth: 420, mt: 1.25 }}>
                Открой демо-версию и посмотри, как выглядит твоя первая траектория.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button
                size="large"
                onClick={() => navigate('/sign-in')}
                sx={{ bgcolor: '#fff', color: brand.forest, px: 3, '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
              >
                Открыть демо-версию
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => navigate('/sign-up')}
                sx={{ color: '#fff', borderColor: alpha('#fff', 0.45), px: 3, '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.1) } }}
              >
                Стать участником
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Тёмный футер — плоский фон под скруглённым низом светлой секции
          выше; собственного скругления не несёт. */}
      <Box
        component="footer"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: brand.ink
        }}
      >
        <BrandBackdrop preset="landing" />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 4, md: 5 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>Трек — демонстрационный прототип</Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>2026</Typography>
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse 1000px 700px at 10% 0%, ${alpha(brand.lime, 0.22)}, transparent 55%),
          radial-gradient(ellipse 900px 800px at 100% 100%, ${alpha(brand.teal, 0.2)}, transparent 55%),
          #f6faf8
        `
      }}
    >
      <Box sx={{ px: { xs: 3, md: 5 }, py: 3, position: 'relative' }}>
        <Typography
          component={RouterLink}
          to="/"
          sx={{ fontFamily: fontSber, fontWeight: 800, fontSize: 22, color: '#292929', textDecoration: 'none' }}
        >
          Трек
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          px: { xs: 3, md: 6 },
          pb: { xs: 4, md: 6 }
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            position: 'absolute',
            left: '25%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 380,
            opacity: 0.9
          }}
        >
          <SignInIllustration />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            position: { lg: 'absolute' },
            left: { lg: '72%' },
            top: { lg: '50%' },
            transform: { lg: 'translate(-50%, -50%)' }
          }}
        >
          <Box
            sx={{
              width: '100%',
              p: { xs: 3, md: 5 },
              bgcolor: '#fff',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              boxSizing: 'border-box',
              boxShadow: '0 24px 64px rgba(6, 32, 26, 0.08)',
              fontFamily: fontSber
            }}
          >
            <Box>
              <Typography sx={{ fontFamily: fontSber, fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: '#292929' }}>
                Добро пожаловать!
              </Typography>
              <Typography sx={{ fontFamily: fontSber, fontSize: 14, color: '#292929', mt: 1 }}>
                Войдите, чтобы продолжить путь к маяку профессии.
              </Typography>
            </Box>

            <Stack component="form" spacing={2} onSubmit={submit}>
              {error && <Alert severity="error">{error}</Alert>}
              <FormField label="Email">
                <TextField
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  required
                  type="email"
                  placeholder="name@example.com"
                  size="small"
                  sx={{ '& .MuiInputBase-input': { fontFamily: fontSber } }}
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
                  size="small"
                  sx={{ '& .MuiInputBase-input': { fontFamily: fontSber } }}
                />
              </FormField>
              <Button
                type="submit"
                sx={{
                  height: 48,
                  borderRadius: 2,
                  bgcolor: brand.teal,
                  color: '#fff',
                  fontFamily: fontSber,
                  fontWeight: 600,
                  fontSize: 16,
                  '&:hover': { bgcolor: brand.forest }
                }}
              >
                Войти
              </Button>
            </Stack>

            <Typography sx={{ fontFamily: fontSber, fontSize: 14, color: '#292929' }}>
              Нет аккаунта?{' '}
              <Typography component={RouterLink} to="/sign-up" sx={{ fontFamily: fontSber, color: '#0066ff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                Создать аккаунт
              </Typography>
            </Typography>

            <Divider />

            <Box>
              <Typography sx={{ fontFamily: fontSber, fontSize: 13, color: '#292929', mb: 1.5 }}>
                Демо-профили используют тестовый пароль — можно сразу посмотреть платформу с ролью.
              </Typography>
              <Stack spacing={1}>
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    fullWidth
                    onClick={() => signIn(account.email)}
                    disableElevation
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      bgcolor: brand.paperDim,
                      color: brand.forest,
                      fontFamily: fontSber,
                      fontSize: 14,
                      fontWeight: 600,
                      justifyContent: 'flex-start',
                      px: 2,
                      '&:hover': { bgcolor: alpha(brand.teal, 0.16) }
                    }}
                  >
                    {account.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
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
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        overflow: 'hidden',
        background: `radial-gradient(circle at 0% 100%, ${alpha(brand.lime, 0.12)}, transparent 35%), radial-gradient(circle at 100% 0%, ${alpha(brand.teal, 0.08)}, transparent 35%), linear-gradient(135deg, #f8fafc 0%, ${brand.paperDim} 50%, #f3faf7 100%)`
      }}
    >
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
                background: `linear-gradient(150deg, ${brand.forest} 0%, ${brand.teal} 58%, ${brand.lime} 100%)`
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
            <CardContent sx={{ p: { xs: 3, md: 4 }, fontFamily: fontSber, '& .MuiInputBase-input': { fontFamily: fontSber } }}>{children}</CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          mb: 1,
          color: light ? '#fff' : 'text.primary'
        }}
      >
        Трек
      </Typography>
      <Typography variant="caption" color={light ? alpha('#fff', 0.76) : 'text.secondary'}>
        Платформа практических кейсов <br /> и траекторий развития
      </Typography>
    </Box>
  );
}
