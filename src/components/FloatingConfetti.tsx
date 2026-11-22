import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: string;
  y: string;
  rotate: number;
  color: string;
  shape: 'pill' | 'dot';
  width: number;
  height: number;
  delay: number;
}

const CONFETTI_PIECES: ConfettiPiece[] = [
  { id: 1, x: '13%', y: '8%', rotate: 22, color: '#F39CB2', shape: 'pill', width: 5, height: 14, delay: 0 },
  { id: 2, x: '68%', y: '10%', rotate: 16, color: '#AEE1D3', shape: 'pill', width: 5, height: 14, delay: 0.4 },
  { id: 3, x: '81%', y: '23%', rotate: -78, color: '#AEE1D3', shape: 'pill', width: 4, height: 12, delay: 0.8 },
  { id: 4, x: '58%', y: '34%', rotate: -48, color: '#F58574', shape: 'pill', width: 5, height: 13, delay: 0.2 },
  { id: 5, x: '20%', y: '38%', rotate: -42, color: '#C2A8E5', shape: 'pill', width: 5, height: 13, delay: 1.0 },
  { id: 6, x: '90%', y: '51%', rotate: -32, color: '#F5DA7B', shape: 'pill', width: 4, height: 12, delay: 0.5 },
  { id: 7, x: '9%', y: '60%', rotate: 32, color: '#F5DA7B', shape: 'pill', width: 4, height: 11, delay: 0.9 },
  { id: 8, x: '92%', y: '83%', rotate: -62, color: '#F39CB2', shape: 'pill', width: 4, height: 11, delay: 0.3 },
  { id: 9, x: '38%', y: '11%', rotate: 0, color: '#F8A9BD', shape: 'dot', width: 6, height: 6, delay: 0.6 },
  { id: 10, x: '77%', y: '71%', rotate: 15, color: '#F5B5C5', shape: 'dot', width: 5, height: 5, delay: 1.1 },
];

export function FloatingConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {CONFETTI_PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            borderRadius: '9999px',
            rotate: piece.rotate,
          }}
          className="absolute opacity-80"
          animate={{
            y: [0, -7, 0, 5, 0],
            rotate: [piece.rotate, piece.rotate + 10, piece.rotate - 8, piece.rotate],
          }}
          transition={{
            duration: 5.5 + (piece.id % 3),
            delay: piece.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
