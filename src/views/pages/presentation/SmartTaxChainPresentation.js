import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  GlobalStyles,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Grid,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ArrowBack,
  ArrowForward,
  Block,
  Bolt,
  CheckCircle,
  EditNote,
  FactCheck,
  Fullscreen,
  FullscreenExit,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Lock,
  PictureAsPdf,
  Savings,
  Shield,
  Speed,
  TrackChanges,
  Verified,
  Visibility,
  VisibilityOff,
  ReceiptLong,
  WarningAmber,
  BugReport,
  Timer,
  AccountTree,
  TrendingDown,
  Gavel,
} from '@mui/icons-material';

import PageContainer from 'src/components/container/PageContainer';
import { ReactComponent as TRALogo } from 'src/assets/images/logos/tra_logo.svg';

const PRESENTER_NAME = 'Eng: Ismael Ramadhani Mkumbi';
const CITIZEN_TAX_EVASION_IMAGE_URL = '/presentation/tra-tax-evasion-the-citizen.png';

const SlideFrame = ({ children, footerLeft, footerRight, sx }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      className="stc-slide"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: 'auto',
        // Cross-device: tighter padding on phones, roomy on large screens
        p: { xs: 2, sm: 3, md: 6 },
        borderRadius: { xs: 3, md: 4 },
        backgroundColor: '#ffffff',
        border: `1px solid ${alpha('#111111', 0.08)}`,
        boxShadow: `0 22px 70px ${alpha('#111111', 0.12)}`,
        overflow: 'hidden',
        ...(sx || {}),
      }}
    >
      {/* TRA accent bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          background: 'linear-gradient(90deg, #fff200 0%, #e6d700 100%)',
        }}
      />

      {/* subtle watermark */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 15% 20%, ${alpha(
              theme.palette.primary.main,
              0.18,
            )} 0%, transparent 55%),
            radial-gradient(circle at 85% 60%, ${alpha(
              theme.palette.primary.main,
              0.12,
            )} 0%, transparent 60%)`,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(90deg, ${alpha('#111111', 0.035)} 0px, ${alpha(
              '#111111',
              0.035,
            )} 1px, transparent 1px, transparent 26px)`,
            opacity: 0.8,
          },
        }}
      />

      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>

        <Divider
          sx={{
            mt: { xs: 2.25, md: 3 },
            mb: { xs: 1.5, md: 2 },
            borderColor: alpha('#111111', 0.08),
          }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{
              color: alpha('#111111', 0.7),
              fontWeight: 700,
              fontSize: { xs: 11.5, sm: 12, md: 13 },
            }}
          >
            {footerLeft}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha('#111111', 0.6),
              fontWeight: 700,
              fontSize: { xs: 11.5, sm: 12, md: 13 },
            }}
          >
            {footerRight}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

