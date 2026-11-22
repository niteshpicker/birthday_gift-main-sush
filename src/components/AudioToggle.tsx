import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, VolumeX } from 'lucide-react';
import { mockData } from '../data/mockData';

export interface AudioController {
  isPlaying: boolean;
  isMuted: boolean;
  startAudio: () => void;
  toggleMute: () => void;
  pauseForVideo: () => void;
  resumeAfterVideo: () => void;
}

// Gentle music-box notes (Happy Birthday in C major) used as zero-fail fallback if external audio is blocked/offline
const MUSIC_BOX_NOTES: Array<{ freq: number; beats: number }> = [
  { freq: 392.0, beats: 0.75 }, // G4
  { freq: 392.0, beats: 0.25 }, // G4
  { freq: 440.0, beats: 1.0 },  // A4
  { freq: 392.0, beats: 1.0 },  // G4
  { freq: 523.25, beats: 1.0 }, // C5
  { freq: 493.88, beats: 2.0 }, // B4

  { freq: 392.0, beats: 0.75 }, // G4
  { freq: 392.0, beats: 0.25 }, // G4
  { freq: 440.0, beats: 1.0 },  // A4
  { freq: 392.0, beats: 1.0 },  // G4
  { freq: 587.33, beats: 1.0 }, // D5
  { freq: 523.25, beats: 2.0 }, // C5

  { freq: 392.0, beats: 0.75 }, // G4
  { freq: 392.0, beats: 0.25 }, // G4
  { freq: 783.99, beats: 1.0 }, // G5
  { freq: 659.25, beats: 1.0 }, // E5
  { freq: 523.25, beats: 1.0 }, // C5
  { freq: 493.88, beats: 1.0 }, // B4
  { freq: 440.0, beats: 1.5 },  // A4

  { freq: 698.46, beats: 0.75 }, // F5
  { freq: 698.46, beats: 0.25 }, // F5
  { freq: 659.25, beats: 1.0 },  // E5
  { freq: 523.25, beats: 1.0 },  // C5
  { freq: 587.33, beats: 1.0 },  // D5
  { freq: 523.25, beats: 2.5 },  // C5
];

export function useBirthdayAudio(): AudioController {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const noteIdxRef = useRef<number>(0);
  const usingFallbackRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const isStartingRef = useRef(false);
  const wasPausedOnHideRef = useRef(false);
  const wasPlayingBeforeVideoRef = useRef(false);
  const pausedForVideoRef = useRef(false);

  const stopSynthLoop = useCallback(() => {
    if (synthTimerRef.current !== null) {
      window.clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  }, []);

  const scheduleNextSynthNote = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain || !usingFallbackRef.current) return;

    const note = MUSIC_BOX_NOTES[noteIdxRef.current % MUSIC_BOX_NOTES.length];
    noteIdxRef.current = (noteIdxRef.current + 1) % MUSIC_BOX_NOTES.length;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now);

    // Subtle music-box bell overtone
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(note.freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.06, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.5);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(note.beats * 0.55, 1.3));

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.4);
    overtone.stop(now + 0.6);

    const ms = note.beats * 460;
    synthTimerRef.current = window.setTimeout(scheduleNextSynthNote, ms);
  }, []);

  const startSynthFallback = useCallback(
    (muted: boolean) => {
      usingFallbackRef.current = true;
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextCtor();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume();
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(muted ? 0 : 0.45, audioCtxRef.current.currentTime);
      }

      stopSynthLoop();
      scheduleNextSynthNote();
      isPlayingRef.current = true;
      setIsPlaying(true);
    },
    [scheduleNextSynthNote, stopSynthLoop]
  );

  useEffect(() => {
    const audio = new Audio(mockData.audioUrl);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.55;
    audioRef.current = audio;

    const handleError = () => {
      if ((isPlayingRef.current || isStartingRef.current) && !usingFallbackRef.current) {
        isStartingRef.current = false;
        startSynthFallback(isMutedRef.current);
      }
    };

    const pauseForBackground = () => {
      if (!isPlayingRef.current || isMutedRef.current) return;
      wasPausedOnHideRef.current = true;
      if (!usingFallbackRef.current) {
        audio.pause();
      } else {
        stopSynthLoop();
        void audioCtxRef.current?.suspend();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseForBackground();
      } else if (wasPausedOnHideRef.current) {
        wasPausedOnHideRef.current = false;
        if (isMutedRef.current) return;
        if (!usingFallbackRef.current) {
          void audio.play().catch(() => {});
        } else if (audioCtxRef.current) {
          void audioCtxRef.current.resume().then(() => {
            scheduleNextSynthNote();
          });
        }
      }
    };

    audio.addEventListener('error', handleError);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseForBackground);
    return () => {
      audio.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseForBackground);
      audio.pause();
      stopSynthLoop();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, [scheduleNextSynthNote, startSynthFallback, stopSynthLoop]);

  const startAudio = useCallback(() => {
    if (isPlayingRef.current || isStartingRef.current) return;
    isMutedRef.current = false;
    setIsMuted(false);

    const audio = audioRef.current;
    if (audio && !usingFallbackRef.current) {
      audio.muted = false;
      isStartingRef.current = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isStartingRef.current = false;
            audio.muted = isMutedRef.current;
            isPlayingRef.current = true;
            setIsPlaying(true);
            if (document.hidden && !isMutedRef.current) {
              wasPausedOnHideRef.current = true;
              audio.pause();
            }
          })
          .catch(() => {
            isStartingRef.current = false;
            startSynthFallback(isMutedRef.current);
          });
        return;
      }
      isStartingRef.current = false;
      isPlayingRef.current = true;
      setIsPlaying(true);
      return;
    }

    startSynthFallback(false);
  }, [startSynthFallback]);

  const toggleMute = useCallback(() => {
    if (!isPlayingRef.current && !isStartingRef.current) {
      startAudio();
      return;
    }

    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    if (audioRef.current && !usingFallbackRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && audioRef.current.paused && isPlayingRef.current && !pausedForVideoRef.current) {
        void audioRef.current.play().catch(() => {});
      }
    }
    if (audioCtxRef.current && gainNodeRef.current) {
      if (!nextMuted && audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume().then(() => {
          scheduleNextSynthNote();
        });
      }
      gainNodeRef.current.gain.setTargetAtTime(
        nextMuted ? 0 : 0.45,
        audioCtxRef.current.currentTime,
        0.04
      );
    }
  }, [scheduleNextSynthNote, startAudio]);

  const pauseForVideo = useCallback(() => {
    pausedForVideoRef.current = true;
    wasPlayingBeforeVideoRef.current = isPlayingRef.current && !isMutedRef.current;
    if (!wasPlayingBeforeVideoRef.current) return;
    if (!usingFallbackRef.current) {
      audioRef.current?.pause();
    } else {
      stopSynthLoop();
      void audioCtxRef.current?.suspend();
    }
  }, [stopSynthLoop]);

  const resumeAfterVideo = useCallback(() => {
    pausedForVideoRef.current = false;
    if (!wasPlayingBeforeVideoRef.current || isMutedRef.current) return;
    wasPlayingBeforeVideoRef.current = false;
    if (!usingFallbackRef.current) {
      void audioRef.current?.play().catch(() => {});
    } else if (audioCtxRef.current) {
      void audioCtxRef.current.resume().then(() => scheduleNextSynthNote());
    }
  }, [scheduleNextSynthNote]);

  return { isPlaying, isMuted, startAudio, toggleMute, pauseForVideo, resumeAfterVideo };
}

