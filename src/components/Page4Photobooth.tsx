import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsRight, RotateCcw, X } from 'lucide-react';
import { mockData, MomentPhoto, PageConfig } from '../data/mockData';

type PhotoboothStage = 'idle' | 'countdown' | 'printing' | 'showcase';

interface Page4PhotoboothProps {
  page?: PageConfig;
}

const DEFAULT_PAGE: PageConfig = {
  id: 'moments',
  title: 'Moments',
  badge: 'SAY CHEESE!',
  heading: 'Our moments',
};

const PERIMETER_BULBS: Array<{ cx: number; cy: number }> = [
  // Top row (left -> right)
  ...[18, 42, 66, 90, 114, 138, 162, 186, 210, 234].map((cx) => ({ cx, cy: 7 })),
  // Right edge (top -> bottom)
  ...[20, 34, 48].map((cy) => ({ cx: 243, cy })),
  // Bottom row (right -> left)
  ...[234, 210, 186, 162, 138, 114, 90, 66, 42, 18].map((cx) => ({ cx, cy: 55 })),
  // Left edge (bottom -> top)
  ...[48, 34, 20].map((cy) => ({ cx: 9, cy })),
];

interface PhotoboothMachineProps {
  stage: PhotoboothStage;
  countdownValue: 3 | 2 | 1;
  marqueeTitle: string;
  printingLabel: string;
  photos: MomentPhoto[];
  flashActive?: boolean;
  compact?: boolean;
  onReplay?: () => void;
}

