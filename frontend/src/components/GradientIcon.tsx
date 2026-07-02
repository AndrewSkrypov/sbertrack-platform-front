import { Box } from '@mui/material';
import React from 'react';

// Иконка-плашка с фирменным градиентом Сбера — тот же язык, что у hero-блоков
// («Движение к роли», прогресс roadmap). Заменяет блёклые плашки
// bgcolor: alpha(primary, 0.1), чтобы акценты читались как единая система.
export function GradientIcon({
  icon,
  size = 44,
  radius = 2,
  round = false,
  variant = 'brand'
}: {
  icon: React.ReactElement;
  size?: number;
  radius?: number;
  round?: boolean;
  variant?: 'brand' | 'blue' | 'amber' | 'violet';
}) {
  const gradients: Record<string, string> = {
    brand: 'linear-gradient(135deg, #075747 0%, #0b7a64 60%, #16803c 100%)',
    blue: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #0ea5e9 100%)',
    amber: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    violet: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)'
  };
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: round ? '50%' : radius,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'white',
        background: gradients[variant],
        boxShadow: '0 4px 12px rgba(11, 122, 100, 0.28)'
      }}
    >
      {icon}
    </Box>
  );
}
