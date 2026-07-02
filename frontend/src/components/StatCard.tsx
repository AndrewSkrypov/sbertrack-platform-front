import { Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { GradientIcon } from './GradientIcon';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactElement;
  color?: 'brand' | 'blue' | 'amber' | 'violet';
  subtitle?: string;
}

export function StatCard({ title, value, icon, color = 'brand', subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography>
            <Typography variant="h4" fontWeight={800}>{value}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Stack>
          <GradientIcon icon={icon} size={48} variant={color} />
        </Stack>
      </CardContent>
    </Card>
  );
}
