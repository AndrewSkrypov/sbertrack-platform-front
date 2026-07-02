import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { Competency } from '../types';
import { competencyLabels } from '../shared/labels';

interface CompetencyBarsProps {
  values: Partial<Record<Competency, number>>;
  compact?: boolean;
}

export function CompetencyBars({ values, compact = false }: CompetencyBarsProps) {
  return (
    <Stack spacing={compact ? 1 : 1.5}>
      {(Object.keys(competencyLabels) as Competency[]).map((competency) => {
        const value = values[competency] ?? 0;
        return (
          <Box key={competency}>
            <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
              <Typography variant={compact ? 'caption' : 'body2'} fontWeight={700}>{competencyLabels[competency]}</Typography>
              <Typography variant="caption" color="text.secondary">{value}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={value} sx={{ height: compact ? 6 : 8, borderRadius: 4 }} />
          </Box>
        );
      })}
    </Stack>
  );
}
