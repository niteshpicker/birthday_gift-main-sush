import { CalendarHeart, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { mockData } from '../data/mockData';
import { BirthdayCake3D } from './BirthdayCake3D';
import { FloatingConfetti } from './FloatingConfetti';

interface Page0CoverProps {
  onOpenGift: () => void;
}

export function Page0Cover({ onOpenGift }: Page0CoverProps) {
  const { cover } = mockData;

  const handleOpenClick = () => {
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.72 },
      colors: ['#E12D53', '#F9A8B8', '#CFAEEB', '#FFE07D', '#9CE0CC'],
    });
    onOpenGift();
  };

  return (
    <section
      aria-label="Birthday Cover"
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#FDF5EE] via-[#FDF3EC] to-[#FBDCE2] px-5 pt-7 pb-6"
    >
      {/* Subtle pink radial glow matching ref_01 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#F8BCC9]/45 blur-3xl"
      />
      <FloatingConfetti />

      {/* Top Header Group */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Date Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 shadow-[0_4px_16px_rgba(45,25,43,0.06)]">
          <CalendarHeart className="h-3.5 w-3.5 text-[#E12D53]" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#B83B57]">
            {cover.dateBadge}
          </span>
        </div>

        {/* Main Serif Heading */}
        <h1 className="font-serif text-[32px] font-black leading-[1.08] tracking-tight text-[#2D192B]">
          <span className="block">{cover.titleLine1}</span>
          <span className="block">
            <span className="text-[#E12D53]">{cover.recipientName}</span>
            <span className="text-[#2D192B]">!</span>
          </span>
        </h1>

        {/* Handwritten Accent with Yellow Highlighter Brush */}
        <p className="mt-2 font-handwriting text-[27px] leading-snug text-[#2D192B]">
          {cover.handwrittenPrefix}{' '}
          <span className="relative inline-block px-1 text-[#DE3959]">
            <svg
              aria-hidden="true"
              viewBox="0 0 130 34"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-x-1 bottom-0.5 -z-10 h-[72%] w-[calc(100%+8px)]"
            >
              <path
                d="M4 21 C 28 11, 88 10, 125 18 C 110 25, 42 29, 6 26 Z"
                fill="#FFE47D"
                opacity="0.88"
              />
            </svg>
            {cover.handwrittenHighlight}
          </span>
        </p>
      </motion.div>

      {/* Center Interactive 3D Birthday Cake */}
      <div className="relative z-10 my-2 w-full flex-1 min-h-[275px]">
        <BirthdayCake3D dragHint={cover.dragHint} />
      </div>

      {/* Bottom Glossy Badge & Primary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-3 pb-2"
      >
        {/* Glossy pink pill "Today is your day!" */}
        <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#FA92AA] via-[#E8456B] to-[#DC244D] px-7 py-2 shadow-[0_8px_22px_rgba(225,45,83,0.28)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0.5 h-2.5 rounded-full bg-white/30 blur-[1px]"
          />
          <span className="relative font-serif text-[16px] font-bold tracking-tight text-white">
            {cover.todayBadge}
          </span>
        </div>

        {/* Primary CTA Button "Open my gift" */}
        <button
          type="button"
          onClick={handleOpenClick}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-b from-[#EA375D] to-[#D61E46] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(225,45,83,0.38)] transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(225,45,83,0.45)] active:scale-[0.97]"
        >
          <Gift className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-rotate-6" />
          <span>{cover.ctaButtonText}</span>
        </button>
      </motion.div>
    </section>
  );
}
