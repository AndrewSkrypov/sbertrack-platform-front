import { Box, Stack, Typography, alpha } from '@mui/material';
import React from 'react';
import { brand } from '../theme/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  // hero — фирменный градиент-баннер (тот же язык, что блок «Движение к роли»).
  // Используется на дашбордах ролей, чтобы заголовок был акцентным, а не серым.
  hero?: boolean;
}

export function PageHeader({ title, subtitle, actions, hero = false }: PageHeaderProps) {
  if (hero) {
    return (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 3,
          color: 'white',
          background: `linear-gradient(135deg, ${brand.forest} 0%, ${brand.teal} 62%, ${brand.lime} 100%)`
        }}
      >
        <Box aria-hidden sx={{ position: 'absolute', right: -120, top: -120, width: 360, height: 360, borderRadius: '50%', background: alpha('#fff', 0.07) }} />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
          spacing={2}
          sx={{ position: 'relative' }}
        >
          <Box sx={{ maxWidth: 640 }}>
            <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontSize: { xs: 26, md: 34 }, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</Typography>
            {subtitle && <Typography sx={{ mt: 1, color: alpha('#fff', 0.85) }}>{subtitle}</Typography>}
          </Box>
          {actions}
        </Stack>
      </Box>
    );
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} spacing={2} sx={{ mb: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>{title}</Typography>
        {subtitle && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {actions}
    </Stack>
  );
}
