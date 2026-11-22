import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Heart, Play, SkipBack, SkipForward } from 'lucide-react';

// Add clips to public/videos and update these paths. The first clip is shown
// after the gift is opened; only one video is played at a time.
const birthdayVideos = [
  { title: 'A birthday wish for you', src: '/videos/birthday-wish-1.mp4' },
  { title: 'One more little message', src: '/videos/birthday-wish-2.mp4' },

];

interface Page7VideosProps {
  onVideoPlay: () => void;
  onVideoPause: () => void;
}

export function Page7Videos({ onVideoPlay, onVideoPause }: Page7VideosProps) {
  const [opened, setOpened] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const video = birthdayVideos[activeVideo];

  return (
    <section className="relative flex h-full w-full flex-col items-center overflow-y-auto bg-[#FFF8F3] px-6 pb-28 pt-[max(4.5rem,env(safe-area-inset-top))] text-center">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C7737E]">
        <Heart className="h-3.5 w-3.5 fill-current" /> A little surprise
      </div>
      <h1 className="font-serif text-[32px] leading-tight text-[#432A38]">Birthday wishes<br />just for you</h1>
      <p className="mt-3 max-w-[270px] text-[13px] leading-6 text-[#806D77]">
        {opened ? 'A little collection of love, one message at a time.' : 'There are a few messages waiting inside this little gift.'}
      </p>

      {!opened ? (
        <motion.button
          type="button"
          aria-label="Open your birthday video gift"
          onClick={() => setOpened(true)}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="group relative mt-14 flex h-52 w-56 items-center justify-center rounded-[30px] bg-[#F4A7A9] shadow-[0_18px_35px_rgba(173,94,107,0.22)]"
        >
          <span aria-hidden="true" className="absolute -top-5 left-1/2 h-10 w-[244px] -translate-x-1/2 rounded-2xl border-4 border-[#F9CDD0] bg-[#E9828D] shadow-md" />
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-[#FFE6C7]" />
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 bg-[#FFE6C7]" />
          <span className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 text-[#D6536D] drop-shadow-sm">
            <Gift className="h-16 w-16 stroke-[1.6]" />
          </span>
          <span className="relative z-10 mt-7 rounded-full bg-white/90 px-5 py-2 text-xs font-bold tracking-wide text-[#8D3F56] shadow-sm transition group-hover:bg-white">TAP TO OPEN</span>
          <span aria-hidden="true" className="absolute -right-5 top-6 text-2xl">✦</span>
          <span aria-hidden="true" className="absolute -left-6 bottom-7 text-xl text-white">✦</span>
        </motion.button>
      ) : (
        <div className="mt-7 w-full max-w-[320px]">
          <AnimatePresence mode="wait">
            <motion.div key={video.src} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="overflow-hidden rounded-[26px] border-[5px] border-white bg-[#F2E6E3] shadow-[0_16px_36px_rgba(75,44,61,0.14)]">
                <video key={video.src} className="aspect-[9/13] w-full bg-[#2D192B] object-contain" controls playsInline preload="metadata" onPlay={onVideoPlay} onPause={onVideoPause} onEnded={onVideoPause}>
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
              <p className="mt-4 text-sm font-bold text-[#432A38]">{video.title}</p>
              <p className="mt-1 text-[11px] font-medium tracking-wider text-[#A18591]">{String(activeVideo + 1).padStart(2, '0')} / {String(birthdayVideos.length).padStart(2, '0')}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setActiveVideo((activeVideo - 1 + birthdayVideos.length) % birthdayVideos.length)} aria-label="Previous video" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#7B5265] shadow-sm"><SkipBack className="h-4 w-4" /></button>
            <button type="button" onClick={() => setActiveVideo((activeVideo + 1) % birthdayVideos.length)} className="flex h-11 items-center gap-2 rounded-full bg-[#E12D53] px-5 text-xs font-bold text-white shadow-[0_5px_14px_rgba(225,45,83,0.25)]"><Play className="h-4 w-4 fill-current" /> Next wish</button>
            <button type="button" onClick={() => setActiveVideo((activeVideo + 1) % birthdayVideos.length)} aria-label="Next video" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#7B5265] shadow-sm"><SkipForward className="h-4 w-4" /></button>
          </div>
          <p className="mt-4 text-[10px] leading-5 text-[#A18591]">Add your MP4 clips to <code>public/videos</code> and name them birthday-wish-1.mp4, birthday-wish-2.mp4, and birthday-wish-3.mp4.</p>
        </div>
      )}
      {!opened && <p className="mt-8 text-[11px] font-semibold tracking-[0.12em] text-[#B18591]">YOUR SURPRISE IS WAITING</p>}
    </section>
  );
}
