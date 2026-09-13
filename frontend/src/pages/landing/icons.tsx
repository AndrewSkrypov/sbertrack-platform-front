// Кастомный набор линейных SVG-иконок для лендинга — сознательно не
// @mui/icons-material, чтобы визуальный язык не совпадал с любым другим
// MUI-проектом на рынке. Стиль (stroke-width 2, round caps) единый для всех.
import { SvgIcon, SvgIconProps } from '@mui/material';
import type { ReactNode } from 'react';

function icon(path: ReactNode) {
  return function Icon(props: SvgIconProps) {
    return (
      <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fill: 'none', ...props.sx }}>
        <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {path}
        </g>
      </SvgIcon>
    );
  };
}

export const TrajectoryIcon = icon(<path d="M3 12h18M3 6h18M3 18h18" />);
export const RoadmapIcon = icon(<path d="M3 3v18h18M7 14l4-4 3 3 5-6" />);
export const CaseIcon = icon(<path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />);
export const MentorIcon = icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>);
export const FeedbackIcon = icon(<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />);
export const PortfolioIcon = icon(<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />);

export const SystemsThinkingIcon = icon(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 2" /></>);
export const UncertaintyIcon = icon(<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />);
export const CollaborationIcon = FeedbackIcon;
export const ResultIcon = CaseIcon;
export const AiSynergyIcon = MentorIcon;

export const ArrowRightIcon = icon(<path d="M5 12h14M13 5l7 7-7 7" />);
export const CheckIcon = icon(<path d="M20 6L9 17l-5-5" />);