const Bullet = ({ children }) => (
  <Stack direction="row" spacing={1.25} alignItems="flex-start">
    <Box
      sx={{
        mt: '10px',
        width: 10,
        height: 10,
        borderRadius: 999,
        backgroundColor: '#fff200',
        border: `1px solid ${alpha('#111111', 0.12)}`,
        flexShrink: 0,
      }}
    />
    <Typography variant="body1" sx={{ color: alpha('#111111', 0.8), lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Stack>
);

const BulletItem = ({ icon, text, spacing = 1.25, iconBoxSx, textSx, textVariant = 'body1' }) => (
  <Stack direction="row" spacing={spacing} alignItems="flex-start">
    <Box
      sx={{
        mt: '2px',
        width: 32,
        height: 32,
        borderRadius: 2.5,
        backgroundColor: alpha('#fff200', 0.18),
        border: `1px solid ${alpha('#fff200', 0.45)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...(iconBoxSx || {}),
      }}
    >
      {icon}
    </Box>
    <Typography
      variant={textVariant}
      sx={{ color: alpha('#111111', 0.8), lineHeight: 1.7, ...(textSx || {}) }}
    >
      {text}
    </Typography>
  </Stack>
);

// Tanzania Map with Blockchain Network - Cover Slide Illustration
const TanzaniaBlockchainArt = () => (
  <Box
    component="svg"
    viewBox="0 0 400 380"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: 360 }}
  >
    <defs>
      <linearGradient id="tzMapGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.25" />
        <stop offset="1" stopColor="#fff200" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="tzNodeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <filter id="tzGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="tzShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
      </filter>
    </defs>

    {/* Tanzania Map Outline (simplified) */}
    <path
      d="M120 40 L180 35 L220 45 L260 40 L290 55 L310 50 L330 70 L340 100 
         L335 130 L345 160 L340 190 L350 220 L345 250 L330 280 L300 300 
         L270 320 L240 340 L200 350 L160 345 L130 330 L100 300 L80 260 
         L70 220 L75 180 L85 140 L95 100 L105 70 L120 40 Z"
      fill="url(#tzMapGrad)"
      stroke="#111111"
      strokeOpacity="0.15"
      strokeWidth="2"
    />

    {/* Zanzibar */}
    <ellipse
      cx="355"
      cy="195"
      rx="18"
      ry="28"
      fill="url(#tzMapGrad)"
      stroke="#111111"
      strokeOpacity="0.12"
      strokeWidth="1.5"
    />

    {/* Network Connection Lines */}
    <g stroke="#111111" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="4 4" fill="none">
      {/* Dar es Salaam to other cities */}
      <path d="M290 240 L200 120" /> {/* Dar to Arusha */}
      <path d="M290 240 L150 180" /> {/* Dar to Dodoma */}
      <path d="M290 240 L100 260" /> {/* Dar to Mbeya */}
      <path d="M290 240 L240 300" /> {/* Dar to Mtwara */}
      <path d="M290 240 L330 195" /> {/* Dar to Zanzibar */}
      {/* Secondary connections */}
      <path d="M200 120 L150 180" /> {/* Arusha to Dodoma */}
      <path d="M150 180 L100 260" /> {/* Dodoma to Mbeya */}
      <path d="M200 120 L260 80" /> {/* Arusha to Mwanza */}
      <path d="M150 180 L260 80" /> {/* Dodoma to Mwanza */}
    </g>

    {/* Blockchain Chain Links on connections */}
    {[
      { x: 245, y: 180 },
      { x: 220, y: 210 },
      { x: 195, y: 250 },
      { x: 175, y: 150 },
      { x: 125, y: 220 },
      { x: 175, y: 100 },
      { x: 205, y: 80 },
    ].map((pos, i) => (
      <g key={i} transform={`translate(${pos.x} ${pos.y})`}>
        <rect
          x="-8"
          y="-5"
          width="16"
          height="10"
          rx="2"
          fill="#ffffff"
          stroke="#111111"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <rect x="-4" y="-2" width="8" height="4" rx="1" fill="#fff200" opacity="0.7" />
      </g>
    ))}

    {/* City Nodes */}
    {[
      { x: 200, y: 120, name: 'Arusha', size: 14 },
      { x: 260, y: 80, name: 'Mwanza', size: 12 },
      { x: 150, y: 180, name: 'Dodoma', size: 14 },
      { x: 290, y: 240, name: 'Dar es Salaam', size: 18, primary: true },
      { x: 100, y: 260, name: 'Mbeya', size: 12 },
      { x: 240, y: 300, name: 'Mtwara', size: 10 },
      { x: 330, y: 195, name: 'Zanzibar', size: 11 },
    ].map((city, i) => (
      <g key={city.name} filter={city.primary ? 'url(#tzGlow)' : undefined}>
        {/* Outer pulse ring for primary */}
        {city.primary && (
          <circle
            cx={city.x}
            cy={city.y}
            r={city.size + 8}
            fill="none"
            stroke="#fff200"
            strokeWidth="2"
            opacity="0.4"
          >
            <animate
              attributeName="r"
              values={`${city.size + 4};${city.size + 14};${city.size + 4}`}
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.15;0.5"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        {/* Node background */}
        <circle cx={city.x} cy={city.y} r={city.size} fill="#ffffff" filter="url(#tzShadow)" />
        {/* Node border */}
        <circle
          cx={city.x}
          cy={city.y}
          r={city.size}
          fill="url(#tzNodeGrad)"
          stroke="#111111"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        {/* Inner dot */}
        <circle cx={city.x} cy={city.y} r={city.size * 0.4} fill="#111111" opacity="0.75" />
        {/* City label */}
        <text
          x={city.x}
          y={city.y + city.size + 14}
          textAnchor="middle"
          fontSize={city.primary ? 11 : 9}
          fontWeight={city.primary ? 900 : 700}
          fill="#111111"
          opacity={city.primary ? 0.9 : 0.7}
        >
          {city.name}
        </text>
      </g>
    ))}

    {/* Legend */}
    <g transform="translate(20 340)">
      <rect x="0" y="0" width="140" height="28" rx="6" fill="#ffffff" opacity="0.9" />
      <circle
        cx="16"
        cy="14"
        r="6"
        fill="url(#tzNodeGrad)"
        stroke="#111111"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <text x="28" y="18" fontSize="10" fontWeight="800" fill="#111111" opacity="0.75">
        Blockchain Nodes
      </text>
      <rect
        x="100"
        y="10"
        width="12"
        height="8"
        rx="2"
        fill="#fff200"
        stroke="#111111"
        strokeOpacity="0.2"
        strokeWidth="0.5"
      />
      <text x="116" y="18" fontSize="8" fill="#111111" opacity="0.6">
        Link
      </text>
    </g>
  </Box>
);

// Option 1: Blockchain Network Shield - Cover Slide (horizontal, left-to-right)
const BlockchainNetworkShieldArt = () => (
  <Box
    component="svg"
    viewBox="0 0 640 200"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.35" />
        <stop offset="0.5" stopColor="#fff200" stopOpacity="0.15" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="shieldStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fff200" />
      </linearGradient>
      <filter id="shieldGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
      </filter>
    </defs>
    {/* Horizontal shield shape (wide, low) */}
    <path
      d="M40 100 L100 40 L540 40 L600 100 L600 160 L540 200 L100 200 L40 160 Z"
      fill="url(#shieldGrad)"
      stroke="url(#shieldStroke)"
      strokeWidth="3"
      strokeOpacity="0.5"
      filter="url(#shieldGlow)"
    />
    {/* Connection lines (horizontal flow) */}
    <g stroke="#111111" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M120 100 H180" />
      <path d="M220 100 H280" />
      <path d="M320 100 H380" />
      <path d="M420 100 H480" />
      <path d="M520 100 H580" />
      <path d="M180 100 V60 H220 V100" />
      <path d="M280 100 V60 H320 V100" />
      <path d="M380 100 V60 H420 V100" />
      <path d="M480 100 V60 H520 V100" />
    </g>
    {/* Nodes left to right */}
    {[
      { cx: 120, cy: 100, r: 22, center: true },
      { cx: 220, cy: 100, r: 18 },
      { cx: 320, cy: 100, r: 18 },
      { cx: 420, cy: 100, r: 18 },
      { cx: 520, cy: 100, r: 18 },
    ].map((node, i) => (
      <g key={i}>
        <circle cx={node.cx} cy={node.cy} r={node.r} fill="#ffffff" filter="url(#nodeShadow)" />
        <circle cx={node.cx} cy={node.cy} r={node.r} fill="url(#nodeGrad)" stroke="#111111" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx={node.cx} cy={node.cy} r={node.r * 0.4} fill="#111111" opacity="0.6" />
        {node.center && (
          <circle cx={node.cx} cy={node.cy} r={node.r + 5} fill="none" stroke="#fff200" strokeWidth="2" opacity="0.5">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
    ))}
    {/* Chain links on connections */}
    {[
      { x: 150, y: 100 },
      { x: 250, y: 100 },
      { x: 350, y: 100 },
      { x: 450, y: 100 },
      { x: 550, y: 100 },
    ].map((pos, i) => (
      <g key={i} transform={`translate(${pos.x} ${pos.y})`}>
        <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#ffffff" stroke="#111111" strokeOpacity="0.2" strokeWidth="1" />
        <rect x="-5" y="-2" width="10" height="4" rx="1" fill="#fff200" opacity="0.8" />
      </g>
    ))}
    <text x="320" y="190" textAnchor="middle" fontSize="14" fontWeight="800" fill="#111111" opacity="0.7">
      Security + Decentralization
    </text>
  </Box>
);

// Option 2: Data Flow Transformation - horizontal
const DataFlowTransformationArt = () => (
  <Box component="svg" viewBox="0 0 640 200" aria-hidden="true" sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}>
    <defs>
      <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.2" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    {/* Paper/Manual */}
    <g transform="translate(40 50)">
      <rect x="0" y="0" width="140" height="100" rx="16" fill="#ffffff" stroke="#111111" strokeOpacity="0.12" strokeWidth="2" />
      <rect x="12" y="12" width="80" height="8" rx="4" fill="#111111" opacity="0.2" />
      <rect x="12" y="28" width="100" height="8" rx="4" fill="#111111" opacity="0.15" />
      <rect x="12" y="44" width="60" height="8" rx="4" fill="#111111" opacity="0.12" />
      <text x="70" y="85" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.7">Manual Records</text>
    </g>
    {/* Arrow + chain */}
    <path d="M200 100 H260" stroke="#111111" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="6 6" />
    <g transform="translate(220 92)">
      <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#fff200" stroke="#111111" strokeOpacity="0.2" strokeWidth="1" />
    </g>
    {/* Blockchain */}
    <g transform="translate(280 40)">
      <rect x="0" y="0" width="120" height="120" rx="20" fill="url(#flowGrad)" stroke="#fff200" strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="35" cy="45" r="12" fill="#ffffff" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="85" cy="45" r="12" fill="#ffffff" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="60" cy="85" r="12" fill="#ffffff" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" />
      <path d="M35 45 L85 45 M60 45 L60 85" stroke="#111111" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <text x="60" y="118" textAnchor="middle" fontSize="11" fontWeight="800" fill="#111111" opacity="0.75">Blockchain</text>
    </g>
    {/* Arrow */}
    <path d="M420 100 H480" stroke="#111111" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="6 6" />
    <g transform="translate(440 92)">
      <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#fff200" stroke="#111111" strokeOpacity="0.2" strokeWidth="1" />
    </g>
    {/* Verified */}
    <g transform="translate(500 50)">
      <rect x="0" y="0" width="140" height="100" rx="16" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="70" cy="45" r="24" fill="#fff200" opacity="0.3" stroke="#e6d700" strokeWidth="2" />
      <path d="M58 45 L66 53 L82 37" stroke="#111111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="70" y="85" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.8">Verified Data</text>
    </g>
    <text x="320" y="190" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.65">Transformation flow</text>
  </Box>
);

// Option 4: Immutable Ledger Blocks - horizontal
const ImmutableLedgerBlocksArt = () => (
  <Box component="svg" viewBox="0 0 640 200" aria-hidden="true" sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}>
    <defs>
      <linearGradient id="blockGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fff200" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {[
      { x: 60, y: 80, w: 90, h: 70, label: 'Block 1' },
      { x: 165, y: 75, w: 90, h: 70, label: 'Block 2' },
      { x: 270, y: 70, w: 100, h: 75, label: 'Block 3' },
      { x: 385, y: 75, w: 90, h: 70, label: 'Block 4' },
      { x: 490, y: 80, w: 90, h: 70, label: 'Block 5' },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="12" fill="url(#blockGrad)" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" />
        <rect x={b.x + 8} y={b.y + 12} width={b.w - 16} height="8" rx="4" fill="#111111" opacity="0.15" />
        <rect x={b.x + 8} y={b.y + 28} width={b.w - 24} height="6" rx="3" fill="#111111" opacity="0.1" />
        <text x={b.x + b.w / 2} y={b.y + b.h - 12} textAnchor="middle" fontSize="10" fontWeight="800" fill="#111111" opacity="0.7">{b.label}</text>
        {i < 4 && (
          <g transform={`translate(${b.x + b.w + 2} ${b.y + b.h / 2 - 8})`}>
            <rect x="0" y="0" width="16" height="10" rx="2" fill="#fff200" stroke="#111111" strokeOpacity="0.2" strokeWidth="0.5" />
          </g>
        )}
      </g>
    ))}
    <path d="M155 115 L165 115 M260 112 L270 112 M375 115 L385 115 M480 115 L490 115" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
    <text x="320" y="190" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.65">Immutable chain</text>
  </Box>
);

// Option 5: Three Pillars - horizontal
const ThreePillarsArt = () => (
  <Box component="svg" viewBox="0 0 640 200" aria-hidden="true" sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}>
    <defs>
      <linearGradient id="pillarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.4" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {[
      { x: 100, icon: 'shield', label: 'Security', sub: 'Protected' },
      { x: 320, icon: 'eye', label: 'Transparency', sub: 'Visible' },
      { x: 540, icon: 'lock', label: 'Immutability', sub: 'Tamper-proof' },
    ].map((p, i) => (
      <g key={i} transform={`translate(${p.x} 0)`}>
        <rect x="-55" y="20" width="110" height="100" rx="16" fill="url(#pillarGrad)" stroke="#111111" strokeOpacity="0.12" strokeWidth="2" />
        <circle cx="0" cy="55" r="24" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.6" />
        {p.icon === 'shield' && <path d="M0 40 L12 48 L12 62 Q12 72 0 76 Q-12 72 -12 62 L-12 48 Z" fill="#111111" opacity="0.6" />}
        {p.icon === 'eye' && <ellipse cx="0" cy="55" rx="12" ry="6" fill="none" stroke="#111111" strokeWidth="3" strokeOpacity="0.6" />}
        {p.icon === 'lock' && <rect x="-10" y="48" width="20" height="18" rx="4" fill="none" stroke="#111111" strokeWidth="2.5" strokeOpacity="0.6" />}
        <text x="0" y="95" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.85">{p.label}</text>
        <text x="0" y="108" textAnchor="middle" fontSize="9" fontWeight="700" fill="#111111" opacity="0.55">{p.sub}</text>
      </g>
    ))}
    <path d="M155 70 H265 M375 70 H485" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="4 4" />
    <text x="320" y="190" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.65">Key pillars</text>
  </Box>
);

// Option 6: Before/After Split - horizontal
const BeforeAfterSplitArt = () => (
  <Box component="svg" viewBox="0 0 640 200" aria-hidden="true" sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}>
    <defs>
      <linearGradient id="beforeGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#111111" stopOpacity="0.08" />
        <stop offset="1" stopColor="#111111" stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id="afterGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.25" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    {/* Before - fragmented */}
    <g transform="translate(40 40)">
      <rect x="0" y="0" width="260" height="120" rx="16" fill="url(#beforeGrad)" stroke="#111111" strokeOpacity="0.1" strokeWidth="2" />
      <text x="130" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.5">BEFORE</text>
      <rect x="20" y="45" width="70" height="50" rx="8" fill="#ffffff" stroke="#111111" strokeOpacity="0.08" />
      <rect x="100" y="50" width="60" height="40" rx="8" fill="#ffffff" stroke="#111111" strokeOpacity="0.08" />
      <rect x="170" y="48" width="75" height="48" rx="8" fill="#ffffff" stroke="#111111" strokeOpacity="0.08" />
      <rect x="210" y="55" width="40" height="35" rx="8" fill="#ffffff" stroke="#111111" strokeOpacity="0.08" />
      <text x="130" y="115" textAnchor="middle" fontSize="10" fontWeight="700" fill="#111111" opacity="0.5">Fragmented • Mutable</text>
    </g>
    {/* Arrow */}
    <path d="M320 100 H340" stroke="#111111" strokeOpacity="0.4" strokeWidth="3" />
    <polygon points="335,95 345,100 335,105" fill="#111111" opacity="0.5" />
    {/* After - connected */}
    <g transform="translate(360 40)">
      <rect x="0" y="0" width="260" height="120" rx="16" fill="url(#afterGrad)" stroke="#fff200" strokeOpacity="0.5" strokeWidth="2" />
      <text x="130" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.8">AFTER</text>
      <circle cx="70" cy="75" r="18" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.7" />
      <circle cx="130" cy="75" r="18" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.7" />
      <circle cx="190" cy="75" r="18" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.7" />
      <circle cx="250" cy="75" r="18" fill="#ffffff" stroke="#fff200" strokeWidth="2" strokeOpacity="0.7" />
      <path d="M88 75 H112 M148 75 H172 M208 75 H232" stroke="#fff200" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />
      <text x="130" y="115" textAnchor="middle" fontSize="10" fontWeight="700" fill="#111111" opacity="0.75">Connected • Immutable</text>
    </g>
    <text x="320" y="190" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111111" opacity="0.65">Transformation</text>
  </Box>
);

// Horizontal Tanzania Map (Option 3)
const TanzaniaBlockchainArtHorizontal = () => (
  <Box component="svg" viewBox="0 0 640 220" aria-hidden="true" sx={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%', minWidth: 320 }}>
    <defs>
      <linearGradient id="tzHMapGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.2" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="tzHNodeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fff200" />
      </linearGradient>
    </defs>
    <path d="M80 80 L160 60 L240 70 L320 50 L400 70 L480 60 L560 80 L580 140 L560 180 L480 200 L320 190 L160 200 L80 180 L60 140 Z" fill="url(#tzHMapGrad)" stroke="#111111" strokeOpacity="0.12" strokeWidth="2" />
    <ellipse cx="605" cy="120" rx="12" ry="20" fill="url(#tzHMapGrad)" stroke="#111111" strokeOpacity="0.1" strokeWidth="1" />
    {[
      { x: 120, y: 100, name: 'Arusha' },
      { x: 240, y: 90, name: 'Dodoma' },
      { x: 320, y: 110, name: 'Dar', primary: true },
      { x: 440, y: 90, name: 'Mwanza' },
      { x: 540, y: 110, name: 'Mbeya' },
    ].map((c, i) => (
      <g key={c.name}>
        <circle cx={c.x} cy={c.y} r={c.primary ? 14 : 10} fill="url(#tzHNodeGrad)" stroke="#111111" strokeOpacity="0.2" strokeWidth="1.5" />
        <circle cx={c.x} cy={c.y} r={(c.primary ? 14 : 10) * 0.4} fill="#111111" opacity="0.6" />
        <text x={c.x} y={c.y + 28} textAnchor="middle" fontSize="9" fontWeight="700" fill="#111111" opacity="0.7">{c.name}</text>
      </g>
    ))}
    <path d="M134 100 H226 M254 92 H306 M334 102 H426 M454 94 H526" stroke="#111111" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="3 4" />
    <text x="320" y="210" textAnchor="middle" fontSize="11" fontWeight="800" fill="#111111" opacity="0.65">National coverage</text>
  </Box>
);

const MiniEvasionArt = () => (
  <Box
    component="svg"
    viewBox="0 0 640 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcEvG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="stcEvInk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#111111" stopOpacity="0.9" />
        <stop offset="1" stopColor="#111111" stopOpacity="0.55" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="640" height="360" rx="28" fill="url(#stcEvG)" />
    <path
      d="M0 245 C140 180, 260 300, 420 220 C520 170, 590 170, 640 190 L640 360 L0 360 Z"
      fill="#fffde7"
      opacity="0.9"
    />

    {/* KPI circle */}
    <circle cx="130" cy="150" r="78" fill="#ffffff" opacity="0.95" />
    <circle
      cx="130"
      cy="150"
      r="78"
      fill="none"
      stroke="#111111"
      strokeOpacity="0.12"
      strokeWidth="10"
    />
    <path
      d="M130 72 A78 78 0 0 1 194 115"
      fill="none"
      stroke="#111111"
      strokeOpacity="0.75"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <text x="130" y="145" textAnchor="middle" fontSize="34" fontWeight="900" fill="#111111">
      1.3%
    </text>
    <text
      x="130"
      y="175"
      textAnchor="middle"
      fontSize="16"
      fontWeight="800"
      fill="#111111"
      opacity="0.7"
    >
      of GDP
    </text>

    {/* Headline card */}
    <g transform="translate(250 95)">
      <rect x="0" y="0" width="340" height="170" rx="20" fill="#ffffff" opacity="0.96" />
      <rect x="0" y="0" width="340" height="10" rx="20" fill="#fff200" />
      <text x="18" y="40" fontSize="16" fontWeight="950" fill="#111111" opacity="0.8">
        Evidence-backed estimate
      </text>
      <text x="18" y="72" fontSize="24" fontWeight="950" fill="url(#stcEvInk)">
        Tax evasion causes
      </text>
      <text x="18" y="102" fontSize="24" fontWeight="950" fill="url(#stcEvInk)">
        major revenue leakage
      </text>
      <rect x="18" y="122" width="190" height="10" rx="6" fill="#111111" opacity="0.10" />
      <rect x="18" y="140" width="260" height="10" rx="6" fill="#111111" opacity="0.10" />
      <rect x="18" y="158" width="230" height="10" rx="6" fill="#111111" opacity="0.10" />
    </g>

    {/* subtle motion */}
    <circle cx="194" cy="115" r="6" fill="#111111" opacity="0.7">
      <animate attributeName="opacity" values="0.35;0.9;0.35" dur="2.2s" repeatCount="indefinite" />
    </circle>
  </Box>
);

const MiniFraudArt = () => (
  <Box
    component="svg"
    viewBox="0 0 640 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <radialGradient id="stcFrG" cx="30%" cy="25%" r="85%">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.28" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="640" height="360" rx="28" fill="url(#stcFrG)" />

    {/* network */}
    {[
      [120, 120],
      [220, 80],
      [320, 130],
      [210, 210],
      [360, 230],
      [470, 150],
      [520, 230],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="10" fill="#111111" opacity="0.22" />
    ))}
    <path
      d="M120 120 L220 80 L320 130 L210 210 L360 230 L470 150 L520 230"
      fill="none"
      stroke="#111111"
      strokeOpacity="0.18"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* threat pulse */}
    <g transform="translate(455 115)">
      <circle cx="0" cy="0" r="46" fill="#111111" opacity="0.06" />
      <circle cx="0" cy="0" r="18" fill="#111111" opacity="0.85" />
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="none"
        stroke="#fff200"
        strokeOpacity="0.85"
        strokeWidth="4"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.2;0.9;0.2"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    {/* label blocks */}
    <g transform="translate(90 265)">
      <rect x="0" y="0" width="220" height="62" rx="18" fill="#ffffff" opacity="0.96" />
      <rect x="0" y="0" width="220" height="8" rx="18" fill="#111111" opacity="0.18" />
      <text x="18" y="38" fontSize="18" fontWeight="950" fill="#111111">
        External + Internal
      </text>
    </g>
    <g transform="translate(330 265)">
      <rect x="0" y="0" width="220" height="62" rx="18" fill="#ffffff" opacity="0.96" />
      <rect x="0" y="0" width="220" height="8" rx="18" fill="#fff200" />
      <text x="18" y="38" fontSize="18" fontWeight="950" fill="#111111">
        Fraud vectors
      </text>
    </g>
  </Box>
);

const MiniDelayArt = () => (
  <Box
    component="svg"
    viewBox="0 0 640 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcDlG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fffde7" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="640" height="360" rx="28" fill="url(#stcDlG)" />

    {/* timeline */}
    <path
      d="M110 190 H530"
      stroke="#111111"
      strokeOpacity="0.18"
      strokeWidth="10"
      strokeLinecap="round"
    />
    {[
      { x: 140, label: 'Day 1' },
      { x: 320, label: 'Day 30–180' },
      { x: 500, label: '180+' },
    ].map((n, i) => (
      <g key={i} transform={`translate(${n.x} 190)`}>
        <circle cx="0" cy="0" r="18" fill="#111111" opacity="0.18" />
        <circle cx="0" cy="0" r="10" fill="#111111" opacity="0.75" />
        <text
          x="0"
          y="44"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fill="#111111"
          opacity="0.75"
        >
          {n.label}
        </text>
      </g>
    ))}

    {/* clock */}
    <g transform="translate(110 90)">
      <circle cx="0" cy="0" r="54" fill="#ffffff" opacity="0.98" />
      <circle
        cx="0"
        cy="0"
        r="54"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.12"
        strokeWidth="10"
      />
      <path d="M0 0 V-22" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 0 L18 10" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
      <circle cx="0" cy="0" r="6" fill="#fff200" />
    </g>

    {/* document stack */}
    <g transform="translate(360 70)">
      <rect x="0" y="38" width="200" height="120" rx="18" fill="#111111" opacity="0.08" />
      <rect x="10" y="20" width="200" height="120" rx="18" fill="#ffffff" opacity="0.98" />
      <rect x="10" y="20" width="200" height="10" rx="18" fill="#fff200" />
      <rect x="28" y="54" width="150" height="10" rx="6" fill="#111111" opacity="0.12" />
      <rect x="28" y="76" width="170" height="10" rx="6" fill="#111111" opacity="0.12" />
      <rect x="28" y="98" width="110" height="10" rx="6" fill="#111111" opacity="0.12" />
    </g>

    <text
      x="320"
      y="320"
      textAnchor="middle"
      fontSize="18"
      fontWeight="950"
      fill="#111111"
      opacity="0.75"
    >
      Manual verification slows recovery
    </text>
  </Box>
);

const FocusDottedGuide = ({ activeIdx = 0 }) => (
  <Box
    sx={{
      position: 'relative',
      height: 44,
      display: { xs: 'none', md: 'block' },
      px: 1,
    }}
  >
    <Box
      component="svg"
      viewBox="0 0 1000 44"
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    >
      <line
        x1="80"
        y1="10"
        x2="920"
        y2="10"
        stroke="#111111"
        strokeOpacity="0.14"
        strokeWidth="2"
        strokeDasharray="3 8"
      />

      {[166.67, 500, 833.33].map((x, i) => {
        const isActive = i === activeIdx;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy="10"
              r="4.5"
              fill={isActive ? '#fff200' : '#111111'}
              opacity={isActive ? 1 : 0.2}
            />
            <line
              x1={x}
              y1="10"
              x2={x}
              y2="40"
              stroke={isActive ? '#fff200' : '#111111'}
              strokeOpacity={isActive ? 1 : 0.12}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={isActive ? '5 6' : '3 8'}
              strokeLinecap="round"
            >
              {isActive ? (
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-22"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              ) : null}
            </line>
          </g>
        );
      })}
    </Box>
  </Box>
);

const EvidencePhotoCard = ({ src, caption, aspectRatio = '16 / 9', fillHeight = false }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      border: `1px solid ${alpha('#111111', 0.1)}`,
      backgroundColor: '#ffffff',
      height: fillHeight ? '100%' : 'auto',
      display: fillHeight ? 'flex' : 'block',
      flexDirection: fillHeight ? 'column' : undefined,
      minHeight: 0,
    }}
  >
    <Box
      onClick={() => window.open(src, '_blank', 'noopener,noreferrer')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') window.open(src, '_blank', 'noopener,noreferrer');
      }}
      sx={{
        width: '100%',
        aspectRatio: fillHeight ? undefined : aspectRatio,
        flex: fillHeight ? 1 : undefined,
        minHeight: fillHeight ? 0 : undefined,
        backgroundColor: alpha('#111111', 0.02),
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        cursor: 'pointer',
      }}
    >
      <Box
        component="img"
        src={src}
        alt="Evidence image"
        loading="lazy"
        referrerPolicy="no-referrer"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // Never crop evidence
          display: 'block',
          filter: 'contrast(1.02) saturate(1.02)',
        }}
      />
      {caption ? (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: 1,
            py: 0.75,
            backgroundColor: alpha('#ffffff', 0.8),
            backdropFilter: 'blur(8px)',
            borderTop: `1px solid ${alpha('#111111', 0.08)}`,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: alpha('#111111', 0.7), fontWeight: 800 }}>
              {caption}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#111111', 0.55), fontWeight: 900 }}>
              View full
            </Typography>
          </Stack>
        </Box>
      ) : null}
    </Box>
  </Paper>
);

const FocusRail = ({ activeIdx = 0 }) => (
  <Box
    sx={{
      width: 28,
      display: { xs: 'none', md: 'flex' },
      alignItems: 'stretch',
      justifyContent: 'center',
      py: 0.5,
      flexShrink: 0,
    }}
  >
    <Box
      component="svg"
      viewBox="0 0 28 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{ width: 28, height: '100%', display: 'block' }}
    >
      <line
        x1="14"
        y1="12"
        x2="14"
        y2="288"
        stroke="#111111"
        strokeOpacity="0.14"
        strokeWidth="2"
        strokeDasharray="3 8"
        strokeLinecap="round"
      />
      <circle cx="14" cy="28" r="5" fill="#fff200" />
      <circle cx="14" cy="28" r="5" fill="#fff200" opacity="0.35">
        <animate attributeName="r" values="5;12" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text
        x="14"
        y="298"
        textAnchor="middle"
        fontSize="10"
        fontWeight="900"
        fill="#111111"
        opacity="0.45"
      >
        {activeIdx + 1}/3
      </text>
    </Box>
  </Box>
);

const ChallengeFocus = ({ cards, focus, activeIdx, onSelect, stage, setStage }) => {
  const theme = useTheme();
  const item = focus?.items?.[activeIdx] ?? null;
  const activeCard = cards?.[activeIdx] ?? null;
  const visited = focus?.visited || [];
  const visitedCount = visited.filter(Boolean).length;
  const isComplete = visitedCount >= (cards?.length ?? 3);

  // Micro-transitions for the right-side details/evidence:
  // fade-out old content -> swap -> fade-in new content
  const [displayIdx, setDisplayIdx] = useState(activeIdx);
  const [detailPhase, setDetailPhase] = useState('in'); // 'in' | 'out'
  const revealWrapRef = useRef(null);
  const detailsRef = useRef(null);
  const slotRefs = useRef([]);
  const [overlayRect, setOverlayRect] = useState(null);
  const [activeSlotRect, setActiveSlotRect] = useState(null);
  const [wrapSize, setWrapSize] = useState(null);
  const [panelOriginRect, setPanelOriginRect] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelPhase, setPanelPhase] = useState('from'); // 'from' | 'to'

  useEffect(() => {
    // Keep in sync when (re)entering reveal mode.
    if (stage !== 'reveal') {
      setDisplayIdx(activeIdx);
      setDetailPhase('in');
      return;
    }
    if (activeIdx === displayIdx) return;
    setDetailPhase('out');
    const t = window.setTimeout(() => {
      setDisplayIdx(activeIdx);
      window.requestAnimationFrame(() => setDetailPhase('in'));
    }, 170);
    return () => window.clearTimeout(t);
  }, [activeIdx, displayIdx, stage]);

  const displayItem = focus?.items?.[displayIdx] ?? null;
  const detailMotionSx = {
    opacity: detailPhase === 'out' ? 0 : 1,
    transform: detailPhase === 'out' ? 'translateY(6px)' : 'translateY(0px)',
    transition: 'opacity 170ms ease, transform 170ms ease',
    willChange: 'opacity, transform',
  };

  const nextIdx1 = (activeIdx + 1) % (cards?.length ?? 3);
  const nextIdx2 = (activeIdx + 2) % (cards?.length ?? 3);
  const panelTargetRect = useMemo(() => {
    if (!overlayRect) return null;
    const base = Math.min(overlayRect.width, overlayRect.height);
    // Horizontal padding only; keep the panel as tall as possible.
    const insetX = Math.max(6, Math.min(12, base * 0.03));
    const insetY = 0;
    return {
      left: overlayRect.left + insetX,
      top: overlayRect.top + insetY,
      width: Math.max(0, overlayRect.width - insetX * 2),
      height: Math.max(0, overlayRect.height - insetY * 2),
      insetX,
      insetY,
    };
  }, [overlayRect]);
  const panelDensity = useMemo(() => {
    const h = panelTargetRect?.height ?? 0;
    if (h && h < 440) return 'tight';
    if (h && h < 520) return 'compact';
    return 'normal';
  }, [panelTargetRect]);
  const isDense = panelDensity !== 'normal';
  const panelContentScale = panelDensity === 'tight' ? 0.94 : panelDensity === 'compact' ? 0.98 : 1;
  const panelFromTransform = useMemo(() => {
    if (!panelTargetRect || !panelOriginRect) return 'translateY(10px) scale(0.985)';
    const dx = panelOriginRect.left - panelTargetRect.left;
    const dy = panelOriginRect.top - panelTargetRect.top;
    const sx = panelTargetRect.width ? panelOriginRect.width / panelTargetRect.width : 1;
    const sy = panelTargetRect.height ? panelOriginRect.height / panelTargetRect.height : 1;
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  }, [panelOriginRect, panelTargetRect]);

  useEffect(() => {
    if (stage !== 'reveal') {
      setPanelOpen(false);
      return undefined;
    }
    // Two-step reveal: blur first, then expand details.
    setPanelOpen(false);
    const t = window.setTimeout(() => setPanelOpen(true), 260);
    return () => window.clearTimeout(t);
  }, [activeIdx, stage]);

  useEffect(() => {
    if (stage !== 'reveal' || !panelOpen) {
      setPanelPhase('from');
      return undefined;
    }
    setPanelPhase('from');
    let raf = 0;
    raf = requestAnimationFrame(() => setPanelPhase('to'));
    return () => cancelAnimationFrame(raf);
  }, [displayIdx, panelOpen, stage]);

  useEffect(() => {
    if (stage !== 'reveal') {
      setOverlayRect(null);
      setActiveSlotRect(null);
      setWrapSize(null);
      setPanelOriginRect(null);
      return undefined;
    }
    let raf = 0;
    const compute = () => {
      const wrap = revealWrapRef.current;
      const el0 = slotRefs.current?.[0];
      const el1 = slotRefs.current?.[1];
      const el2 = slotRefs.current?.[2];
      if (!wrap || !el0 || !el1 || !el2) {
        setOverlayRect(null);
        setActiveSlotRect(null);
        setWrapSize(null);
        setPanelOriginRect(null);
        return;
      }
      const w = wrap.getBoundingClientRect();
      setWrapSize({ width: w.width, height: w.height });
      const r0 = el0.getBoundingClientRect();
      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      const left = Math.min(r1.left, r2.left) - w.left;
      // Make the right panel "long": start at top of the wrap and extend to its bottom.
      const top = 0;
      const right = Math.max(r1.right, r2.right) - w.left;
      const bottom = w.height;
      const width = Math.max(0, right - left);
      const height = Math.max(0, bottom - top);
      if (width < 2 || height < 2) {
        setOverlayRect(null);
        setActiveSlotRect(null);
        setPanelOriginRect(null);
        return;
      }
      setOverlayRect({ left, top, width, height });
      setActiveSlotRect({
        left: r0.left - w.left,
        top: r0.top - w.top,
        width: r0.width,
        height: r0.height,
      });
      setPanelOriginRect({
        left: r1.left - w.left,
        top: r1.top - w.top,
        width: r1.width,
        height: r1.height,
      });
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    schedule();
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
    };
  }, [activeIdx, stage]);

  const ChallengeCard = ({ c, i, slot = null, isActive, tone = 'normal' }) => (
    <Paper
      elevation={0}
      ref={(el) => {
        if (typeof slot === 'number') slotRefs.current[slot] = el;
      }}
      onClick={() => {
        // Keep the 3-card arrangement; just reveal details panel.
        setStage('reveal');
        onSelect(i);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setStage('reveal');
          onSelect(i);
        }
      }}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: `1px solid ${alpha('#111111', isActive ? 0.14 : 0.08)}`,
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        userSelect: 'none',
        transition:
          'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, filter 220ms ease, opacity 220ms ease',
        boxShadow:
          tone === 'queue'
            ? 'none'
            : isActive
              ? `0 18px 55px ${alpha(theme.palette.primary.main, 0.18)}`
              : 'none',
        transform: tone === 'queue' ? 'none' : isActive ? 'translateY(-2px)' : 'none',
        opacity: tone === 'queue' ? 0.58 : 1,
        filter: tone === 'queue' ? 'blur(1.15px)' : 'none',
        pointerEvents: tone === 'queue' ? 'auto' : 'auto',
        '&:hover':
          tone === 'queue'
            ? { opacity: 0.7, filter: 'blur(0.8px)' }
            : {
                transform: isActive ? 'translateY(-2px)' : 'translateY(-1px)',
                boxShadow: `0 18px 50px ${alpha(theme.palette.primary.main, 0.14)}`,
              },
        '&:focus-visible': {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          outlineOffset: 2,
        },
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, isActive ? 0.22 : 0.14),
              border: `1px solid ${alpha(theme.palette.primary.main, isActive ? 0.5 : 0.28)}`,
            }}
          >
            {c.icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>
            {c.title}
          </Typography>
        </Stack>

        {c.illustration ? (
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha('#111111', 0.08)}`,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1,
              )} 0%, #ffffff 70%)`,
            }}
          >
            {c.illustration}
          </Box>
        ) : null}

        <Stack spacing={0.65}>
          {c.lines.map((l) => (
            <Typography
              key={l}
              variant="body2"
              sx={{ color: alpha('#111111', 0.74), lineHeight: 1.65 }}
            >
              {l}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );

  if (stage === 'overview') {
    return (
      <Stack spacing={1.75} sx={{ flex: 1, minHeight: 0 }}>
        <Grid container spacing={2}>
          {cards.map((c, i) => (
            <Grid key={c.title} item xs={12} md={4}>
              <ChallengeCard c={c} i={i} isActive={false} />
            </Grid>
          ))}
        </Grid>

        <FocusDottedGuide activeIdx={-1} />

        <Paper
          elevation={0}
          sx={{
            p: 1.75,
            borderRadius: 4,
            border: `1px dashed ${alpha('#111111', 0.18)}`,
            backgroundColor: alpha('#111111', 0.02),
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="body2" sx={{ color: alpha('#111111', 0.76), lineHeight: 1.7 }}>
              Scroll once (or click a card) to <strong>reveal details</strong> on the right — the
              three challenges stay visible.
            </Typography>
            <Button
              onClick={() => {
                setStage('reveal');
                onSelect(0);
              }}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                textTransform: 'none',
                fontWeight: 950,
                borderRadius: 999,
                whiteSpace: 'nowrap',
                boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.22)}`,
              }}
            >
              Next
            </Button>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={1.75}
      sx={{
        flex: 1,
        minHeight: 0,
        '@keyframes stcStepIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0px)' },
        },
        '@keyframes stcPanelIn': {
          from: { opacity: 0, transform: 'translateX(12px)' },
          to: { opacity: 1, transform: 'translateX(0px)' },
        },
      }}
    >
      <Box
        ref={revealWrapRef}
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          pb: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* Active (left) + two queued (right) */}
          {[0, 1, 2].map((slot) => {
            const idx = slot === 0 ? activeIdx : slot === 1 ? nextIdx1 : nextIdx2;
            return (
              <Grid key={`stc-slot-${slot}`} item xs={12} md={4}>
                <ChallengeCard
                  c={cards[idx]}
                  i={idx}
                  slot={slot}
                  isActive={slot === 0}
                  tone={slot === 0 ? 'normal' : 'queue'}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Dotted connector: active point → details panel */}
        {stage === 'reveal' && activeSlotRect && panelTargetRect ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <Box
              component="svg"
              data-stc-aim="1"
              viewBox={`0 0 ${Math.max(1, wrapSize?.width ?? 1)} ${Math.max(
                1,
                wrapSize?.height ?? 1,
              )}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            >
              {(() => {
                const sx = activeSlotRect.left + activeSlotRect.width - 10;
                const sy = activeSlotRect.top + activeSlotRect.height * 0.5;
                const ex = Math.max(0, panelTargetRect.left - 14);
                const ey = panelTargetRect.top + 28;
                const dx = Math.max(60, (ex - sx) * 0.6);
                const d = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`;
                return (
                  <g>
                    <path
                      d={d}
                      fill="none"
                      stroke="#111111"
                      strokeOpacity="0.22"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="3 8"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-26"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <circle cx={ex} cy={ey} r="4.5" fill="#fff200" />
                    <circle cx={ex} cy={ey} r="10" fill="#fff200" opacity="0.18" />
                  </g>
                );
              })()}
            </Box>
          </Box>
        ) : null}

        {/* Details overlay above the two right queued cards */}
        {panelOpen && panelTargetRect && displayItem ? (
          <Box
            sx={{
              position: 'absolute',
              left: panelTargetRect.left,
              top: panelTargetRect.top,
              width: panelTargetRect.width,
              bottom: panelTargetRect.insetY ?? 0,
              zIndex: 3,
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: isDense ? 1.25 : 2,
              p: isDense ? 1.25 : 1.5,
              borderRadius: 4,
              backgroundColor: alpha('#ffffff', 0.74),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#111111', 0.1)}`,
              boxShadow: `0 24px 70px ${alpha('#111111', 0.12)}`,
              transformOrigin: 'top left',
              opacity: panelPhase === 'to' ? 1 : 0,
              transform:
                panelPhase === 'to' ? 'translate(0px, 0px) scale(1, 1)' : panelFromTransform,
              transition: 'transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 220ms ease',
              willChange: 'transform, opacity',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'grid',
                gap: isDense ? 1.25 : 2,
                gridTemplateRows: displayItem.right
                  ? displayItem.right.type === 'image'
                    ? 'minmax(0, 0.65fr) minmax(0, 1.35fr)'
                    : displayItem.right.type === 'node'
                      ? 'minmax(0, 0.75fr) minmax(0, 1.25fr)'
                      : 'minmax(0, 1.05fr) minmax(0, 0.95fr)'
                  : 'minmax(0, 1fr)',
              }}
            >
              <Paper
                ref={detailsRef}
                elevation={0}
                sx={{
                  p:
                    displayItem.right?.type === 'image'
                      ? isDense
                        ? 1.25
                        : 1.5
                      : isDense
                        ? 1.5
                        : 2,
                  borderRadius: 4,
                  border: `1px solid ${alpha('#111111', 0.08)}`,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.16,
                  )} 0%, #ffffff 55%)`,
                  overflow: 'hidden',
                  minHeight: 0,
                }}
              >
                <Stack
                  spacing={isDense ? 0.75 : 1.25}
                  sx={{
                    ...detailMotionSx,
                    transformOrigin: 'top left',
                    transform: `scale(${panelContentScale})`,
                    width: `calc(100% / ${panelContentScale})`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: '#fff200',
                        boxShadow: `0 0 0 4px ${alpha('#fff200', 0.22)}`,
                        flexShrink: 0,
                      }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        height: 1,
                        borderBottom: `1px dashed ${alpha('#111111', 0.24)}`,
                      }}
                    />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 950,
                        letterSpacing: '0.08em',
                        color: alpha('#111111', 0.62),
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayItem.kicker || 'Expanded details'}
                    </Typography>
                  </Stack>
                  {displayItem.lead ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#111111', 0.76),
                        lineHeight: 1.55,
                        fontSize: isDense ? 12.5 : undefined,
                      }}
                    >
                      {displayItem.lead}
                    </Typography>
                  ) : null}

                  {displayItem.bullets?.length ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: isDense ? 0.75 : 1,
                      }}
                    >
                      {displayItem.bullets.map((b, i) => (
                        <Stack
                          key={`${displayItem.title}-d-${i}`}
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              mt: '1px',
                              width: isDense ? 26 : 30,
                              height: isDense ? 26 : 30,
                              borderRadius: 2,
                              backgroundColor: alpha('#fff200', 0.18),
                              border: `1px solid ${alpha('#fff200', 0.45)}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              '& svg': { fontSize: isDense ? 18 : 20 },
                            }}
                          >
                            {b.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha('#111111', 0.8),
                              lineHeight: 1.45,
                              fontSize: isDense ? 12.2 : 13.5,
                              minWidth: 0,
                            }}
                          >
                            {b.text}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  ) : null}

                  {displayItem.callout ? (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 0.25,
                        p: isDense ? 1 : 1.25,
                        borderRadius: 3,
                        border: `1px dashed ${alpha('#111111', 0.18)}`,
                        backgroundColor: alpha('#111111', 0.02),
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha('#111111', 0.78),
                          lineHeight: 1.55,
                          fontSize: isDense ? 12.2 : undefined,
                        }}
                      >
                        <strong>Quote:</strong> {displayItem.callout}
                      </Typography>
                    </Paper>
                  ) : null}
                </Stack>
              </Paper>

              {displayItem.right ? (
                <Paper
                  elevation={0}
                  sx={{
                    p:
                      displayItem.right.type === 'image'
                        ? isDense
                          ? 1
                          : 1.25
                        : isDense
                          ? 1.25
                          : 1.5,
                    borderRadius: 4,
                    border: `1px solid ${alpha('#111111', 0.08)}`,
                    backgroundColor: '#ffffff',
                    overflow: 'hidden',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    spacing={isDense ? 0.9 : 1.25}
                    sx={{
                      ...detailMotionSx,
                      minHeight: 0,
                      transformOrigin: 'top left',
                      flex: 1,
                      transform: `scale(${
                        displayItem.right.type === 'image' || displayItem.right.type === 'node'
                          ? 1
                          : panelContentScale
                      })`,
                      width: `calc(100% / ${
                        displayItem.right.type === 'image' || displayItem.right.type === 'node'
                          ? 1
                          : panelContentScale
                      })`,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<Verified sx={{ color: '#111111 !important' }} />}
                        label={displayItem.right.type === 'image' ? 'Evidence' : 'Diagram'}
                        size="small"
                        sx={{
                          fontWeight: 950,
                          height: 28,
                          '& .MuiChip-label': { px: 1.1, fontSize: 12.5 },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: alpha('#111111', 0.65), fontWeight: 800 }}
                      >
                        Supports the selected point
                      </Typography>
                    </Stack>

                    {displayItem.right.type === 'image' ? (
                      <Box sx={{ flex: 1, minHeight: 0 }}>
                        <EvidencePhotoCard
                          src={displayItem.right.src}
                          caption={displayItem.right.caption}
                          fillHeight
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: `1px solid ${alpha('#111111', 0.08)}`,
                          backgroundColor: '#ffffff',
                          flex: 1,
                          minHeight: 0,
                          display: 'flex',
                          alignItems: 'stretch',
                          justifyContent: 'stretch',
                          '& svg': { width: '100%', height: '100%' },
                        }}
                      >
                        {displayItem.right?.node ?? null}
                      </Box>
                    )}
                  </Stack>
                </Paper>
              ) : null}
            </Box>
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
};

const Pill = ({ icon, label }) => (
  <Chip
    icon={icon}
    label={label}
    size="small"
    sx={{
      borderRadius: 999,
      backgroundColor: alpha('#fff200', 0.22),
      border: `1px solid ${alpha('#fff200', 0.6)}`,
      fontWeight: 900,
      height: { xs: 26, sm: 28, md: 32 },
      '& .MuiChip-label': {
        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' },
        px: { xs: 0.75, sm: 1, md: 1.5 },
      },
      '& .MuiChip-icon': {
        color: '#111111',
        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
      },
    }}
  />
);

const DiagramCard = ({ title, subtitle, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 4,
      border: `1px solid ${alpha('#111111', 0.08)}`,
      backgroundColor: '#ffffff',
    }}
  >
    <Stack spacing={1.25}>
      <Stack spacing={0.25}>
        <Typography variant="subtitle1" sx={{ fontWeight: 950, letterSpacing: '-0.2px' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            variant="body2"
            sx={{ color: alpha('#111111', 0.7), lineHeight: 1.6, fontSize: 13.5 }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {children}
    </Stack>
  </Paper>
);

const SolutionNetworkArt = () => (
  <Box
    component="svg"
    viewBox="0 0 760 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcSolBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#fffde7" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="stcSolLine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.95" />
        <stop offset="1" stopColor="#e6d700" stopOpacity="0.95" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="760" height="360" rx="28" fill="url(#stcSolBg)" />

    {/* connection rays (matches original PPT vibe) */}
    <g stroke="url(#stcSolLine)" strokeWidth="4" strokeLinecap="round" opacity="0.95">
      <path d="M380 180 L180 90" />
      <path d="M380 180 L560 85" />
      <path d="M380 180 L610 185" />
      <path d="M380 180 L510 300" />
      <path d="M380 180 L235 305" />
      <path d="M380 180 L150 205" />
    </g>

    {/* helper for node icon */}
    {[
      { x: 180, y: 90, icon: 'receipt' },
      { x: 560, y: 85, icon: 'lock' },
      { x: 610, y: 185, icon: 'chart' },
      { x: 510, y: 300, icon: 'db' },
      { x: 235, y: 305, icon: 'coin' },
      { x: 150, y: 205, icon: 'verify' },
    ].map((n, idx) => (
      <g key={idx}>
        <circle cx={n.x} cy={n.y} r="36" fill="#ffffff" />
        <circle
          cx={n.x}
          cy={n.y}
          r="36"
          fill="none"
          stroke="url(#stcSolLine)"
          strokeWidth="3.5"
          opacity="0.95"
        />
        <g
          transform={`translate(${n.x - 18} ${n.y - 18})`}
          fill="none"
          stroke="#e6d700"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {n.icon === 'receipt' ? (
            <>
              <path d="M8 4 h18 v28 l-4-3 -4 3 -4-3 -4 3 -4-3 -4 3 z" />
              <path d="M12 14 h12" />
              <path d="M12 20 h10" />
            </>
          ) : null}
          {n.icon === 'lock' ? (
            <>
              <path d="M10 16 v-4 a8 8 0 0 1 16 0 v4" />
              <rect x="8" y="16" width="20" height="14" rx="4" />
              <path d="M18 22 v4" />
            </>
          ) : null}
          {n.icon === 'chart' ? (
            <>
              <path d="M9 29 V12" />
              <path d="M18 29 V8" />
              <path d="M27 29 V16" />
              <path d="M8 29 H30" />
            </>
          ) : null}
          {n.icon === 'db' ? (
            <>
              <ellipse cx="18" cy="10" rx="12" ry="5" />
              <path d="M6 10 v14 c0 3 5.4 6 12 6 s12-3 12-6 V10" />
              <path d="M6 18 c0 3 5.4 6 12 6 s12-3 12-6" />
            </>
          ) : null}
          {n.icon === 'coin' ? (
            <>
              <circle cx="18" cy="18" r="12" />
              <path d="M14 14 h8" />
              <path d="M14 22 h8" />
            </>
          ) : null}
          {n.icon === 'verify' ? (
            <>
              <circle cx="18" cy="18" r="12" />
              <path d="M12 18 l4 4 l8-10" />
            </>
          ) : null}
        </g>
      </g>
    ))}

    {/* center node */}
    <g>
      <circle cx="380" cy="180" r="54" fill="#fff200" opacity="0.92" />
      <circle
        cx="380"
        cy="180"
        r="54"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.12"
        strokeWidth="6"
      />
      {/* chain link icon */}
      <g
        transform="translate(350 150)"
        fill="none"
        stroke="#111111"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      >
        <path d="M18 24 a14 14 0 0 1 0-20 l6-6 a14 14 0 0 1 20 0" />
        <path d="M42 36 a14 14 0 0 1 0 20 l-6 6 a14 14 0 0 1-20 0" />
        <path d="M28 32 l16-16" />
      </g>
    </g>
  </Box>
);

const KeyBenefitsPanel = () => {
  const theme = useTheme();
  const items = [
    {
      icon: <Shield sx={{ color: '#111111' }} />,
      title: 'Secures Taxpayer Data',
      desc: 'Protects sensitive information with cryptographic security.',
    },
    {
      icon: <Lock sx={{ color: '#111111' }} />,
      title: 'Prevents Manipulation',
      desc: 'Makes records tamper-evident once anchored to the chain.',
    },
    {
      icon: <Bolt sx={{ color: '#111111' }} />,
      title: 'Enables Real-Time Auditing',
      desc: 'Immediate verification of transactions and declarations.',
    },
    {
      icon: <Visibility sx={{ color: '#111111' }} />,
      title: 'Enhances Transparency & Trust',
      desc: 'Builds confidence through traceability and accountability.',
    },
    {
      icon: <Savings sx={{ color: '#111111' }} />,
      title: 'Protects Revenue',
      desc: 'Reduces losses by shrinking fraud windows and disputes.',
    },
  ];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: `1px solid ${alpha('#111111', 0.08)}`,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.08,
        )} 0%, #ffffff 65%)`,
      }}
    >
      <Stack spacing={1.75}>
        <Typography variant="h6" sx={{ fontWeight: 1000, letterSpacing: '-0.2px' }}>
          Key Benefits
        </Typography>
        <Stack spacing={1.4}>
          {items.map((it) => (
            <Stack key={it.title} direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: alpha('#fff200', 0.22),
                  border: `1px solid ${alpha('#fff200', 0.55)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  '& svg': { fontSize: 20 },
                }}
              >
                {it.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 950, lineHeight: 1.2 }}>
                  {it.title}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#111111', 0.72), lineHeight: 1.5 }}>
                  {it.desc}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

const SolutionCapabilityBlock = ({ icon, title, desc }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 4,
      border: `1px solid ${alpha('#111111', 0.08)}`,
      backgroundColor: '#ffffff',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          width: 6,
          alignSelf: 'stretch',
          borderRadius: 999,
          background: 'linear-gradient(180deg, #fff200 0%, #e6d700 100%)',
          flexShrink: 0,
          opacity: 0.9,
        }}
      />
      <Box
        sx={{
          width: 62,
          height: 62,
          borderRadius: 999,
          backgroundColor: alpha('#fff200', 0.18),
          border: `1px solid ${alpha('#fff200', 0.55)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '& svg': { fontSize: 30, color: '#111111' },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, pt: 0.2 }}>
        <Typography variant="h6" sx={{ fontWeight: 1000, letterSpacing: '-0.25px' }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha('#111111', 0.72), lineHeight: 1.75, mt: 0.35 }}
        >
          {desc}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const CapabilityShowCard = ({ icon, title, desc, tags = [] }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 4,
      border: `1px solid ${alpha('#111111', 0.08)}`,
      backgroundColor: '#ffffff',
    }}
  >
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: 999,
            backgroundColor: alpha('#fff200', 0.2),
            border: `1px solid ${alpha('#fff200', 0.55)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& svg': { fontSize: 26, color: '#111111' },
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 1050, letterSpacing: '-0.25px', lineHeight: 1.15 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha('#111111', 0.74), lineHeight: 1.75, mt: 0.5 }}
          >
            {desc}
          </Typography>
        </Box>
      </Stack>

      {tags?.length ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{
                fontWeight: 950,
                borderRadius: 999,
                backgroundColor: alpha('#111111', 0.03),
                border: `1px solid ${alpha('#111111', 0.12)}`,
              }}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  </Paper>
);

const PlatformMapArt = () => (
  <Box
    component="svg"
    viewBox="0 0 1000 520"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcPmBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#fffde7" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="stcPmY" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <linearGradient id="stcPmInk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#111111" stopOpacity="0.92" />
        <stop offset="1" stopColor="#111111" stopOpacity="0.58" />
      </linearGradient>
      <filter id="stcPmShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
        <feOffset dx="0" dy="10" result="o" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.16" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect x="0" y="0" width="1000" height="520" rx="30" fill="url(#stcPmBg)" />

    {/* section labels */}
    <g
      fontFamily="ui-sans-serif, system-ui, -apple-system"
      fontWeight="900"
      fontSize="12"
      fill="#111111"
      opacity="0.72"
    >
      <text x="78" y="70">
        INPUTS (TRA)
      </text>
      <text x="424" y="70">
        SMART TAX CHAIN CORE
      </text>
      <text x="830" y="70">
        OUTPUTS
      </text>
    </g>

    {/* connectors */}
    <g fill="none" stroke="#111111" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round">
      <path d="M300 150 C360 150, 390 170, 420 200" />
      <path d="M300 260 C360 260, 390 250, 420 240" />
      <path d="M300 370 C360 370, 395 335, 420 300" />

      <path d="M660 240 C710 240, 740 200, 780 185" />
      <path d="M660 260 C710 260, 740 270, 780 295" />
      <path d="M620 340 C705 370, 770 392, 860 402" />
    </g>

    {/* animated “flow dots” */}
    {[
      { d: 'M300 150 C360 150, 390 170, 420 200', dur: '2.4s' },
      { d: 'M300 260 C360 260, 390 250, 420 240', dur: '2.1s' },
      { d: 'M300 370 C360 370, 395 335, 420 300', dur: '2.7s' },
      { d: 'M660 240 C720 240, 760 200, 820 190', dur: '2.3s' },
      { d: 'M660 260 C720 260, 760 270, 820 300', dur: '2.6s' },
    ].map((p, i) => (
      <circle key={i} r="6" fill="#fff200" stroke="#111111" strokeOpacity="0.14" strokeWidth="2">
        <animateMotion dur={p.dur} repeatCount="indefinite" path={p.d} />
        <animate
          attributeName="opacity"
          values="0.35;1;0.35"
          dur={p.dur}
          repeatCount="indefinite"
        />
      </circle>
    ))}

    {/* input cards */}
    {[
      { x: 70, y: 110, title: 'EFD receipts', sub: 'Transactions captured' },
      { x: 70, y: 220, title: 'Declarations', sub: 'Returns / filings' },
      { x: 70, y: 330, title: 'Payments', sub: 'Collections / adjustments' },
    ].map((n, i) => (
      <g key={n.title} filter="url(#stcPmShadow)">
        <rect
          x={n.x}
          y={n.y}
          width="230"
          height="92"
          rx="22"
          fill="#ffffff"
          stroke="#111111"
          strokeOpacity="0.12"
        />
        <rect
          x={n.x + 16}
          y={n.y + 16}
          width="52"
          height="52"
          rx="18"
          fill="url(#stcPmY)"
          opacity="0.22"
        />
        <text
          x={n.x + 84}
          y={n.y + 42}
          fontSize="18"
          fontWeight="950"
          fill="#111111"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
        >
          {n.title}
        </text>
        <text
          x={n.x + 84}
          y={n.y + 66}
          fontSize="13"
          fill="url(#stcPmInk)"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
        >
          {n.sub}
        </text>
        {/* tiny icon */}
        <g
          transform={`translate(${n.x + 26} ${n.y + 26})`}
          fill="none"
          stroke="#111111"
          strokeOpacity="0.75"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {i === 0 ? (
            <>
              <path d="M8 2 h20 v30 l-4-3 -4 3 -4-3 -4 3 -4-3 -4 3 z" />
              <path d="M12 12 h12" />
              <path d="M12 18 h10" />
            </>
          ) : null}
          {i === 1 ? (
            <>
              <path d="M10 6 h20 a6 6 0 0 1 6 6 v18 a6 6 0 0 1-6 6 h-20 a6 6 0 0 1-6-6 v-18 a6 6 0 0 1 6-6 z" />
              <path d="M12 18 h14" />
              <path d="M12 25 h10" />
            </>
          ) : null}
          {i === 2 ? (
            <>
              <circle cx="18" cy="18" r="14" />
              <path d="M12 18 h12" />
              <path d="M14 12 h8" />
              <path d="M14 24 h8" />
            </>
          ) : null}
        </g>
      </g>
    ))}

    {/* Core (STC) */}
    <g filter="url(#stcPmShadow)">
      <rect
        x="420"
        y="120"
        width="260"
        height="240"
        rx="28"
        fill="#ffffff"
        stroke="#111111"
        strokeOpacity="0.14"
      />
      <circle cx="550" cy="220" r="66" fill="url(#stcPmY)" opacity="0.38" />
      <circle
        cx="550"
        cy="220"
        r="66"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.12"
        strokeWidth="6"
      />

      <text
        x="550"
        y="148"
        fontSize="12"
        fill="url(#stcPmInk)"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system"
      >
        Evidence ledger + monitoring + audit
      </text>

      {/* chain icon */}
      <g
        transform="translate(515 185)"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.9"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 24 a14 14 0 0 1 0-20 l6-6 a14 14 0 0 1 20 0" />
        <path d="M42 36 a14 14 0 0 1 0 20 l-6 6 a14 14 0 0 1-20 0" />
        <path d="M28 32 l16-16" />
      </g>

      {/* core modules */}
      {[
        { x: 450, y: 252, t: 'Immutable ledger' },
        { x: 450, y: 286, t: 'Fraud signals' },
        { x: 450, y: 320, t: 'Real-time audit' },
      ].map((m, i) => (
        <g key={m.t}>
          <rect
            x={m.x}
            y={m.y}
            width="200"
            height="28"
            rx="14"
            fill={alpha('#111111', 0.03)}
            stroke="#111111"
            strokeOpacity="0.08"
          />
          <circle
            cx={m.x + 16}
            cy={m.y + 14}
            r="6"
            fill="#fff200"
            stroke="#111111"
            strokeOpacity="0.14"
            strokeWidth="2"
          >
            <animate
              attributeName="opacity"
              values="0.35;1;0.35"
              dur={`${2.2 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={m.x + 30}
            y={m.y + 19}
            fontSize="12.5"
            fontWeight="900"
            fill="#111111"
            fontFamily="ui-sans-serif, system-ui, -apple-system"
          >
            {m.t}
          </text>
        </g>
      ))}
    </g>

    {/* Outputs */}
    {[
      { x: 780, y: 130, title: 'Real-time dashboard', sub: 'National visibility' },
      { x: 780, y: 240, title: 'Audit exports', sub: 'Defensible evidence' },
      { x: 780, y: 350, title: 'Alerts & cases', sub: 'Faster recovery' },
    ].map((n, i) => (
      <g key={n.title} filter="url(#stcPmShadow)">
        <rect
          x={n.x}
          y={n.y}
          width="200"
          height="92"
          rx="22"
          fill="#ffffff"
          stroke="#111111"
          strokeOpacity="0.12"
        />
        <rect
          x={n.x + 14}
          y={n.y + 16}
          width="40"
          height="40"
          rx="14"
          fill="url(#stcPmY)"
          opacity="0.22"
        />
        <text
          x={n.x + 62}
          y={n.y + 40}
          fontSize="13"
          fontWeight="950"
          fill="#111111"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
        >
          {n.title}
        </text>
        <text
          x={n.x + 62}
          y={n.y + 58}
          fontSize="11"
          fill="url(#stcPmInk)"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
        >
          {n.sub}
        </text>
      </g>
    ))}
  </Box>
);

