import { Box, Typography, alpha } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useStaggerReveal } from '../../hooks/useStaggerReveal';
import { brand } from '../../theme/theme';

export interface CompetencyCardData {
  key: string;
  title: string;
  description: string;
  Icon: SvgIconComponent | ((props: { sx?: object }) => JSX.Element);
}

export function CompetencyGrid({ items }: { items: CompetencyCardData[] }) {
  const { containerRef, visible } = useStaggerReveal(items.length, 90);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
        gap: 2
      }}
    >
      {items.map((item, index) => {
        const isVisible = visible.has(index);
        const Icon = item.Icon;
        return (
          <Box
            key={item.key}
            data-reveal-index={index}
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: 3,
              overflow: 'hidden',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity .55s ease, transform .55s ease, border-color .2s ease, box-shadow .2s ease',
              '&:hover': {
                borderColor: brand.teal,
                boxShadow: `0 12px 28px ${alpha(brand.ink, 0.08)}`
              }
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: 16,
                right: 18,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: brand.stone2
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                mb: 2,
                bgcolor: brand.paperDim,
                color: brand.forest
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 15.5, mb: 1 }}>
              {item.title}
            </Typography>
            <Typography sx={{ fontSize: 13.5, lineHeight: 1.55, color: brand.stone }}>{item.description}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
