import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  CircularProgress,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { platformApi } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { useApi } from '../hooks/useApi';
import { Role, SearchResult } from '../types';
import { pluralizeDays } from '../shared/format';
import { roleLabels } from '../shared/labels';
import { brand } from '../theme/theme';

const drawerWidth = 280;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  roles: Role[];
  badge?: number;
  activePrefixes?: string[];
}

interface NavGroup {
  id: string;
  label: string;
  roles: Role[];
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'cabinet',
    label: 'Кабинет',
    roles: ['STUDENT'],
    items: [
      { label: 'Главная', path: '/student/dashboard', icon: <DashboardRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Новости', path: '/student/news', icon: <NewspaperRoundedIcon />, roles: ['STUDENT'], badge: 3 },
      { label: 'Аналитика', path: '/student/analytics', icon: <InsightsRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Рефлексия', path: '/student/reflection', icon: <SelfImprovementRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Мой профиль', path: '/student/profile', icon: <AccountBoxRoundedIcon />, roles: ['STUDENT'] }
    ]
  },
  {
    id: 'growth',
    label: 'Развитие',
    roles: ['STUDENT'],
    items: [
      { label: 'Курсы и треки', path: '/student/tracks', icon: <RouteRoundedIcon />, roles: ['STUDENT'], activePrefixes: ['/student/cases', '/student/workspace'] },
      { label: 'Дерево траекторий', path: '/student/trajectories', icon: <AccountTreeRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Мой roadmap', path: '/student/roadmap', icon: <TimelineRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Песочница наставников', path: '/student/agents', icon: <SmartToyRoundedIcon />, roles: ['STUDENT'] },
      { label: 'Портфолио', path: '/student/portfolio', icon: <WorkRoundedIcon />, roles: ['STUDENT'] }
    ]
  },
  {
    id: 'customer',
    label: 'Заказчик',
    roles: ['CUSTOMER'],
    items: [
      { label: 'Панель заказчика', path: '/customer/dashboard', icon: <DashboardRoundedIcon />, roles: ['CUSTOMER'] },
      { label: 'Создать трек', path: '/customer/tracks/create', icon: <AddCircleRoundedIcon />, roles: ['CUSTOMER'] },
      { label: 'Создать кейс', path: '/customer/cases/create', icon: <WorkRoundedIcon />, roles: ['CUSTOMER'] },
      { label: 'Проверка решений', path: '/customer/submissions', icon: <FactCheckRoundedIcon />, roles: ['CUSTOMER'] },
      { label: 'Витрина кандидатов', path: '/customer/cv-book', icon: <GroupRoundedIcon />, roles: ['CUSTOMER'] }
    ]
  },
  {
    id: 'moderator',
    label: 'Модерация',
    roles: ['MODERATOR'],
    items: [
      { label: 'Модерация', path: '/moderator/dashboard', icon: <DashboardRoundedIcon />, roles: ['MODERATOR'] },
      { label: 'ИИ-наставники', path: '/moderator/agents', icon: <SmartToyRoundedIcon />, roles: ['MODERATOR'] },
      { label: 'Мастер-промпты', path: '/moderator/master-prompts', icon: <TuneRoundedIcon />, roles: ['MODERATOR'] }
    ]
  },
  {
    id: 'admin',
    label: 'Администрирование',
    roles: ['ADMIN'],
    items: [
      { label: 'Админ-панель', path: '/admin/dashboard', icon: <AdminPanelSettingsRoundedIcon />, roles: ['ADMIN'] }
    ]
  }
];