// Platform Map content with toggle between one-side and full-side views
const PlatformMapSlideContent = ({ illustrationFull = false, onToggleIllustration }) => {
  const handleToggle = onToggleIllustration || (() => {});

  const toggleBtn = (
    <Button
      size="small"
      variant="outlined"
      onClick={handleToggle}
      startIcon={illustrationFull ? <FullscreenExit /> : <Fullscreen />}
      sx={{
        textTransform: 'none',
        fontWeight: 800,
        borderColor: alpha('#111111', 0.2),
        color: alpha('#111111', 0.8),
        flexShrink: 0,
        fontSize: { xs: '0.7rem', sm: '0.8rem' },
      }}
    >
      {illustrationFull ? 'Split' : 'Full'}
    </Button>
  );

  // Full diagram view
  if (illustrationFull) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          maxHeight: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>{toggleBtn}</Box>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minHeight: 0,
            maxHeight: '100%',
            overflow: 'hidden',
            borderRadius: 3,
            border: `1px solid ${alpha('#111111', 0.08)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
        >
          <PlatformMapArt />
        </Paper>
      </Box>
    );
  }

  // Split view - diagram with side content
  return (
    <Grid
      container
      spacing={{ xs: 1.5, md: 2.5 }}
      alignItems="stretch"
      sx={{ height: '100%', minHeight: 0 }}
    >
      <Grid item xs={12} md={7.2} sx={{ minHeight: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, sm: 1.5, md: 2 },
            borderRadius: { xs: 2, md: 3 },
            border: `1px solid ${alpha('#111111', 0.08)}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>{toggleBtn}</Box>
          <Stack spacing={0.5} sx={{ mb: 1, flexShrink: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 950, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' } }}
            >
              What Smart Tax Chain comes with
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha('#111111', 0.6),
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              }}
            >
              Inputs → evidence → real-time decisions
            </Typography>
          </Stack>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha('#111111', 0.06)}`,
              backgroundColor: '#ffffff',
            }}
          >
            <PlatformMapArt />
          </Box>
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75, md: 1 }}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 1, gap: { xs: 0.5, sm: 0.75 } }}
          >
            {[
              'Dashboards',
              'APIs & integration',
              'Role-based access',
              'Audit-ready exports',
              'Alerts & cases',
            ].map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                sx={{
                  fontWeight: 950,
                  borderRadius: 999,
                  backgroundColor: alpha('#111111', 0.03),
                  border: `1px solid ${alpha('#111111', 0.12)}`,
                  height: { xs: 22, sm: 26 },
                  '& .MuiChip-label': { fontSize: { xs: 10, sm: 11 }, px: { xs: 0.75, sm: 1 } },
                }}
              />
            ))}
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4.8} sx={{ minHeight: 0 }}>
        <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ height: '100%' }}>
          <CapabilityShowCard
            icon={<AccountTree />}
            title="Decentralized and Immutable ledger"
            desc="A decentralized ledger provides a shared, transparent record where every participant can verify transactions, ensuring trust. Its immutability makes records like EFD receipts tamper-proof — a bulletproof vault for taxpayer data."
            tags={['Transparent', 'Tamper-proof', 'Verifiable']}
          />
          <CapabilityShowCard
            icon={<Lock />}
            title="Built-In Fraud Prevention & Traceability"
            desc="Even under a cyberattack, taxpayer data remains untouched — immutability leaves no room for alteration. No authorized user can secretly change records — fraud stops before it starts."
            tags={['Cyberattack-proof', 'Traceability', 'No secret changes']}
          />
          <CapabilityShowCard
            icon={<Bolt />}
            title="Real Time Auditing & Accountability"
            desc="Enables real-time auditing, dramatically improving efficiency and trust across all stakeholders. Auditors gain immediate access to a complete, immutable, and pre-verified audit trail."
            tags={['Real-time', 'Pre-verified', 'Complete trail']}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

const CtaHeroArt = () => (
  <Box
    component="svg"
    viewBox="0 0 900 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcCtaBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.42" stopColor="#fffde7" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="stcCtaInk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#111111" stopOpacity="0.92" />
        <stop offset="1" stopColor="#111111" stopOpacity="0.58" />
      </linearGradient>
      <radialGradient id="stcCtaPulse" cx="50%" cy="50%" r="60%">
        <stop offset="0" stopColor="#fff200" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff200" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="900" height="360" rx="26" fill="url(#stcCtaBg)" />
    <circle cx="650" cy="170" r="170" fill="url(#stcCtaPulse)">
      <animate
        attributeName="opacity"
        values="0.55;0.85;0.55"
        dur="3.6s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Network lines */}
    <g stroke="#111111" strokeOpacity="0.16" strokeWidth="3" fill="none">
      <path d="M130 250 C220 170, 320 170, 410 250" />
      <path d="M260 120 C360 85, 485 105, 560 175" />
      <path d="M410 250 C490 290, 590 285, 680 225" />
      <path d="M560 175 C640 120, 740 120, 810 170" />
    </g>

    {/* Nodes */}
    {[
      [130, 250],
      [260, 120],
      [410, 250],
      [560, 175],
      [680, 225],
      [810, 170],
    ].map(([x, y], idx) => (
      <g key={idx}>
        <circle cx={x} cy={y} r="14" fill="#ffffff" />
        <circle
          cx={x}
          cy={y}
          r="14"
          fill="none"
          stroke="#111111"
          strokeOpacity="0.18"
          strokeWidth="4"
        />
        <circle
          cx={x}
          cy={y}
          r="6"
          fill="#fff200"
          stroke="#111111"
          strokeOpacity="0.18"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0.45;1;0.45"
            dur="2.6s"
            begin={`${idx * 0.12}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    ))}

    {/* Center "ledger" badge */}
    <g transform="translate(360 58)">
      <rect
        x="0"
        y="0"
        width="320"
        height="120"
        rx="22"
        fill="#ffffff"
        stroke="#111111"
        strokeOpacity="0.14"
        strokeWidth="3"
      />
      <rect x="18" y="18" width="84" height="84" rx="20" fill="#fff200" opacity="0.24" />
      <path
        d="M44 62 L58 76 L82 48"
        fill="none"
        stroke="#111111"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.45;1;0.45"
          dur="2.1s"
          repeatCount="indefinite"
        />
      </path>
      <text
        x="120"
        y="48"
        fontSize="22"
        fontFamily="ui-sans-serif, system-ui, -apple-system"
        fontWeight="800"
        fill="#111111"
      >
        LIVE LEDGER EVIDENCE
      </text>
      <text
        x="120"
        y="78"
        fontSize="16"
        fontFamily="ui-sans-serif, system-ui, -apple-system"
        fill="url(#stcCtaInk)"
      >
        Traceable receipts • tamper-evident records • defensible audit trail
      </text>
    </g>
  </Box>
);

