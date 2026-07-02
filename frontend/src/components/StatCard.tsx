import { Avatar, Card, CardContent, Stack, Typography, alpha, useTheme } from '@mui/material';
import React from 'react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactElement;
  color?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const theme = useTheme();
  const mainColor = color ?? theme.palette.primary.main;
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography>
            <Typography variant="h4" fontWeight={800}>{value}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Stack>
          <Avatar sx={{ bgcolor: alpha(mainColor, 0.12), color: mainColor }}>{icon}</Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
