import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockData } from '../data/mockData';
import { FloatingConfetti } from './FloatingConfetti';

export type LetterState = 'closed' | 'peek' | 'full';

interface Page1LetterProps {
  onFullStateChange?: (isFull: boolean) => void;
}

function WaxSeal() {
  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center drop-shadow-[0_6px_10px_rgba(80,10,24,0.35)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <defs>
          <radialGradient id="waxOuter" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#D6364A" />
            <stop offset="55%" stopColor="#A8182A" />
            <stop offset="100%" stopColor="#720D1A" />
          </radialGradient>
          <radialGradient id="waxInner" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#8E1120" />
            <stop offset="100%" stopColor="#B82032" />
          </radialGradient>
        </defs>
        {/* Organic scalloped wax rim */}
        <path
          d="M32 3 C37 3 41 5.5 45 6.5 C49.5 7.5 54 11 56 15.5 C58 20 61 24 61 29.5 C61 34.5 58.5 39 57.5 43.5 C56.5 48 52.5 52.5 48 55 C43.5 57.5 38.5 61 33 61 C27.5 61 23 58 18.5 56.5 C14 55 9.5 51 7.5 46.5 C5.5 42 3 37.5 3 32 C3 26.5 5.5 22 7 17.5 C8.5 13 13 9 17.5 7 C22 5 27 3 32 3 Z"
          fill="url(#waxOuter)"
        />
        {/* Recessed wax stamp circle */}
        <circle
          cx="32"
          cy="32"
          r="20.5"
          fill="url(#waxInner)"
          stroke="#6A0B16"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        {/* Embossed heart */}
        <path
          d="M32 42.5 C32 42.5 20.5 35.2 20.5 27.6 C20.5 23.8 23.4 21 26.8 21 C29.1 21 31.1 22.3 32 24.1 C32.9 22.3 34.9 21 37.2 21 C40.6 21 43.5 23.8 43.5 27.6 C43.5 35.2 32 42.5 32 42.5 Z"
          fill="#CE2C40"
          stroke="#EB6A7B"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function Page1Letter({ onFullStateChange }: Page1LetterProps) {
  const [letterState, setLetterState] = useState<LetterState>('closed');
  const { letter } = mockData;

  // Trigger confetti burst on entry & auto-open envelope after ~0.5s
  useEffect(() => {
    const confettiTimer = window.setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 85,
        origin: { y: 0.45 },
        colors: ['#E12D53', '#F9A8B8', '#CFAEEB', '#FFE07D', '#9CE0CC'],
      });
    }, 120);

    const openTimer = window.setTimeout(() => {
      setLetterState((prev) => (prev === 'closed' ? 'peek' : prev));
    }, 500);

    return () => {
      window.clearTimeout(confettiTimer);
      window.clearTimeout(openTimer);
    };
  }, []);

  useEffect(() => {
    onFullStateChange?.(letterState === 'full');
  }, [letterState, onFullStateChange]);

  const isFull = letterState === 'full';
  const isClosed = letterState === 'closed';

  const handleOpenFull = () => {
    setLetterState('full');
  };

  const handleRetract = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFull) {
      setLetterState('peek');
    } else if (letterState === 'peek') {
      setLetterState('closed');
    }
  };

  const handleEnvelopeClick = () => {
    if (isClosed) {
      setLetterState('peek');
    } else if (letterState === 'peek') {
      setLetterState('full');
    }
  };

  return (
    <section
      aria-label="Birthday Letter"
      className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#FCD6DF] via-[#FDEAE8] to-[#FDF6EE]"
    >
      <FloatingConfetti />

      {/* Center/Lower Envelope Assembly (ref_02) */}
      <motion.div
        animate={{ opacity: isFull ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 mt-auto flex w-full flex-col items-center px-3.5 pb-[68px]"
      >
        <div
          onClick={handleEnvelopeClick}
          className="relative h-[396px] w-full max-w-[362px] cursor-pointer select-none"
        >
          {/* Envelope Back Interior */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[250px] rounded-b-[16px] rounded-t-[6px] bg-gradient-to-b from-[#E592AA] to-[#ECA1B7] shadow-[0_18px_40px_rgba(145,50,82,0.18)]"
            aria-hidden="true"
          />

          {/* Top Flap (Closed -> Rotated Open Behind Card) */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              rotateX: isClosed ? 0 : 180,
              zIndex: isClosed ? 30 : 5,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            className="absolute bottom-[122px] left-0 right-0 h-[128px] pointer-events-none"
          >
            <svg viewBox="0 0 360 130" preserveAspectRatio="none" className="h-full w-full drop-shadow-sm">
              <path
                d="M0 0 L360 0 L186 122 C182 125 178 125 174 122 Z"
                fill={isClosed ? '#F4AEBF' : '#EE9BB2'}
              />
            </svg>
          </motion.div>

          {/* Peeked Letter Card inside Envelope (ref_02) */}
          <AnimatePresence>
            {!isFull && (
              <motion.div
                key="peek-letter"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenFull();
                }}
                initial={{ y: 120, opacity: 0.4 }}
                animate={{
                  y: isClosed ? 105 : 0,
                  opacity: isClosed ? 0 : 1,
                }}
                exit={{ y: -140, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 230, damping: 26 }}
                className="absolute bottom-[98px] left-3 right-3 z-10 h-[296px] cursor-pointer rounded-t-[20px] rounded-b-[12px] border border-[#F1E6E2] bg-[#FFFDF9] px-5 pt-2.5 pb-6 shadow-[0_-4px_24px_rgba(45,25,43,0.08)]"
              >
                {/* Top pill handle */}
                <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-[#CDC3C8]" aria-hidden="true" />

                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A93954]">
                      {letter.badge}
                    </p>
                    <h2 className="mt-0.5 font-serif text-[22px] font-black leading-tight text-[#2D192B]">
                      {letter.title}
                    </h2>
                  </div>

                  {/* Top-right action buttons (^ and X) */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFull();
                      }}
                      aria-label="Expand letter to full screen"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DADF] bg-white text-[#2D192B] shadow-sm transition-colors hover:bg-[#FAF4F6] active:scale-95"
                    >
                      <ChevronUp className="h-4 w-4 stroke-[2.2]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRetract}
                      aria-label="Close letter preview"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DADF] bg-white text-[#2D192B] shadow-sm transition-colors hover:bg-[#FAF4F6] active:scale-95"
                    >
                      <X className="h-4 w-4 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Handwritten Preview */}
                <div className="mt-3.5">
                  <p className="font-handwriting text-[23px] leading-snug text-[#D62950]">
                    {letter.greeting}
                  </p>
                  <p className="mt-3 pr-3 text-right font-handwriting text-[21px] text-[#D62950]">
                    {letter.signOff}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope Front Pocket (Left, Right, Bottom Flaps overlapping bottom of card) */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[250px] overflow-hidden rounded-b-[16px]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 360 250" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="envSideL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9C1D0" />
                  <stop offset="100%" stopColor="#F2A4BA" />
                </linearGradient>
                <linearGradient id="envSideR" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F7BACB" />
                  <stop offset="100%" stopColor="#EF9FB6" />
                </linearGradient>
                <linearGradient id="envBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F8C0CF" />
                  <stop offset="100%" stopColor="#EE9CB4" />
                </linearGradient>
              </defs>
              {/* Left & Right Triangles (symmetric center vertex at x=180) */}
              <polygon points="0,0 180,132 0,250" fill="url(#envSideL)" />
              <polygon points="360,0 180,132 360,250" fill="url(#envSideR)" />
              {/* Bottom Triangle Pocket */}
              <path
                d="M0 250 L172 118 C177 114 183 114 188 118 L360 250 Z"
                fill="url(#envBottom)"
                stroke="#DF86A1"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
            </svg>

            {/* Bottom Pull Up Hint */}
            <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenFull();
                }}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8A5164] transition-colors hover:text-[#683748]"
              >
                <ChevronUp className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{letter.pullHint}</span>
              </button>
            </div>
          </div>

          {/* 3D Red Heart Wax Seal (wrapped in flex centering container so scale never offsets centering) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[110px] z-30 flex justify-center">
            <motion.div
              animate={{
                y: isClosed ? -6 : 0,
                scale: isClosed ? 1.04 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <WaxSeal />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Full-Screen Letter Modal Sheet (ref_03) */}
      <AnimatePresence>
        {isFull && (
          <motion.div
            key="full-letter"
            initial={{ y: '65%', opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '68%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            className="absolute inset-x-2.5 top-2.5 bottom-[86px] z-30 flex flex-col overflow-hidden rounded-[26px] border border-[#EFE3DF] bg-[#FFFDF9] shadow-[0_14px_45px_rgba(45,25,43,0.18)]"
          >
            {/* Fixed Top Header inside Full Letter */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#EFE6E2] px-5 pt-4 pb-3.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#A93954]">
                  {letter.badge}
                </p>
                <h2 className="mt-0.5 font-serif text-[20px] font-black leading-tight text-[#2D192B]">
                  {letter.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetract}
                  aria-label="Collapse letter back into envelope"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DADF] bg-white text-[#2D192B] shadow-sm transition-colors hover:bg-[#FAF4F6] active:scale-95"
                >
                  <ChevronDown className="h-4 w-4 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={handleRetract}
                  aria-label="Close letter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DADF] bg-white text-[#2D192B] shadow-sm transition-colors hover:bg-[#FAF4F6] active:scale-95"
                >
                  <X className="h-4 w-4 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Scrollable Handwritten Letter Body */}
            <div className="letter-scroll flex-1 touch-pan-y overscroll-y-contain overflow-y-auto px-6 py-5">
              <p className="font-handwriting text-[27px] leading-snug text-[#D62950]">
                {letter.greeting}
              </p>

              <div className="mt-4 space-y-4 font-handwriting text-[21px] leading-[1.52] text-[#3F3038]">
                {letter.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-7 mb-2 text-right font-handwriting text-[25px] text-[#D62950]">
                {letter.signOff}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
