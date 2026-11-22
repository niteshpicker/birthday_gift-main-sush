import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockData } from '../data/mockData';

function GiftStackIllustration({ chapterNumber }: { chapterNumber: number }) {
  if (chapterNumber === 1) {
    // Stacked pastel gift boxes sticker matching ref_04.png
    return (
      <svg viewBox="0 0 160 160" className="h-full w-full drop-shadow-[0_6px_12px_rgba(45,25,43,0.12)]">
        {/* Bottom purple gift box */}
        <rect x="34" y="96" width="92" height="44" rx="7" fill="#C49EEA" />
        <rect x="30" y="90" width="100" height="14" rx="5" fill="#D1B2F1" />
        <rect x="74" y="90" width="12" height="50" fill="#9CE0CC" />
        {/* Bottom box bow */}
        <ellipse cx="70" cy="87" rx="11" ry="6" transform="rotate(-18 70 87)" fill="#9CE0CC" />
        <ellipse cx="90" cy="87" rx="11" ry="6" transform="rotate(18 90 87)" fill="#9CE0CC" />
        <circle cx="80" cy="89" r="4.5" fill="#7ACCB4" />

        {/* Middle pink gift box */}
        <rect x="46" y="57" width="68" height="33" rx="6" fill="#F9A6BC" />
        <rect x="42" y="51" width="76" height="12" rx="4.5" fill="#FBB9CA" />
        <rect x="75" y="51" width="10" height="39" fill="#FFE07D" />
        {/* Middle box bow */}
        <ellipse cx="71" cy="48" rx="9" ry="5" transform="rotate(-18 71 48)" fill="#FFE07D" />
        <ellipse cx="89" cy="48" rx="9" ry="5" transform="rotate(18 89 48)" fill="#FFE07D" />
        <circle cx="80" cy="50" r="4" fill="#F5CB54" />

        {/* Top yellow gift box */}
        <rect x="58" y="25" width="44" height="26" rx="5" fill="#FDE28A" />
        <rect x="55" y="20" width="50" height="10" rx="4" fill="#FEEA9F" />
        <rect x="76" y="20" width="8" height="31" fill="#E92F54" />
        {/* Top red bow */}
        <ellipse cx="72" cy="17" rx="9" ry="5" transform="rotate(-22 72 17)" fill="#E92F54" />
        <ellipse cx="88" cy="17" rx="9" ry="5" transform="rotate(22 88 17)" fill="#E92F54" />
        <circle cx="80" cy="19" r="4" fill="#C91D41" />
      </svg>
    );
  }

  // Chapter 2: festive pastel party balloons & keepsake camera/star sticker
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full drop-shadow-[0_6px_12px_rgba(45,25,43,0.12)]">
      {/* Strings */}
      <path d="M56 76 Q52 108 76 138" stroke="#C59FA9" strokeWidth="2" fill="none" />
      <path d="M80 64 Q80 102 78 138" stroke="#C59FA9" strokeWidth="2" fill="none" />
      <path d="M104 78 Q106 108 80 138" stroke="#C59FA9" strokeWidth="2" fill="none" />
      {/* Left lavender balloon */}
      <ellipse cx="56" cy="54" rx="20" ry="24" transform="rotate(-10 56 54)" fill="#C6A6EC" />
      <ellipse cx="49" cy="44" rx="4.5" ry="8" transform="rotate(-15 49 44)" fill="white" fillOpacity="0.45" />
      {/* Right mint balloon */}
      <ellipse cx="105" cy="56" rx="19" ry="23" transform="rotate(10 105 56)" fill="#9CE0CC" />
      <ellipse cx="99" cy="46" rx="4" ry="7.5" transform="rotate(-10 99 46)" fill="white" fillOpacity="0.45" />
      {/* Center rose-pink balloon */}
      <ellipse cx="80" cy="42" rx="22" ry="26" fill="#FA9BB3" />
      <ellipse cx="72" cy="31" rx="5" ry="9" transform="rotate(-15 72 31)" fill="white" fillOpacity="0.45" />
      {/* Heart sparkle badge */}
      <path
        d="M80 124 C80 124 67 115 67 107 C67 103 70 100 74 100 C76.6 100 78.8 101.4 80 103.5 C81.2 101.4 83.4 100 86 100 C90 100 93 103 93 107 C93 115 80 124 80 124 Z"
        fill="#E12D53"
      />
    </svg>
  );
}

