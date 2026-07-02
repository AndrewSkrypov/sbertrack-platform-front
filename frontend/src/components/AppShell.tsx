import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
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
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Role } from '../types';
import { roleLabels } from '../shared/labels';

const drawerWidth = 280;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Главная', path: '/student/dashboard', icon: <DashboardRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Каталог треков', path: '/student/tracks', icon: <RouteRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Дерево траекторий', path: '/student/trajectories', icon: <AccountTreeRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Мой roadmap', path: '/student/roadmap', icon: <TimelineRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Песочница наставников', path: '/student/agents', icon: <SmartToyRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Моё портфолио', path: '/student/portfolio', icon: <AccountBoxRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Рефлексия', path: '/student/reflection', icon: <FactCheckRoundedIcon />, roles: ['STUDENT'] },
  { label: 'Панель заказчика', path: '/customer/dashboard', icon: <DashboardRoundedIcon />, roles: ['CUSTOMER'] },
  { label: 'Создать трек', path: '/customer/tracks/create', icon: <AddCircleRoundedIcon />, roles: ['CUSTOMER'] },
  { label: 'Создать кейс', path: '/customer/cases/create', icon: <WorkRoundedIcon />, roles: ['CUSTOMER'] },
  { label: 'Проверка решений', path: '/customer/submissions', icon: <FactCheckRoundedIcon />, roles: ['CUSTOMER'] },
  { label: 'Витрина кандидатов', path: '/customer/cv-book', icon: <GroupRoundedIcon />, roles: ['CUSTOMER'] },
  { label: 'Модерация', path: '/moderator/dashboard', icon: <DashboardRoundedIcon />, roles: ['MODERATOR'] },
  { label: 'ИИ-наставники', path: '/moderator/agents', icon: <SmartToyRoundedIcon />, roles: ['MODERATOR'] },
  { label: 'Мастер-промпты', path: '/moderator/master-prompts', icon: <TuneRoundedIcon />, roles: ['MODERATOR'] },
  { label: 'Админ-панель', path: '/admin/dashboard', icon: <AdminPanelSettingsRoundedIcon />, roles: ['ADMIN'] }
];

export function AppShell() {
  const { session, signOut } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const visibleItems = navItems.filter((item) => session && item.roles.includes(session.user.role));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Stack spacing={0.25}>
          <Typography variant="h6" color="primary" fontWeight={900}>СберТрек</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>Платформа практических кейсов</Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {visibleItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 800 : 600 }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (nextTheme) => nextTheme.zIndex.drawer + 1,
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {isMobile && (
              <IconButton onClick={() => setOpen(true)}><MenuRoundedIcon /></IconButton>
            )}
            <Typography variant="h6" fontWeight={900}>СберТрек Платформа</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip size="small" label={session ? roleLabels[session.user.role] : ''} color="primary" variant="outlined" />
            <Button
              color="inherit"
              startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>{session?.user.fullName[0]}</Avatar>}
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
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: '100%' }}>
        <Toolbar />
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