const CtaEndAnimator = ({ playKey, demoUrl }) => {
  const theme = useTheme();
  return (
    <Box
      key={playKey}
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Above slide content so trails are visible across full width.
        zIndex: 6,

        '@keyframes stcBubbleFall': {
          '0%': { transform: 'translateY(-42%)', opacity: 0 },
          '10%': { opacity: 0.85 },
          '90%': { opacity: 0.85 },
          '100%': { transform: 'translateY(135%)', opacity: 0 },
        },
        '@keyframes stcCutSweep': {
          '0%': { transform: 'translateY(140%) rotate(-4deg)', opacity: 0 },
          '25%': { opacity: 1 },
          '55%': { transform: 'translateY(35%) rotate(-2deg)', opacity: 1 },
          '100%': { transform: 'translateY(-40%) rotate(0deg)', opacity: 0 },
        },
        '@keyframes stcEndCardDrop': {
          '0%': {
            transform: 'translate(-50%, 120%) rotate(5deg) scale(0.92)',
            opacity: 0,
          },
          '55%': {
            transform: 'translate(-50%, -10px) rotate(-3deg) scale(1.02)',
            opacity: 1,
          },
          '72%': {
            transform: 'translate(-50%, 5px) rotate(-4deg) scale(1.01)',
            opacity: 1,
          },
          '100%': {
            transform: 'translate(-50%, 0) rotate(-4deg) scale(1)',
            opacity: 1,
          },
        },
        '@keyframes stcButtonAppear': {
          '0%': {
            transform: 'translateY(30px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
      }}
    >
      {/* 3 bubble trails */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          mixBlendMode: 'multiply',
          filter: `drop-shadow(0 18px 30px ${alpha('#111111', 0.06)})`,
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 78%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 78%, transparent 100%)',
        }}
      >
        {[
          // Centered trio (guides eye to final “end” card)
          { left: '44%', dur: '4.8s', delay: '0s', op: 0.62 },
          { left: '50%', dur: '5.2s', delay: '0.22s', op: 0.72 },
          { left: '56%', dur: '4.6s', delay: '0.14s', op: 0.64 },
        ].map((c, idx) => (
          <Box
            key={c.left}
            sx={{
              position: 'absolute',
              top: -140,
              bottom: -140,
              left: c.left,
              width: 36,
              transform: 'translateX(-50%)',
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 28 360"
              sx={{ width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                {/* Use safe IDs (no %) to avoid SVG url() failures */}
                <linearGradient id={`stcBubG-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff200" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#fff200" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              <line
                x1="14"
                y1="0"
                x2="14"
                y2="360"
                stroke={`url(#stcBubG-${idx})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="2 10"
              />
              <g style={{ opacity: c.op }}>
                {[18, 62, 106, 150, 194, 238, 282, 326].map((y, i) => (
                  <circle
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    cx={14}
                    cy={y}
                    r={i % 3 === 0 ? 7.5 : i % 3 === 1 ? 6 : 5}
                    fill={alpha('#fff200', 0.62)}
                    stroke={alpha('#111111', 0.12)}
                    strokeWidth="2"
                  />
                ))}
              </g>
            </Box>

            {/* moving bubbles wrapper */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                animation: `stcBubbleFall ${c.dur} linear infinite`,
                animationDelay: c.delay,
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 28 360"
                sx={{ width: '100%', height: '100%', display: 'block' }}
              >
                <g>
                  {[24, 92, 170, 250, 320].map((y, i) => (
                    <circle
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      cx={14}
                      cy={y}
                      r={i % 2 === 0 ? 8.5 : 6.5}
                      fill={alpha('#fff200', 0.88)}
                      stroke={alpha('#111111', 0.12)}
                      strokeWidth="2.5"
                    />
                  ))}
                </g>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* “cut” sweep */}
      <Box
        sx={{
          position: 'absolute',
          left: '-20%',
          right: '-20%',
          height: 70,
          bottom: -40,
          background: `linear-gradient(90deg, transparent 0%, ${alpha(
            '#111111',
            0.78,
          )} 18%, ${alpha('#fff200', 0.9)} 40%, ${alpha('#111111', 0.78)} 62%, transparent 100%)`,
          filter: `drop-shadow(0 22px 50px ${alpha('#111111', 0.16)})`,
          opacity: 0,
          animation: `stcCutSweep 1.25s cubic-bezier(0.2, 0.8, 0.2, 1) 2.55s 1 both`,
        }}
      />

      {/* Final "end" card rises from bottom */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          // Position at very bottom of slide
          bottom: { xs: 8, md: 12 },
          transform: 'translate(-50%, 120%) rotate(5deg) scale(0.92)',
          zIndex: 8,
          opacity: 0,
          animation: `stcEndCardDrop 720ms cubic-bezier(0.2, 0.9, 0.2, 1) 3.05s 1 both`,
          width: { xs: 'min(92vw, 560px)', md: 620 },
          pointerEvents: 'auto',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            px: 3.1,
            py: 2,
            borderRadius: 4,
            backgroundColor: alpha('#ffffff', 0.95),
            border: `3px solid ${alpha('#111111', 0.34)}`,
            boxShadow: `0 28px 80px ${alpha('#111111', 0.14)}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 1150,
              letterSpacing: '0.18em',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            THE END
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: alpha('#111111', 0.72), fontWeight: 950, textAlign: 'center', mt: 0.6 }}
          >
            Thank you for your attention
          </Typography>
        </Paper>

        {/* Small button appears after card settles */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1.5,
            opacity: 0,
            animation: `stcButtonAppear 400ms ease-out 3.8s 1 both`,
          }}
        >
          <Button
            component="a"
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="small"
            startIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2.5,
              px: 2.5,
              py: 0.9,
              fontSize: '0.85rem',
              backgroundColor: '#fff200',
              color: '#111111',
              boxShadow: `0 8px 24px ${alpha('#111111', 0.15)}`,
              transform: 'rotate(4deg)',
              '&:hover': {
                backgroundColor: '#e6d700',
                transform: 'rotate(4deg) scale(1.05)',
              },
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            Let's See Smart Tax Chain in Action
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const CallToActionPanel = ({ demoUrl }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        p: 0,
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${alpha('#111111', 0.08)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(
          '#fff200',
          0.18,
        )} 38%, #ffffff 100%)`,
      }}
    >
      <Box sx={{ p: 2.75, position: 'relative', zIndex: 1, flex: 1, minHeight: 0 }}>
        <Stack spacing={2.1} sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Chip
              label="LIVE DEMO"
              size="small"
              sx={{
                fontWeight: 950,
                borderRadius: 999,
                backgroundColor: alpha('#fff200', 0.26),
                border: `1px solid ${alpha('#fff200', 0.6)}`,
              }}
            />
            <Chip
              label="Ready to show"
              size="small"
              sx={{
                fontWeight: 900,
                borderRadius: 999,
                backgroundColor: alpha('#111111', 0.03),
                border: `1px solid ${alpha('#111111', 0.12)}`,
                color: alpha('#111111', 0.8),
              }}
            />
          </Stack>

          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha('#111111', 0.08)}`,
              backgroundColor: '#ffffff',
              boxShadow: `0 18px 50px ${alpha('#111111', 0.08)}`,
            }}
          >
            <CtaHeroArt />
          </Box>

          <Stack spacing={0.75}>
            <Typography variant="h5" sx={{ fontWeight: 1000, letterSpacing: '-0.3px' }}>
              Open Smart Tax Chain Live Demo
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#111111', 0.75) }}>
              Walk through the prototype and see how evidence becomes verifiable and traceable.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              component="a"
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                textTransform: 'none',
                fontWeight: 950,
                borderRadius: 999,
                py: 1.2,
                boxShadow: `0 18px 50px ${alpha(theme.palette.primary.main, 0.32)}`,
              }}
              fullWidth
            >
              Open live demo
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outlined"
              startIcon={<PictureAsPdf />}
              sx={{
                textTransform: 'none',
                fontWeight: 950,
                borderRadius: 999,
                py: 1.2,
                borderColor: alpha('#111111', 0.18),
                color: '#111111',
                '&:hover': {
                  borderColor: alpha('#111111', 0.28),
                  backgroundColor: alpha('#111111', 0.03),
                },
              }}
              fullWidth
            >
              Export deck (PDF)
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Paper
            elevation={0}
            sx={{
              p: 1.75,
              borderRadius: 3,
              backgroundColor: alpha('#ffffff', 0.82),
              border: `1px dashed ${alpha('#111111', 0.18)}`,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: alpha('#111111', 0.7) }}>
                Demo URL
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 900,
                  color: '#111111',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  wordBreak: 'break-all',
                }}
              >
                {demoUrl}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#111111', 0.7) }}>
                Tip: press <strong>F</strong> for fullscreen (ESC exits).
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Paper>
  );
};

const CtaBenefitCard = ({ icon, title, desc }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 4,
      borderTop: `3px solid ${alpha('#fff200', 0.95)}`,
      borderLeft: `1px solid ${alpha('#111111', 0.08)}`,
      borderRight: `1px solid ${alpha('#111111', 0.08)}`,
      borderBottom: `1px solid ${alpha('#111111', 0.08)}`,
      backgroundColor: '#ffffff',
      height: '100%',
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 999,
          backgroundColor: alpha('#fff200', 0.2),
          border: `1px solid ${alpha('#fff200', 0.55)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '& svg': { fontSize: 22, color: '#111111' },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 1000, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha('#111111', 0.72), lineHeight: 1.55, mt: 0.4 }}
        >
          {desc}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const CallToActionSlide = ({ demoUrl, isSlideActive = false }) => {
  const theme = useTheme();
  const [playKey, setPlayKey] = useState(0);
  const [showEndCard, setShowEndCard] = useState(false);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isSlideActive && !wasActiveRef.current) {
      setPlayKey((k) => k + 1);
      setShowEndCard(false);
      // Show end card after animation delay (3.05s)
      const timer = setTimeout(() => setShowEndCard(true), 3000);
      return () => clearTimeout(timer);
    }
    wasActiveRef.current = isSlideActive;
  }, [isSlideActive]);

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {isSlideActive ? <CtaEndAnimator playKey={playKey} demoUrl={demoUrl} /> : null}

      <Stack
        spacing={2.25}
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {/* Top-left title (matches the PPT screenshot style) */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 1000, letterSpacing: '-0.4px' }}>
            Call to Action
          </Typography>
          <Typography variant="subtitle2" sx={{ color: alpha('#111111', 0.72), mt: 0.5 }}>
            Let’s secure Tanzania’s revenue with Smart Tax Chain
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
          <Stack spacing={2.2} sx={{ width: '100%' }} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 1050,
                textAlign: 'center',
                letterSpacing: '-0.6px',
                lineHeight: 1.08,
              }}
            >
              Securing Tanzania’s Tax Revenue Starts Now
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: alpha('#111111', 0.74),
                maxWidth: 820,
              }}
            >
              Smart Tax Chain strengthens revenue protection by making critical tax records
              tamper‑evident, improving visibility, and enabling real-time verification across TRA
              workflows.
            </Typography>

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={4}>
                <CtaBenefitCard
                  icon={<Shield />}
                  title="Reliable"
                  desc="Immutable records ensure tax data cannot be manipulated or deleted."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CtaBenefitCard
                  icon={<Visibility />}
                  title="Transparent"
                  desc="Real-time visibility into transactions enhances accountability and oversight."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CtaBenefitCard
                  icon={<Lock />}
                  title="Immutable"
                  desc="Tamper-evident evidence blocks both internal and external fraud vectors."
                />
              </Grid>
            </Grid>

            {/* decorative center rail */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 680,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.4,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  backgroundColor: alpha('#e6d700', 0.65),
                  borderRadius: 999,
                }}
              />
              {[
                { icon: <Shield sx={{ fontSize: 18, color: '#111111' }} />, key: 'a' },
                { icon: <Lock sx={{ fontSize: 18, color: '#111111' }} />, key: 'b' },
                { icon: <TrackChanges sx={{ fontSize: 18, color: '#111111' }} />, key: 'c' },
              ].map((n) => (
                <Box
                  key={n.key}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    backgroundColor: alpha('#fff200', 0.22),
                    border: `2px solid ${alpha('#e6d700', 0.85)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 14px 40px ${alpha('#111111', 0.06)}`,
                  }}
                >
                  {n.icon}
                </Box>
              ))}
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  backgroundColor: alpha('#e6d700', 0.65),
                  borderRadius: 999,
                }}
              />
            </Box>

            {/* Button fades out when END card appears */}
            <Box
              sx={{
                opacity: showEndCard ? 0 : 1,
                transform: showEndCard ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                pointerEvents: showEndCard ? 'none' : 'auto',
              }}
            ></Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

