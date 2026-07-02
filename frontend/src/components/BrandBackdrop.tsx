import { Box } from '@mui/material';

type GlowSpot = {
  asset: 'radial' | 'arch' | 'streak';
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  size: number | string;
  opacity: number;
  rotate?: number;
};

const glowAssets: Record<GlowSpot['asset'], string> = {
  radial: '/sber-glow-radial.png',
  arch: '/sber-glow-arch.png',
  streak: '/sber-glow-streak.png'
};

const presets: Record<'auth' | 'landing' | 'shell', GlowSpot[]> = {
  // Экран входа/регистрации: один спокойный блик в верхнем левом углу за
  // карточкой формы — фирменный акцент, не отвлекающий от полей.
  auth: [
    { asset: 'radial', top: -220, left: -220, size: 620, opacity: 0.16 },
    { asset: 'streak', bottom: -80, right: -160, size: 640, opacity: 0.12, rotate: 8 }
  ],
  // Лендинг: свечение под футером/секциями, чуть заметнее, т.к. страница
  // представительская и не перегружена данными.
  landing: [
    { asset: 'arch', bottom: -260, left: '50%', size: 900, opacity: 0.18 }
  ],
  // Рабочая зона (AppShell): почти незаметный акцент в углу, чтобы не
  // мешать чтению таблиц/графиков — как ненавязчивый фирменный подклад.
  shell: [
    { asset: 'radial', top: -160, right: -160, size: 520, opacity: 0.08 }
  ]
};

// Переиспользуемый фирменный фон на основе свечений-ассетов из презентации
// Сбера. Всегда декоративный (aria-hidden, pointer-events: none), всегда
// позади контента (zIndex 0) и сильно приглушённый — задача не в том,
// чтобы фон был заметен, а в том, чтобы платформа считывалась как
// брендовая, не теряя чистоты и читаемости данных (см. pulse-hcm.ru).
export function BrandBackdrop({ preset = 'shell', fixed = false }: { preset?: 'auth' | 'landing' | 'shell'; fixed?: boolean }) {
  const spots = presets[preset];
  return (
    <Box
      aria-hidden
      sx={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {spots.map((spot, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: spot.top,
            bottom: spot.bottom,
            left: spot.left,
            right: spot.right,
            width: spot.size,
            height: spot.size,
            backgroundImage: `url(${glowAssets[spot.asset]})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: spot.opacity,
            filter: 'blur(36px)',
            transform: [
              spot.left === '50%' ? 'translateX(-50%)' : '',
              spot.rotate ? `rotate(${spot.rotate}deg)` : ''
            ]
              .filter(Boolean)
              .join(' ')
          }}
        />
      ))}
    </Box>
  );
}