export function AppShell() {
  const { session, signOut } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const isStudent = session?.user.role === 'STUDENT';
  const { data: streak } = useApi(
    () => (isStudent ? platformApi.streak.me() : Promise.resolve(null)),
    [isStudent]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRequestId = useRef(0);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const requestId = ++searchRequestId.current;
    const timeout = setTimeout(() => {
      platformApi.search.run(query)
        .then((results) => {
          if (searchRequestId.current === requestId) {
            setSearchResults(results);
          }
        })
        .catch(() => {
          if (searchRequestId.current === requestId) {
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (searchRequestId.current === requestId) {
            setSearchLoading(false);
          }
        });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  function goToSearchResult(result: SearchResult) {
    setSearchOpen(false);
    setSearchQuery('');
    if (result.type === 'PERSON') {
      if (session?.user.role === 'CUSTOMER') {
        navigate(`/customer/cv-book/${result.id}`);
      }
      return;
    }
    if (result.type === 'CASE') {
      navigate(`/student/cases/${result.id}`);
      return;
    }
    navigate(`/student/tracks/${result.id}`);
  }

  const searchResultIcon = {
    CASE: <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} />,
    TRACK: <AltRouteRoundedIcon sx={{ fontSize: 18 }} />,
    PERSON: <PersonRoundedIcon sx={{ fontSize: 18 }} />
  } as const;

  const visibleGroups = navGroups
    .filter((group) => session && group.roles.includes(session.user.role))
    .map((group) => ({ ...group, items: group.items.filter((item) => session && item.roles.includes(session.user.role)) }))
    .filter((group) => group.items.length > 0);

  function toggleGroup(id: string) {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function goTo(path: string) {
    navigate(path);
    setOpen(false);
    const owningGroup = navGroups.find((group) => group.items.some((item) => item.path === path));
    if (owningGroup) {
      setCollapsedGroups((prev) => ({ ...prev, [owningGroup.id]: false }));
    }
  }

  const currentWidth = drawerWidth;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ py: 2, px: 2.5, flexShrink: 0 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(135deg, ${brand.forest} 0%, ${brand.teal} 60%, ${brand.lime} 100%)`,
              color: '#fff',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: 16
            }}
          >
            Т
          </Box>
          <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 17, color: brand.forest, letterSpacing: '-0.01em', lineHeight: 1.1, minWidth: 0, flexGrow: 1 }}>
            Трек
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 2.5, flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {visibleGroups.map((group) => {
          const isCollapsed = Boolean(collapsedGroups[group.id]);
          return (
            <Box key={group.id} sx={{ mb: 0.5 }}>
              <Box
                component="button"
                onClick={() => toggleGroup(group.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderRadius: 1,
                  px: 1.25,
                  py: 0.75,
                  mt: 1
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.disabled' }}
                >
                  {group.label}
                </Typography>
                <ExpandMoreRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: 'text.disabled',
                    transition: 'transform 200ms ease',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'none'
                  }}
                />
              </Box>
              <Collapse in={!isCollapsed} timeout={220} unmountOnExit={false}>
                <List sx={{ py: 0.5 }}>
                  {group.items.map((item) => {
                    const prefixes = [item.path, ...(item.activePrefixes ?? [])];
                    const active = prefixes.some(
                      (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
                    );
                    return (
                      <ListItemButton
                        key={item.path}
                        onClick={() => goTo(item.path)}
                        sx={{
                          position: 'relative',
                          mb: 0.5,
                          pl: 2,
                          borderRadius: 1.5,
                          color: active ? brand.forest : 'text.secondary',
                          bgcolor: active ? alpha(brand.teal, 0.1) : 'transparent',
                          transition: 'background-color 150ms ease, color 150ms ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '20%',
                            bottom: '20%',
                            width: 3,
                            borderRadius: 4,
                            bgcolor: active ? brand.teal : 'transparent',
                            transition: 'background-color 150ms ease'
                          },
                          '&:hover': {
                            bgcolor: active ? alpha(brand.teal, 0.14) : 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: 'inherit', justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
                        {Boolean(item.badge) && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{ height: 18, minWidth: 18, fontSize: 10.5, fontWeight: 700, bgcolor: brand.lime, color: '#fff', '& .MuiChip-label': { px: 0.75 } }}
                          />
                        )}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>
      {isStudent && streak && (
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}
          >
            <Typography sx={{ fontSize: 18, lineHeight: 1 }}>🔥</Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                Серия {streak.currentStreakDays} {pluralizeDays(streak.currentStreakDays)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3, display: 'block' }}>
                {streak.activeToday
                  ? 'Отлично, вы уже занимались сегодня'
                  : 'Занимайтесь и сегодня — не теряйте серию'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (nextTheme) => nextTheme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => (isMobile ? setOpen((prev) => !prev) : setSidebarHidden((prev) => !prev))}
              aria-label={sidebarHidden || isMobile ? 'Показать меню' : 'Скрыть меню'}
              title={sidebarHidden || isMobile ? 'Показать меню' : 'Скрыть меню'}
              sx={{
                color: 'text.secondary',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'action.hover', color: brand.forest }
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            {isMobile && (
              <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 18, color: brand.forest }}>Трек</Typography>
            )}
          </Stack>
          {!isMobile && (
            <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
              <Box sx={{ position: 'relative', width: 340, maxWidth: '40vw' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'action.hover',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.75,
                    color: 'text.disabled'
                  }}
                >
                  <SearchRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                  <InputBase
                    placeholder="Поиск по кейсам, курсам, людям…"
                    fullWidth
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    sx={{ fontSize: 13.5, color: 'text.primary', '& input::placeholder': { color: 'text.disabled', opacity: 1 } }}
                  />
                  {searchLoading && <CircularProgress size={14} sx={{ flexShrink: 0 }} />}
                </Box>
                {searchOpen && searchQuery.trim().length >= 2 && (
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      mt: 0.5,
                      left: 0,
                      right: 0,
                      zIndex: (nextTheme) => nextTheme.zIndex.modal,
                      maxHeight: 360,
                      overflowY: 'auto'
                    }}
                  >
                    {searchResults.length === 0 && !searchLoading ? (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        Ничего не найдено
                      </Typography>
                    ) : (
                      <List sx={{ py: 0.5 }}>
                        {searchResults.map((result) => (
                          <ListItemButton key={`${result.type}-${result.id}`} onClick={() => goToSearchResult(result)}>
                            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                              {searchResultIcon[result.type]}
                            </ListItemIcon>
                            <ListItemText
                              primary={result.title}
                              secondary={result.subtitle}
                              primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }}
                              secondaryTypographyProps={{ fontSize: 11.5 }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    )}
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          )}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip
              label={session ? roleLabels[session.user.role] : ''}
              size="small"
              sx={{ bgcolor: alpha(brand.teal, 0.12), color: brand.forest, fontWeight: 700 }}
            />
            <Button
              color="inherit"
              onClick={() => session?.user.role === 'STUDENT' && goTo('/student/profile')}
              startIcon={
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: `linear-gradient(135deg, ${brand.forest} 0%, ${brand.teal} 60%, ${brand.lime} 100%)`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14
                  }}
                >
                  {session?.user.fullName[0]}
                </Avatar>
              }
            >
              {session?.user.fullName}
            </Button>
            <IconButton color="error" onClick={signOut} aria-label="Выйти"><LogoutRoundedIcon /></IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: isMobile || !sidebarHidden ? currentWidth : 0,
          flexShrink: 0,
          transition: 'width 200ms ease',
          '& .MuiDrawer-paper': {
            width: isMobile ? drawerWidth : currentWidth,
            transform: !isMobile && sidebarHidden ? `translateX(-${currentWidth}px)` : 'none',
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: 'width 200ms ease, transform 200ms ease',
            overflowX: 'hidden'
          }
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