const FlowNode = ({ title, subtitle, tone = 'neutral' }) => {
  const theme = useTheme();
  const bg =
    tone === 'primary'
      ? alpha(theme.palette.primary.main, 0.2)
      : tone === 'danger'
        ? alpha(theme.palette.error.main, 0.12)
        : alpha('#111111', 0.04);
  const border =
    tone === 'primary'
      ? alpha(theme.palette.primary.main, 0.45)
      : tone === 'danger'
        ? alpha(theme.palette.error.main, 0.25)
        : alpha('#111111', 0.12);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        borderRadius: 3,
        backgroundColor: bg,
        border: `1px solid ${border}`,
        minWidth: 170,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 950, color: '#111111' }}>
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: alpha('#111111', 0.7), display: 'block', mt: 0.25, lineHeight: 1.5 }}
      >
        {subtitle}
      </Typography>
    </Paper>
  );
};

const FlowArrow = () => (
  <Box sx={{ px: 1.25, color: alpha('#111111', 0.35), fontWeight: 900, fontSize: 22 }}>→</Box>
);

// Clean, professional SVG illustration - all text fits inside blocks, no overflow
const RootCauseSystemArt = ({ fullView = false }) => (
  <Box
    component="svg"
    viewBox="0 0 960 430"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
    sx={{
      width: fullView ? 'auto' : '100%',
      height: fullView ? '100%' : 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'block',
      flexShrink: 0,
    }}
  >
    <defs>
      <linearGradient id="rcBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#fffde7" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="rcY" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <linearGradient id="rcDanger" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <filter id="rcSh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.1" />
      </filter>
    </defs>

    {/* Background */}
    <rect x="0" y="0" width="960" height="430" rx="24" fill="url(#rcBg)" />

    {/* Top banner - CORE PROBLEM (same style as MANUAL CHECKS) */}
    <g transform="translate(20 -5)">
      <rect x="0" y="0" width="420" height="30" rx="15" fill="#111" opacity="0.9" />
      <text x="20" y="20" fontSize="13" fontWeight="950" fill="#fff200" fontFamily="system-ui">
        CORE PROBLEM: MUTABLE RECORDS + DELAYED VISIBILITY
      </text>
    </g>

    {/* LEFT COLUMN: Input sources */}
    <g filter="url(#rcSh)">
      <rect
        x="20"
        y="30"
        width="180"
        height="90"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <circle cx="60" cy="75" r="20" fill="#fff200" opacity="0.25" />
      <g
        transform="translate(47 61)"
        fill="none"
        stroke="#111"
        strokeOpacity="0.75"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M6 0 h14 v24 l-3-2 -3 2 -3-2 -3 2 -3-2 -3 2 z" />
        <path d="M9 8 h8" strokeOpacity="0.45" strokeLinecap="round" />
        <path d="M9 13 h10" strokeOpacity="0.35" strokeLinecap="round" />
      </g>
      <text x="90" y="65" fontSize="14" fontWeight="900" fill="#111" fontFamily="system-ui">
        EFD / POS events
      </text>
      <text x="90" y="85" fontSize="11" fill="#111" opacity="0.6" fontFamily="system-ui">
        Receipts + transactions
      </text>
    </g>

    <g filter="url(#rcSh)">
      <rect
        x="20"
        y="135"
        width="180"
        height="90"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <circle cx="60" cy="180" r="20" fill="#fff200" opacity="0.25" />
      <g
        transform="translate(46 167)"
        fill="none"
        stroke="#111"
        strokeOpacity="0.75"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M6 2 h15 a4 4 0 0 1 4 4 v16 a4 4 0 0 1-4 4 h-15 a4 4 0 0 1-4-4 v-16 a4 4 0 0 1 4-4 z" />
        <path d="M7 10 h14" strokeOpacity="0.45" strokeLinecap="round" />
        <path d="M7 15 h11" strokeOpacity="0.35" strokeLinecap="round" />
      </g>
      <text x="90" y="170" fontSize="14" fontWeight="900" fill="#111" fontFamily="system-ui">
        Declarations
      </text>
      <text x="90" y="190" fontSize="11" fill="#111" opacity="0.6" fontFamily="system-ui">
        Returns + filings
      </text>
    </g>

    <g filter="url(#rcSh)">
      <rect
        x="20"
        y="240"
        width="180"
        height="90"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <circle cx="60" cy="285" r="20" fill="#fff200" opacity="0.25" />
      <g
        transform="translate(46 273)"
        fill="none"
        stroke="#111"
        strokeOpacity="0.75"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M4 8 h22" />
        <path d="M6 16 h18" strokeOpacity="0.55" />
      </g>
      <text x="90" y="275" fontSize="14" fontWeight="900" fill="#111" fontFamily="system-ui">
        Other sources
      </text>
      <text x="90" y="295" fontSize="11" fill="#111" opacity="0.6" fontFamily="system-ui">
        Payments / Adjustments
      </text>
    </g>

    {/* Arrows: inputs → core */}
    <g stroke="#111" strokeOpacity="0.25" strokeWidth="3" fill="none">
      <path d="M200 75 L250 75 L250 200 L290 200" />
      <path d="M200 180 L250 180 L250 200 L290 200" />
      <path d="M200 285 L250 285 L250 200 L290 200" />
      <polygon points="290,195 305,200 290,205" fill="#111" fillOpacity="0.25" />
    </g>

    {/* CENTER: Core system */}
    <g filter="url(#rcSh)">
      <rect
        x="305"
        y="60"
        width="300"
        height="200"
        rx="20"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.12"
        strokeWidth="2"
      />
      {/* Dotted red border to highlight issue area */}
      <rect
        x="305"
        y="60"
        width="300"
        height="200"
        rx="20"
        fill="none"
        stroke="#f28b82"
        strokeOpacity="0.85"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Header with cream background */}
      <rect
        x="330"
        y="80"
        width="250"
        height="42"
        rx="12"
        fill="#fffde7"
        stroke="#e6d700"
        strokeWidth="1"
      />
      <text
        x="455"
        y="100"
        fontSize="14"
        fontWeight="900"
        fill="#111"
        textAnchor="middle"
        fontFamily="system-ui"
      >
        CORE TAX SYSTEM (TODAY)
      </text>
      <text
        x="455"
        y="116"
        fontSize="10"
        fill="#111"
        opacity="0.55"
        textAnchor="middle"
        fontFamily="system-ui"
      >
        Records stored in a mutable database
      </text>

      {/* Database icon - danger color */}
      <g
        transform="translate(345 130)"
        stroke="#e53935"
        strokeOpacity="0.85"
        strokeWidth="3"
        fill="none"
      >
        <ellipse cx="35" cy="10" rx="32" ry="10" />
        <path d="M3 10 v50 c0 6 14 12 32 12 s32-6 32-12 V10" />
        <path d="M3 32 c0 6 14 12 32 12 s32-6 32-12" opacity="0.6" />
      </g>

      {/* Edit tag - dark charcoal */}
      <g transform="translate(460 135)">
        <rect x="0" y="0" width="110" height="28" rx="14" fill="#4a4a4a" />
        <text x="14" y="19" fontSize="11" fontWeight="900" fill="#ffffff" fontFamily="system-ui">
          EDIT AFTER SAVE
        </text>
        <animate attributeName="opacity" values="0.85;1;0.85" dur="1.5s" repeatCount="indefinite" />
      </g>

      {/* Evidence callout */}
      <g transform="translate(440 175)">
        <rect
          x="0"
          y="0"
          width="175"
          height="55"
          rx="12"
          fill="#fffde7"
          stroke="#e6d700"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <text x="14" y="22" fontSize="11" fontWeight="900" fill="#111" fontFamily="system-ui">
          Evidence is weak
        </text>
        <text x="14" y="40" fontSize="9" fill="#111" opacity="0.6" fontFamily="system-ui">
          Hard to prove who/when changed
        </text>
      </g>
    </g>

    {/* Arrow: core → outcomes */}
    <g stroke="#111" strokeOpacity="0.25" strokeWidth="3" fill="none">
      <path d="M605 160 L650 160" />
      <polygon points="650,155 665,160 650,165" fill="#111" fillOpacity="0.25" />
    </g>

    {/* RIGHT COLUMN: Outcomes */}
    <g filter="url(#rcSh)">
      <rect
        x="680"
        y="60"
        width="260"
        height="100"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <rect x="700" y="78" width="110" height="24" rx="12" fill="#111" opacity="0.9" />
      <text x="712" y="95" fontSize="10" fontWeight="900" fill="#fff200" fontFamily="system-ui">
        MANUAL CHECKS
      </text>
      <text x="700" y="125" fontSize="12" fontWeight="900" fill="#111" fontFamily="system-ui">
        Verification
      </text>
      <text x="700" y="145" fontSize="10" fill="#111" opacity="0.6" fontFamily="system-ui">
        Cross-check + rework
      </text>
    </g>

    {/* Arrow down */}
    <g stroke="#111" strokeOpacity="0.25" strokeWidth="3" fill="none">
      <path d="M810 160 L810 190" />
      <polygon points="805,190 810,205 815,190" fill="#111" fillOpacity="0.25" />
    </g>

    <g filter="url(#rcSh)">
      <rect
        x="680"
        y="210"
        width="260"
        height="120"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <rect
        x="700"
        y="228"
        width="90"
        height="24"
        rx="12"
        fill="#fffde7"
        stroke="#e6d700"
        strokeWidth="1"
      />
      <text x="714" y="245" fontSize="10" fontWeight="900" fill="#111" fontFamily="system-ui">
        LATE AUDIT
      </text>
      <text x="700" y="275" fontSize="12" fontWeight="900" fill="#111" fontFamily="system-ui">
        Discovery window
      </text>
      <text x="700" y="295" fontSize="10" fill="#111" opacity="0.6" fontFamily="system-ui">
        30–180 days
      </text>
      <text x="700" y="315" fontSize="10" fill="#111" opacity="0.6" fontFamily="system-ui">
        Disputes + late recovery
      </text>
    </g>

    {/* Bottom timeline */}
    <g filter="url(#rcSh)">
      <rect
        x="20"
        y="355"
        width="920"
        height="60"
        rx="16"
        fill="#fff"
        stroke="#111"
        strokeOpacity="0.1"
      />
      <path
        d="M80 385 H880"
        stroke="#111"
        strokeOpacity="0.15"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {[
        { x: 120, label: 'Day 0', sub: 'Saved', danger: false },
        { x: 480, label: 'Day 1', sub: 'Silent edit', danger: true },
        { x: 820, label: 'Day 30+', sub: 'Audit late', danger: true },
      ].map((m) => (
        <g key={m.label}>
          <circle
            cx={m.x}
            cy="385"
            r="8"
            fill="#fff200"
            stroke="#111"
            strokeOpacity={0.15}
            strokeWidth="2"
          />
          <text
            x={m.x}
            y="377"
            fontSize="10"
            fontWeight="900"
            fill="#111"
            textAnchor="middle"
            fontFamily="system-ui"
          >
            {m.label}
          </text>
          <text
            x={m.x}
            y="405"
            fontSize="9"
            fill="#111"
            opacity={0.6}
            fontWeight={400}
            textAnchor="middle"
            fontFamily="system-ui"
          >
            {m.sub}
          </text>
        </g>
      ))}
    </g>
  </Box>
);

// Slide 2 content with toggle between one-side and full-side views
const RootCauseSlideContent = ({ illustrationFull = false, onToggleIllustration }) => {
  const handleToggle = onToggleIllustration || (() => {});

  const toggleBtn = (
    <Button
      size="small"
      variant="outlined"
      onClick={handleToggle}
      startIcon={illustrationFull ? <FullscreenExit /> : <Fullscreen />}
      sx={{
        textTransform: 'none',
        fontWeight: 800,
        borderColor: alpha('#111111', 0.2),
        color: alpha('#111111', 0.8),
        flexShrink: 0,
      }}
    >
      {illustrationFull ? '' : ''}
    </Button>
  );

  // Full diagram view - illustration fills the content area (constrained to not overflow header/footer)
  if (illustrationFull) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          maxHeight: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Toggle button overlay */}
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>{toggleBtn}</Box>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minHeight: 0,
            maxHeight: '100%',
            overflow: 'hidden',
            borderRadius: 3,
            border: `1px solid ${alpha('#111111', 0.08)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
        >
          <RootCauseSystemArt fullView />
        </Paper>
      </Box>
    );
  }

  // Split view - text on left, illustration on right
  return (
    <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ height: '100%', minHeight: 0 }}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.25, sm: 1.5, md: 2 },
            borderRadius: { xs: 2, md: 3 },
            border: `1px solid ${alpha('#111111', 0.08)}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: { xs: 1, md: 2 }, flexShrink: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 950, fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.25rem' } }}
            >
              Pain today (root cause)
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  width: { xs: 8, md: 10 },
                  height: { xs: 8, md: 10 },
                  borderRadius: 999,
                  backgroundColor: '#fff200',
                  boxShadow: `0 0 0 4px ${alpha('#e6d700', 0.25)}`,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 950,
                  letterSpacing: '0.08em',
                  color: alpha('#111111', 0.62),
                  lineHeight: 1,
                  fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
                }}
              >
                Mutable records + late visibility → weak evidence
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={{ xs: 1, sm: 1.5, md: 2.2 }} sx={{ flex: 1, minHeight: 0 }}>
            <BulletItem
              spacing={0.75}
              icon={<EditNote sx={{ color: '#111111', fontSize: { xs: 16, sm: 18, md: 20 } }} />}
              iconBoxSx={{
                width: { xs: 24, sm: 28, md: 30 },
                height: { xs: 24, sm: 28, md: 30 },
                borderRadius: 2,
              }}
              textSx={{
                fontSize: { xs: 11, sm: 12, md: 13.5 },
                lineHeight: 1.45,
                color: alpha('#111111', 0.8),
              }}
              text="Silent edits after submission are possible"
            />
            <BulletItem
              spacing={0.75}
              icon={<Lock sx={{ color: '#111111', fontSize: { xs: 16, sm: 18, md: 20 } }} />}
              iconBoxSx={{
                width: { xs: 24, sm: 28, md: 30 },
                height: { xs: 24, sm: 28, md: 30 },
                borderRadius: 2,
              }}
              textSx={{
                fontSize: { xs: 11, sm: 12, md: 13.5 },
                lineHeight: 1.45,
                color: alpha('#111111', 0.8),
              }}
              text="Proof is weak (who/when/what is hard to prove)"
            />
            <BulletItem
              spacing={0.75}
              icon={
                <VisibilityOff sx={{ color: '#111111', fontSize: { xs: 16, sm: 18, md: 20 } }} />
              }
              iconBoxSx={{
                width: { xs: 24, sm: 28, md: 30 },
                height: { xs: 24, sm: 28, md: 30 },
                borderRadius: 2,
              }}
              textSx={{
                fontSize: { xs: 11, sm: 12, md: 13.5 },
                lineHeight: 1.45,
                color: alpha('#111111', 0.8),
              }}
              text="Detection is late — often 30–180 days"
            />
            <BulletItem
              spacing={0.75}
              icon={<FactCheck sx={{ color: '#111111', fontSize: { xs: 16, sm: 18, md: 20 } }} />}
              iconBoxSx={{
                width: { xs: 24, sm: 28, md: 30 },
                height: { xs: 24, sm: 28, md: 30 },
                borderRadius: 2,
              }}
              textSx={{
                fontSize: { xs: 11, sm: 12, md: 13.5 },
                lineHeight: 1.45,
                color: alpha('#111111', 0.8),
              }}
              text="Cases become manual cross-check + rework"
            />
            <BulletItem
              spacing={0.75}
              icon={<Timer sx={{ color: '#111111', fontSize: { xs: 16, sm: 18, md: 20 } }} />}
              iconBoxSx={{
                width: { xs: 24, sm: 28, md: 30 },
                height: { xs: 24, sm: 28, md: 30 },
                borderRadius: 2,
              }}
              textSx={{
                fontSize: { xs: 11, sm: 12, md: 13.5 },
                lineHeight: 1.45,
                color: alpha('#111111', 0.8),
              }}
              text="Outcome: bigger fraud window + delayed recovery"
            />
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} sx={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1,
            borderRadius: 3,
            border: `1px solid ${alpha('#111111', 0.08)}`,
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Toggle button overlay */}
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>{toggleBtn}</Box>
          <RootCauseSystemArt fullView={false} />
        </Paper>
      </Grid>
    </Grid>
  );
};

