import { useId } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockData } from '../data/mockData';

interface Page6FinaleProps {
  onWatchAgain: () => void;
  onSelectPage: (pageNumber: number) => void;
}

// Smooth tubular spines for digits 0-9 inside a 110x145 viewBox
const DIGIT_SPINES: Record<string, string[]> = {
  '0': ['M 55 24 C 76 24 85 45 85 72 C 85 100 76 121 55 121 C 34 121 25 100 25 72 C 25 45 34 24 55 24 Z'],
  '1': ['M 39 38 L 57 24 L 57 120', 'M 37 120 L 76 120'],
  '2': ['M 30 44 C 31 25 54 22 69 26 C 83 31 84 48 75 62 C 64 78 36 96 28 119 Q 55 117 83 119'],
  '3': ['M 31 32 C 44 22 76 22 79 42 C 81 58 64 68 50 69 C 68 70 84 82 82 101 C 79 121 44 123 28 111'],
  '4': ['M 68 26 L 26 86 L 84 86', 'M 68 26 L 68 120'],
  '5': ['M 79 26 L 36 26 L 32 66 C 48 56 80 61 81 89 C 82 116 51 124 29 112'],
  '6': ['M 72 25 C 44 26 26 52 26 87 C 26 112 42 121 58 121 C 75 121 84 108 84 91 C 84 74 71 63 55 63 C 40 63 29 73 27 86'],
  '7': ['M 28 27 L 82 27 C 66 56 53 86 48 120'],
  '8': [
    'M 55 24 C 71 24 79 34 79 46 C 79 59 69 68 55 68 C 41 68 31 59 31 46 C 31 34 39 24 55 24 Z',
    'M 55 68 C 73 68 84 80 84 95 C 84 111 72 121 55 121 C 38 121 26 111 26 95 C 26 80 37 68 55 68 Z',
  ],
  '9': ['M 38 120 C 66 119 84 93 84 58 C 84 33 68 24 52 24 C 35 24 26 37 26 54 C 26 71 39 82 55 82 C 70 82 81 72 83 59'],
};