export function Page2Diary() {
  const { chapters, continuedText } = mockData.story;
  const [pageIdx, setPageIdx] = useState(0);
  const [flipDir, setFlipDir] = useState(1);
  const [imgStatus, setImgStatus] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});

  const totalPages = chapters.length;
  const activeChapter = chapters[pageIdx];
  const currentImgState = imgStatus[activeChapter.chapterNumber] ?? 'loading';

  const goToChapter = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= totalPages || nextIdx === pageIdx) return;
    setFlipDir(nextIdx > pageIdx ? 1 : -1);
    setPageIdx(nextIdx);
  };

  const stopGesturePropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <section
      aria-label="Our story diary"
      className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#D5EEE4] via-[#F2F2EB] to-[#FCEEE9] px-5 pt-11 pb-24"
    >
      {/* Centered Header matching ref_04 */}
      <header className="relative z-10 text-center">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#D92B52]">
          {mockData.pages[1]?.badge ?? 'CHAPTER BY CHAPTER'}
        </p>
        <h2 className="mt-0.5 font-serif text-[30px] font-black leading-tight text-[#2D192B]">
          {mockData.pages[1]?.heading ?? 'Our story'}
        </h2>
      </header>

      {/* Tactile Diary Book Wrapper (gesture isolated) */}
      <div
        onPointerDown={stopGesturePropagation}
        onPointerUp={stopGesturePropagation}
        onTouchStart={stopGesturePropagation}
        onTouchEnd={stopGesturePropagation}
        className="relative z-10 mx-auto mt-3 flex w-full max-w-[336px] flex-1 min-h-0 flex-col justify-center"
      >
        <div className="relative flex-1 max-h-[476px] min-h-[390px] w-full" style={{ perspective: '1200px' }}>
          {/* Red Ribbon Bookmark Tab peeking out from upper-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-11 -right-2.5 z-0 h-6 w-8"
          >
            <svg viewBox="0 0 32 24" className="h-full w-full drop-shadow-sm">
              <path d="M0 0 L32 0 L24 12 L32 24 L0 24 Z" fill="#D9234B" />
            </svg>
          </div>

          {/* Stacked Multi-Page Paper Edges along bottom and right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 translate-x-[5px] translate-y-[6px] rounded-[18px] border border-[#DFCFC7] bg-[#EADBD4]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 translate-x-[2.5px] translate-y-[3px] rounded-[18px] border border-[#E8D9D1] bg-[#F5EAE4]"
          />

          {/* 3D Perspective Page Flip Surface */}
          <AnimatePresence mode="wait" custom={flipDir}>
            <motion.article
              key={activeChapter.chapterNumber}
              custom={flipDir}
              initial={{ rotateY: flipDir > 0 ? 72 : -72, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipDir > 0 ? -72 : 72, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                backgroundImage: 'radial-gradient(#ECC8D2 1.15px, transparent 1.15px)',
                backgroundSize: '16px 16px',
              }}
              className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-[#EFE1DC] bg-[#FFF9F8] pt-4 pr-5 pb-4 pl-8 shadow-[0_14px_34px_rgba(45,25,43,0.12)]"
            >
              {/* Left Spine Perforated Binding Dots */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-3 bottom-3 left-2.5 flex flex-col justify-between"
              >
                {Array.from({ length: 24 }, (_, idx) => (
                  <span
                    key={idx}
                    className="block h-[3.5px] w-[3.5px] rounded-full bg-[#DFC7CF]"
                  />
                ))}
              </div>
              {/* Subtle Spine Gutter Line */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 bottom-0 left-5 border-l border-[#F4E0E5]"
              />

              {/* Folded Bottom-Right Corner Crease */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-7 w-7 overflow-hidden rounded-br-[18px]"
              >
                <div className="absolute right-0 bottom-0 h-0 w-0 border-b-[28px] border-l-[28px] border-b-[#EAD6D0] border-l-transparent" />
                <div className="absolute right-0 bottom-0 h-0 w-0 border-t-[28px] border-r-[28px] border-t-[#F6EAE6] border-r-transparent shadow-sm" />
              </div>

              {/* Handwritten Chapter Heading + Wavy Underline */}
              <div className="relative inline-block self-start">
                <h3 className="font-handwriting text-[25px] leading-none text-[#E04365]">
                  {activeChapter.label}
                </h3>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 110 8"
                  className="mt-0.5 h-2 w-24 text-[#F3B0BE]"
                  fill="none"
                >
                  <path
                    d="M1 4 Q7 1 13 4 T25 4 T37 4 T49 4 T61 4 T73 4 T85 4 T97 4 T109 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Center Circular Pastel Backdrop + Die-Cut Sticker Photo/Illustration */}
              <div className="my-3 flex items-center justify-center">
                <div
                  style={{ backgroundColor: activeChapter.backdropColor }}
                  className="relative flex h-[176px] w-[176px] items-center justify-center rounded-full shadow-inner"
                >
                  <div className="relative h-[132px] w-[132px] overflow-hidden rounded-2xl border-[5px] border-white bg-white/75 shadow-[0_8px_20px_rgba(45,25,43,0.12)]">
                    {/* Immediate crisp SVG sticker fallback layer */}
                    <div className="absolute inset-0 p-1">
                      <GiftStackIllustration chapterNumber={activeChapter.chapterNumber} />
                    </div>
                    {/* Real image loaded from mockData.ts when reachable */}
                    {currentImgState !== 'error' && (
                      <img
                        src={activeChapter.imageUrl}
                        alt={activeChapter.imageAlt}
                        onLoad={() =>
                          setImgStatus((prev) => ({
                            ...prev,
                            [activeChapter.chapterNumber]: 'loaded',
                          }))
                        }
                        onError={() =>
                          setImgStatus((prev) => ({
                            ...prev,
                            [activeChapter.chapterNumber]: 'error',
                          }))
                        }
                        className={`relative z-10 h-full w-full object-cover transition-opacity duration-300 ${
                          currentImgState === 'loaded' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Editorial Serif Story Copy with Oversized Rose-Red Drop Cap */}
              <p className="mt-1 font-serif text-[16px] font-extrabold leading-[1.36] text-[#2D192B]">
                <span className="float-left mr-2 pt-0.5 font-serif text-[44px] font-black leading-[0.78] text-[#E12D53]">
                  {activeChapter.text.charAt(0)}
                </span>
                {activeChapter.text.slice(1)}
              </p>

              {/* Bottom Footer Row: "To be continued..." on page 2 + Circular Page Number */}
              <div className="mt-auto flex items-center justify-between pt-3">
                {activeChapter.chapterNumber === totalPages ? (
                  <span className="font-handwriting text-[18px] text-[#BA6D83]">
                    {continuedText}
                  </span>
                ) : (
                  <span />
                )}

                <span
                  aria-label={`Diary page ${activeChapter.chapterNumber}`}
                  className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#FADAE3] text-[11px] font-bold text-[#8E5266]"
                >
                  {activeChapter.chapterNumber}
                </span>
              </div>

              {/* Clickable Bottom-Left & Bottom-Right Page Corner Flip Zones */}
              {pageIdx > 0 && (
                <button
                  type="button"
                  onClick={() => goToChapter(pageIdx - 1)}
                  aria-label="Flip to previous diary page"
                  className="absolute bottom-0 left-0 z-20 h-14 w-16 cursor-pointer opacity-0"
                />
              )}
              {pageIdx < totalPages - 1 && (
                <button
                  type="button"
                  onClick={() => goToChapter(pageIdx + 1)}
                  aria-label="Flip to next diary page"
                  className="absolute right-0 bottom-0 z-20 h-14 w-16 cursor-pointer opacity-0"
                />
              )}
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Secondary Diary Control Row (below book, above BottomNav) */}
        <div className="mt-3.5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToChapter(pageIdx - 1)}
            disabled={pageIdx === 0}
            aria-label="Previous diary page"
            className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-all active:scale-95 ${
              pageIdx === 0
                ? 'cursor-not-allowed border-[#E8DADF] text-[#C8B7BE]'
                : 'border-[#E6B8C5] text-[#2D192B] hover:bg-[#FFF5F7]'
            }`}
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.3]" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-sm">
            <span className="flex items-center gap-1" aria-hidden="true">
              {chapters.map((ch, idx) => (
                <span
                  key={ch.chapterNumber}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === pageIdx ? 'w-3.5 bg-[#E12D53]' : 'w-1.5 bg-[#D9C7CF]'
                  }`}
                />
              ))}
            </span>
            <span className="text-[12px] font-semibold text-[#2D192B] tabular-nums">
              Page {pageIdx + 1} of {totalPages}
            </span>
          </div>

          <button
            type="button"
            onClick={() => goToChapter(pageIdx + 1)}
            disabled={pageIdx === totalPages - 1}
            aria-label="Next diary page"
            className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-all active:scale-95 ${
              pageIdx === totalPages - 1
                ? 'cursor-not-allowed border-[#E8DADF] text-[#C8B7BE]'
                : 'border-[#E6B8C5] text-[#2D192B] hover:bg-[#FFF5F7]'
            }`}
          >
            <ChevronRight className="h-4 w-4 stroke-[2.3]" />
          </button>
        </div>
      </div>
    </section>
  );
}