const AuditDelayFlowArt = () => (
  <Box
    component="svg"
    viewBox="0 0 1000 420"
    aria-hidden="true"
    sx={{ width: '100%', height: '100%', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcDl2Bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fffde7" />
      </linearGradient>
      <linearGradient id="stcDl2Y" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
      <filter id="stcDl2Shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000000" floodOpacity="0.12" />
      </filter>
    </defs>

    <rect x="0" y="0" width="1000" height="420" rx="28" fill="url(#stcDl2Bg)" />

    {/* headers */}
    <g transform="translate(40 40)">
      <text x="0" y="0" fontSize="22" fontWeight="950" fill="#111111" opacity="0.9">
        Audit & compliance delays
      </text>
      <text x="0" y="28" fontSize="15" fontWeight="800" fill="#111111" opacity="0.62">
        Today: long manual cycles (manual verification + delayed recovery)
      </text>
    </g>

    {/* lane cards */}
    <g transform="translate(40 92)" filter="url(#stcDl2Shadow)">
      <rect x="0" y="0" width="920" height="132" rx="22" fill="#ffffff" opacity="0.96" />
      <rect x="0" y="0" width="920" height="10" rx="22" fill="#111111" opacity="0.16" />
      <text x="18" y="36" fontSize="18" fontWeight="950" fill="#111111" opacity="0.86">
        TODAY (manual verification)
      </text>

      {/* timeline */}
      <path
        d="M120 82 H800"
        stroke="#111111"
        strokeOpacity="0.18"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {[
        { x: 150, t: 'Day 1', s: 'Submission' },
        { x: 420, t: 'Day 30–180', s: 'Processing / checks' },
        { x: 720, t: 'Day 180+', s: 'Resolution / recovery' },
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.x} 82)`}>
          <circle cx="0" cy="0" r="18" fill="#111111" opacity="0.18" />
          <circle cx="0" cy="0" r="10" fill="#111111" opacity="0.78" />
          <text
            x="0"
            y="44"
            textAnchor="middle"
            fontSize="14"
            fontWeight="900"
            fill="#111111"
            opacity="0.78"
          >
            {n.t}
          </text>
          <text
            x="0"
            y="64"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#111111"
            opacity="0.58"
          >
            {n.s}
          </text>
        </g>
      ))}
    </g>

    {/* pain callout */}
    <g transform="translate(520 392)">
      <rect x="0" y="0" width="440" height="24" rx="12" fill="#ffffff" opacity="0.92" />
      <rect
        x="0"
        y="0"
        width="440"
        height="24"
        rx="12"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.1"
      />
      <text x="14" y="16" fontSize="13" fontWeight="900" fill="#111111" opacity="0.72">
        Outcome: delayed recovery + bigger fraud window + weaker control
      </text>
    </g>
  </Box>
);

const MiniFraudAttacksArt = () => (
  <Box
    component="svg"
    viewBox="0 0 640 360"
    aria-hidden="true"
    sx={{ width: '100%', height: 'auto', display: 'block' }}
  >
    <defs>
      <linearGradient id="stcFr2Bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fffde7" />
      </linearGradient>
      <linearGradient id="stcFr2Y" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff200" />
        <stop offset="1" stopColor="#e6d700" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="640" height="360" rx="28" fill="url(#stcFr2Bg)" />

    {/* two lanes */}
    <g transform="translate(34 42)">
      <rect x="0" y="0" width="270" height="276" rx="22" fill="#ffffff" opacity="0.95" />
      <rect x="0" y="0" width="270" height="10" rx="22" fill="#111111" opacity="0.16" />
      <text x="18" y="34" fontSize="16" fontWeight="950" fill="#111111" opacity="0.85">
        External attack
      </text>
      <text x="18" y="58" fontSize="12" fontWeight="800" fill="#111111" opacity="0.62">
        Zappers / device tampering
      </text>

      {[
        { y: 86, t: 'Install suppression tool', s: 'Interposes at POS/EFD' },
        { y: 146, t: 'Alter receipts / sales', s: 'Under-report transactions' },
        { y: 206, t: 'False reporting', s: 'TRA sees incomplete data' },
      ].map((x, i) => (
        <g key={i} transform={`translate(18 ${x.y})`}>
          <rect x="0" y="0" width="234" height="44" rx="14" fill="#ffffff" />
          <rect
            x="0"
            y="0"
            width="234"
            height="44"
            rx="14"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <circle cx="18" cy="22" r="6" fill="#ef4444" opacity="0.85" />
          <text x="34" y="20" fontSize="13" fontWeight="950" fill="#111111" opacity="0.85">
            {x.t}
          </text>
          <text x="34" y="35" fontSize="11" fontWeight="800" fill="#111111" opacity="0.58">
            {x.s}
          </text>
        </g>
      ))}
    </g>

    <g transform="translate(336 42)">
      <rect x="0" y="0" width="270" height="276" rx="22" fill="#ffffff" opacity="0.95" />
      <rect x="0" y="0" width="270" height="10" rx="22" fill="#111111" opacity="0.16" />
      <text x="18" y="34" fontSize="16" fontWeight="950" fill="#111111" opacity="0.85">
        Internal attack
      </text>
      <text x="18" y="58" fontSize="12" fontWeight="800" fill="#111111" opacity="0.62">
        Insider edits / back-office abuse
      </text>

      {[
        { y: 86, t: 'Privileged access', s: 'Staff/admin capability' },
        { y: 146, t: 'Edit liabilities', s: 'Reduce declared tax' },
        { y: 206, t: 'Delete penalties', s: 'Hard to prove later' },
      ].map((x, i) => (
        <g key={i} transform={`translate(18 ${x.y})`}>
          <rect x="0" y="0" width="234" height="44" rx="14" fill="#ffffff" />
          <rect
            x="0"
            y="0"
            width="234"
            height="44"
            rx="14"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <circle cx="18" cy="22" r="6" fill="#ef4444" opacity="0.85" />
          <text x="34" y="20" fontSize="13" fontWeight="950" fill="#111111" opacity="0.85">
            {x.t}
          </text>
          <text x="34" y="35" fontSize="11" fontWeight="800" fill="#111111" opacity="0.58">
            {x.s}
          </text>
        </g>
      ))}
    </g>

    {/* convergence to Smart Tax Chain */}
    <path
      d="M170 322 C 220 340, 270 340, 320 330 C 370 340, 420 340, 470 322"
      fill="none"
      stroke="#111111"
      strokeOpacity="0.18"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="6 10"
    />
    <g transform="translate(200 300)">
      <rect x="0" y="0" width="240" height="46" rx="18" fill="url(#stcFr2Y)" opacity="0.35" />
      <rect x="0" y="0" width="240" height="46" rx="18" fill="#ffffff" opacity="0.92" />
      <rect x="0" y="0" width="240" height="8" rx="18" fill="url(#stcFr2Y)" opacity="0.9" />
      <text x="18" y="32" fontSize="14" fontWeight="950" fill="#111111" opacity="0.86">
        Smart Tax Chain: tamper-evident proof
      </text>
    </g>
  </Box>
);

const FraudAttackFlowArt = () => {
  const theme = useTheme();
  const danger = theme.palette.error.main;
  const ink = '#111111';
  const muted = alpha('#111111', 0.62);
  const stepsL = [
    { t: 'Install Zapper', s: 'Intercepts POS/EFD layer' },
    { t: 'Suppress sales', s: 'Receipts changed / removed' },
    { t: 'Impact', s: 'Under-reporting reaches TRA late' },
  ];
  const stepsR = [
    { t: 'Privilege access', s: 'Back-office/admin rights' },
    { t: 'Edit records', s: 'Liability/penalty changes' },
    { t: 'Impact', s: 'Hard to prove later' },
  ];

  const StepBox = ({ x, y, w, h, t, s }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={w} height={h} rx="18" fill="#ffffff" opacity="0.98" />
      <rect x="0" y="0" width={w} height="10" rx="18" fill={danger} opacity="0.9" />
      <text x="16" y="40" fontSize="20" fontWeight="950" fill={ink} opacity="0.88">
        {t}
      </text>
      <text x="16" y="68" fontSize="15" fontWeight="800" fill={ink} opacity="0.62">
        {s}
      </text>
    </g>
  );

  const Arrow = ({ x1, y1, x2, y2 }) => (
    <g>
      <path
        d={`M ${x1} ${y1} C ${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke={ink}
        strokeOpacity="0.22"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="7 10"
      />
      <circle cx={x2} cy={y2} r="6" fill="#fff200" />
      <circle cx={x2} cy={y2} r="12" fill="#fff200" opacity="0.18" />
    </g>
  );

  return (
    <Box
      component="svg"
      viewBox="0 0 1000 420"
      aria-hidden="true"
      sx={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="stcAtkBg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fffde7" />
        </linearGradient>
        <linearGradient id="stcAtkY2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff200" />
          <stop offset="1" stopColor="#e6d700" />
        </linearGradient>
        <filter id="stcAtkShadow2" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="0" y="0" width="1000" height="420" rx="28" fill="url(#stcAtkBg2)" />

      {/* Titles */}
      <g transform="translate(40 38)">
        <text x="0" y="0" fontSize="22" fontWeight="950" fill={ink} opacity="0.9">
          External attacker
        </text>
        <text x="0" y="28" fontSize="15" fontWeight="800" fill={ink} opacity="0.62">
          Zappers / device tampering
        </text>
      </g>
      <g transform="translate(540 38)">
        <text x="0" y="0" fontSize="22" fontWeight="950" fill={ink} opacity="0.9">
          Internal attacker
        </text>
        <text x="0" y="28" fontSize="15" fontWeight="800" fill={ink} opacity="0.62">
          Insider edits / back-office abuse
        </text>
      </g>

      {/* Attacker icons */}
      <g transform="translate(70 92)" filter="url(#stcAtkShadow2)">
        <circle cx="55" cy="55" r="46" fill={ink} opacity="0.08" />
        <path d="M20 62 Q55 20 90 62" fill={ink} opacity="0.85" />
        <circle cx="55" cy="58" r="18" fill="#fffde7" />
        <rect x="28" y="76" width="54" height="26" rx="13" fill={ink} opacity="0.85" />
        <text
          x="55"
          y="130"
          textAnchor="middle"
          fontSize="13"
          fontWeight="950"
          fill={ink}
          opacity="0.68"
        >
          Attacker
        </text>
      </g>
      <g transform="translate(570 92)" filter="url(#stcAtkShadow2)">
        <circle cx="55" cy="55" r="46" fill={ink} opacity="0.08" />
        <circle cx="55" cy="56" r="18" fill="#fffde7" />
        <rect x="24" y="78" width="62" height="24" rx="12" fill={ink} opacity="0.85" />
        <rect x="22" y="104" width="66" height="6" rx="3" fill={ink} opacity="0.18" />
        <text
          x="55"
          y="130"
          textAnchor="middle"
          fontSize="13"
          fontWeight="950"
          fill={ink}
          opacity="0.68"
        >
          Insider
        </text>
      </g>

      {/* Steps (left lane) */}
      {stepsL.map((s, i) => (
        <StepBox key={`l-${i}`} x={170} y={94 + i * 104} w={300} h={90} t={s.t} s={s.s} />
      ))}
      {/* Steps (right lane) */}
      {stepsR.map((s, i) => (
        <StepBox key={`r-${i}`} x={670} y={94 + i * 104} w={300} h={90} t={s.t} s={s.s} />
      ))}

      {/* Vulnerable system (today) */}
      <g transform="translate(470 156)" filter="url(#stcAtkShadow2)">
        <rect x="0" y="0" width="60" height="116" rx="20" fill="#ffffff" opacity="0.96" />
        <rect x="0" y="0" width="60" height="10" rx="20" fill={danger} opacity="0.85" />
        <path
          d="M30 34 L45 42 L45 60 Q45 80 30 92 Q15 80 15 60 L15 42 Z"
          fill={danger}
          opacity="0.14"
          stroke={ink}
          strokeOpacity="0.16"
        />
        <text
          x="30"
          y="78"
          textAnchor="middle"
          fontSize="10"
          fontWeight="950"
          fill={ink}
          opacity="0.72"
        >
          SYSTEM
        </text>
        <text
          x="30"
          y="96"
          textAnchor="middle"
          fontSize="9"
          fontWeight="900"
          fill={ink}
          opacity="0.55"
        >
          Weak
        </text>
      </g>

      {/* Arrows: attacker → steps → (weak system) → steps */}
      <Arrow x1={125} y1={146} x2={170} y2={140} />
      <Arrow x1={470} y1={140} x2={520} y2={140} />
      <Arrow x1={520} y1={140} x2={670} y2={140} />

      <Arrow x1={470} y1={244} x2={520} y2={244} />
      <Arrow x1={520} y1={244} x2={670} y2={244} />

      <Arrow x1={470} y1={348} x2={520} y2={348} />
      <Arrow x1={520} y1={348} x2={670} y2={348} />

      {/* Footer label */}
      <g transform="translate(360 388)">
        <rect x="0" y="0" width="280" height="26" rx="13" fill="#ffffff" opacity="0.92" />
        <rect
          x="0"
          y="0"
          width="280"
          height="26"
          rx="13"
          fill="none"
          stroke={ink}
          strokeOpacity="0.10"
        />
        <text x="14" y="18" fontSize="13" fontWeight="900" fill={ink} opacity="0.72">
          Result: manipulation stays hidden until late audit (disputes + delayed recovery)
        </text>
      </g>
    </Box>
  );
};

const FraudAttackDiagram = () => {
  const theme = useTheme();
  const Step = ({ title, desc }) => (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
        backgroundColor: alpha('#ffffff', 0.95),
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 950, color: alpha('#111111', 0.86) }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: alpha('#111111', 0.68), lineHeight: 1.55, mt: 0.25, fontSize: 13 }}
      >
        {desc}
      </Typography>
    </Paper>
  );

  const Lane = ({ label, sub, steps }) => (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        borderRadius: 3,
        border: `1px solid ${alpha('#111111', 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.error.main,
          0.06,
        )} 0%, #ffffff 60%)`,
        height: '100%',
      }}
    >
      <Typography
        variant="overline"
        sx={{ fontWeight: 950, letterSpacing: 1.3, color: alpha('#111111', 0.7) }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: alpha('#111111', 0.68), mt: 0.25, lineHeight: 1.55 }}
      >
        {sub}
      </Typography>
      <Stack spacing={1} sx={{ mt: 1.1 }}>
        {steps.map((s, i) => (
          <Box key={s.title} sx={{ display: 'grid', gap: 1 }}>
            <Step title={`${i + 1}. ${s.title}`} desc={s.desc} />
            {i < steps.length - 1 ? (
              <Box
                sx={{
                  color: alpha('#111111', 0.35),
                  fontWeight: 950,
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                ↓
              </Box>
            ) : null}
          </Box>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Stack spacing={1.25}>
      <FraudAttackFlowArt />

      <Grid container spacing={1.25}>
        <Grid item xs={12} md={6}>
          <Lane
            label="External fraud path"
            sub="Zappers + device tampering suppress sales before TRA sees them."
            steps={[
              { title: 'Entry point', desc: 'Suppression tool installed at POS/EFD layer.' },
              {
                title: 'Manipulation',
                desc: 'Receipts altered / transactions removed or reduced.',
              },
              { title: 'Result', desc: 'Under-reporting + delayed detection during audits.' },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Lane
            label="Internal fraud path"
            sub="Insider edits change liabilities/penalties without defensible evidence."
            steps={[
              { title: 'Privileged access', desc: 'Back-office roles can edit taxpayer records.' },
              {
                title: 'Silent change',
                desc: 'Liabilities reduced / penalties changed or deleted.',
              },
              { title: 'Result', desc: 'Hard to prove the “who/when/what changed” later.' },
            ]}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.16),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 950 }}>
          How Smart Tax Chain stops both
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha('#111111', 0.72), mt: 0.25, lineHeight: 1.6 }}
        >
          Every critical tax event becomes <strong>tamper-evident evidence</strong> (hash +
          signature) anchored to an immutable ledger, enabling faster detection and defensible
          enforcement.
        </Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mt: 1.25 }}>
          <FlowNode tone="primary" title="Capture" subtitle="Tax event recorded" />
          <FlowArrow />
          <FlowNode tone="primary" title="Proof" subtitle="Hash + signature" />
          <FlowArrow />
          <FlowNode tone="primary" title="Ledger" subtitle="Immutable anchor" />
          <FlowArrow />
          <FlowNode tone="primary" title="Verify" subtitle="Real-time checks" />
        </Stack>
      </Paper>
    </Stack>
  );
};

const CoverHeroArt = () => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      animation: 'stcFloat 6s ease-in-out infinite',
      '@keyframes stcFloat': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
      },
    }}
  >
    <Box
      component="svg"
      viewBox="0 0 640 420"
      role="img"
      aria-label="Smart Tax Chain illustration"
      sx={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="stcY" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff200" />
          <stop offset="1" stopColor="#e6d700" />
        </linearGradient>
        <linearGradient id="stcInk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#111111" stopOpacity="0.9" />
          <stop offset="1" stopColor="#111111" stopOpacity="0.6" />
        </linearGradient>
        <filter id="stcShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="10" result="o" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.18" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* background halo */}
      <circle cx="240" cy="160" r="150" fill="url(#stcY)" opacity="0.14" />
      <circle cx="450" cy="250" r="170" fill="url(#stcY)" opacity="0.1" />

      {/* connection lines */}
      <path
        d="M120 190 C210 120, 300 120, 360 155"
        stroke="#111111"
        strokeOpacity="0.25"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-32"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M360 155 C430 190, 490 230, 530 295"
        stroke="#111111"
        strokeOpacity="0.22"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6 10"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-32"
          dur="2.9s"
          repeatCount="indefinite"
        />
      </path>

      {/* node pulses */}
      {[
        { x: 120, y: 190, d: '2.4s' },
        { x: 360, y: 155, d: '2.1s' },
        { x: 530, y: 295, d: '2.7s' },
      ].map((n) => (
        <g key={`${n.x}-${n.y}`}>
          <circle cx={n.x} cy={n.y} r="7" fill="#fff200" />
          <circle cx={n.x} cy={n.y} r="7" fill="#fff200" opacity="0.35">
            <animate attributeName="r" values="7;18" dur={n.d} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0" dur={n.d} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* block 1 */}
      <g filter="url(#stcShadow)">
        <rect
          x="70"
          y="230"
          width="170"
          height="140"
          rx="18"
          fill="#ffffff"
          stroke="#111111"
          strokeOpacity="0.12"
        />
        <rect x="90" y="254" width="130" height="16" rx="8" fill="url(#stcInk)" opacity="0.85" />
        <rect x="90" y="278" width="110" height="10" rx="5" fill="#111111" opacity="0.25" />
        <rect x="90" y="296" width="120" height="10" rx="5" fill="#111111" opacity="0.22" />
        <rect x="90" y="314" width="80" height="10" rx="5" fill="#111111" opacity="0.18" />
        <rect x="90" y="338" width="90" height="20" rx="10" fill="url(#stcY)" opacity="0.22" />
        <text
          x="135"
          y="353"
          fontSize="12"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill="#111111"
        >
          RECEIPT
        </text>
      </g>

      {/* block 2 (ledger) */}
      <g filter="url(#stcShadow)">
        <rect
          x="250"
          y="70"
          width="220"
          height="190"
          rx="22"
          fill="#ffffff"
          stroke="#111111"
          strokeOpacity="0.12"
        />
        <rect x="270" y="92" width="180" height="26" rx="13" fill="url(#stcY)" opacity="0.35" />
        <text
          x="290"
          y="110"
          fontSize="12"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fill="#111111"
        >
          LIVE LEDGER
        </text>

        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x="270"
              y={132 + i * 28}
              width="180"
              height="16"
              rx="8"
              fill="#111111"
              opacity={0.12 + i * 0.03}
            />
            <circle cx="448" cy={140 + i * 28} r="5" fill="#22c55e" opacity="0.85" />
          </g>
        ))}

        {/* moving highlight */}
        <rect x="270" y="132" width="180" height="16" rx="8" fill="url(#stcY)" opacity="0.18">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 84;0 0"
            dur="3.4s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* shield */}
      <g filter="url(#stcShadow)">
        <path
          d="M540 95 L595 120 L595 185 Q595 235 540 260 Q485 235 485 185 L485 120 Z"
          fill="url(#stcY)"
          opacity="0.95"
          stroke="#111111"
          strokeOpacity="0.18"
        />
        <path
          d="M540 115 L575 133 L575 185 Q575 215 540 235 Q505 215 505 185 L505 133 Z"
          fill="#fffde7"
        />
        <path
          d="M525 175 L538 188 L560 164"
          fill="none"
          stroke="#111111"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.4;1;0.4"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </Box>
  </Box>
);