function FoilBalloonDigit({
  char,
  index,
  total,
}: {
  char: string;
  index: number;
  total: number;
}) {
  const uid = `${useId().replace(/:/g, '')}-${index}`;
  const paths = DIGIT_SPINES[char] ?? DIGIT_SPINES['0'];

  const isFirstOfTwo = total >= 2 && index % 2 === 0;
  const baseTilt = total === 1 ? -2 : isFirstOfTwo ? -5 : 4;
  const verticalOffset = total === 1 ? 0 : isFirstOfTwo ? -4 : 6;
  const bobDuration = 3.6 + (index % 3) * 0.35;

  return (
    <motion.div
      initial={{ y: 85, opacity: 0, scale: 0.82 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        duration: 1.4,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative -mx-2.5 flex flex-col items-center"
      style={{ marginTop: `${verticalOffset}px` }}
    >
      {/* Continuous Helium Bobbing & Gentle Sway Loop */}
      <motion.div
        animate={{
          y: [0, -7, 0],
          rotate: [baseTilt - 1.2, baseTilt + 1.4, baseTilt - 1.2],
        }}
        transition={{
          duration: bobDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.45,
        }}
        className="relative flex flex-col items-center"
      >
        <svg
          viewBox="0 0 110 148"
          className="h-[132px] w-[100px] overflow-visible drop-shadow-[0_14px_22px_rgba(176,104,122,0.28)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`rg-bevel-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6B5C2" />
              <stop offset="45%" stopColor="#CE6C7E" />
              <stop offset="100%" stopColor="#B85668" />
            </linearGradient>

            <linearGradient id={`rg-body-${uid}`} x1="12%" y1="6%" x2="88%" y2="96%">
              <stop offset="0%" stopColor="#FAD6DE" />
              <stop offset="28%" stopColor="#F29FAE" />
              <stop offset="56%" stopColor="#FFE9ED" />
              <stop offset="82%" stopColor="#E98FA0" />
              <stop offset="100%" stopColor="#FAD2DA" />
            </linearGradient>

            <linearGradient id={`rg-crown-${uid}`} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFF5F7" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#FAD7DF" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#F3A6B6" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id={`rg-valve-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DD8495" />
              <stop offset="50%" stopColor="#FAD8E0" />
              <stop offset="100%" stopColor="#D77C8D" />
            </linearGradient>
          </defs>

          {/* Bottom Inflation Valve Tab */}
          <g>
            <polygon
              points="49,131 61,131 63,139 47,139"
              fill={`url(#rg-valve-${uid})`}
              stroke="#D07285"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <line x1="48" y1="136" x2="62" y2="136" stroke="#C56578" strokeWidth="0.9" />
          </g>

          {/* Layer 1: Outer Crimped Foil Seam Border */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, i) => (
              <path
                key={`seam-${i}`}
                d={d}
                stroke="#DF8698"
                strokeWidth="37"
              />
            ))}
            {paths.map((d, i) => (
              <path
                key={`crimp-${i}`}
                d={d}
                stroke="#FADDE3"
                strokeWidth="35.5"
                strokeDasharray="1.8 3.2"
                strokeOpacity="0.65"
              />
            ))}
          </g>

          {/* Layer 2: 3D Metallic Bevel Contour */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, i) => (
              <path
                key={`bevel-${i}`}
                d={d}
                stroke={`url(#rg-bevel-${uid})`}
                strokeWidth="33"
              />
            ))}
          </g>

          {/* Layer 3: Puffy Metallic Rose-Gold Main Body */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, i) => (
              <path
                key={`body-${i}`}
                d={d}
                stroke={`url(#rg-body-${uid})`}
                strokeWidth="28.5"
              />
            ))}
          </g>

          {/* Layer 4: Plump Satin Crown Highlight */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-1.5, -2)">
            {paths.map((d, i) => (
              <path
                key={`crown-${i}`}
                d={d}
                stroke={`url(#rg-crown-${uid})`}
                strokeWidth="16"
              />
            ))}
          </g>

          {/* Layer 5: Curved Glossy Mylar Specular Light Streaks */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4.5, -4.5)">
            {paths.map((d, i) => (
              <path
                key={`spec-${i}`}
                d={d}
                stroke="rgba(255, 255, 255, 0.86)"
                strokeWidth="4.6"
                strokeDasharray="18 22"
              />
            ))}
          </g>

          {/* Subtle Crisp Secondary Rim Shimmer */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(4, 3)">
            {paths.map((d, i) => (
              <path
                key={`rim-${i}`}
                d={d}
                stroke="rgba(255, 232, 238, 0.42)"
                strokeWidth="2.5"
                strokeDasharray="14 28"
              />
            ))}
          </g>
        </svg>

        {/* Wavy Pastel Pink Ribbon Dangling Below Balloon */}
        <motion.svg
          viewBox="0 0 20 42"
          className="-mt-2.5 h-[36px] w-[18px] overflow-visible"
          animate={{ skewX: [-3.5, 3.5, -3.5] }}
          transition={{ duration: bobDuration * 0.9, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <path
            d="M 10 0 C 6 9 14 17 9 27 C 6 33 11 38 9 42"
            fill="none"
            stroke="#E59AAA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

function fireCelebrationConfetti() {
  const colors = ['#E12D53', '#F49FB2', '#FDE047', '#9CE0CC', '#BFA3E8', '#FFFDF9'];
  try {
    confetti({
      particleCount: 55,
      spread: 68,
      origin: { y: 0.58 },
      colors,
    });
    window.setTimeout(() => {
      confetti({
        particleCount: 34,
        angle: 60,
        spread: 52,
        origin: { x: 0.18, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 34,
        angle: 120,
        spread: 52,
        origin: { x: 0.82, y: 0.65 },
        colors,
      });
    }, 140);
  } catch {
    // Graceful no-op in environments without confetti canvas support
  }
}

export function Page6Finale({ onWatchAgain, onSelectPage }: Page6FinaleProps) {
  const { finale } = mockData;
  const digits = Array.from(finale.age.trim() || '22');

  const handleWatchAgainClick = () => {
    fireCelebrationConfetti();
    onWatchAgain();
  };

  const memoryTiles: Array<{
    id: string;
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }> = [
    {
      id: 'envelope',
      label: 'Go to The letter',
      onClick: () => onSelectPage(1),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <rect x="3" y="6" width="22" height="16" rx="3.5" fill="#F9A8BF" />
          <path d="M3.5 7 L14 15.5 L24.5 7" fill="none" stroke="#FCD3DF" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M14 18.2c0 0-3.5-2.3-3.5-4.4a1.9 1.9 0 0 1 3.5-1 1.9 1.9 0 0 1 3.5 1c0 2.1-3.5 4.4-3.5 4.4Z"
            fill="#E12D53"
          />
        </svg>
      ),
    },
    {
      id: 'balloons',
      label: 'Celebrate with balloons',
      onClick: () => fireCelebrationConfetti(),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <path d="M14 15 L14 25" stroke="#D5B8C2" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="10.5" cy="11" rx="4.2" ry="5.2" fill="#9CE0CC" />
          <ellipse cx="17.5" cy="11.5" rx="4.2" ry="5.2" fill="#FDE07D" />
          <ellipse cx="14" cy="8.5" rx="4.4" ry="5.5" fill="#F78EA7" />
          <circle cx="12.5" cy="6.6" r="1.1" fill="#FFFDF9" opacity="0.7" />
        </svg>
      ),
    },
    {
      id: 'cake',
      label: 'Go to The candles',
      onClick: () => onSelectPage(5),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <rect x="5" y="16" width="18" height="7" rx="2.5" fill="#C9ACEA" />
          <rect x="7.5" y="10" width="13" height="6.5" rx="2" fill="#FAA9BF" />
          <path d="M7.5 10.5 Q10.5 12.8 14 10.5 Q17.5 12.8 20.5 10.5" fill="#FFFDF9" />
          <rect x="13" y="6" width="2" height="4" rx="1" fill="#F9DE7E" />
          <circle cx="14" cy="4.6" r="1.5" fill="#FF9D2E" />
        </svg>
      ),
    },
    {
      id: 'jar',
      label: 'Go to Wishes',
      onClick: () => onSelectPage(3),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <rect x="9.5" y="4.5" width="9" height="3" rx="1" fill="#D5A67E" />
          <rect x="7" y="8" width="14" height="15" rx="5" fill="#F7EBF5" stroke="#DEC8EC" strokeWidth="1.2" />
          <circle cx="11.5" cy="17.5" r="2" fill="#FDE047" />
          <circle cx="16.5" cy="18.2" r="2" fill="#9CE0CC" />
          <circle cx="14" cy="14" r="2" fill="#F78EB1" />
          <path d="M10 9 Q14 10.5 18 9" fill="none" stroke="#BFA3E8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'camera',
      label: 'Go to Moments',
      onClick: () => onSelectPage(4),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <rect x="4" y="8.5" width="20" height="13.5" rx="3.5" fill="#AEE3CE" />
          <rect x="6.2" y="11" width="3.5" height="6" rx="1" fill="#FFF8EE" />
          <circle cx="15" cy="15.2" r="4.5" fill="#CEBDE8" />
          <circle cx="15" cy="15.2" r="2.6" fill="#2A1C2D" />
          <circle cx="14" cy="14.2" r="0.9" fill="#FFFFFF" />
          <circle cx="20.8" cy="11.2" r="1.2" fill="#E12D53" />
        </svg>
      ),
    },
    {
      id: 'map',
      label: 'Go to Our story',
      onClick: () => onSelectPage(2),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <polygon points="4,9 11,6.5 17,9 24,6.5 24,19.5 17,22 11,19.5 4,22" fill="#E6F5EF" stroke="#C5E4D8" strokeWidth="1" />
          <path d="M6 17 Q14 13 21 15" fill="none" stroke="#F7A8BE" strokeWidth="1.5" strokeDasharray="2 1.5" />
          <path d="M16 6.5 C17.7 6.5 19 7.8 19 9.5 C19 11.7 16 15 16 15 C16 15 13 11.7 13 9.5 C13 7.8 14.3 6.5 16 6.5 Z" fill="#E12D53" />
          <circle cx="16" cy="9.4" r="1.1" fill="#FFFDF9" />
        </svg>
      ),
    },
    {
      id: 'diary',
      label: 'Open Our story chapters',
      onClick: () => onSelectPage(2),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <rect x="6" y="6" width="16" height="17" rx="3" fill="#FFF5F7" stroke="#EBC9D2" strokeWidth="1.2" />
          <path d="M6 9 C6 7.3 7.3 6 9 6 L19 6 C20.7 6 22 7.3 22 9 L22 10.5 L6 10.5 Z" fill="#F27A94" />
          <rect x="9.5" y="4.5" width="2" height="3.2" rx="1" fill="#B5A4AE" />
          <rect x="16.5" y="4.5" width="2" height="3.2" rx="1" fill="#B5A4AE" />
          <line x1="9.5" y1="14.5" x2="18.5" y2="14.5" stroke="#DFC4CC" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="9.5" y1="18" x2="15.5" y2="18" stroke="#DFC4CC" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'vinyl',
      label: 'Replay music sparkle',
      onClick: () => fireCelebrationConfetti(),
      icon: (
        <svg viewBox="0 0 28 28" className="h-[22px] w-[22px]" aria-hidden="true">
          <circle cx="14" cy="14" r="9.5" fill="#CEB3EC" />
          <circle cx="14" cy="14" r="6.8" fill="none" stroke="#E7D8F8" strokeWidth="0.9" strokeOpacity="0.65" />
          <circle cx="14" cy="14" r="3.8" fill="#F794AC" />
          <circle cx="14" cy="14" r="1.2" fill="#FFFDF9" />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-label="Birthday Finale"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden pb-[92px] select-none"
      style={{
        background:
          'linear-gradient(175deg, #FBF2EB 0%, #FAF0E7 48%, #F9E5DF 86%, #F8E7D8 100%)',
      }}
    >
      {/* Subtle Ambient Warm Glow Around Finale Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] left-1/2 h-[240px] w-[280px] -translate-x-1/2 rounded-full opacity-75 blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(252,214,222,0.75) 0%, rgba(249,229,223,0.28) 55%, rgba(251,242,235,0) 80%)',
        }}
      />

      {/* Centered Finale Content Area (clean top cream space matching ref_11, no top-left logo) */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 pt-10">
        {/* Glossy 3D Rose-Gold Foil Balloon Numerals */}
        <div className="flex items-start justify-center" aria-label={`Age ${finale.age} balloons`}>
          {digits.map((char, idx) => (
            <FoilBalloonDigit
              key={`${char}-${idx}`}
              char={char}
              index={idx}
              total={digits.length}
            />
          ))}
        </div>

        {/* Center Typography Block */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1 flex flex-col items-center text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E12D53]">
            {finale.badge}
          </p>

          <h1 className="mt-2 font-serif text-[28px] font-black leading-[1.16] tracking-[-0.02em] text-[#2D192B]">
            {finale.headingPrefix}{' '}
            <span className="text-[#E12D53]">{finale.recipientShortName}</span>!
          </h1>

          <div className="mt-3 font-handwriting text-[20px] leading-[1.22] text-[#6B5460]">
            <p>{finale.signOffLine1}</p>
            <p className="text-[#4B3542]">{finale.signOffLine2}</p>
          </div>
        </motion.div>

        {/* Row of 8 Mini Memory Icon Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex w-full max-w-[354px] items-center justify-center gap-1.5"
        >
          {memoryTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={tile.onClick}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label={tile.label}
              title={tile.label}
              className="flex h-[35px] w-[35px] min-[385px]:h-[38px] min-[385px]:w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[11px] border border-[#F5E6EA] bg-white/95 shadow-[0_4px_12px_rgba(148,88,110,0.12)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
            >
              {tile.icon}
            </button>
          ))}
        </motion.div>

        {/* Centered "Watch again" White Pill CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <button
            type="button"
            onClick={handleWatchAgainClick}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#EAD9DF] bg-white/95 px-6 py-2.5 text-[14px] font-semibold text-[#2D192B] shadow-[0_8px_20px_rgba(148,88,110,0.12)] transition-all hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(148,88,110,0.18)] active:scale-95 focus-visible:outline-none"
          >
            <RotateCcw className="h-4 w-4 text-[#4C3643]" aria-hidden="true" />
            <span>{finale.watchAgainLabel}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