function PhotoboothMachine({
  stage,
  countdownValue,
  marqueeTitle,
  printingLabel,
  photos,
  flashActive = false,
  compact = false,
  onReplay,
}: PhotoboothMachineProps) {
  const isCounting = stage === 'countdown';
  const isPrinting = stage === 'printing';
  const heartLit = isCounting || isPrinting;
  const dotsLit = isPrinting;

  const [chaseIndex, setChaseIndex] = useState(0);

  // Sequential clockwise chasing marquee bulbs (accelerates on countdown / printing)
  useEffect(() => {
    const intervalMs = isCounting || isPrinting ? 75 : 175;
    const timer = window.setInterval(() => {
      setChaseIndex((prev) => (prev + 1) % PERIMETER_BULBS.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isCounting, isPrinting]);

  const boothBody = (
    <div
      className={
        compact
          ? 'relative w-[68px] select-none drop-shadow-[0_10px_18px_rgba(128,74,108,0.24)]'
          : 'relative w-[254px] select-none drop-shadow-[0_22px_36px_rgba(112,58,92,0.24)]'
      }
    >
      {/* Perimeter Marquee Sign with 3D Extruded Top Bevel */}
      <div
        className={
          compact
            ? 'relative z-20 mx-auto w-[98%] rounded-[8px] border border-[#B41935] bg-gradient-to-b from-[#EC3959] to-[#C81B39] px-1.5 py-1 shadow-[0_3px_0_#8F1128]'
            : 'relative z-20 mx-auto w-[98%] rounded-[18px] border-2 border-[#B41935] bg-gradient-to-b from-[#EE3D5D] via-[#DC2746] to-[#B91734] px-5 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.32),0_7px_0_#8F1128,0_12px_18px_rgba(118,32,54,0.28)]'
        }
      >
        {/* Top & Side Chasing Perimeter Bulbs */}
        <svg
          viewBox="0 0 252 62"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {PERIMETER_BULBS.map(({ cx, cy }, i) => {
            const dist = (i - chaseIndex + PERIMETER_BULBS.length) % PERIMETER_BULBS.length;
            const isHead = dist === 0 || dist === 1 || dist === 13 || dist === 14;
            const isTrail = dist === 2 || dist === 15;
            const litScale = isHead ? 1.28 : isTrail ? 1.05 : 0.85;
            const radius = (compact ? 2.1 : 2.55) * litScale;
            const fill = isHead ? '#FFFCE0' : isTrail ? '#FFE97D' : '#F4CA6C';
            const opacity = isHead ? 1 : isTrail ? 0.92 : isCounting || isPrinting ? 0.65 : 0.52;

            return (
              <g key={`mb-${i}`}>
                {!compact && isHead && (
                  <circle cx={cx} cy={cy} r={6.2} fill="#FFE97A" opacity={0.38} />
                )}
                <circle cx={cx} cy={cy} r={radius} fill={fill} opacity={opacity} />
              </g>
            );
          })}
        </svg>

        {/* Cream Inner Plaque */}
        <div
          className={
            compact
              ? 'relative rounded-[4px] border border-[#F3CED5] bg-[#FFFDF8] px-0.5 py-[1px] text-center shadow-inner'
              : 'relative rounded-[10px] border border-[#F3CED5] bg-gradient-to-b from-[#FFFDF9] to-[#FDF5EB] px-3 py-1.5 text-center shadow-[inset_0_2px_4px_rgba(180,25,53,0.14),0_1px_0_rgba(255,255,255,0.4)]'
          }
        >
          <span
            className={
              compact
                ? 'block whitespace-nowrap font-serif text-[7px] font-bold leading-tight tracking-[-0.02em] text-[#D92544]'
                : 'block font-serif text-[23px] font-bold leading-[1.1] tracking-[-0.02em] text-[#D92544] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]'
            }
          >
            {marqueeTitle}
          </span>
        </div>
      </div>

      {/* Main 3D Extruded Lavender Cabinet + Side Depth Panel */}
      <div className={compact ? 'relative z-10 mx-auto -mt-0.5 w-[86%]' : 'relative z-10 mx-auto -mt-1 w-[86%]'}>
        {/* Right Side 3D Cabinet Depth Slab (visible on full booth) */}
        {!compact && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 -right-[8px] bottom-1 w-[14px] rounded-r-[16px] border-r border-b border-[#AE95CD] bg-gradient-to-b from-[#C7B0E2] via-[#B99FD7] to-[#A68AC8] shadow-[4px_6px_14px_rgba(92,48,80,0.2)]"
          />
        )}

        <div
          className={
            compact
              ? 'relative rounded-b-[10px] border border-[#C6B1DF] bg-gradient-to-r from-[#DFCFF1] via-[#E8DCF5] to-[#D4C0EA] pt-2 pb-2'
              : 'relative rounded-b-[18px] border-[1.5px] border-[#C1A9DC] bg-gradient-to-r from-[#E6D8F6] via-[#EEE4FA] to-[#D5C0EB] pt-5 pb-4 shadow-[inset_4px_0_10px_rgba(255,255,255,0.55),inset_-8px_0_14px_rgba(146,118,184,0.28)]'
          }
        >
          {/* Roof Overhang Cast Shadow under Marquee */}
          {!compact && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-[#7E5280]/28 to-transparent"
            />
          )}

          {/* Subtle Polka-Dot Texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-55"
            style={{
              backgroundImage: 'radial-gradient(circle, #FAF7FF 2px, transparent 2.2px)',
              backgroundSize: compact ? '6px 6px' : '15px 15px',
            }}
            aria-hidden="true"
          />

          {/* Pink & White Striped Scalloped Awning with 3D Curl Shadow */}
          <div
            className={
              compact
                ? 'pointer-events-none absolute -top-0.5 -left-[4%] z-20 h-3 w-[108%]'
                : 'pointer-events-none absolute -top-0.5 -left-[4%] z-20 h-7 w-[108%]'
            }
            aria-hidden="true"
          >
            <svg viewBox="0 0 240 28" className="h-full w-full drop-shadow-[0_4px_3px_rgba(104,54,84,0.26)]" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => {
                const x = idx * 20;
                const isPink = idx % 2 === 0;
                return (
                  <g key={idx}>
                    <rect x={x} y={0} width={20} height={19} fill={isPink ? '#F7A8BE' : '#FFF8FA'} />
                    <circle cx={x + 10} cy={19} r={10} fill={isPink ? '#F499B2' : '#FFF8FA'} />
                    <rect x={x} y={0} width={20} height={4} fill="#000000" opacity={0.05} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Gold-Framed Recessed Booth Window */}
          <div className={compact ? 'relative z-10 mx-auto mt-1.5 w-[80%]' : 'relative z-10 mx-auto mt-4 w-[79%]'}>
            <div
              className={
                compact
                  ? 'rounded-[7px] bg-gradient-to-b from-[#F4CA6C] via-[#DF9F39] to-[#C88422] p-[2.5px] shadow-[0_2px_5px_rgba(88,45,76,0.24)]'
                  : 'rounded-[14px] bg-gradient-to-b from-[#F7D47A] via-[#DF9F39] to-[#BE7D1D] p-[5.5px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_7px_16px_rgba(74,32,62,0.3)]'
              }
            >
              {/* Deep Recessed Plum Booth Interior */}
              <div
                className={
                  compact
                    ? 'relative h-[44px] overflow-hidden rounded-[5px] bg-[#3A1830]'
                    : 'relative h-[132px] overflow-hidden rounded-[9px] bg-gradient-to-b from-[#2B1024] via-[#3E1C35] to-[#4A223E] shadow-[inset_0_8px_16px_rgba(14,4,12,0.75)]'
                }
              >
                {/* Pleated Dark Plum Backdrop Stripes */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-45"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 6px, transparent 6px, transparent 14px)',
                  }}
                  aria-hidden="true"
                />

                {/* Gold Curtain Rod & Rich Multi-Fold Burgundy Curtains with Drop Shadows */}
                <svg
                  viewBox="0 0 180 130"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Curtain Inner Wall Cast Shadows */}
                  <path d="M0 10 L42 10 Q38 62 29 88 Q36 110 37 130 L0 130 Z" fill="#180713" opacity="0.48" />
                  <path d="M180 10 L138 10 Q142 62 151 88 Q144 110 143 130 L180 130 Z" fill="#180713" opacity="0.48" />

                  {/* Left Curtain */}
                  <path d="M0 10 L36 10 Q32 58 24 85 Q31 108 32 130 L0 130 Z" fill="#8C2139" />
                  <path d="M5 10 L12 10 L9 130 L2 130 Z" fill="#B13752" opacity="0.72" />
                  <path d="M15 10 L21 10 L17 130 L12 130 Z" fill="#5D1022" opacity="0.78" />
                  <path d="M24 10 L29 10 L23 130 L19 130 Z" fill="#A6324B" opacity="0.65" />

                  {/* Right Curtain */}
                  <path d="M180 10 L144 10 Q148 58 156 85 Q149 108 148 130 L180 130 Z" fill="#8C2139" />
                  <path d="M175 10 L168 10 L171 130 L178 130 Z" fill="#B13752" opacity="0.72" />
                  <path d="M165 10 L159 10 L163 130 L168 130 Z" fill="#5D1022" opacity="0.78" />
                  <path d="M156 10 L151 10 L157 130 L161 130 Z" fill="#A6324B" opacity="0.65" />

                  {/* Curtain Rod & Metallic Finials */}
                  <rect x="0" y="7" width="180" height="4" fill="#F2C867" />
                  <rect x="0" y="9.5" width="180" height="1.5" fill="#BE8424" />
                  {[12, 22, 32, 148, 158, 168].map((rx) => (
                    <rect key={rx} x={rx} y={6} width={2.5} height={6} rx={1} fill="#FFE394" />
                  ))}
                </svg>

                {/* Retro Mint Camera Box with Optical Multi-Ring Glass Lens & Shutter Recoil */}
                <motion.div
                  animate={
                    flashActive
                      ? { scale: [1, 0.92, 1.06, 1], y: [0, 1, -1, 0] }
                      : { scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.24 }}
                  className={
                    compact
                      ? 'relative mx-auto mt-2.5 flex h-[19px] w-[30px] items-center justify-center rounded-[4px] border border-[#84C5AC] bg-[#B1E5D0] px-1 shadow-sm'
                      : 'relative mx-auto mt-[22px] flex h-[48px] w-[78px] items-center justify-between rounded-[10px] border border-[#7ABFA4] bg-gradient-to-b from-[#C7F2E4] via-[#B4E6D4] to-[#98D4BE] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_rgba(14,4,12,0.55)]'
                  }
                >
                  {/* Flash / Vent Grill */}
                  <div
                    className={
                      compact
                        ? 'flex h-[10px] w-[6px] flex-col justify-center gap-[1.5px] rounded-[1.5px] bg-[#FFF6E8] px-[1px]'
                        : `flex h-[24px] w-[15px] flex-col justify-center gap-[3px] rounded-[4px] border px-[2.5px] transition-colors ${
                            flashActive
                              ? 'border-[#FDE047] bg-[#FFFDF2] shadow-[0_0_12px_#FFF69E]'
                              : 'border-[#DFCBB6] bg-[#FFF8EE]'
                          }`
                    }
                  >
                    <span className="block h-[1.5px] w-full rounded-full bg-[#D8C1AD]" />
                    <span className="block h-[1.5px] w-full rounded-full bg-[#D8C1AD]" />
                    <span className="block h-[1.5px] w-full rounded-full bg-[#D8C1AD]" />
                  </div>

                  {/* Multi-Ring Optical Glass Lens & Mechanical Shutter Blink */}
                  <div
                    className={
                      compact
                        ? 'flex h-[13px] w-[13px] items-center justify-center rounded-full border border-[#9E87C2] bg-[#C9B6E4]'
                        : 'flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#8F76B8] bg-gradient-to-br from-[#DFD1F4] to-[#B7A0DA] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_5px_rgba(24,10,20,0.35)]'
                    }
                  >
                    <div
                      className={
                        compact
                          ? 'relative h-[8px] w-[8px] rounded-full bg-[#241827]'
                          : 'relative flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-full border-2 border-[#F2ECFA] bg-[#160D1B] shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)]'
                      }
                      style={
                        !compact
                          ? {
                              backgroundImage:
                                'radial-gradient(circle at 35% 35%, rgba(92,225,230,0.45) 0%, rgba(192,132,252,0.28) 42%, #140B18 82%)',
                            }
                          : undefined
                      }
                    >
                      {/* Primary Lens Glint & Secondary Optical Coating Reflection */}
                      <span
                        className={
                          compact
                            ? 'absolute top-[1.5px] left-[1.5px] h-[2px] w-[2px] rounded-full bg-white/80'
                            : 'absolute top-[3px] left-[3.5px] h-[5.5px] w-[5.5px] rounded-full bg-white/90'
                        }
                      />
                      {!compact && (
                        <>
                          <span className="absolute right-[3px] bottom-[3px] h-[3px] w-[3px] rounded-full bg-[#7DF2E3]/85" />
                          <span className="pointer-events-none absolute -top-1 -left-1 h-4 w-7 -rotate-45 bg-white/12" />
                        </>
                      )}

                      {/* Mechanical Shutter Blade Blink on Capture Flash */}
                      {!compact && flashActive && (
                        <motion.span
                          initial={{ scaleY: 1 }}
                          animate={{ scaleY: [1, 0.1, 1] }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-[#2C1B30]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Small Heart Indicator Light (Top-Right of Camera) */}
                  <motion.div
                    animate={
                      heartLit
                        ? {
                            scale: [1, 1.24, 1],
                            filter: [
                              'drop-shadow(0 0 4px #FF2952)',
                              'drop-shadow(0 0 9px #FF2952)',
                              'drop-shadow(0 0 4px #FF2952)',
                            ],
                          }
                        : { scale: 1, filter: 'none' }
                    }
                    transition={heartLit ? { duration: 0.75, repeat: Infinity } : { duration: 0.2 }}
                    className={
                      compact
                        ? 'absolute -top-[1px] right-[1.5px] h-1.5 w-1.5'
                        : 'absolute top-[3.5px] right-[4px] h-3 w-3'
                    }
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-full w-full">
                      <path
                        d="M12 20.4C12 20.4 4 14.8 4 9.2C4 6.6 6 4.8 8.3 4.8C9.8 4.8 11.2 5.6 12 6.8C12.8 5.6 14.2 4.8 15.7 4.8C18 4.8 20 6.6 20 9.2C20 14.8 12 20.4 12 20.4Z"
                        fill={heartLit ? '#FF254D' : '#C98395'}
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Countdown Speech Bubble (Stage 2) */}
                <AnimatePresence mode="popLayout">
                  {!compact && isCounting && (
                    <motion.div
                      key={`cd-${countdownValue}`}
                      initial={{ opacity: 0, scale: 0.65, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="relative mx-auto mt-2.5 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(18,6,14,0.5)]"
                    >
                      <span
                        className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white"
                        aria-hidden="true"
                      />
                      <span className="relative z-10 font-serif text-[20px] font-bold leading-none text-[#E12D53]">
                        {countdownValue}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 4 Circular Indicator Dots Below Window */}
          <div
            className={
              compact
                ? 'relative z-10 mt-1.5 flex items-center justify-center gap-1'
                : 'relative z-10 mt-3 flex items-center justify-center gap-2'
            }
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((dotIdx) => (
              <motion.span
                key={dotIdx}
                animate={
                  dotsLit
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.85, 1, 0.85],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  dotsLit
                    ? { duration: 0.65, repeat: Infinity, delay: dotIdx * 0.12 }
                    : { duration: 0.2 }
                }
                className={
                  compact
                    ? `block h-1 w-1 rounded-full ${
                        dotsLit ? 'bg-[#FDE047] shadow-[0_0_4px_#FACC15]' : 'bg-[#B69ED4]'
                      }`
                    : `block h-2 w-2 rounded-full border ${
                        dotsLit
                          ? 'border-[#F59E0B] bg-[#FDE047] shadow-[0_0_8px_rgba(250,204,21,0.95)]'
                          : 'border-[#A88EC9] bg-[#BDA5DA] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]'
                      }`
                }
              />
            ))}
          </div>

          {/* Metallic Gold Dispensing Slot + Warm LED Backlight + Emerging Mini Strip */}
          <div className={compact ? 'relative z-20 mx-auto mt-1.5 w-[56%]' : 'relative z-20 mx-auto mt-2.5 w-[56%]'}>
            <div
              className={
                compact
                  ? 'rounded-[3px] bg-gradient-to-b from-[#F1C563] to-[#C88825] p-[1.5px]'
                  : `rounded-[6px] bg-gradient-to-b from-[#F4CA6C] via-[#DF9F39] to-[#BD7E1F] p-[2.5px] transition-shadow ${
                      isPrinting
                        ? 'shadow-[0_0_14px_rgba(253,224,71,0.65),0_2px_4px_rgba(110,65,92,0.2)]'
                        : 'shadow-[0_2px_4px_rgba(110,65,92,0.18)]'
                    }`
              }
            >
              <div
                className={
                  compact
                    ? 'h-[2px] rounded-[1px] bg-[#2D1824]'
                    : `h-[5px] rounded-[2px] transition-colors ${
                        isPrinting
                          ? 'bg-gradient-to-b from-[#FFE680] via-[#F59E0B] to-[#6B3F12]'
                          : 'bg-[#2D1824]'
                      }`
                }
              />
            </div>

            {/* Stage 3: Printing Pill & Emerging Mini Strip with Paper Curl Shadow */}
            <AnimatePresence>
              {!compact && isPrinting && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -6, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute -top-2 -right-[62px] z-30 flex items-center gap-1.5 rounded-full bg-[#2E1E29] px-2.5 py-1 shadow-[0_6px_14px_rgba(32,12,24,0.28)]"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FDE047] shadow-[0_0_6px_#FACC15]" />
                    <span className="whitespace-nowrap text-[10.5px] font-semibold tracking-wide text-white">
                      {printingLabel}
                    </span>
                  </motion.div>

                  {/* Warm LED Floor Light under Slot */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-[7px] left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-[#FDE047]/55 blur-[5px]"
                  />

                  {/* Masked Slot Exit Container with Curved Photo Strip Shading */}
                  <div className="pointer-events-none absolute top-[6px] left-1/2 z-30 w-[42px] -translate-x-1/2 overflow-hidden pb-3">
                    <motion.div
                      initial={{ y: '-105%', rotateX: 16 }}
                      animate={{ y: '0%', rotateX: 0 }}
                      transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mx-auto flex w-[34px] flex-col gap-[2px] rounded-b-[5px] border border-[#E7D4DC] bg-gradient-to-b from-[#FFFFFF] via-[#FFFDFE] to-[#F3E4EC] p-[2.5px] shadow-[0_10px_16px_rgba(68,30,58,0.32)]"
                    >
                      {photos.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="h-[13px] w-full rounded-[1.5px] shadow-[inset_0_1px_2px_rgba(45,25,43,0.12)]"
                          style={{ backgroundColor: p.backdropColor }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Cabinet Gold Accents */}
          <div
            className={
              compact
                ? 'relative z-10 mx-auto mt-2 flex w-[80%] items-center justify-between'
                : 'relative z-10 mx-auto mt-6 flex w-[79%] items-center justify-between'
            }
            aria-hidden="true"
          >
            <div
              className={
                compact
                  ? 'flex items-center gap-[1px] rounded-[2px] bg-[#E3AB47] p-[1.5px]'
                  : 'flex items-center gap-[2.5px] rounded-[5px] bg-gradient-to-b from-[#F4CA6C] to-[#C88825] px-[4px] py-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_4px_rgba(74,35,65,0.18)]'
              }
            >
              <span className={compact ? 'h-1 w-1 rounded-[0.5px] bg-[#F89BB7]' : 'h-2.5 w-2.5 rounded-[1.5px] bg-[#F89BB7]'} />
              <span className={compact ? 'h-1 w-1 rounded-[0.5px] bg-[#96DEC4]' : 'h-2.5 w-2.5 rounded-[1.5px] bg-[#96DEC4]'} />
              <span className={compact ? 'h-1 w-1 rounded-[0.5px] bg-[#F8B786]' : 'h-2.5 w-2.5 rounded-[1.5px] bg-[#F8B786]'} />
            </div>

            <div
              className={
                compact
                  ? 'flex h-2 w-2.5 items-center justify-center rounded-[2px] bg-[#E3AB47]'
                  : 'flex h-[18px] w-[22px] items-center justify-center rounded-[5px] bg-gradient-to-b from-[#F4CA6C] to-[#C88825] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_4px_rgba(74,35,65,0.18)]'
              }
            >
              <svg viewBox="0 0 24 24" className={compact ? 'h-1 w-1' : 'h-2.5 w-2.5'}>
                <path
                  d="M12 20.4C12 20.4 4 14.8 4 9.2C4 6.6 6 4.8 8.3 4.8C9.8 4.8 11.2 5.6 12 6.8C12.8 5.6 14.2 4.8 15.7 4.8C18 4.8 20 6.6 20 9.2C20 14.8 12 20.4 12 20.4Z"
                  fill="#4A2541"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stepped 3D Pedestal Base & Floor Shadow */}
      <div
        className={
          compact
            ? 'relative z-20 mx-auto -mt-[1px] h-[5px] w-[96%] rounded-b-[4px] border border-[#BFA8DA] bg-gradient-to-b from-[#E5D7F4] to-[#CBB6E4]'
            : 'relative z-20 mx-auto -mt-[2px] flex flex-col items-center'
        }
        aria-hidden="true"
      >
        {!compact && (
          <>
            <div className="h-[7px] w-[93%] rounded-t-[3px] border-x border-t border-[#CEBCE6] bg-gradient-to-b from-[#EEE3FA] to-[#DECFEF]" />
            <div className="h-[11px] w-[99%] rounded-b-[8px] border-[1.5px] border-[#B49CD4] bg-gradient-to-b from-[#E0CEF2] via-[#D2BCE9] to-[#BFA6DB] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_18px_rgba(128,74,108,0.28)]" />
            <div className="-mt-1 h-2.5 w-[108%] rounded-full bg-[#8D4F72]/20 blur-md" />
          </>
        )}
      </div>
    </div>
  );

  if (compact && onReplay) {
    return (
      <button
        type="button"
        onClick={onReplay}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        aria-label="Replay photobooth session"
        className="group cursor-pointer rounded-xl p-1 transition-transform active:scale-95 focus-visible:outline-none"
      >
        <div className="transition-transform group-hover:scale-105">{boothBody}</div>
      </button>
    );
  }

  return boothBody;
}

interface StickerSlotConfig {
  positionClass: string;
  rotateRange: [number, number, number];
  yRange: [number, number];
  delay: number;
  bobDuration: number;
  rotateDuration: number;
  sizeClass?: string;
}

const SHOWCASE_STICKER_SLOTS: StickerSlotConfig[] = [
  {
    // 1. shin_chan_STICKER.gif — top-left corner of Photo 1
    positionClass: '-top-3 -left-11',
    rotateRange: [-9, -5, -9],
    yRange: [0, -3],
    delay: 0.12,
    bobDuration: 2.6,
    rotateDuration: 3.2,
    sizeClass: 'h-12 w-12',
  },
  {
    // 2. gd.gif — right border between Photos 1 & 2 (below mini Photobooth)
    positionClass: 'top-[23%] -right-11',
    rotateRange: [8, 12, 8],
    yRange: [0, -3.5],
    delay: 0.2,
    bobDuration: 2.3,
    rotateDuration: 2.9,
    sizeClass: 'h-12 w-12',
  },
  {
    // 3. capybara.gif — left border between Photos 2 & 3
    positionClass: 'top-[42%] -left-11',
    rotateRange: [-10, -6, -10],
    yRange: [0, -3],
    delay: 0.28,
    bobDuration: 2.5,
    rotateDuration: 3.1,
    sizeClass: 'h-12 w-12',
  },
  {
    // 4. cat_meme.gif — right border between Photos 3 & 4
    positionClass: 'top-[58%] -right-11',
    rotateRange: [6, 10, 6],
    yRange: [0, -3.5],
    delay: 0.36,
    bobDuration: 2.4,
    rotateDuration: 3.3,
    sizeClass: 'h-12 w-12',
  },
  {
    // 5. cat_fight.gif — bottom-left edge near Photo 4
    positionClass: 'bottom-6 -left-11',
    rotateRange: [-8, -4, -8],
    yRange: [0, -3],
    delay: 0.44,
    bobDuration: 2.2,
    rotateDuration: 2.8,
    sizeClass: 'h-12 w-12',
  },
];

function ShowcaseStickerLayer({ stickers }: { stickers: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      {SHOWCASE_STICKER_SLOTS.map((slot, idx) => {
        const src = stickers[idx];
        if (!src) return null;

        return (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.4, rotate: slot.rotateRange[0] * 1.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: slot.rotateRange,
              y: [slot.yRange[0], slot.yRange[1], slot.yRange[0]],
            }}
            transition={{
              opacity: { duration: 0.3, delay: slot.delay },
              scale: { type: 'spring', stiffness: 320, damping: 18, delay: slot.delay },
              rotate: { duration: slot.rotateDuration, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: slot.bobDuration, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`absolute ${slot.positionClass} overflow-hidden rounded-2xl bg-white p-[3px] ring-2 ring-white shadow-[0_7px_16px_rgba(45,25,43,0.22)]`}
          >
            <img
              src={src}
              alt=""
              className={`${slot.sizeClass ?? 'h-12 w-12'} rounded-xl object-cover`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

const LIGHTBOX_STICKER_SLOTS: Array<{
  stickerIndex: number;
  positionClass: string;
  rotateRange: [number, number, number];
  duration: number;
}> = [
  {
    stickerIndex: 0, // shin_chan_STICKER.gif
    positionClass: '-top-4 -left-4',
    rotateRange: [-12, -7, -12],
    duration: 3.0,
  },
  {
    stickerIndex: 2, // capybara.gif
    positionClass: '-bottom-3 -left-3',
    rotateRange: [-10, -5, -10],
    duration: 2.5,
  },
  {
    stickerIndex: 3, // cat_meme.gif
    positionClass: '-right-3 -bottom-3',
    rotateRange: [6, 2, 6],
    duration: 2.7,
  },
];

function LightboxCornerStickers({ stickers }: { stickers: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      {LIGHTBOX_STICKER_SLOTS.map((slot) => {
        const src = stickers[slot.stickerIndex];
        if (!src) return null;

        return (
          <motion.div
            key={src}
            animate={{ rotate: slot.rotateRange, y: [0, -2, 0] }}
            transition={{ duration: slot.duration, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute ${slot.positionClass} overflow-hidden rounded-xl bg-white p-0.5 ring-2 ring-white shadow-[0_6px_14px_rgba(45,25,43,0.22)]`}
          >
            <img
              src={src}
              alt=""
              className="h-10 w-10 rounded-lg object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function IllustratedMomentScene({ index, backdropColor }: { index: number; backdropColor: string }) {
  const variant = index % 4;
  return (
    <svg
      viewBox="0 0 240 135"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="240" height="135" fill={backdropColor} />
      {/* Soft Pastel Bokeh */}
      <circle cx="38" cy="28" r="22" fill="#FFFFFF" fillOpacity="0.48" />
      <circle cx="204" cy="108" r="28" fill="#FFFFFF" fillOpacity="0.42" />
      <circle cx="196" cy="24" r="10" fill="#F9C6D3" fillOpacity="0.45" />

      {variant === 0 && (
        <g>
          {/* Cozy party hat duo */}
          <ellipse cx="92" cy="96" rx="28" ry="26" fill="#FDE8EE" stroke="#E8B8C7" strokeWidth="1.5" />
          <ellipse cx="148" cy="96" rx="28" ry="26" fill="#E8F6F1" stroke="#B7DDD0" strokeWidth="1.5" />
          <circle cx="92" cy="64" r="21" fill="#FFE6D5" />
          <circle cx="148" cy="64" r="21" fill="#FFE6D5" />
          {/* Party hats */}
          <polygon points="81,46 92,18 103,46" fill="#F2728E" />
          <circle cx="92" cy="17" r="3.5" fill="#FDE047" />
          <polygon points="137,46 148,22 159,46" fill="#89D6BC" />
          <circle cx="148" cy="21" r="3.5" fill="#FFFDF8" />
          {/* Rosy cheeks & smiles */}
          <circle cx="84" cy="66" r="3.2" fill="#F6A2B5" opacity="0.65" />
          <circle cx="100" cy="66" r="3.2" fill="#F6A2B5" opacity="0.65" />
          <circle cx="140" cy="66" r="3.2" fill="#F6A2B5" opacity="0.65" />
          <circle cx="156" cy="66" r="3.2" fill="#F6A2B5" opacity="0.65" />
          <circle cx="87" cy="61" r="2" fill="#4A2D37" />
          <circle cx="97" cy="61" r="2" fill="#4A2D37" />
          <circle cx="143" cy="61" r="2" fill="#4A2D37" />
          <circle cx="153" cy="61" r="2" fill="#4A2D37" />
          <path d="M89 69 Q92 73 95 69" stroke="#4A2D37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M145 69 Q148 73 151 69" stroke="#4A2D37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M120 38c0 0-8-6-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 128 27c0 5-8 11-8 11Z" fill="#E12D53" opacity="0.82" />
        </g>
      )}

      {variant === 1 && (
        <g>
          {/* Cheerful birthday duo frame (default highlighted photo) */}
          <rect x="44" y="20" width="152" height="96" rx="18" fill="#FFF8EE" fillOpacity="0.68" />
          {/* Little floating stars */}
          <path d="M56 38 L58 43 L63 45 L58 47 L56 52 L54 47 L49 45 L54 43 Z" fill="#F7C948" />
          <path d="M184 36 L186 41 L191 43 L186 45 L184 50 L182 45 L177 43 L182 41 Z" fill="#F78EB1" />
          {/* Smiling characters */}
          <circle cx="96" cy="70" r="24" fill="#FFD9B8" />
          <circle cx="144" cy="70" r="24" fill="#FCE2EC" />
          <circle cx="88" cy="73" r="3.5" fill="#F2859F" opacity="0.7" />
          <circle cx="104" cy="73" r="3.5" fill="#F2859F" opacity="0.7" />
          <circle cx="136" cy="73" r="3.5" fill="#F2859F" opacity="0.7" />
          <circle cx="152" cy="73" r="3.5" fill="#F2859F" opacity="0.7" />
          <path d="M88 66 Q90 63 92 66" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M100 66 Q102 63 104 66" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M136 66 Q138 63 140 66" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M148 66 Q150 63 152 66" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M92 77 Q96 81 100 77" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M140 77 Q144 81 148 77" stroke="#4A2D37" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M120 42c0 0-9-6.5-9-12a5 5 0 0 1 9-3.1A5 5 0 0 1 129 30c0 5.5-9 12-9 12Z" fill="#E12D53" />
        </g>
      )}

      {variant === 2 && (
        <g>
          {/* Floating pastel balloons + cozy hug */}
          <ellipse cx="58" cy="48" rx="13" ry="17" fill="#F79BB5" opacity="0.88" />
          <path d="M58 65 Q55 82 61 98" stroke="#D88A9F" strokeWidth="1.3" fill="none" />
          <ellipse cx="182" cy="44" rx="12" ry="16" fill="#B59DE5" opacity="0.85" />
          <path d="M182 60 Q186 78 179 96" stroke="#9B82CE" strokeWidth="1.3" fill="none" />
          <circle cx="104" cy="76" r="22" fill="#FFE6D5" />
          <circle cx="136" cy="76" r="22" fill="#FFF0DB" />
          <circle cx="98" cy="72" r="2.1" fill="#4A2D37" />
          <circle cx="109" cy="72" r="2.1" fill="#4A2D37" />
          <circle cx="131" cy="72" r="2.1" fill="#4A2D37" />
          <circle cx="142" cy="72" r="2.1" fill="#4A2D37" />
          <path d="M100 81 Q104 85 108 81" stroke="#E12D53" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <path d="M132 81 Q136 85 140 81" stroke="#E12D53" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <path d="M120 45c0 0-7-5-7-9.5a4 4 0 0 1 7-2.4A4 4 0 0 1 127 35.5c0 4.5-7 9.5-7 9.5Z" fill="#E12D53" opacity="0.85" />
        </g>
      )}

      {variant === 3 && (
        <g>
          {/* Sparkle celebration pose */}
          <circle cx="120" cy="68" r="44" fill="#FFFFFF" fillOpacity="0.58" />
          <circle cx="100" cy="68" r="20" fill="#FFE4D6" />
          <circle cx="140" cy="68" r="20" fill="#FFE4D6" />
          <circle cx="94" cy="65" r="2" fill="#4A2D37" />
          <circle cx="105" cy="65" r="2" fill="#4A2D37" />
          <circle cx="135" cy="65" r="2" fill="#4A2D37" />
          <circle cx="146" cy="65" r="2" fill="#4A2D37" />
          <circle cx="92" cy="71" r="2.8" fill="#F69CB2" opacity="0.7" />
          <circle cx="107" cy="71" r="2.8" fill="#F69CB2" opacity="0.7" />
          <circle cx="133" cy="71" r="2.8" fill="#F69CB2" opacity="0.7" />
          <circle cx="148" cy="71" r="2.8" fill="#F69CB2" opacity="0.7" />
          <path d="M97 73 Q100 76 103 73" stroke="#4A2D37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M137 73 Q140 76 143 73" stroke="#4A2D37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Little mini cake between them */}
          <rect x="110" y="88" width="20" height="14" rx="4" fill="#F9B4C7" />
          <rect x="110" y="88" width="20" height="5" rx="2.5" fill="#FFFDF8" />
          <rect x="119" y="80" width="2" height="8" rx="1" fill="#E12D53" />
          <circle cx="120" cy="78" r="2.5" fill="#FACC15" />
        </g>
      )}
    </svg>
  );
}

function MomentPhotoImage({
  photo,
  index,
}: {
  photo: MomentPhoto;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      {/* Layer 1: Immediate Illustrated Fallback */}
      <div className="absolute inset-0 z-0">
        <IllustratedMomentScene index={index} backdropColor={photo.backdropColor} />
      </div>

      {/* Layer 2: Remote Photo (fades in only once loaded without error) */}
      {!errored && (
        <img
          src={photo.imageUrl}
          alt={photo.caption}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`relative z-10 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </>
  );
}

function MomentPhotoFrame({
  photo,
  index,
  isSelected,
  onSelect,
}: {
  photo: MomentPhoto;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      aria-label={`${photo.caption} (photo ${index + 1})`}
      aria-pressed={isSelected}
      className={`group relative min-h-0 w-full flex-1 cursor-pointer overflow-hidden rounded-[9px] transition-all duration-200 focus-visible:outline-none ${
        isSelected
          ? 'ring-[2.5px] ring-[#E12D53] ring-offset-[1.5px] ring-offset-white shadow-[0_4px_12px_rgba(225,45,83,0.22)]'
          : 'ring-1 ring-[#EFE2E5] hover:ring-[#E8B6C2]'
      }`}
      style={{ backgroundColor: photo.backdropColor }}
    >
      <MomentPhotoImage photo={photo} index={index} />
    </button>
  );
}

export function Page4Photobooth({ page = DEFAULT_PAGE }: Page4PhotoboothProps) {
  const { moments } = mockData;
  const visiblePhotos = moments.photos.slice(0, 4);

  const [stage, setStage] = useState<PhotoboothStage>('idle');
  const [countdownValue, setCountdownValue] = useState<3 | 2 | 1>(3);
  const [flashActive, setFlashActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [runId, setRunId] = useState(0);

  // Clean timer-driven choreography with automatic cleanup
  useEffect(() => {
    if (stage === 'idle') {
      const autoStartTimer = window.setTimeout(() => {
        setCountdownValue(3);
        setStage('countdown');
      }, 800);
      return () => window.clearTimeout(autoStartTimer);
    }

    if (stage === 'countdown') {
      const t2 = window.setTimeout(() => setCountdownValue(2), 900);
      const t1 = window.setTimeout(() => setCountdownValue(1), 1800);
      const tPrint = window.setTimeout(() => {
        setFlashActive(true);
        setStage('printing');
      }, 2700);
      return () => {
        window.clearTimeout(t2);
        window.clearTimeout(t1);
        window.clearTimeout(tPrint);
      };
    }

    if (stage === 'printing') {
      const tShowcase = window.setTimeout(() => {
        setSelectedIndex(1);
        setStage('showcase');
      }, 1650);
      return () => window.clearTimeout(tShowcase);
    }

    return undefined;
  }, [stage, runId]);

  useEffect(() => {
    if (!flashActive) return undefined;
    const clearFlash = window.setTimeout(() => setFlashActive(false), 320);
    return () => window.clearTimeout(clearFlash);
  }, [flashActive]);

  const handlePrintAll = () => {
    setFlashActive(false);
    setLightboxOpen(false);
    setSelectedIndex(1);
    setStage('showcase');
  };

  const handlePrintAgain = () => {
    setFlashActive(false);
    setLightboxOpen(false);
    setCountdownValue(3);
    setSelectedIndex(1);
    setRunId((prev) => prev + 1);
    setStage('countdown');
  };

  const handlePrevPhoto = () => {
    if (visiblePhotos.length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + visiblePhotos.length) % visiblePhotos.length);
  };

  const handleNextPhoto = () => {
    if (visiblePhotos.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % visiblePhotos.length);
  };

  const isShowcase = stage === 'showcase';
  const activePhoto = visiblePhotos[selectedIndex] ?? visiblePhotos[0];

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden pb-[92px] select-none"
      style={{
        background: 'linear-gradient(175deg, #FCE3D8 0%, #FDF0E8 34%, #FEFAF3 76%, #FFFDF9 100%)',
      }}
    >
      {/* Left-Aligned Header (ref_06 - ref_09, no top-left brand logo) */}
      <header className="relative z-10 shrink-0 px-6 pt-11 text-left">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E12D53]">{page.badge}</p>
        <h1 className="mt-1 font-serif text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-[#2D1A22]">
          {page.heading}
        </h1>
      </header>

      {/* Top-Right Docked Mini Photobooth in Showcase Mode (positioned cleanly below AudioToggle) */}
      <AnimatePresence>
        {isShowcase && (
          <motion.div
            key="mini-booth"
            initial={{ opacity: 0, scale: 0.72, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[64px] right-3 z-20"
          >
            <PhotoboothMachine
              stage={stage}
              countdownValue={countdownValue}
              marqueeTitle={moments.marqueeTitle}
              printingLabel={moments.printingLabel}
              photos={moments.photos}
              compact
              onReplay={handlePrintAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Stage */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {!isShowcase ? (
            <motion.div
              key="booth-stage"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -14 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center"
            >
              <PhotoboothMachine
                stage={stage}
                countdownValue={countdownValue}
                marqueeTitle={moments.marqueeTitle}
                printingLabel={moments.printingLabel}
                photos={moments.photos}
                flashActive={flashActive}
              />
            </motion.div>
          ) : (
            <motion.div
              key="showcase-strip"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full max-h-[496px] w-[196px] flex-col items-center pt-2.5"
            >
              {/* 5 Real GIF Stickers Framing the Photo Strip */}
              <ShowcaseStickerLayer stickers={moments.stickers} />

              {/* Semi-Transparent Tilted Pink Vertical-Striped Washi Tape */}
              <div
                className="pointer-events-none absolute top-[1px] left-1/2 z-20 h-[18px] w-[60px] -translate-x-1/2 -rotate-[4deg] overflow-hidden opacity-85 shadow-[0_1px_3px_rgba(140,80,100,0.16)]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(247,168,190,0.82) 0px, rgba(247,168,190,0.82) 4px, rgba(255,248,250,0.82) 4px, rgba(255,248,250,0.82) 8px)',
                  clipPath: 'polygon(3% 0%, 97% 2%, 100% 35%, 96% 68%, 100% 100%, 2% 98%, 0% 66%, 4% 32%)',
                }}
                aria-hidden="true"
              />

              {/* White 4-Photo Strip Card */}
              <div className="flex h-full w-full flex-col rounded-[16px] border border-[#F5E3E7] bg-white px-2.5 pt-3.5 pb-2.5 shadow-[0_16px_36px_rgba(130,72,94,0.14)]">
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  {visiblePhotos.map((photo, idx) => (
                    <MomentPhotoFrame
                      key={photo.id}
                      photo={photo}
                      index={idx}
                      isSelected={selectedIndex === idx}
                      onSelect={() => {
                        setSelectedIndex(idx);
                        setLightboxOpen(true);
                      }}
                    />
                  ))}
                </div>

                {/* Strip Footer: Small Red Heart + Date Stamp */}
                <div className="mt-2 flex shrink-0 items-center justify-center gap-1.5 pt-0.5">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-[#E12D53]" aria-hidden="true">
                    <path
                      d="M12 20.4C12 20.4 4 14.8 4 9.2C4 6.6 6 4.8 8.3 4.8C9.8 4.8 11.2 5.6 12 6.8C12.8 5.6 14.2 4.8 15.7 4.8C18 4.8 20 6.6 20 9.2C20 14.8 12 20.4 12 20.4Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-[10.5px] font-medium tracking-[0.14em] text-[#7D6670]">
                    {moments.dateStamp}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar Above BottomNav */}
      <div className="relative z-20 shrink-0 px-6 pb-2">
        {!isShowcase ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handlePrintAll}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#F2DCE1] bg-white/95 px-5 py-2.5 text-[14px] font-semibold text-[#2D1A22] shadow-[0_8px_20px_rgba(148,88,110,0.12)] transition-all hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(148,88,110,0.18)] active:scale-95"
            >
              <ChevronsRight className="h-4 w-4 text-[#E12D53]" aria-hidden="true" />
              <span>{moments.ctaLabel}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[13.5px] font-medium text-[#7B626D]">
              {moments.photoCountLabel}
            </span>
            <button
              type="button"
              onClick={handlePrintAgain}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#F2DCE1] bg-white/95 px-4 py-2 text-[13.5px] font-semibold text-[#2D1A22] shadow-[0_6px_16px_rgba(148,88,110,0.12)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#E12D53]" aria-hidden="true" />
              <span>{moments.printAgainLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* Camera Shutter White Flash Overlay */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            key="camera-flash"
            initial={{ opacity: 0.92 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-40 bg-white"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Photo Zoom Lightbox Modal (3 natural dismissal modes: backdrop, drag-Y, X button) */}
      <AnimatePresence>
        {isShowcase && lightboxOpen && activePhoto && (
          <motion.div
            key="photo-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${activePhoto.caption} photo preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxOpen(false)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/55 px-5 backdrop-blur-sm"
          >
            {/* Top-Right Close X Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Close photo preview"
              className="absolute top-5 right-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#2D1A22] shadow-[0_6px_18px_rgba(0,0,0,0.22)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Draggable Enlarged Polaroid Card */}
            <motion.div
              key="photo-lightbox-card"
              initial={{ opacity: 0, scale: 0.86, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 65 || Math.abs(info.velocity.y) > 420) {
                  setLightboxOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="relative w-full max-w-[330px] cursor-grab rounded-[24px] border border-[#F6E4E9] bg-[#FFFDFB] px-4 pt-3 pb-4 shadow-[0_24px_60px_rgba(18,8,16,0.42)] active:cursor-grabbing"
            >
              {/* Subtle Outer Frame Corner Stickers */}
              <LightboxCornerStickers stickers={moments.stickers} />

              {/* Subtle vertical-drag handle bar */}
              <div
                aria-hidden="true"
                className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#DFCFD5]"
              />

              {/* Index Badge + Date Stamp Header */}
              <div className="mb-2.5 flex items-center justify-between">
                <span className="rounded-full bg-[#FDF0F3] px-2.5 py-0.5 text-[11px] font-bold text-[#E12D53] tabular-nums">
                  {selectedIndex + 1} / {visiblePhotos.length}
                </span>
                <span className="text-[11px] font-medium tracking-[0.14em] text-[#7D6670]">
                  {moments.dateStamp}
                </span>
              </div>

              {/* Large Photo Container with Prev/Next Flip Controls */}
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] border border-[#EFE2E5]"
                style={{ backgroundColor: activePhoto.backdropColor }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePhoto.id}
                    initial={{ opacity: 0.35, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.35 }}
                    transition={{ duration: 0.18 }}
                    className="relative h-full w-full"
                  >
                    <MomentPhotoImage photo={activePhoto} index={selectedIndex} />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#2D1A22] shadow-[0_4px_12px_rgba(45,25,43,0.18)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#2D1A22] shadow-[0_4px_12px_rgba(45,25,43,0.18)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
                >
                  <ChevronRight className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
                </button>
              </div>

              {/* Polaroid Footer Caption */}
              <div className="mt-3 text-center">
                <p className="font-handwriting text-[22px] leading-snug text-[#2D1A22]">
                  {activePhoto.caption}
                </p>
                <p className="mt-1 text-[10.5px] font-medium text-[#9A828C]">
                  Swipe up or down to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
