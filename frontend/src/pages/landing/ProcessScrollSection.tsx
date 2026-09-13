import { Box, Stack, Typography, alpha } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { brand, fontMono } from '../../theme/theme';
import { StepIllustration } from './StepIllustrations';

export interface ProcessStep {
  title: string;
  description: string;
  Icon: SvgIconComponent | ((props: { sx?: object }) => JSX.Element);
}

const VIEWPORT_HEIGHT_MULTIPLIER = 100;

export function ProcessScrollSection({ steps }: { steps: ProcessStep[] }) {
  const { ref, progress, scrollToProgress } = useScrollProgress<HTMLDivElement>();
  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  const current = steps[active];

  function goToStep(index: number) {
    // Прогресс в середину сегмента шага, чтобы клик надёжно попадал
    // в диапазон, где этот шаг считается активным.
    scrollToProgress((index + 0.5) / steps.length);
  }

  return (
    <Box
      ref={ref}
      sx={{ position: 'relative', bgcolor: brand.ink, height: { xs: 'auto', md: `${steps.length * VIEWPORT_HEIGHT_MULTIPLIER}vh` } }}
    >
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          height: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          py: { xs: 8, md: 0 }
        }}
      >
        <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 3, md: 4 }, width: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.8fr 0.75fr 0.85fr' },
              gap: { xs: 5, md: 5 },
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontFamily: fontMono, fontSize: 13, letterSpacing: '0.08em', color: '#5eead4' }}>
                Шаг {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(26px, 3.6vw, 40px)',
                  my: 1.5,
                  minHeight: '1.1em'
                }}
              >
                {current.title}
              </Typography>
              <Typography sx={{ color: alpha('#fff', 0.62), fontSize: 16, lineHeight: 1.6, maxWidth: 420 }}>
                {current.description}
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Typography sx={{ fontFamily: fontMono, fontSize: 13, letterSpacing: '0.08em', color: '#5eead4', mb: 1 }}>
                Как это работает
              </Typography>
              <Typography sx={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 28, mb: 1 }}>
                Путь от старта до маяка
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <StepPreviewCard step={current} index={active} total={steps.length} />
            </Box>

            <Box sx={{ position: 'relative', py: 2.5 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 19,
                  top: 20,
                  bottom: 20,
                  width: 2,
                  bgcolor: alpha('#fff', 0.12)
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 19,
                  top: 20,
                  width: 2,
                  height: `${progress * 100}%`,
                  background: `linear-gradient(180deg, #5eead4, ${brand.lime})`,
                  transition: 'height .1s linear'
                }}
              />
              <Stack spacing={0}>
                {steps.map((step, index) => {
                  const isActive = index === active;
                  const Icon = step.Icon;
                  return (
                    <Stack
                      key={step.title}
                      direction="row"
                      spacing={1.75}
                      alignItems="flex-start"
                      onClick={() => goToStep(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          goToStep(index);
                        }
                      }}
                      aria-label={`Перейти к шагу ${index + 1}: ${step.title}`}
                      sx={{
                        position: 'relative',
                        py: { xs: 1.75, md: 1.15 },
                        opacity: { xs: 1, md: isActive ? 1 : 0.32 },
                        transition: 'opacity .3s ease',
                        cursor: { xs: 'default', md: 'pointer' },
                        borderRadius: 2,
                        '&:hover': { opacity: 1 },
                        '&:focus-visible': { outline: `2px solid ${brand.teal}`, outlineOffset: 4 }
                      }}
                    >
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: { xs: 48, md: 40 },
                          height: { xs: 48, md: 40 },
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          zIndex: 1,
                          bgcolor: isActive ? brand.teal : alpha('#fff', 0.06),
                          border: '1.5px solid',
                          borderColor: isActive ? brand.teal : alpha('#fff', 0.18),
                          color: isActive ? '#fff' : alpha('#fff', 0.5),
                          transform: isActive ? 'scale(1.06)' : 'none',
                          transition: 'background .3s ease, border-color .3s ease, color .3s ease, transform .3s ease'
                        }}
                      >
                        <Icon sx={{ fontSize: 18 }} />
                      </Box>
                      <Box sx={{ pt: { xs: 1.5, md: 0.75 } }}>
                        <Typography sx={{ fontFamily: fontMono, fontSize: 11, color: alpha('#fff', 0.4) }}>
                          {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 15, md: 14 } }}>{step.title}</Typography>
                        <Typography
                          sx={{
                            display: { xs: 'block', md: 'none' },
                            color: alpha('#fff', 0.6),
                            fontSize: 13.5,
                            lineHeight: 1.5,
                            mt: 0.5,
                            maxWidth: 460
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function StepPreviewCard({ step, index, total }: { step: ProcessStep; index: number; total: number }) {
  const Icon = step.Icon;
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 280,
        aspectRatio: '3 / 4',
        borderRadius: 4,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: alpha('#fff', 0.05),
        border: `1px solid ${alpha('#fff', 0.14)}`,
        backdropFilter: 'blur(6px)',
        overflow: 'hidden'
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 70% 20%, ${alpha(brand.lime, 0.18)}, transparent 55%)`
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(brand.teal, 0.24),
            color: '#5eead4'
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Typography sx={{ fontFamily: fontMono, fontSize: 12, color: alpha('#fff', 0.4) }}>
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </Typography>
      </Stack>

      <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0 }}>
        <StepIllustration index={index} />
      </Box>
    </Box>
  );
}