interface AudioToggleProps {
  isPlaying: boolean;
  isMuted: boolean;
  onToggle: () => void;
  shiftLeft?: boolean;
}

export function AudioToggle({
  isPlaying,
  isMuted,
  onToggle,
  shiftLeft = false,
}: AudioToggleProps) {
  const active = isPlaying && !isMuted;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Mute background music' : 'Play background music'}
      aria-pressed={active}
      animate={{ right: shiftLeft ? 114 : 16, top: shiftLeft ? 24 : 16 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={`absolute z-50 flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-shadow duration-200 active:scale-95 ${
        shiftLeft ? 'h-9 px-2.5' : 'px-3 py-2'
      } ${
        active
          ? 'border-[#F4C4D0] bg-white/90 text-[#E12D53] shadow-[0_6px_18px_rgba(225,45,83,0.18)]'
          : 'border-[#E9DDE1] bg-white/85 text-[#8A717B] shadow-[0_4px_12px_rgba(45,25,43,0.08)]'
      }`}
    >
      {/* Floating musical notes when actively playing */}
      <AnimatePresence>
        {active && (
          <motion.span
            key="note-1"
            aria-hidden="true"
            initial={{ opacity: 0, y: 2, scale: 0.7 }}
            animate={{
              opacity: [0, 0.9, 0],
              y: [-2, -14],
              x: [0, -4],
              scale: [0.8, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-1 left-2 text-[11px] font-bold text-[#E12D53]"
          >
            ♪
          </motion.span>
        )}
      </AnimatePresence>

      {active ? (
        <Music2 className="h-4 w-4 shrink-0 text-[#E12D53]" />
      ) : (
        <VolumeX className="h-4 w-4 shrink-0 text-[#8A717B]" />
      )}

      {/* Animated soundwave bars */}
      <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <motion.span
            key={bar}
            className={`w-[2.5px] rounded-full ${active ? 'bg-[#E12D53]' : 'bg-[#B9A7AF]'}`}
            animate={
              active
                ? {
                    height: ['4px', bar === 1 ? '14px' : '11px', '5px', '13px', '4px'],
                  }
                : { height: bar === 1 ? '6px' : '4px' }
            }
            transition={
              active
                ? {
                    duration: 0.9 + bar * 0.18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : { duration: 0.2 }
            }
          />
        ))}
      </span>
    </motion.button>
  );
}
