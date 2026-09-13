import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import React from 'react';
import { brand } from '../theme/theme';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactElement;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'brand' | 'blue' | 'amber' | 'violet';
  subtitle?: string;
}

const accentByColor: Record<NonNullable<StatCardProps['color']>, string> = {
  primary: brand.teal,
  success: brand.lime,
  warning: '#d97706',
  error: '#dc2626',
  brand: brand.forest,
  blue: brand.blue,
  amber: '#d97706',
  violet: '#7c3aed'
};

export function StatCard({ title, value, icon, color = 'primary', subtitle }: StatCardProps) {
  const accent = accentByColor[color];
  return (
    <Card sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: accent }} />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
            <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2rem', lineHeight: 1.15, color: accent }}>
              {value}
            </Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Stack>
          <Box sx={{ color: accent, opacity: 0.55, flexShrink: 0, display: 'grid', placeItems: 'center', '& svg': { fontSize: 22 } }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
