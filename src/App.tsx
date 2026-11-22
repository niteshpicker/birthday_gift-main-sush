import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { mockData } from './data/mockData';
import { AudioToggle, useBirthdayAudio } from './components/AudioToggle';
import { BottomNav } from './components/BottomNav';
import { Page0Cover } from './components/Page0Cover';
import { Page1Letter } from './components/Page1Letter';
import { Page2Diary } from './components/Page2Diary';
import { Page3Wishes } from './components/Page3Wishes';
import { Page4Photobooth } from './components/Page4Photobooth';
import { Page5Candles } from './components/Page5Candles';
import { Page6Finale } from './components/Page6Finale';
import { Page7Videos } from './components/Page7Videos';

export function App() {
  // 0 = Cover page; 1..pages.length = Content pages
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isLetterFull, setIsLetterFull] = useState<boolean>(false);

  const { isPlaying, isMuted, startAudio, toggleMute, pauseForVideo, resumeAfterVideo } = useBirthdayAudio();

  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const totalContentPages = mockData.pages.length;

  const navigateTo = (targetPage: number) => {
    const clamped = Math.max(0, Math.min(totalContentPages, targetPage));
    if (clamped === currentPage) return;
    setDirection(clamped > currentPage ? 1 : -1);
    setIsLetterFull(false);
    setCurrentPage(clamped);
  };

  const handleOpenGift = () => {
    startAudio();
    navigateTo(1);
  };

  // Horizontal swipe gestures active ONLY from Page 1 onwards
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (currentPage === 0 || !e.isPrimary) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (currentPage === 0 || !e.isPrimary || !pointerStartRef.current) return;
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dt = Date.now() - start.time;

    // Require clear horizontal swipe
    if (dt < 650 && Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && currentPage < totalContentPages) {
        navigateTo(currentPage + 1);
      } else if (dx > 0 && currentPage > 0) {
        navigateTo(currentPage - 1);
      }
    }
  };

  const activeContentPage = currentPage >= 1 ? mockData.pages[currentPage - 1] : null;

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center overscroll-none bg-gradient-to-br from-[#FFF7F1] via-[#FCEEE9] to-[#FBE2DD] p-0 sm:p-4 select-none">
      {/* Desktop Phone Frame Wrapper */}
      <div className="relative flex items-center justify-center w-full sm:w-auto">
        {/* Decorative side hardware buttons on desktop frame */}
        <span
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-[120px] h-10 w-[4px] rounded-l bg-[#C9BCB7]"
        />
        <span
          aria-hidden="true"
          className="hidden sm:block absolute -right-[3px] top-[148px] h-16 w-[4px] rounded-r bg-[#C9BCB7]"
        />

        {/* Mobile Viewport Container: 100vw x 100dvh on mobile, max-w-[393px] h-[852px] max-h-[95dvh] on desktop */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartRef.current = null;
          }}
          className="relative h-dvh w-screen touch-pan-y overscroll-none overflow-hidden bg-[#FDF5EE] sm:h-[852px] sm:max-h-[95dvh] sm:w-[393px] sm:max-w-[393px] sm:rounded-[46px] sm:border-[8px] sm:border-[#DBD0CB] sm:shadow-[0_24px_65px_rgba(45,25,43,0.16)]"
        >
          {/* Global Top-Right Floating Audio Toggle */}
          <AudioToggle
            isPlaying={isPlaying}
            isMuted={isMuted}
            onToggle={toggleMute}
            shiftLeft={currentPage === 1 && isLetterFull}
          />

          {/* Page Content Area */}
          <AnimatePresence mode="wait" custom={direction}>
            {currentPage === 0 ? (
              <motion.div
                key="page-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="h-full w-full"
              >
                <Page0Cover onOpenGift={handleOpenGift} />
              </motion.div>
            ) : activeContentPage?.id === 'letter' ? (
              <motion.div
                key="page-letter"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page1Letter onFullStateChange={setIsLetterFull} />
              </motion.div>
            ) : activeContentPage?.id === 'story' ? (
              <motion.div
                key="page-story"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page2Diary />
              </motion.div>
            ) : activeContentPage?.id === 'wishes' ? (
              <motion.div
                key="page-wishes"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page3Wishes />
              </motion.div>
            ) : activeContentPage?.id === 'moments' ? (
              <motion.div
                key="page-moments"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page4Photobooth page={activeContentPage} />
              </motion.div>
            ) : activeContentPage?.id === 'candles' ? (
              <motion.div
                key="page-candles"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page5Candles page={activeContentPage} />
              </motion.div>
            ) : activeContentPage?.id === 'videos' ? (
              <motion.div
                key="page-videos"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page7Videos onVideoPlay={pauseForVideo} onVideoPause={resumeAfterVideo} />
              </motion.div>
            ) : activeContentPage?.id === 'wish' ? (
              <motion.div
                key="page-wish"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Page6Finale
                  onWatchAgain={() => navigateTo(0)}
                  onSelectPage={(pageNum) => navigateTo(pageNum)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Bottom Navigation Bar (only rendered from Page 1 onwards) */}
          {currentPage >= 1 && (
            <BottomNav
              pages={mockData.pages}
              currentPage={currentPage}
              onPrev={() => navigateTo(currentPage - 1)}
              onNext={() => navigateTo(currentPage + 1)}
              onSelectPage={(pageNum) => navigateTo(pageNum)}
            />
          )}

          {/* Subtle iOS-style bottom home indicator bar inside frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-[#2D192B]/20"
          />
        </div>
      </div>

      {/* Desktop Preview Badge */}
      <div
        aria-hidden="true"
        className="mt-2.5 hidden items-center gap-2 rounded-full border border-[#E4D6D1] bg-white/60 px-4 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-[#4C3843] shadow-sm sm:flex"
      >
        <span>MOBILE PREVIEW</span>
        <span className="text-[#8E7682]">393X852</span>
      </div>
    </main>
  );
}

export default App;