export default function SmartTaxChainPresentation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const fullscreenElRef = useRef(null);
  const deckRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rootCauseFullView, setRootCauseFullView] = useState(false);
  const [platformMapFullView, setPlatformMapFullView] = useState(false);
  const presentationDate = useMemo(() => {
    const d = new Date();
    return {
      full: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      short: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
  }, []);

  const demoUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/auth/login';
    try {
      return new URL('/auth/login', window.location.origin).toString();
    } catch {
      return '/auth/login';
    }
  }, []);

  const slides = useMemo(
    () => [
      {
        title: 'SMART TAX CHAIN',
        subtitle: "Revolutionizing Tanzania's Tax Administration",
        body: [
          'Blockchain-Based Solution for Enhanced Data Integrity, Trust, and Operational Efficiency',
          'Tanzania Revenue Authority',
          `Date: ${presentationDate.full}`,
        ],
      },
      {
        title: 'Root Cause: System Architecture Weakness',
        subtitle: 'The same tax record can change after submission — and oversight sees it late',
        body: [
          'Silent edits are possible after submission (mutable records).',
          'Visibility comes late (often 30–180 days) — evidence is weaker and recovery is delayed.',
        ],
        pills: [
          { icon: <EditNote />, label: 'Mutable records' },
          { icon: <VisibilityOff />, label: 'Late visibility' },
          { icon: <Lock />, label: 'Weak evidence' },
          { icon: <Gavel />, label: 'Harder decisions' },
        ],
        content: (
          <RootCauseSlideContent
            illustrationFull={rootCauseFullView}
            onToggleIllustration={() => setRootCauseFullView((v) => !v)}
          />
        ),
      },
      {
        title: 'Current Tax System Challenges',
        subtitle: "Three critical issues plaguing Tanzania's tax system",
        cards: [
          {
            icon: <WarningAmber sx={{ color: '#111111' }} />,
            title: 'Tax Evasion',
            illustration: <MiniEvasionArt />,
            lines: [
              'Tanzania loses 1.3% of GDP annually',
              'Approximately USD 1 Billion (TZS 3 Trillion)',
            ],
          },
          {
            icon: <BugReport sx={{ color: '#111111' }} />,
            title: 'System Fraud',
            illustration: <MiniFraudArt />,
            lines: [
              'External attacks via Zappers',
              'EFD Transaction',
              'Africa loses USD 50–60 Billion annually',
            ],
          },
          {
            icon: <Timer sx={{ color: '#111111' }} />,
            title: 'Audit & Compliance Delays',
            illustration: <MiniDelayArt />,
            lines: [
              'Audit cycles: 30–180 days',
              'Delayed detection = delayed recovery',
              'Manual cross-checking reduces transparency',
            ],
          },
        ],
        focus: {
          autoAdvance: false,
          autoAdvanceMs: 6500,
          items: [
            {
              title: 'Tax Evasion',
              kicker: 'Evidence from national briefing',
              lead: 'Revenue leakage is driven by non-issuance of receipts, under-reporting, and record manipulation—creating an unfair burden on compliant taxpayers.',
              bullets: [
                {
                  icon: <ReceiptLong sx={{ color: '#111111' }} />,
                  text: 'Common methods: failure to issue receipts, under-reporting sales, manipulation of records',
                },
                {
                  icon: <VisibilityOff sx={{ color: '#111111' }} />,
                  text: 'Informal activity + hidden income reduces visibility and enforcement strength',
                },
                {
                  icon: <Savings sx={{ color: '#111111' }} />,
                  text: 'Tax-to-GDP gap signals leakage (13.7% vs SSA average 15%)',
                },
                {
                  icon: <FactCheck sx={{ color: '#111111' }} />,
                  text: 'Impact: reduced collections constrain funding for public services and infrastructure',
                },
              ],
              callout:
                '“Tax evasion in Tanzania accounts for 1.3 percent of the country’s GDP.” (The Citizen, Aug 22, 2025)',
              right: {
                type: 'image',
                src: CITIZEN_TAX_EVASION_IMAGE_URL,
                caption:
                  'Source: The Citizen — “TRA: Tax evasion costs Tanzania 1.3 percent of GDP”',
              },
            },
            {
              title: 'System Fraud',
              kicker: 'External + internal manipulation',
              lead: 'Fraud succeeds when sales can be suppressed and records can be edited without immediate visibility—causing delayed discovery and weak proof.',
              bullets: [
                {
                  icon: <BugReport sx={{ color: '#111111' }} />,
                  text: 'External: “Zappers” suppress sales and bypass fiscal controls',
                },
                {
                  icon: <EditNote sx={{ color: '#111111' }} />,
                  text: 'Internal: edits to liabilities/penalties create silent leakage',
                },
                {
                  icon: <VisibilityOff sx={{ color: '#111111' }} />,
                  text: 'Pain point: investigation becomes slow and disputable because evidence is incomplete or can be modified',
                },
              ],
              // Pain-only diagram (how attackers exploit current weaknesses)
              right: { type: 'node', node: <FraudAttackFlowArt /> },
            },
            {
              title: 'Audit & Compliance Delays',
              kicker: 'Slow cycles = wider fraud window',
              lead: 'Long manual verification cycles delay recovery, widen the fraud window, and reduce real-time control and confidence.',
              bullets: [
                {
                  icon: <Timer sx={{ color: '#111111' }} />,
                  text: 'Audit cycles often take 30–180 days (verification is late)',
                },
                {
                  icon: <Savings sx={{ color: '#111111' }} />,
                  text: 'Delayed detection causes delayed recovery — billions remain uncollected',
                },
                {
                  icon: <FactCheck sx={{ color: '#111111' }} />,
                  text: 'Manual cross-checking slows decisions and increases disputes and rework',
                },
              ],
              // Pain-only timeline (today)
              right: { type: 'node', node: <AuditDelayFlowArt /> },
            },
          ],
        },
      },
      {
        title: 'The Solution: SMART TAX CHAIN',
        subtitle: 'Blockchain-powered platform integrated with TRA systems',
        content: (
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 4,
                  border: `1px solid ${alpha('#111111', 0.08)}`,
                  backgroundColor: '#ffffff',
                }}
              >
                <Stack spacing={1.25} alignItems="center">
                  <SolutionNetworkArt />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 1000 }}>
                      Blockchain Network
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#111111', 0.7) }}>
                      Secured, transparent &amp; immutable
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <KeyBenefitsPanel />
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  border: `1px dashed ${alpha('#111111', 0.18)}`,
                  backgroundColor: alpha('#111111', 0.02),
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 950 }}>
                  Program promise
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: alpha('#111111', 0.72), mt: 0.5, lineHeight: 1.65 }}
                >
                  A verifiable evidence trail for every critical tax event — so decisions become
                  faster, defensible, and measurable.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ),
      },
      {
        title: 'SMART TAX CHAIN: Transforming Tax Administration with Blockchain Intelligence',
        subtitle:
          'A blockchain-based system providing immutable ledger, automated fraud detection, and real-time auditing capabilities for transparent tax administration.',
        content: (
          <PlatformMapSlideContent
            illustrationFull={platformMapFullView}
            onToggleIllustration={() => setPlatformMapFullView((v) => !v)}
          />
        ),
      },
      {
        title: 'Call to Action',
        hideHeader: true,
        footerLeft: 'ismaelmkumbi@tra.go.tz',
        content: <CallToActionSlide demoUrl={demoUrl} />,
      },
    ],
    [demoUrl, rootCauseFullView, platformMapFullView, presentationDate],
  );

  const slideRefs = useRef([]);
  const [active, setActive] = useState(0);
  const prevActiveRef = useRef(0);

  const challengeSlideIdx = useMemo(
    () => slides.findIndex((s) => s.title === 'Current Tax System Challenges'),
    [slides],
  );
  const [challengeActive, setChallengeActive] = useState(0);
  const [challengeStage, setChallengeStage] = useState('overview');
  const [challengeVisited, setChallengeVisited] = useState([false, false, false]);
  const challengeComplete = useMemo(
    () => (challengeVisited || []).every(Boolean),
    [challengeVisited],
  );
  const challengeStageRef = useRef('overview');
  const challengeCompleteRef = useRef(false);
  const challengeWheelCooldownRef = useRef(0);
  const activeRef = useRef(0);
  const challengeSlideIdxRef = useRef(-1);

  useEffect(() => {
    challengeStageRef.current = challengeStage;
  }, [challengeStage]);
  useEffect(() => {
    challengeCompleteRef.current = challengeComplete;
  }, [challengeComplete]);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    challengeSlideIdxRef.current = challengeSlideIdx;
  }, [challengeSlideIdx]);

  // First scroll on Slide 3 reveals details panel (prevents jumping away).
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (challengeSlideIdxRef.current < 0) return;
      if (activeRef.current !== challengeSlideIdxRef.current) return;
      const now = Date.now();
      if (now - challengeWheelCooldownRef.current < 650) return;

      // Only on meaningful "scroll intent" inside the slide.
      if (Math.abs(e.deltaY) < 8) return;

      // Overview -> reveal details instead of moving slides.
      if (challengeStageRef.current === 'overview') {
        e.preventDefault();
        challengeWheelCooldownRef.current = now;
        setChallengeStage('reveal');
        setChallengeActive(0);
        return;
      }

      // Reveal mode: lock slide navigation until all steps are visited.
      if (challengeStageRef.current === 'reveal' && !challengeCompleteRef.current) {
        e.preventDefault();
        challengeWheelCooldownRef.current = now;
        setChallengeActive((v) => (e.deltaY > 0 ? (v + 1) % 3 : (v + 2) % 3));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const prev = prevActiveRef.current;
    prevActiveRef.current = active;
    if (challengeSlideIdx >= 0 && active === challengeSlideIdx && prev !== challengeSlideIdx) {
      setChallengeActive(0);
      setChallengeStage('overview');
      setChallengeVisited([false, false, false]);
    }
  }, [active, challengeSlideIdx]);

  useEffect(() => {
    if (challengeSlideIdx < 0) return;
    if (active !== challengeSlideIdx) return;
    if (challengeStage !== 'reveal') return;
    setChallengeVisited((prev) => {
      if (prev?.[challengeActive]) return prev;
      const next = [...(prev || [false, false, false])];
      next[challengeActive] = true;
      return next;
    });
  }, [active, challengeActive, challengeSlideIdx, challengeStage]);

  useEffect(() => {
    if (challengeSlideIdx < 0) return undefined;
    if (active !== challengeSlideIdx) return undefined;
    if (challengeStage !== 'reveal') return undefined;
    const enabled = Boolean(slides[challengeSlideIdx]?.focus?.autoAdvance);
    if (!enabled) return undefined;
    const ms = slides[challengeSlideIdx]?.focus?.autoAdvanceMs ?? 6500;
    const id = window.setInterval(() => {
      setChallengeActive((v) => (v + 1) % 3);
    }, ms);
    return () => window.clearInterval(id);
  }, [active, challengeSlideIdx, slides, challengeStage]);

  const goTo = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, idx));
      const el = slideRefs.current?.[clamped];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [slides.length],
  );

  useEffect(() => {
    const nodes = slideRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const idx = nodes.indexOf(visible.target);
        if (idx >= 0) setActive(idx);
      },
      { root: null, threshold: [0.4, 0.55, 0.7] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const onChallengeSlide = challengeSlideIdx >= 0 && active === challengeSlideIdx;
      if (onChallengeSlide) {
        const stepNext = () => setChallengeActive((v) => (v + 1) % 3);
        const stepPrev = () => setChallengeActive((v) => (v + 2) % 3);

        if (
          challengeStage === 'overview' &&
          (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ')
        ) {
          e.preventDefault();
          setChallengeStage('reveal');
          setChallengeActive(0);
          return;
        }

        // Keep users .... on Slide 3 in ... overview mode (prevents skipping the guided deep-dive)......
        if (challengeStage === 'overview' && e.key === 'ArrowRight') {
          e.preventDefault();
          return;
        }

        // In focus mode, arrows/space move between steps until complete......
        if (challengeStage === 'reveal' && !challengeComplete) {
          if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            stepNext();
            return;
          }
          if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            stepPrev();
            return;
          }
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(active + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(active - 1);
      if (e.key === 'Home') goTo(0);
      if (e.key === 'End') goTo(slides.length - 1);
      if (e.key?.toLowerCase?.() === 'f') {
        // Enter fullscreen only. Exit should be ESC (browser default).
        if (!document.fullscreenElement) fullscreenElRef.current?.requestFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, challengeComplete, challengeSlideIdx, challengeStage, goTo, slides.length]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) fullscreenElRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  return (
    <PageContainer
      title="SMART TAX CHAIN | Presentation"
      description="Smart Tax Chain — Presentation deck for revenue administration"
    >
      <GlobalStyles
        styles={{
          // Presentation typography tuning (readable from back of room)
          '.stc-slide .MuiTypography-h2': {
            fontSize: 'clamp(42px, 4.2vw, 64px)',
            lineHeight: 1.02,
          },
          '.stc-slide .MuiTypography-h4': {
            fontSize: 'clamp(28px, 2.6vw, 42px)',
            lineHeight: 1.12,
          },
          '.stc-slide .MuiTypography-h5': {
            fontSize: 'clamp(20px, 1.8vw, 28px)',
            lineHeight: 1.25,
          },
          '.stc-slide .MuiTypography-h6': {
            fontSize: 'clamp(18px, 1.45vw, 24px)',
            lineHeight: 1.25,
          },
          '.stc-slide .MuiTypography-subtitle1': {
            fontSize: 'clamp(17px, 1.35vw, 22px)',
            lineHeight: 1.25,
          },
          '.stc-slide .MuiTypography-subtitle2': {
            fontSize: 'clamp(15px, 1.2vw, 20px)',
            lineHeight: 1.25,
          },
          '.stc-slide .MuiTypography-body1': {
            fontSize: 'clamp(16px, 1.25vw, 20px)',
            lineHeight: 1.7,
          },
          '.stc-slide .MuiTypography-body2': {
            fontSize: 'clamp(14px, 1.05vw, 18px)',
            lineHeight: 1.65,
          },
          '.stc-slide .MuiTypography-caption': {
            fontSize: 'clamp(12px, 0.95vw, 14px)',
            lineHeight: 1.4,
          },
          '.stc-slide .MuiTypography-overline': {
            fontSize: 'clamp(11px, 0.9vw, 13px)',
            letterSpacing: '0.12em',
          },
          '.stc-slide .MuiChip-root': {
            fontSize: 'clamp(12px, 0.95vw, 14px)',
          },
          '.stc-slide .MuiChip-label': {
            fontSize: 'inherit',
          },
          '@media print': {
            '@page': { margin: '10mm', size: 'A4 landscape' },
            '#stc-topbar': { display: 'none !important' },
            '#stc-controls': { display: 'none !important' },
            '.stc-deck': { height: 'auto !important' },
            '.stc-slide-wrap': {
              breakAfter: 'page',
              height: 'auto !important',
              padding: '0 !important',
            },
            '.stc-slide': { boxShadow: 'none !important' },
          },
        }}
      />

      <Box
        ref={fullscreenElRef}
        sx={{
          // Mobile-safe viewport height (handles iOS address bar)
          minHeight: '100dvh',
          background: isFullscreen
            ? 'linear-gradient(180deg, #0b0b0b 0%, #111111 50%, #0b0b0b 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #fffef7 60%, #ffffff 100%)',
          transition: 'background 180ms ease',
        }}
      >
        <AppBar
          id="stc-topbar"
          position="sticky"
          elevation={0}
          sx={{
            display: isFullscreen ? 'none' : 'flex',
            backgroundColor: isFullscreen ? alpha('#111111', 0.72) : alpha('#ffffff', 0.82),
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(
              isFullscreen ? '#ffffff' : '#111111',
              isFullscreen ? 0.12 : 0.08,
            )}`,
            '& .MuiTypography-root, & .MuiButton-root': {
              color: isFullscreen ? '#ffffff' : undefined,
            },
          }}
        >
          <Toolbar>
            <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  borderRadius: 2,
                  px: 1,
                  py: 0.75,
                  backgroundColor: '#ffffff',
                  border: `1px solid ${alpha('#111111', 0.08)}`,
                  boxShadow: `0 10px 28px ${alpha('#111111', 0.08)}`,
                  '& svg': { width: 120, height: 'auto', display: 'block' },
                }}
              >
                <TRALogo />
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography sx={{ fontWeight: 950, letterSpacing: '-0.4px' }}>
                  SMART TAX CHAIN — Presentation
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#111111', 0.65) }}>
                  Slide {active + 1} of {slides.length}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  component={RouterLink}
                  to="/auth/login"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 950,
                    borderRadius: 999,
                    boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.28)}`,
                  }}
                >
                  Open demo
                </Button>

                <Button
                  onClick={toggleFullscreen}
                  variant="outlined"
                  startIcon={isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 950,
                    borderRadius: 999,
                    borderColor: alpha(isFullscreen ? '#ffffff' : '#111111', 0.18),
                    color: isFullscreen ? '#ffffff' : '#111111',
                    '&:hover': {
                      borderColor: alpha(isFullscreen ? '#ffffff' : '#111111', 0.28),
                      backgroundColor: isFullscreen
                        ? alpha('#ffffff', 0.06)
                        : alpha('#111111', 0.03),
                    },
                    display: isFullscreen ? 'none' : { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  Full screen
                </Button>
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{
                    display: isFullscreen ? 'none' : { xs: 'inline-flex', sm: 'none' },
                    border: `1px solid ${alpha(isFullscreen ? '#ffffff' : '#111111', 0.18)}`,
                    color: isFullscreen ? '#ffffff' : '#111111',
                  }}
                  aria-label="Toggle full screen"
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
                <Button
                  component={RouterLink}
                  to="/landingpage"
                  variant="text"
                  startIcon={<ArrowBack />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 800,
                    color: alpha('#111111', 0.75),
                    display: { xs: 'none', md: 'inline-flex' },
                  }}
                >
                  Back
                </Button>
              </Stack>
            </Container>
          </Toolbar>
        </AppBar>

        <Box
          className="stc-deck"
          ref={deckRef}
          sx={{
            // Use dvh to prevent jumps on mobile (address bar show/hide).
            // Toolbar is 56px on xs, 64px on sm+.
            height: isFullscreen
              ? '100dvh'
              : { xs: 'calc(100dvh - 56px)', sm: 'calc(100dvh - 64px)' },
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            backgroundColor: isFullscreen ? '#0b0b0b' : 'transparent',
            overscrollBehavior: 'contain',
          }}
        >
          <Container maxWidth={false} disableGutters sx={{ py: 0, px: 0 }}>
            <Box sx={{ width: '100%' }}>
              {slides.map((s, idx) => (
                <Box
                  key={idx}
                  className="stc-slide-wrap"
                  ref={(el) => {
                    slideRefs.current[idx] = el;
                  }}
                  sx={{
                    height: isFullscreen
                      ? '100dvh'
                      : { xs: 'calc(100dvh - 56px)', sm: 'calc(100dvh - 64px)' },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // In fullscreen, keep a PPT-like safe margin (avoid content touching edges)
                    // Also respects notch safe-areas.
                    px: isFullscreen
                      ? {
                          xs: 'calc(env(safe-area-inset-left, 0px) + 10px)',
                          sm: 'calc(env(safe-area-inset-left, 0px) + 16px)',
                          md: 'calc(env(safe-area-inset-left, 0px) + 24px)',
                        }
                      : 0,
                    py: isFullscreen
                      ? {
                          xs: 'calc(env(safe-area-inset-top, 0px) + 10px)',
                          sm: 'calc(env(safe-area-inset-top, 0px) + 16px)',
                          md: 'calc(env(safe-area-inset-top, 0px) + 24px)',
                        }
                      : 0,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                  }}
                >
                  <SlideFrame
                    footerLeft={
                      s.footerLeft ??
                      (idx === 0
                        ? 'Tanzania Revenue Authority'
                        : `Tanzania Revenue Authority • Presenter: ${PRESENTER_NAME}`)
                    }
                    footerRight={s.footerRight ?? `SMART TAX CHAIN • ${idx + 1} / ${slides.length}`}
                    sx={
                      isFullscreen
                        ? {
                            // Fill the padded wrap area, not the entire screen.
                            width: '100%',
                            height: '100%',
                            // Keep slide-like framing in fullscreen
                            borderRadius: { xs: 2, md: 4 },
                          }
                        : undefined
                    }
                  >
                    {/* Slide content */}
                    <Grid container spacing={3} sx={{ height: '100%', minHeight: 0 }}>
                      <Grid
                        item
                        xs={12}
                        md={s.diagram ? 7 : 12}
                        sx={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
                      >
                        <Stack
                          spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                          sx={{
                            height: '100%',
                            minHeight: 0,
                            ...(s.title === 'Root Cause: System Architecture Weakness'
                              ? { flex: 1, overflow: 'hidden' }
                              : {}),
                          }}
                        >
                          {idx === 0 ? (
                            <Grid
                              container
                              spacing={3}
                              alignItems="stretch"
                              sx={{ height: '100%' }}
                            >
                              <Grid item xs={12} md={7}>
                                <Stack
                                  spacing={2.5}
                                  sx={{
                                    pr: { md: 1 },
                                    height: { md: '100%' },
                                    justifyContent: { md: 'center' },
                                  }}
                                >
                                  <Stack spacing={{ xs: 2, md: 3 }} sx={{ maxWidth: 820 }}>
                                    {/* Classic title slide */}
                                    <Box>
                                      <Typography
                                        variant="h2"
                                        sx={{
                                          fontWeight: 1050,
                                          letterSpacing: { xs: '-0.5px', md: '-1.2px' },
                                          lineHeight: 1.02,
                                          fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem' },
                                        }}
                                      >
                                        SMART TAX CHAIN
                                      </Typography>
                                      <Typography
                                        variant="h5"
                                        sx={{
                                          mt: { xs: 0.8, md: 1.2 },
                                          color: alpha('#111111', 0.78),
                                          lineHeight: 1.35,
                                          fontWeight: 800,
                                          fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.5rem' },
                                        }}
                                      >
                                        Revolutionizing Tanzania&apos;s Tax Administration
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          mt: { xs: 1, md: 1.6 },
                                          color: alpha('#111111', 0.74),
                                          lineHeight: 1.7,
                                          fontWeight: 650,
                                          maxWidth: 820,
                                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                        }}
                                      >
                                        Blockchain-Based Solution for Enhanced Data Integrity,
                                        Trust, and Operational Efficiency
                                      </Typography>
                                    </Box>

                                    {/* Cover illustration - illustration 4 only (Immutable Ledger Blocks) */}
                                    <Box
                                      sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        py: { xs: 0.5, md: 1 },
                                      }}
                                    >
                                      <ImmutableLedgerBlocksArt />
                                    </Box>

                                    {/* Presenter / Date (single clean block) ***/}
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        p: { xs: 1.5, sm: 2, md: 2.25 },
                                        borderRadius: { xs: 2, md: 4 },
                                        border: `1px solid ${alpha('#111111', 0.08)}`,
                                        background: `linear-gradient(135deg, ${alpha(
                                          theme.palette.primary.main,
                                          0.16,
                                        )} 0%, #ffffff 65%)`,
                                      }}
                                    >
                                      <Grid
                                        container
                                        spacing={{ xs: 1, sm: 2 }}
                                        alignItems="center"
                                      >
                                        <Grid item xs={12} sm={7}>
                                          <Typography
                                            variant="overline"
                                            sx={{
                                              letterSpacing: 1.2,
                                              fontWeight: 950,
                                              color: alpha('#111111', 0.7),
                                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                            }}
                                          >
                                            Presenter
                                          </Typography>
                                          <Typography
                                            variant="h6"
                                            sx={{
                                              fontWeight: 950,
                                              fontSize: {
                                                xs: '0.95rem',
                                                sm: '1.1rem',
                                                md: '1.25rem',
                                              },
                                            }}
                                          >
                                            {PRESENTER_NAME}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: alpha('#111111', 0.75),
                                              fontWeight: 700,
                                              fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                            }}
                                          >
                                            Tanzania Revenue Authority
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                          <Typography
                                            variant="overline"
                                            sx={{
                                              letterSpacing: 1.2,
                                              fontWeight: 950,
                                              color: alpha('#111111', 0.7),
                                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                            }}
                                          >
                                            Date
                                          </Typography>
                                          <Typography
                                            variant="h6"
                                            sx={{
                                              fontWeight: 900,
                                              fontSize: {
                                                xs: '0.95rem',
                                                sm: '1.1rem',
                                                md: '1.25rem',
                                              },
                                            }}
                                          >
                                            {presentationDate.short}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: alpha('#111111', 0.65),
                                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                              display: { xs: 'none', sm: 'block' },
                                            }}
                                          >
                                            Press <strong>F</strong> for full screen
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  </Stack>
                                </Stack>
                              </Grid>

                              <Grid item xs={12} md={5}>
                                <Stack
                                  sx={{ height: '100%' }}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <CoverHeroArt />
                                </Stack>
                              </Grid>
                            </Grid>
                          ) : (
                            <Stack spacing={1}>
                              {!s.hideHeader ? (
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="flex-start"
                                  justifyContent="space-between"
                                >
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: 950,
                                        letterSpacing: '-0.6px',
                                        lineHeight: 1.08,
                                        fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' },
                                      }}
                                    >
                                      {s.title}
                                    </Typography>
                                    {s.subtitle ? (
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          color: alpha('#111111', 0.72),
                                          lineHeight: 1.65,
                                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                        }}
                                      >
                                        {s.subtitle}
                                      </Typography>
                                    ) : null}
                                  </Box>

                                  {idx === challengeSlideIdx && challengeStage === 'overview' ? (
                                    <Button
                                      onClick={() => {
                                        setChallengeStage('reveal');
                                        setChallengeActive(0);
                                      }}
                                      variant="contained"
                                      endIcon={<ArrowForward />}
                                      sx={{
                                        mt: 0.5,
                                        textTransform: 'none',
                                        fontWeight: 950,
                                        borderRadius: 999,
                                        whiteSpace: 'nowrap',
                                        boxShadow: `0 16px 40px ${alpha(
                                          theme.palette.primary.main,
                                          0.22,
                                        )}`,
                                      }}
                                    >
                                      Next
                                    </Button>
                                  ) : idx === challengeSlideIdx && challengeStage === 'reveal' ? (
                                    <Stack
                                      direction="row"
                                      spacing={{ xs: 0.5, sm: 0.9 }}
                                      alignItems="center"
                                      justifyContent="flex-end"
                                      flexWrap="wrap"
                                      useFlexGap
                                      sx={{
                                        mt: 0.5,
                                        p: { xs: 0.5, sm: 0.75 },
                                        borderRadius: { xs: 3, sm: 999 },
                                        backgroundColor: alpha('#ffffff', 0.72),
                                        border: `1px solid ${alpha('#111111', 0.1)}`,
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: `0 18px 50px ${alpha('#111111', 0.08)}`,
                                        maxWidth: { xs: '100%', md: 640 },
                                        gap: { xs: 0.5, sm: 0.75 },
                                      }}
                                    >
                                      <Chip
                                        icon={
                                          <Verified
                                            sx={{
                                              color: '#111111 !important',
                                              fontSize: { xs: 14, sm: 18 },
                                            }}
                                          />
                                        }
                                        label={`Active: ${
                                          s?.cards?.[challengeActive]?.title ?? ''
                                        }`}
                                        size="small"
                                        sx={{
                                          fontWeight: 950,
                                          height: { xs: 24, sm: 28 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.75, sm: 1.1 },
                                            fontSize: { xs: 10, sm: 12.5 },
                                          },
                                        }}
                                      />
                                      <Chip
                                        onClick={() =>
                                          setChallengeActive((challengeActive + 1) % 3)
                                        }
                                        label={`Next: ${
                                          s?.cards?.[(challengeActive + 1) % 3]?.title ?? ''
                                        }`}
                                        size="small"
                                        sx={{
                                          fontWeight: 950,
                                          height: { xs: 24, sm: 28 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.75, sm: 1.1 },
                                            fontSize: { xs: 10, sm: 12.5 },
                                          },
                                          backgroundColor: alpha('#111111', 0.03),
                                          border: `1px solid ${alpha('#111111', 0.12)}`,
                                          display: { xs: 'none', sm: 'flex' },
                                        }}
                                      />
                                      <Chip
                                        onClick={() =>
                                          setChallengeActive((challengeActive + 2) % 3)
                                        }
                                        label={`Then: ${
                                          s?.cards?.[(challengeActive + 2) % 3]?.title ?? ''
                                        }`}
                                        size="small"
                                        sx={{
                                          fontWeight: 950,
                                          height: { xs: 24, sm: 28 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.75, sm: 1.1 },
                                            fontSize: { xs: 10, sm: 12.5 },
                                          },
                                          backgroundColor: alpha('#111111', 0.03),
                                          border: `1px solid ${alpha('#111111', 0.12)}`,
                                          display: { xs: 'none', md: 'flex' },
                                        }}
                                      />
                                      <Chip
                                        label={`Progress: ${
                                          (challengeVisited || []).filter(Boolean).length
                                        }/3`}
                                        size="small"
                                        sx={{
                                          fontWeight: 950,
                                          height: { xs: 24, sm: 28 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.75, sm: 1.1 },
                                            fontSize: { xs: 10, sm: 12.5 },
                                          },
                                          backgroundColor: alpha('#111111', 0.03),
                                          border: `1px solid ${alpha('#111111', 0.12)}`,
                                        }}
                                      />
                                      <Chip
                                        label={
                                          (challengeVisited || []).every(Boolean)
                                            ? 'Unlocked'
                                            : 'Locked'
                                        }
                                        size="small"
                                        sx={{
                                          fontWeight: 950,
                                          height: { xs: 24, sm: 28 },
                                          '& .MuiChip-label': {
                                            px: { xs: 0.75, sm: 1.1 },
                                            fontSize: { xs: 10, sm: 12.5 },
                                          },
                                          backgroundColor: (challengeVisited || []).every(Boolean)
                                            ? alpha('#fff200', 0.26)
                                            : alpha('#111111', 0.03),
                                          border: `1px solid ${alpha(
                                            '#111111',
                                            (challengeVisited || []).every(Boolean) ? 0.14 : 0.12,
                                          )}`,
                                        }}
                                      />
                                    </Stack>
                                  ) : null}
                                </Stack>
                              ) : null}
                            </Stack>
                          )}

                          {idx !== 0 && s.body ? (
                            <Stack spacing={{ xs: 0.5, sm: 0.75, md: 1 }}>
                              {s.body.map((t) => (
                                <Typography
                                  key={t}
                                  variant="body1"
                                  sx={{
                                    color: alpha('#111111', 0.78),
                                    lineHeight: 1.7,
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                  }}
                                >
                                  {t}
                                </Typography>
                              ))}
                            </Stack>
                          ) : null}

                          {s.pills ? (
                            <Stack
                              direction="row"
                              spacing={{ xs: 0.5, sm: 0.75, md: 1 }}
                              flexWrap="wrap"
                              useFlexGap
                              sx={{ gap: { xs: 0.5, sm: 0.75, md: 1 } }}
                            >
                              {s.pills.map((p) => (
                                <Pill key={p.label} icon={p.icon} label={p.label} />
                              ))}
                            </Stack>
                          ) : null}

                          {s.content ? (
                            <Box
                              sx={{
                                mt: s.hideHeader ? 0 : 0.5,
                                height: s.hideHeader ? '100%' : undefined,
                                minHeight: s.hideHeader ? 0 : undefined,
                                ...(s.title === 'Root Cause: System Architecture Weakness'
                                  ? {
                                      flex: 1,
                                      minHeight: 0,
                                      maxHeight: '100%',
                                      overflow: 'hidden',
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }
                                  : {}),
                              }}
                            >
                              {isValidElement(s.content) && s.title === 'Call to Action'
                                ? cloneElement(s.content, { isSlideActive: idx === active })
                                : s.content}
                            </Box>
                          ) : null}

                          {s.bullets ? (
                            <Stack spacing={1.25}>
                              {s.bullets.map((b, bIdx) =>
                                typeof b === 'string' ? (
                                  <Bullet key={`${idx}-b-${bIdx}`}>{b}</Bullet>
                                ) : (
                                  <BulletItem
                                    key={`${idx}-b-${bIdx}`}
                                    icon={b.icon}
                                    text={b.text}
                                  />
                                ),
                              )}
                            </Stack>
                          ) : null}

                          {s.cards ? (
                            idx === challengeSlideIdx && s.focus ? (
                              <ChallengeFocus
                                cards={s.cards}
                                focus={{ ...(s.focus || {}), visited: challengeVisited }}
                                activeIdx={challengeActive}
                                onSelect={setChallengeActive}
                                stage={challengeStage}
                                setStage={setChallengeStage}
                              />
                            ) : (
                              <Grid container spacing={2.5}>
                                {s.cards.map((c) => (
                                  <Grid
                                    key={c.title}
                                    xs={12}
                                    md={
                                      s.diagram
                                        ? s.cards.length === 1
                                          ? 12
                                          : 6
                                        : s.cards.length === 1
                                          ? 12
                                          : s.cards.length === 2
                                            ? 6
                                            : 4
                                    }
                                  >
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        p: 2.5,
                                        borderRadius: 4,
                                        border: `1px solid ${alpha('#111111', 0.08)}`,
                                        backgroundColor: '#ffffff',
                                        height: '100%',
                                      }}
                                    >
                                      <Stack spacing={1.25}>
                                        <Stack direction="row" spacing={1.25} alignItems="center">
                                          <Box
                                            sx={{
                                              width: 40,
                                              height: 40,
                                              borderRadius: 3,
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              backgroundColor: alpha(
                                                theme.palette.primary.main,
                                                0.18,
                                              ),
                                              border: `1px solid ${alpha(
                                                theme.palette.primary.main,
                                                0.35,
                                              )}`,
                                            }}
                                          >
                                            {c.icon}
                                          </Box>
                                          <Typography variant="h6" sx={{ fontWeight: 950 }}>
                                            {c.title}
                                          </Typography>
                                        </Stack>
                                        {c.illustration ? (
                                          <Box
                                            sx={{
                                              mt: 0.5,
                                              borderRadius: 3,
                                              overflow: 'hidden',
                                              border: `1px solid ${alpha('#111111', 0.08)}`,
                                              background: `linear-gradient(135deg, ${alpha(
                                                theme.palette.primary.main,
                                                0.12,
                                              )} 0%, #ffffff 70%)`,
                                            }}
                                          >
                                            {c.illustration}
                                          </Box>
                                        ) : null}
                                        <Stack spacing={0.75}>
                                          {c.lines.map((l) => (
                                            <Typography
                                              key={l}
                                              variant="body2"
                                              sx={{
                                                color: alpha('#111111', 0.72),
                                                lineHeight: 1.7,
                                              }}
                                            >
                                              {l}
                                            </Typography>
                                          ))}
                                        </Stack>
                                      </Stack>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            )
                          ) : null}

                          {s.columns ? (
                            <Grid container spacing={2.5}>
                              {s.columns.map((col) => (
                                <Grid
                                  key={col.heading}
                                  xs={12}
                                  md={col.heading === 'Annual Revenue Loss' ? 4 : 4}
                                >
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2.5,
                                      borderRadius: 4,
                                      border: `1px solid ${alpha('#111111', 0.08)}`,
                                      backgroundColor: '#ffffff',
                                      height: '100%',
                                    }}
                                  >
                                    <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>
                                      {col.heading}
                                    </Typography>
                                    <Stack spacing={1}>
                                      {col.bullets.map((b) => (
                                        <Typography
                                          key={b}
                                          variant="body2"
                                          sx={{ color: alpha('#111111', 0.72), lineHeight: 1.7 }}
                                        >
                                          {b}
                                        </Typography>
                                      ))}
                                    </Stack>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          ) : null}

                          {s.closing ? (
                            <Paper
                              elevation={0}
                              sx={{
                                mt: 'auto',
                                p: 2.5,
                                borderRadius: 4,
                                border: `1px solid ${alpha('#111111', 0.08)}`,
                                background: `linear-gradient(135deg, ${alpha(
                                  theme.palette.primary.main,
                                  0.22,
                                )} 0%, #ffffff 60%)`,
                              }}
                            >
                              <Stack spacing={0.5}>
                                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                                  {s.closing[0]}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: alpha('#111111', 0.75), fontWeight: 700 }}
                                >
                                  {s.closing[1]}
                                </Typography>
                              </Stack>
                            </Paper>
                          ) : null}
                        </Stack>
                      </Grid>

                      {s.diagram ? (
                        <Grid item xs={12} md={5}>
                          {isValidElement(s.diagram) && s.title === 'Call to Action'
                            ? cloneElement(s.diagram, { isSlideActive: idx === active })
                            : s.diagram}
                        </Grid>
                      ) : null}
                    </Grid>
                  </SlideFrame>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Slide controls */}
        <Box
          id="stc-controls"
          sx={{
            position: 'fixed',
            left: 16,
            right: 16,
            bottom: 16,
            pointerEvents: 'none',
          }}
        >
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Mobile navigation */}
            <Paper
              elevation={0}
              sx={{
                pointerEvents: 'auto',
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 999,
                border: `1px solid ${alpha('#111111', 0.12)}`,
                backgroundColor: alpha('#ffffff', 0.92),
                backdropFilter: 'blur(10px)',
              }}
            >
              <IconButton
                size="small"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                sx={{ p: 0.75 }}
              >
                <KeyboardArrowLeft sx={{ fontSize: 20 }} />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 900,
                  color: alpha('#111111', 0.75),
                  fontSize: 11,
                  minWidth: 36,
                  textAlign: 'center',
                }}
              >
                {active + 1}/{slides.length}
              </Typography>
              <IconButton
                size="small"
                onClick={() => goTo(active + 1)}
                disabled={active === slides.length - 1}
                sx={{ p: 0.75 }}
              >
                <KeyboardArrowRight sx={{ fontSize: 20 }} />
              </IconButton>
            </Paper>
            {/* Desktop navigation */}
            <Paper
              elevation={0}
              sx={{
                pointerEvents: 'auto',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: 999,
                border: `1px solid ${alpha('#111111', 0.12)}`,
                backgroundColor: alpha('#ffffff', 0.85),
                backdropFilter: 'blur(10px)',
              }}
            >
              <IconButton size="small" onClick={() => goTo(active - 1)} disabled={active === 0}>
                <KeyboardArrowLeft />
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 900, color: alpha('#111111', 0.75) }}>
                {active + 1} / {slides.length}
              </Typography>
              <IconButton
                size="small"
                onClick={() => goTo(active + 1)}
                disabled={active === slides.length - 1}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Paper>
          </Container>
        </Box>
      </Box>
    </PageContainer>
  );
}
