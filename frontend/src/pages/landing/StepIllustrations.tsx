import { Box, alpha } from '@mui/material';
import { brand } from '../../theme/theme';

// Шесть содержательных мини-мокапов интерфейса — по одному на каждый шаг
// sticky-scroll секции лендинга. Заменяют универсальную заглушку из полосок:
// каждая иллюстрация отражает конкретное действие шага (карта направлений,
// таймлайн, чек-лист кейса, чат с наставником, оценка обратной связи,
// сетка портфолио), сохраняя единый векторный язык карточки.

const teal = '#5eead4';

// 1. Выбираешь траекторию — карта направлений с выделенным узлом
function TrajectoryMock() {
  const nodes = [
    { x: 30, y: 70 },
    { x: 95, y: 30 },
    { x: 95, y: 110 },
    { x: 165, y: 15 },
    { x: 165, y: 70 },
    { x: 165, y: 125 }
  ];
  const active = 4;
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <line x1={30} y1={70} x2={95} y2={30} stroke={alpha('#fff', 0.16)} strokeWidth={2} />
      <line x1={30} y1={70} x2={95} y2={110} stroke={alpha('#fff', 0.16)} strokeWidth={2} />
      <line x1={95} y1={30} x2={165} y2={15} stroke={alpha('#fff', 0.16)} strokeWidth={2} />
      <line x1={95} y1={30} x2={165} y2={70} stroke={teal} strokeWidth={2.5} />
      <line x1={95} y1={110} x2={165} y2={125} stroke={alpha('#fff', 0.16)} strokeWidth={2} />
      {nodes.map((node, index) => (
        <circle
          key={index}
          cx={node.x}
          cy={node.y}
          r={index === active ? 9 : 6}
          fill={index === active ? teal : alpha('#fff', 0.14)}
          stroke={index === active ? '#fff' : 'none'}
          strokeWidth={index === active ? 2 : 0}
        />
      ))}
    </svg>
  );
}

// 2. Получаешь дорожную карту — горизонтальный таймлайн с чекпоинтами
function RoadmapMock() {
  const points = [20, 70, 120, 170];
  const doneUntil = 2;
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <line x1={20} y1={75} x2={170} y2={75} stroke={alpha('#fff', 0.14)} strokeWidth={3} />
      <line x1={20} y1={75} x2={120} y2={75} stroke={teal} strokeWidth={3} />
      {points.map((x, index) => (
        <g key={index}>
          <circle cx={x} cy={75} r={10} fill={index <= doneUntil ? teal : brand.ink} stroke={index <= doneUntil ? 'none' : alpha('#fff', 0.3)} strokeWidth={1.5} />
          {index <= doneUntil && (
            <path d={`M${x - 4} 75 L${x - 1} 78 L${x + 4} 71`} stroke="#06201a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <rect x={x - 14} y={95} width={28} height={5} rx={2.5} fill={alpha('#fff', index === 3 ? 0.28 : 0.14)} />
        </g>
      ))}
    </svg>
  );
}

// 3. Выполняешь кейсы — карточка задачи с чек-листом
function CaseMock() {
  const rows = [{ done: true }, { done: true }, { done: false }, { done: false }];
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x={20} y={15} width={160} height={16} rx={4} fill={alpha('#fff', 0.16)} />
      <rect x={20} y={38} width={110} height={8} rx={4} fill={alpha('#fff', 0.1)} />
      {rows.map((row, index) => {
        const y = 62 + index * 22;
        return (
          <g key={index}>
            <rect x={20} y={y} width={16} height={16} rx={4} fill={row.done ? teal : 'transparent'} stroke={row.done ? teal : alpha('#fff', 0.3)} strokeWidth={1.5} />
            {row.done && <path d={`M24 ${y + 8} L28 ${y + 12} L34 ${y + 4}`} stroke="#06201a" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            <rect x={46} y={y + 4} width={index % 2 === 0 ? 120 : 90} height={7} rx={3.5} fill={alpha('#fff', row.done ? 0.24 : 0.12)} />
          </g>
        );
      })}
    </svg>
  );
}

// 4. Работаешь с ИИ-наставниками — диалоговые пузыри
function MentorMock() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x={20} y={20} width={130} height={30} rx={12} fill={alpha('#fff', 0.1)} />
      <rect x={34} y={30} width={90} height={6} rx={3} fill={alpha('#fff', 0.28)} />
      <rect x={34} y={40} width={60} height={6} rx={3} fill={alpha('#fff', 0.16)} />

      <rect x={70} y={62} width={110} height={30} rx={12} fill={alpha(brand.teal, 0.3)} />
      <rect x={84} y={72} width={70} height={6} rx={3} fill={alpha('#fff', 0.5)} />
      <rect x={84} y={82} width={50} height={6} rx={3} fill={alpha('#fff', 0.32)} />

      <rect x={20} y={104} width={140} height={30} rx={12} fill={alpha('#fff', 0.1)} />
      <rect x={34} y={114} width={100} height={6} rx={3} fill={alpha('#fff', 0.28)} />
      <rect x={34} y={124} width={70} height={6} rx={3} fill={alpha('#fff', 0.16)} />
    </svg>
  );
}

// 5. Получаешь обратную связь — карточка с оценками компетенций
function FeedbackMock() {
  const bars = [86, 64, 92, 50];
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <circle cx={40} cy={40} r={22} fill="none" stroke={alpha('#fff', 0.14)} strokeWidth={6} />
      <circle
        cx={40}
        cy={40}
        r={22}
        fill="none"
        stroke={teal}
        strokeWidth={6}
        strokeDasharray={`${2 * Math.PI * 22 * 0.78} ${2 * Math.PI * 22}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      <text x={40} y={45} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff" fontFamily="Manrope, sans-serif">78%</text>

      {bars.map((width, index) => (
        <g key={index}>
          <rect x={80} y={22 + index * 20} width={100} height={7} rx={3.5} fill={alpha('#fff', 0.12)} />
          <rect x={80} y={22 + index * 20} width={(width / 100) * 100} height={7} rx={3.5} fill={index === 0 ? teal : alpha('#fff', 0.4)} />
        </g>
      ))}
    </svg>
  );
}

// 6. Собираешь портфолио — сетка карточек-артефактов
function PortfolioMock() {
  const cards = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      {cards.map((index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 20 + col * 56;
        const y = 20 + row * 62;
        const featured = index === 1;
        return (
          <g key={index}>
            <rect x={x} y={y} width={48} height={48} rx={8} fill={featured ? alpha(brand.teal, 0.32) : alpha('#fff', 0.09)} stroke={featured ? teal : 'none'} strokeWidth={1.5} />
            <rect x={x + 8} y={y + 30} width={32} height={6} rx={3} fill={alpha('#fff', featured ? 0.5 : 0.2)} />
            {featured && <circle cx={x + 24} cy={y + 16} r={7} fill={teal} />}
          </g>
        );
      })}
    </svg>
  );
}

export const stepIllustrations = [TrajectoryMock, RoadmapMock, CaseMock, MentorMock, FeedbackMock, PortfolioMock];

export function StepIllustration({ index }: { index: number }) {
  const Mock = stepIllustrations[index % stepIllustrations.length];
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Mock />
    </Box>
  );
}
