import { Box } from '@mui/material';
import { brand } from '../../theme/theme';

// Собственная иллюстрация для экрана входа — абстрактная композиция из
// траектории и узлов (тот же визуальный язык, что дерево траекторий и
// sticky-scroll рельс на лендинге), а не позаимствованный сторонний арт.
export function SignInIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        aspectRatio: '1 / 1',
        mx: 'auto'
      }}
    >
      <svg viewBox="0 0 480 480" width="100%" height="100%" fill="none">
        <defs>
          <linearGradient id="sign-in-path" x1="40" y1="420" x2="440" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5eead4" />
            <stop offset="1" stopColor={brand.lime} />
          </linearGradient>
          <linearGradient id="sign-in-node" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={brand.teal} />
            <stop offset="1" stopColor={brand.forest} />
          </linearGradient>
        </defs>

        <circle cx="240" cy="240" r="220" fill={brand.forest} opacity="0.06" />
        <circle cx="240" cy="240" r="160" fill={brand.teal} opacity="0.07" />

        <path
          d="M60 400C120 400 120 320 180 300C240 280 260 200 320 180C370 163 400 120 420 70"
          stroke="url(#sign-in-path)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1 14"
        />

        {[
          { x: 60, y: 400, r: 14 },
          { x: 180, y: 300, r: 10 },
          { x: 320, y: 180, r: 10 },
          { x: 420, y: 70, r: 18 }
        ].map((node, index) => (
          <g key={index}>
            <circle cx={node.x} cy={node.y} r={node.r + 10} fill={brand.teal} opacity="0.12" />
            <circle cx={node.x} cy={node.y} r={node.r} fill="url(#sign-in-node)" />
          </g>
        ))}

        <g opacity="0.9">
          <rect x="252" y="130" width="88" height="60" rx="12" fill="#fff" stroke={brand.paperDim} strokeWidth="2" />
          <rect x="266" y="146" width="44" height="6" rx="3" fill={brand.teal} />
          <rect x="266" y="160" width="60" height="6" rx="3" fill={brand.stone2} opacity="0.5" />
        </g>
        <g opacity="0.9">
          <rect x="96" y="230" width="88" height="60" rx="12" fill="#fff" stroke={brand.paperDim} strokeWidth="2" />
          <rect x="110" y="246" width="44" height="6" rx="3" fill={brand.lime} />
          <rect x="110" y="260" width="60" height="6" rx="3" fill={brand.stone2} opacity="0.5" />
        </g>
      </svg>
    </Box>
  );
}
