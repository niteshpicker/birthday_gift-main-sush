import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Mic, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockData, PageConfig } from '../data/mockData';
import { BirthdayCake3D } from './BirthdayCake3D';

interface Page5CandlesProps {
  page?: PageConfig;
}

const HOLD_DURATION_MS = 1800;

const TWILIGHT_SPARKLES = [
  { top: '10%', left: '14%', size: 4, delay: 0.1 },
  { top: '16%', left: '82%', size: 3, delay: 0.6 },
  { top: '24%', left: '24%', size: 3, delay: 1.1 },
  { top: '20%', left: '68%', size: 4, delay: 0.3 },
  { top: '36%', left: '12%', size: 3.5, delay: 0.8 },
  { top: '34%', left: '88%', size: 3, delay: 1.4 },
  { top: '46%', left: '20%', size: 2.5, delay: 0.4 },
  { top: '44%', left: '78%', size: 3.5, delay: 0.9 },
];

function MiniPastelCandle({
  color,
  index,
  lit,
  windIntensity,
}: {
  color: string;
  index: number;
  lit: boolean;
  windIntensity: number;
}) {
  const tiltDeg = lit ? -(windIntensity * 34 + Math.sin(index * 1.4) * (2 + windIntensity * 6)) : 0;
  const stretchY = lit ? 1 + windIntensity * 0.25 : 1;

  return (
    <div className="relative flex h-7 w-3 items-end justify-center" aria-hidden="true">
      {/* Mini Flame when lit, tiny smoke wisp when blown out */}
      {lit ? (
        <div
          className="absolute top-[1px] left-1/2 origin-bottom transition-transform duration-75"
          style={{
            transform: `translateX(-50%) rotate(${tiltDeg}deg) scaleY(${stretchY})`,
          }}
        >
          <svg viewBox="0 0 12 16" className="h-[11px] w-[9px] drop-shadow-[0_0_4px_rgba(255,180,60,0.85)]">
            <path
              d="M6 1C6 1 10.5 6.4 10.5 10.2C10.5 12.9 8.5 14.8 6 14.8C3.5 14.8 1.5 12.9 1.5 10.2C1.5 6.4 6 1 6 1Z"
              fill="#FF9F2E"
            />
            <path
              d="M6 5C6 5 8.4 8.1 8.4 10.5C8.4 12.1 7.3 13.3 6 13.3C4.7 13.3 3.6 12.1 3.6 10.5C3.6 8.1 6 5 6 5Z"
              fill="#FFF8C7"
            />
          </svg>
        </div>
      ) : (
        <motion.svg
          viewBox="0 0 12 16"
          className="pointer-events-none absolute -top-1 left-1/2 h-3 w-2.5 -translate-x-1/2"
          animate={{ y: [0, -5, -8], opacity: [0.7, 0.45, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.22, ease: 'easeOut' }}
        >
          <path
            d="M6 14C4 11 8 8 5.5 4.5C4.5 3 6.5 1.5 6.5 1.5"
            fill="none"
            stroke="#B6A8B0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {/* Mini Pastel Candle Body */}
      <svg viewBox="0 0 12 18" className="h-[17px] w-[10px]">
        <line x1="6" y1="0.5" x2="6" y2="3.5" stroke="#4B3440" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="2" y="3" width="8" height="14" rx="2.5" fill={color} />
        <path d="M2.5 7.5 L9.5 6" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M2.5 12 L9.5 10.5" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function fireCelebrationConfetti() {
  const colors = ['#E12D53', '#FF8FB1', '#FDE047', '#9CE0CC', '#BFA3E8', '#FFFDF9'];
  try {
    confetti({
      particleCount: 65,
      spread: 72,
      origin: { y: 0.56 },
      colors,
    });
    window.setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.62 },
        colors,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.62 },
        colors,
      });
    }, 180);
  } catch {
    // Graceful no-op if canvas confetti is unavailable
  }
}

export function Page5Candles({ page }: Page5CandlesProps) {
  const { candles } = mockData;
  const badgeText = candles.badge || page?.badge || 'MAKE A WISH';

  const [candlesLit, setCandlesLit] = useState(true);
  const [holdProgress, setHoldProgress] = useState(0);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'unsupported' | 'denied'>('idle');
  const [showManualBlow, setShowManualBlow] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  const rafRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const holdingPointerIdRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const candlesLitRef = useRef(true);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const micFrameRef = useRef<number | null>(null);
  const micFallbackTimerRef = useRef<number | null>(null);
  const micStatusRef = useRef(micStatus);

  useEffect(() => { micStatusRef.current = micStatus; }, [micStatus]);

  const stopMic = useCallback(() => {
    if (micFallbackTimerRef.current !== null) window.clearTimeout(micFallbackTimerRef.current);
    micFallbackTimerRef.current = null;
    if (micFrameRef.current !== null) cancelAnimationFrame(micFrameRef.current);
    micFrameRef.current = null;
    setMicLevel(0);
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
    const context = micContextRef.current;
    micContextRef.current = null;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    candlesLitRef.current = candlesLit;
  }, [candlesLit]);

  useEffect(() => {
    return () => {
      cancelAnimation();
      stopMic();
    };
  }, [cancelAnimation, stopMic]);

  const completeBlowOut = useCallback(() => {
    stopMic();
    setMicStatus('idle');
    setShowManualBlow(false);
    cancelAnimation();
    isHoldingRef.current = false;
    holdingPointerIdRef.current = null;
    progressRef.current = 0;
    candlesLitRef.current = false;
    setHoldProgress(0);
    setCandlesLit(false);
    fireCelebrationConfetti();
  }, [cancelAnimation, stopMic]);

  const toggleMic = async () => {
    if (micStatusRef.current === 'listening') {
      stopMic();
      setMicStatus('idle');
      setShowManualBlow(true);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unsupported');
      setShowManualBlow(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const context = new AudioContext();
      micContextRef.current = context;
      await context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      let loudSince = 0;
      setMicStatus('listening');
      setShowManualBlow(false);
      micFallbackTimerRef.current = window.setTimeout(() => {
        if (candlesLitRef.current) setShowManualBlow(true);
      }, 8000);
      const listen = () => {
        if (micStatusRef.current !== 'listening' || !candlesLitRef.current) return;
        analyser.getByteTimeDomainData(samples);
        let energy = 0;
        let peak = 0;
        for (const sample of samples) {
          const centered = (sample - 128) / 128;
          energy += centered * centered;
          peak = Math.max(peak, Math.abs(centered));
        }
        const volume = Math.sqrt(energy / samples.length);
        setMicLevel(Math.min(1, volume * 5));
        // Phone microphones apply different amounts of gain, so combine a
        // lower RMS threshold with a peak threshold to catch a close breath.
        if (volume > 0.035 || peak > 0.14) {
          if (!loudSince) loudSince = performance.now();
          if (performance.now() - loudSince > 320) {
            setMicStatus('idle');
            completeBlowOut();
            return;
          }
        } else {
          loudSince = 0;
        }
        micFrameRef.current = requestAnimationFrame(listen);
      };
      micFrameRef.current = requestAnimationFrame(listen);
    } catch {
      stopMic();
      setMicStatus('denied');
      setShowManualBlow(true);
    }
  };

  const startHold = useCallback(() => {
    if (!candlesLitRef.current || isHoldingRef.current) return;
    cancelAnimation();
    isHoldingRef.current = true;

    const initialProgress = progressRef.current;
    const startTime = performance.now();

    const step = (now: number) => {
      if (!isHoldingRef.current || !candlesLitRef.current) return;
      const elapsed = now - startTime;
      const next = Math.min(1, initialProgress + elapsed / HOLD_DURATION_MS);
      progressRef.current = next;
      setHoldProgress(next);

      if (next >= 1) {
        completeBlowOut();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [cancelAnimation, completeBlowOut]);

  const stopHoldEarly = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    holdingPointerIdRef.current = null;
    cancelAnimation();

    if (!candlesLitRef.current || progressRef.current <= 0) {
      progressRef.current = 0;
      setHoldProgress(0);
      return;
    }

    const startValue = progressRef.current;
    const releaseStart = performance.now();
    const decayMs = Math.max(180, startValue * 380);

    const decayStep = (now: number) => {
      if (isHoldingRef.current) return;
      const ratio = Math.min(1, (now - releaseStart) / decayMs);
      const eased = 1 - Math.pow(1 - ratio, 2);
      const next = Math.max(0, startValue * (1 - eased));
      progressRef.current = next;
      setHoldProgress(next);

      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(decayStep);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(decayStep);
  }, [cancelAnimation]);

  const handleRelight = () => {
    stopMic();
    setMicStatus('idle');
    setShowManualBlow(false);
    cancelAnimation();
    isHoldingRef.current = false;
    holdingPointerIdRef.current = null;
    progressRef.current = 0;
    candlesLitRef.current = true;
    setHoldProgress(0);
    setCandlesLit(true);
  };

  return (
    <section
      aria-label={candlesLit ? candles.litHeading : candles.blownHeading}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden pb-[92px] select-none"
      style={{
        background:
          'radial-gradient(circle at 50% 24%, #CFC2BA 0%, #B4A69E 38%, #988A84 76%, #857873 100%)',
      }}
    >
      {/* Warm Candlelight Halo Behind 3D Cake Flames When Lit */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[6%] left-1/2 h-[270px] w-[320px] -translate-x-1/2 rounded-full transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 224, 152, 0.42) 0%, rgba(255, 198, 112, 0.16) 48%, rgba(255, 198, 112, 0) 75%)',
          opacity: candlesLit ? Math.max(0.25, 1 - holdProgress * 0.45) : 0,
        }}
      />

      {/* Cozy Dark Birthday-Room Overlay (fades in smoothly over 0.7s on blow-out) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          candlesLit ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 28%, #2B1F30 0%, #1F1722 52%, #120D14 100%)',
        }}
      >
        {/* Subtle Twinkling Twilight Sparkles */}
        {TWILIGHT_SPARKLES.map((star, idx) => (
          <motion.span
            key={idx}
            animate={candlesLit ? { opacity: 0 } : { opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.2, 0.85] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
            className="absolute rounded-full bg-[#FFE9B8] shadow-[0_0_8px_rgba(255,233,184,0.8)]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* Upper 3D Interactive Birthday Cake Canvas */}
      <div className="relative z-10 min-h-0 w-full flex-1 pt-4">
        <BirthdayCake3D
          variant="candles"
          windIntensity={holdProgress}
          candlesLit={candlesLit}
        />
      </div>

      {/* Bottom White Interaction Card Above BottomNav */}
      <div className="relative z-20 shrink-0 px-5 pb-1">
        <div className="rounded-[28px] bg-[#FFFDFB] px-5 pt-4 pb-5 shadow-[0_18px_42px_rgba(24,12,20,0.22)]">
          {/* Card Top Row: Badge + 5 Mini Pastel Candles */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E12D53]">
              {badgeText}
            </p>
            <div className="flex items-end gap-1.5 pr-0.5">
              {candles.candleColors.slice(0, 5).map((color, idx) => (
                <MiniPastelCandle
                  key={`${color}-${idx}`}
                  color={color}
                  index={idx}
                  lit={candlesLit}
                  windIntensity={holdProgress}
                />
              ))}
            </div>
          </div>

          {/* Heading & Optional Blown-Out Celebration Subtitle */}
          <div className="mt-1.5 min-h-[36px]">
            <AnimatePresence mode="wait">
              {candlesLit ? (
                <motion.h1
                  key="heading-lit"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  className="font-serif text-[26px] font-bold leading-[1.14] tracking-[-0.02em] text-[#2D192B]"
                >
                  {candles.litHeading}
                </motion.h1>
              ) : (
                <motion.div
                  key="heading-blown"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="font-serif text-[23px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2D192B]">
                    {candles.blownHeading}
                  </h1>
                  <p className="mt-1.5 text-[13px] leading-[1.45] text-[#6D5564]">
                    {candles.blownSubtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keep press-and-hold available as the reliable fallback to mic blowing. */}
          <div className="mt-4">
            {candlesLit ? (
              <div className="space-y-2">
              <button
                type="button"
                onClick={toggleMic}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border text-[13px] font-semibold transition-colors ${micStatus === 'listening' ? 'border-[#E12D53] bg-[#FFF0F3] text-[#C22145]' : 'border-[#E7DCE0] bg-white text-[#6D5564]'}`}
              >
                <Mic className="h-4 w-4" />
                {micStatus === 'listening' ? 'Listening… blow toward the mic (tap to stop)' : 'Try blowing with your mic'}
              </button>
                {micStatus === 'listening' && <div className="space-y-1 px-1" aria-live="polite">
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0E8EB]" role="meter" aria-label="Microphone input level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(micLevel * 100)}>
                    <div className="h-full rounded-full bg-gradient-to-r from-[#F4C66A] via-[#F28D72] to-[#E12D53] transition-[width] duration-75" style={{ width: `${micLevel * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-[#8B737E]">{micLevel > 0.17 ? 'Sound detected — keep blowing!' : micLevel > 0.035 ? 'Mic is picking up sound. Blow a little closer.' : 'Mic connected — waiting for sound…'}</p>
                </div>}
                {micStatus === 'unsupported' && <p className="text-[10px] text-[#A15C6B]">Microphone access isn’t available here.</p>}
                {micStatus === 'denied' && <p className="text-[10px] text-[#A15C6B]">Mic access was unavailable. Allow microphone access to try again.</p>}
                {showManualBlow && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-[#A15C6B]">Still lit? You can blow them out manually:</motion.p>}
                {showManualBlow && <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  if (!e.isPrimary) return;
                  if (e.button !== 0 && e.pointerType === 'mouse') return;
                  holdingPointerIdRef.current = e.pointerId;
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                    // Safe fallback if synthetic pointer event has no active pointerId
                  }
                  startHold();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  if (
                    holdingPointerIdRef.current !== null &&
                    e.pointerId !== holdingPointerIdRef.current
                  ) {
                    return;
                  }
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }
                  stopHoldEarly();
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'touch' && holdingPointerIdRef.current === e.pointerId) {
                    return;
                  }
                  stopHoldEarly();
                }}
                onPointerCancel={() => stopHoldEarly()}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  stopHoldEarly();
                }}
                onTouchCancel={(e) => {
                  e.stopPropagation();
                  stopHoldEarly();
                }}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                    e.preventDefault();
                    startHold();
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    stopHoldEarly();
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Hold to blow out the candles"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                className="relative flex h-[48px] w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border border-[#E7DCE0] bg-[#FAF4F6] text-[15px] font-semibold text-[#2D192B] shadow-[0_4px_12px_rgba(45,25,43,0.06)] transition-transform active:scale-[0.985] focus-visible:outline-none touch-none"
              >
                {/* Rose-Red Left-to-Right Progress Fill */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#E12D53] to-[#FF6B8B]"
                  style={{ width: `${holdProgress * 100}%` }}
                />

                {/* Base Dark Label Layer */}
                <span className="relative z-10 flex items-center gap-2 text-[#2D192B]">
                  <Wind className="h-[18px] w-[18px] text-[#E12D53]" aria-hidden="true" />
                  <span>Hold to blow out instead</span>
                </span>

                {/* Clipped High-Contrast White Label Layer Over Active Rose Fill */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 text-white"
                  style={{ clipPath: `inset(0 ${(1 - holdProgress) * 100}% 0 0)` }}
                >
                  <Wind className="h-[18px] w-[18px] text-white" />
                  <span>Hold to blow out instead</span>
                </span>
                </button>}
              </div>
            ) : (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={handleRelight}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E12D53] to-[#F4466B] text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(225,45,83,0.28)] transition-transform hover:brightness-105 active:scale-[0.985] focus-visible:outline-none"
              >
                <Flame className="h-[18px] w-[18px]" aria-hidden="true" />
                <span>{candles.relightLabel}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
