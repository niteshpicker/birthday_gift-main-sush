import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Sparkles } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { mockData, WishItem } from '../data/mockData';

interface StripTheme {
  bg: string;
  bgTo: string;
  border: string;
  starPrimary: string;
  starLight: string;
  starDark: string;
  starGlow: string;
}

const STRIP_THEMES: Record<WishItem['color'], StripTheme> = {
  pink: {
    bg: '#FDECF2',
    bgTo: '#F9DDE7',
    border: '#F4C4D5',
    starPrimary: '#F78EB1',
    starLight: '#FFD8E6',
    starDark: '#D8527E',
    starGlow: 'rgba(247, 142, 177, 0.6)',
  },
  lavender: {
    bg: '#F2ECFC',
    bgTo: '#E7DCF9',
    border: '#D6C3F4',
    starPrimary: '#B08CEB',
    starLight: '#E5D8FE',
    starDark: '#8259C8',
    starGlow: 'rgba(176, 140, 235, 0.6)',
  },
  mint: {
    bg: '#E6F8F1',
    bgTo: '#D7F1E7',
    border: '#B7E5D4',
    starPrimary: '#76D3B3',
    starLight: '#CAFAEA',
    starDark: '#41A683',
    starGlow: 'rgba(118, 211, 179, 0.6)',
  },
  yellow: {
    bg: '#FEF6DA',
    bgTo: '#FAECC2',
    border: '#F2DC92',
    starPrimary: '#F8CE57',
    starLight: '#FFF3BD',
    starDark: '#D9A01C',
    starGlow: 'rgba(248, 206, 87, 0.6)',
  },
  coral: {
    bg: '#FEEDEA',
    bgTo: '#FBE0D7',
    border: '#F6C4B6',
    starPrimary: '#F78E82',
    starLight: '#FFD7D1',
    starDark: '#D85B4E',
    starGlow: 'rgba(247, 142, 130, 0.6)',
  },
  sky: {
    bg: '#E8F4FD',
    bgTo: '#D8ECFB',
    border: '#B5DBF7',
    starPrimary: '#74C7F2',
    starLight: '#CEEEFF',
    starDark: '#3E9CD1',
    starGlow: 'rgba(116, 199, 242, 0.6)',
  },
  apricot: {
    bg: '#FFF1E4',
    bgTo: '#FDE3CB',
    border: '#F7C99E',
    starPrimary: '#FFB36B',
    starLight: '#FFE2C4',
    starDark: '#DC8132',
    starGlow: 'rgba(255, 179, 107, 0.6)',
  },
  orchid: {
    bg: '#F8EAFA',
    bgTo: '#F1D8F6',
    border: '#E4B7EE',
    starPrimary: '#E895D8',
    starLight: '#FFD8F8',
    starDark: '#C25CB0',
    starGlow: 'rgba(232, 149, 216, 0.6)',
  },
  lime: {
    bg: '#EEF9E6',
    bgTo: '#DFF3D1',
    border: '#C0E5A8',
    starPrimary: '#9BE07A',
    starLight: '#DCFBC9',
    starDark: '#63B541',
    starGlow: 'rgba(155, 224, 122, 0.6)',
  },
  aqua: {
    bg: '#E6F9FA',
    bgTo: '#D4F2F4',
    border: '#AAE2E7',
    starPrimary: '#7ADCE0',
    starLight: '#CEFBFC',
    starDark: '#3FAEB4',
    starGlow: 'rgba(122, 220, 224, 0.6)',
  },
};

const TILT_ANGLES = [-1.35, 1.05, -0.85, 1.2, -0.95];

const JAR_STAR_COLORS = [
  '#F78EB1',
  '#F8CE57',
  '#76D3B3',
  '#B08CEB',
  '#F78E82',
  '#74C7F2',
  '#FFB36B',
  '#E895D8',
  '#9BE07A',
  '#7ADCE0',
  '#FF9EBB',
  '#FFE27A',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function createFloorShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(130, 78, 62, 0.34)');
    grad.addColorStop(0.5, 'rgba(148, 96, 76, 0.16)');
    grad.addColorStop(1, 'rgba(148, 96, 76, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createJarLatheGeometry(): THREE.LatheGeometry {
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(0.0, -0.94),
    new THREE.Vector2(0.56, -0.94),
    new THREE.Vector2(0.81, -0.87),
    new THREE.Vector2(0.9, -0.66),
    new THREE.Vector2(0.91, -0.18),
    new THREE.Vector2(0.88, 0.25),
    new THREE.Vector2(0.76, 0.44),
    new THREE.Vector2(0.55, 0.56),
    new THREE.Vector2(0.49, 0.65),
    new THREE.Vector2(0.49, 0.78),
    new THREE.Vector2(0.57, 0.82),
    new THREE.Vector2(0.57, 0.87),
    new THREE.Vector2(0.47, 0.88),
    new THREE.Vector2(0.44, 0.77),
  ]);
  const smoothPts = curve.getPoints(44);
  return new THREE.LatheGeometry(smoothPts, 48);
}

function createGlassHighlightGeometry(): THREE.LatheGeometry {
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(0.87, -0.64),
    new THREE.Vector2(0.915, -0.2),
    new THREE.Vector2(0.89, 0.22),
    new THREE.Vector2(0.77, 0.42),
  ]);
  return new THREE.LatheGeometry(curve.getPoints(18), 16, -0.95, 0.28);
}

function createPuffyStarGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const points = 5;
  const outerR = 0.142;
  const innerR = 0.068;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.034,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.042,
  });
  geom.center();
  return geom;
}

// Module-level singletons avoid regenerating Three.js geometries/textures on every Page 3 mount
let sharedJarGeo: THREE.LatheGeometry | null = null;
let sharedStreakGeo: THREE.LatheGeometry | null = null;
let sharedStarGeo: THREE.ExtrudeGeometry | null = null;
let sharedShadowTex: THREE.CanvasTexture | null = null;

function getSharedJarGeo(): THREE.LatheGeometry {
  if (!sharedJarGeo) sharedJarGeo = createJarLatheGeometry();
  return sharedJarGeo;
}

function getSharedStreakGeo(): THREE.LatheGeometry {
  if (!sharedStreakGeo) sharedStreakGeo = createGlassHighlightGeometry();
  return sharedStreakGeo;
}

function getSharedStarGeo(): THREE.ExtrudeGeometry {
  if (!sharedStarGeo) sharedStarGeo = createPuffyStarGeometry();
  return sharedStarGeo;
}

function getSharedShadowTex(): THREE.CanvasTexture {
  if (!sharedShadowTex) sharedShadowTex = createFloorShadowTexture();
  return sharedShadowTex;
}

function GlassStreakHighlight() {
  const streakGeo = useMemo(() => getSharedStreakGeo(), []);

  return (
    <mesh geometry={streakGeo} scale={1.006} rotation={[0, -0.25, 0]}>
      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.44}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

interface StarParticleSpec {
  id: number;
  basePos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  phase: number;
}

interface WishingJarSceneProps {
  targetYawRef: React.MutableRefObject<number>;
  targetPitchRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  isHoldingRef: React.MutableRefObject<boolean>;
  shakeImpulseRef: React.MutableRefObject<{
    velZ: number;
    velX: number;
    swirlEnergy: number;
  }>;
  onSceneReady?: () => void;
}

function WishingJarScene({
  targetYawRef,
  targetPitchRef,
  isDraggingRef,
  isHoldingRef,
  shakeImpulseRef,
  onSceneReady,
}: WishingJarSceneProps) {
  const jarGroupRef = useRef<THREE.Group>(null);
  const corkRef = useRef<THREE.Group>(null);
  const starRefs = useRef<(THREE.Mesh | null)[]>([]);
  const shakeAngleZ = useRef(0);
  const shakeAngleX = useRef(0);
  const shakeOffsetY = useRef(0);
  const frameCountRef = useRef(0);
  const readyFiredRef = useRef(false);
  const onSceneReadyRef = useRef(onSceneReady);
  onSceneReadyRef.current = onSceneReady;

  const jarGeo = useMemo(() => getSharedJarGeo(), []);
  const starGeo = useMemo(() => getSharedStarGeo(), []);
  const shadowTex = useMemo(() => getSharedShadowTex(), []);

  const starsData = useMemo<StarParticleSpec[]>(() => {
    const specs: StarParticleSpec[] = [];
    for (let i = 0; i < 30; i++) {
      // Cluster larger colorful stars richly from jar floor up into lower-mid belly
      const layerT = i / 29;
      const y = -0.66 + layerT * 0.94 + (seededRandom(i * 11 + 1) - 0.5) * 0.08;
      const maxR = y > 0.18 ? 0.44 : 0.56;
      const radial = Math.sqrt(seededRandom(i * 13 + 3)) * maxR;
      const angle = seededRandom(i * 17 + 5) * Math.PI * 2;
      specs.push({
        id: i,
        basePos: [Math.cos(angle) * radial, y, Math.sin(angle) * radial],
        rot: [
          seededRandom(i * 19 + 7) * Math.PI,
          seededRandom(i * 23 + 9) * Math.PI,
          seededRandom(i * 29 + 11) * Math.PI,
        ],
        scale: 0.96 + seededRandom(i * 31 + 13) * 0.36,
        color: JAR_STAR_COLORS[i % JAR_STAR_COLORS.length],
        speed: 0.9 + seededRandom(i * 37 + 15) * 0.9,
        phase: seededRandom(i * 41 + 17) * Math.PI * 2,
      });
    }
    return specs;
  }, []);

  const corkSpecks = useMemo(() => {
    const pts: Array<{ pos: [number, number, number]; scale: number }> = [];
    for (let i = 0; i < 12; i++) {
      const a = seededRandom(i * 7 + 2) * Math.PI * 2;
      const y = 0.78 + seededRandom(i * 9 + 4) * 0.24;
      const r = 0.42;
      pts.push({
        pos: [Math.cos(a) * r, y, Math.sin(a) * r],
        scale: 0.018 + seededRandom(i * 5 + 1) * 0.014,
      });
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!readyFiredRef.current) {
      frameCountRef.current += 1;
      if (frameCountRef.current >= 3) {
        readyFiredRef.current = true;
        onSceneReadyRef.current?.();
      }
    }

    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    // Spring-damped shake physics + continuous rhythmic shake while holding
    const imp = shakeImpulseRef.current;
    if (isHoldingRef.current) {
      imp.swirlEnergy = Math.max(imp.swirlEnergy, 1.15);
      imp.velZ += Math.sin(t * 28) * 28 * dt;
      imp.velX += Math.cos(t * 22) * 14 * dt;
    }

    const springK = 145;
    const damping = 9.5;

    const accZ = -springK * shakeAngleZ.current - damping * imp.velZ;
    imp.velZ += accZ * dt;
    shakeAngleZ.current += imp.velZ * dt;

    const accX = -springK * shakeAngleX.current - damping * imp.velX;
    imp.velX += accX * dt;
    shakeAngleX.current += imp.velX * dt;

    shakeOffsetY.current = THREE.MathUtils.lerp(
      shakeOffsetY.current,
      Math.abs(imp.velZ) * 0.015 + (isHoldingRef.current ? 0.025 : 0),
      dt * 12
    );

    imp.swirlEnergy = Math.max(0, imp.swirlEnergy - dt * (isHoldingRef.current ? 0.45 : 1.15));

    if (!isDraggingRef.current) {
      // Softly relax drag tilt back toward natural slight idle sway
      targetYawRef.current = THREE.MathUtils.lerp(
        targetYawRef.current,
        Math.sin(t * 0.85) * 0.14,
        dt * 2.2
      );
      targetPitchRef.current = THREE.MathUtils.lerp(targetPitchRef.current, 0, dt * 3.5);
    }

    if (jarGroupRef.current) {
      jarGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        jarGroupRef.current.rotation.y,
        targetYawRef.current,
        dt * 10
      );
      jarGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        jarGroupRef.current.rotation.x,
        0.11 + targetPitchRef.current + shakeAngleX.current,
        dt * 12
      );
      jarGroupRef.current.rotation.z = shakeAngleZ.current;
      jarGroupRef.current.position.y =
        -0.04 + Math.sin(t * 1.4) * 0.02 + shakeOffsetY.current;
    }

    if (corkRef.current) {
      corkRef.current.position.y =
        Math.abs(shakeAngleZ.current) * 0.14 + imp.swirlEnergy * 0.045;
      corkRef.current.rotation.z = -0.03 + shakeAngleZ.current * 0.42;
    }

    // Animate 28 puffy origami stars floating + swirling inside the jar
    const swirlBoost = imp.swirlEnergy;
    for (let i = 0; i < starsData.length; i++) {
      const mesh = starRefs.current[i];
      if (!mesh) continue;
      const spec = starsData[i];
      const bob = Math.sin(t * spec.speed + spec.phase) * (0.024 + swirlBoost * 0.09);
      const swirlAngle = swirlBoost * (0.8 + (i % 4) * 0.25) * Math.sin(t * 8 + spec.phase);
      const cosA = Math.cos(swirlAngle);
      const sinA = Math.sin(swirlAngle);
      const bx = spec.basePos[0];
      const bz = spec.basePos[2];

      mesh.position.set(
        bx * cosA - bz * sinA,
        spec.basePos[1] + bob + swirlBoost * 0.08 * seededRandom(i + 2),
        bx * sinA + bz * cosA
      );
      mesh.rotation.x = spec.rot[0] + t * 0.35 * spec.speed + swirlBoost * 1.6;
      mesh.rotation.y = spec.rot[1] + t * 0.45 * spec.speed + swirlBoost * 2.1;
      mesh.rotation.z = spec.rot[2] + Math.sin(t * 0.9 + spec.phase) * 0.16;
    }
  });

  return (
    <>
      {/* Offline Procedural Environment Reflections for Realistic Clear Glass */}
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#FFFBF0"
          position={[3, 2.5, 3]}
          rotation={[0, -0.7, 0]}
          scale={[4, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.0}
          color="#FFE3EC"
          position={[-3, 1.5, 2.5]}
          rotation={[0, 0.7, 0]}
          scale={[3.5, 4, 1]}
        />
        <Lightformer
          form="circle"
          intensity={3.0}
          color="#FFFFFF"
          position={[0, 4.5, 1.5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={3.5}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#FFF1CC"
          position={[0, -2.5, 2]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[4, 2, 1]}
        />
      </Environment>

      <ambientLight intensity={0.62} color="#FFF6EA" />
      <directionalLight position={[2.8, 4.5, 4.2]} intensity={1.35} color="#FFFDF8" />
      <directionalLight position={[-3.2, 1.8, 2.5]} intensity={0.65} color="#FFE7F1" />

      {/* Ground Contact Shadow */}
      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 2.15]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>

      {/* Outer Magic Stardust Sparkles */}
      <Sparkles
        count={32}
        scale={[3.1, 2.5, 2.2]}
        size={2.8}
        speed={0.58}
        opacity={0.85}
        color="#FFD65C"
      />

      {/* Interactive Wishing Jar Assembly */}
      <group ref={jarGroupRef} position={[0, -0.04, 0]} scale={1.04}>
        {/* Warm Internal Candlelight Glow Illuminating the Stars */}
        <pointLight
          position={[0, -0.12, 0.22]}
          color="#FFD875"
          intensity={1.25}
          distance={3.2}
        />

        {/* 28 Puffy 3D Origami Lucky Stars */}
        <group>
          {starsData.map((star, idx) => (
            <mesh
              key={star.id}
              ref={(el) => {
                starRefs.current[idx] = el;
              }}
              geometry={starGeo}
              position={star.basePos}
              rotation={star.rot}
              scale={star.scale}
            >
              <meshStandardMaterial
                color={star.color}
                roughness={0.32}
                metalness={0.04}
                emissive={star.color}
                emissiveIntensity={0.08}
              />
            </mesh>
          ))}
        </group>

        {/* Thick Rounded Frosted Glass Base Puck */}
        <mesh position={[0, -0.86, 0]}>
          <cylinderGeometry args={[0.78, 0.68, 0.14, 36]} />
          <meshStandardMaterial
            color="#FFF2DF"
            roughness={0.2}
            metalness={0.05}
            transparent
            opacity={0.34}
            depthWrite={false}
          />
        </mesh>

        {/* Warm Translucent Inner Glass Contour Wall */}
        <mesh geometry={jarGeo} scale={0.992}>
          <meshPhysicalMaterial
            color="#F5D5AF"
            roughness={0.14}
            clearcoat={0.8}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Crystal-Clear Glossy Outer Glass Shell */}
        <mesh geometry={jarGeo}>
          <meshPhysicalMaterial
            color="#FFFDF8"
            roughness={0.05}
            metalness={0.04}
            clearcoat={1}
            clearcoatRoughness={0.04}
            ior={1.5}
            reflectivity={1}
            envMapIntensity={1.6}
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </mesh>

        {/* Specular Curved Glass Streak Highlight */}
        <GlassStreakHighlight />

        {/* Subtle Glossy Rim Highlight Ring */}
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.525, 0.025, 16, 48]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.08}
            clearcoat={1}
            transparent
            opacity={0.36}
            depthWrite={false}
          />
        </mesh>

        {/* Textured 3D Cork Stopper */}
        <group ref={corkRef}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.45, 0.39, 0.36, 32]} />
            <meshStandardMaterial color="#CA9260" roughness={0.82} metalness={0.02} />
          </mesh>
          <mesh position={[0, 1.075, 0]}>
            <cylinderGeometry args={[0.42, 0.45, 0.035, 32]} />
            <meshStandardMaterial color="#D8A170" roughness={0.78} metalness={0.02} />
          </mesh>
          {corkSpecks.map((sp, sIdx) => (
            <mesh key={sIdx} position={sp.pos} scale={sp.scale}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color="#9E653E" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Sculpted 3D Lavender Satin Ribbon Bow */}
        <group position={[0, 0.64, 0]}>
          {/* Neck Wrap */}
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1.35]}>
            <torusGeometry args={[0.505, 0.038, 16, 48]} />
            <meshPhysicalMaterial
              color="#B798E8"
              roughness={0.32}
              metalness={0.05}
              sheen={0.85}
              sheenColor="#F3EBFF"
            />
          </mesh>

          {/* Center Knot */}
          <mesh position={[0, 0, 0.51]} scale={[1.1, 0.9, 0.85]}>
            <sphereGeometry args={[0.078, 20, 16]} />
            <meshPhysicalMaterial
              color="#CEB4F5"
              roughness={0.28}
              sheen={0.9}
              sheenColor="#FFFFFF"
            />
          </mesh>

          {/* Left Bow Loop */}
          <mesh
            position={[-0.2, 0.045, 0.52]}
            rotation={[0.22, 0.25, 0.32]}
            scale={[1.15, 0.72, 0.55]}
          >
            <torusGeometry args={[0.135, 0.048, 16, 32]} />
            <meshPhysicalMaterial
              color="#B798E8"
              roughness={0.3}
              sheen={0.9}
              sheenColor="#F4EEFF"
            />
          </mesh>

          {/* Right Bow Loop */}
          <mesh
            position={[0.2, 0.045, 0.52]}
            rotation={[0.22, -0.25, -0.32]}
            scale={[1.15, 0.72, 0.55]}
          >
            <torusGeometry args={[0.135, 0.048, 16, 32]} />
            <meshPhysicalMaterial
              color="#B798E8"
              roughness={0.3}
              sheen={0.9}
              sheenColor="#F4EEFF"
            />
          </mesh>

          {/* Left Ribbon Tail */}
          <mesh position={[-0.13, -0.18, 0.53]} rotation={[0.18, 0.15, 0.36]}>
            <boxGeometry args={[0.065, 0.34, 0.02]} />
            <meshPhysicalMaterial
              color="#A583DD"
              roughness={0.35}
              sheen={0.8}
              sheenColor="#EFE6FF"
            />
          </mesh>

          {/* Right Ribbon Tail */}
          <mesh position={[0.13, -0.18, 0.53]} rotation={[0.18, -0.15, -0.36]}>
            <boxGeometry args={[0.065, 0.34, 0.02]} />
            <meshPhysicalMaterial
              color="#A583DD"
              roughness={0.35}
              sheen={0.8}
              sheenColor="#EFE6FF"
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

interface WishingJar3DProps {
  isHolding: boolean;
  onHoldingChange: (holding: boolean) => void;
  onReleaseShake: () => void;
  launchPulse: number;
  onSceneReady?: () => void;
}

function WishingJar3D({
  isHolding,
  onHoldingChange,
  onReleaseShake,
  launchPulse,
  onSceneReady,
}: WishingJar3DProps) {
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoldingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const holdStartRef = useRef(0);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);

  const shakeImpulseRef = useRef({
    velZ: 0,
    velX: 0,
    swirlEnergy: 0,
  });

  useEffect(() => {
    if (launchPulse === 0) return;
    const dir = launchPulse % 2 === 0 ? -1 : 1;
    shakeImpulseRef.current.velZ += dir * 3.8;
    shakeImpulseRef.current.velX += 2.2;
    shakeImpulseRef.current.swirlEnergy = 1.25;
  }, [launchPulse]);

  const triggerJiggle = () => {
    const dir = Math.random() > 0.5 ? 1 : -1;
    shakeImpulseRef.current.velZ += dir * 2.6;
    shakeImpulseRef.current.velX += 1.05;
    shakeImpulseRef.current.swirlEnergy = Math.min(1.2, shakeImpulseRef.current.swirlEnergy + 0.85);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    e.stopPropagation();
    activePointerIdRef.current = e.pointerId;
    isDraggingRef.current = true;
    isHoldingRef.current = true;
    holdStartRef.current = Date.now();
    dragDistanceRef.current = 0;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    onHoldingChange(true);

    const kickDir = Math.random() > 0.5 ? 1 : -1;
    shakeImpulseRef.current.velZ += kickDir * 2.6;
    shakeImpulseRef.current.velX += 1.0;
    shakeImpulseRef.current.swirlEnergy = 1.0;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDraggingRef.current || activePointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    targetYawRef.current = THREE.MathUtils.clamp(targetYawRef.current + dx * 0.015, -1.1, 1.1);
    targetPitchRef.current = THREE.MathUtils.clamp(targetPitchRef.current + dy * 0.008, -0.35, 0.35);
    shakeImpulseRef.current.velZ += THREE.MathUtils.clamp(dx * 0.14, -2.6, 2.6);
    shakeImpulseRef.current.swirlEnergy = Math.min(
      1.3,
      shakeImpulseRef.current.swirlEnergy + Math.abs(dx) * 0.02
    );
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDraggingRef.current || activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    isDraggingRef.current = false;
    isHoldingRef.current = false;
    onHoldingChange(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const heldMs = Date.now() - holdStartRef.current;
    if (heldMs >= 160 || dragDistanceRef.current >= 8) {
      onReleaseShake();
    } else {
      triggerJiggle();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReleaseShake();
        }
      }}
      aria-label="Hũ sao điều ước 3D. Nhấn giữ và lắc rồi thả tay để thả một ngôi sao điều ước ngẫu nhiên."
      className={`relative h-[275px] min-[390px]:h-[300px] w-full touch-none select-none ${
        isHolding ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Warm Ambient Backlight Halo (pulses brighter when shaking) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all duration-300 ${
          isHolding ? 'scale-[1.15] bg-[#FFD86B]/75' : 'bg-[#FFE28A]/55'
        }`}
      />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.14, 4.45], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <WishingJarScene
          targetYawRef={targetYawRef}
          targetPitchRef={targetPitchRef}
          isDraggingRef={isDraggingRef}
          isHoldingRef={isHoldingRef}
          shakeImpulseRef={shakeImpulseRef}
          onSceneReady={onSceneReady}
        />
      </Canvas>
    </div>
  );
}

function ThreeDStarSVG({
  theme,
  gradId,
  className = 'h-full w-full',
}: {
  theme: StripTheme;
  gradId: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={theme.starLight} />
          <stop offset="55%" stopColor={theme.starPrimary} />
          <stop offset="100%" stopColor={theme.starDark} />
        </radialGradient>
      </defs>
      <path
        d="M16 3 L19.8 11 L28.5 12.2 L22.1 18.2 L23.7 27 L16 22.8 L8.3 27 L9.9 18.2 L3.5 12.2 L12.2 11 Z"
        fill={`url(#${gradId})`}
        stroke={theme.starDark}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <ellipse cx="13.5" cy="12" rx="2.6" ry="1.8" fill="white" fillOpacity="0.55" />
    </svg>
  );
}

const STAR_FLIGHT_TIMES = [0, 0.28, 0.48, 0.76, 0.94, 1];
const STAR_TRAIL_OFFSETS = [
  { delay: 0.05, sizeClass: 'h-4 w-4', opacityPeak: 0.85 },
  { delay: 0.1, sizeClass: 'h-3 w-3', opacityPeak: 0.72 },
  { delay: 0.16, sizeClass: 'h-2.5 w-2.5', opacityPeak: 0.58 },
  { delay: 0.22, sizeClass: 'h-2 w-2', opacityPeak: 0.44 },
];

function ParabolicFallingStar({
  flightId,
  wish,
  arcDir,
}: {
  flightId: number;
  wish: WishItem;
  arcDir: 1 | -1;
}) {
  const theme = STRIP_THEMES[wish.color];
  const xKeyframes = [0, arcDir * 32, arcDir * 56, arcDir * 30, 0, 0];
  const yKeyframes = [0, -54, -38, 128, 274, 282];

  return (
    <div
      className="pointer-events-none absolute top-[22%] left-1/2 z-30 -translate-x-1/2"
      aria-hidden="true"
    >
      {/* Initial Pop Aura Ring at the Jar Mouth */}
      <motion.span
        key={`launch-ring-${flightId}`}
        initial={{ opacity: 0.85, scale: 0.35 }}
        animate={{ opacity: 0, scale: 2.1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="absolute top-0 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFD86B]/90 shadow-[0_0_20px_rgba(255,216,107,0.85)]"
      />

      {/* Stardust Comet Trail Following the Inverted Parabolic Arc */}
      {STAR_TRAIL_OFFSETS.map((trail, tIdx) => (
        <motion.div
          key={`trail-${flightId}-${tIdx}`}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, trail.opacityPeak, trail.opacityPeak, trail.opacityPeak * 0.7, 0.3, 0],
            x: xKeyframes,
            y: yKeyframes,
            scale: [0.35, 0.9, 1.05, 0.85, 0.5, 0.2],
          }}
          transition={{
            duration: 1.45,
            delay: trail.delay,
            times: STAR_FLIGHT_TIMES,
            ease: 'easeInOut',
          }}
          style={{
            backgroundColor: tIdx % 2 === 0 ? theme.starLight : '#FFE885',
            boxShadow: `0 0 10px ${theme.starGlow}`,
          }}
          className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full ${trail.sizeClass}`}
        />
      ))}

      {/* Main Large Glowing Star Along Inverted Parabolic Arc */}
      <motion.div
        key={`main-star-${flightId}`}
        initial={{ opacity: 0.95, x: 0, y: 0, scale: 0.38, rotate: -25 }}
        animate={{
          opacity: [0.95, 1, 1, 1, 1, 0],
          x: xKeyframes,
          y: yKeyframes,
          scale: [0.38, 1.15, 1.32, 1.18, 0.96, 1.55],
          rotate: [-25, 45, 120, 230, 320, 360],
        }}
        transition={{
          duration: 1.45,
          times: STAR_FLIGHT_TIMES,
          ease: 'easeInOut',
        }}
        className="relative -top-7 flex h-14 w-14 items-center justify-center"
        style={{
          filter: `drop-shadow(0 0 18px ${theme.starGlow}) drop-shadow(0 4px 10px rgba(255, 224, 120, 0.85))`,
        }}
      >
        <span
          className="absolute inset-0 scale-125 rounded-full blur-md"
          style={{ backgroundColor: theme.starGlow }}
        />
        <ThreeDStarSVG theme={theme} gradId={`falling-star-${flightId}`} className="relative h-14 w-14" />
      </motion.div>
    </div>
  );
}

function ThreeDStarBadge({ theme, idSuffix }: { theme: StripTheme; idSuffix: string | number }) {
  const gradId = `star-3d-${idSuffix}`;
  return (
    <motion.div
      animate={{
        rotate: [-5, 6, -5],
        scale: [1, 1.07, 1],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative flex h-8 w-8 shrink-0 items-center justify-center"
      style={{ filter: `drop-shadow(0 3px 6px ${theme.starGlow})` }}
      aria-hidden="true"
    >
      <ThreeDStarSVG theme={theme} gradId={gradId} />
    </motion.div>
  );
}

interface ActiveWishState {
  runId: number;
  wish: WishItem;
  tilt: number;
}

interface FallingStarState {
  id: number;
  wish: WishItem;
  arcDir: 1 | -1;
}

export function Page3Wishes() {
  const {
    items,
    instructionIdle,
    instructionHolding,
    instructionFalling,
    instructionAfterWish,
  } = mockData.wishes;

  const [isHolding, setIsHolding] = useState(false);
  const [launchPulse, setLaunchPulse] = useState(0);
  const [fallingStar, setFallingStar] = useState<FallingStarState | null>(null);
  const [activeWish, setActiveWish] = useState<ActiveWishState | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const bagRef = useRef<number[]>([]);
  const lastPickedIdxRef = useRef<number | null>(null);
  const runCounterRef = useRef(0);
  const wishPopTimerRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const pickRandomWish = useCallback((): WishItem => {
    if (bagRef.current.length === 0) {
      const indices = items.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      if (
        indices.length > 1 &&
        lastPickedIdxRef.current !== null &&
        indices[indices.length - 1] === lastPickedIdxRef.current
      ) {
        [indices[0], indices[indices.length - 1]] = [
          indices[indices.length - 1],
          indices[0],
        ];
      }
      bagRef.current = indices;
    }
    const nextIdx = bagRef.current.pop() ?? 0;
    lastPickedIdxRef.current = nextIdx;
    return items[nextIdx];
  }, [items]);

  const handleReleaseShake = useCallback(() => {
    if (fallingStar !== null) return;

    if (wishPopTimerRef.current !== null) {
      window.clearTimeout(wishPopTimerRef.current);
      wishPopTimerRef.current = null;
    }

    const drawn = pickRandomWish();
    runCounterRef.current += 1;
    const runId = runCounterRef.current;
    const arcDir: 1 | -1 = runId % 2 === 0 ? 1 : -1;

    setActiveWish(null);
    setLaunchPulse((prev) => prev + 1);
    setFallingStar({ id: runId, wish: drawn, arcDir });

    wishPopTimerRef.current = window.setTimeout(() => {
      setFallingStar(null);
      setActiveWish({
        runId,
        wish: drawn,
        tilt: TILT_ANGLES[runId % TILT_ANGLES.length],
      });
      wishPopTimerRef.current = null;
    }, 1450);
  }, [fallingStar, pickRandomWish]);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollTimeoutRef.current = null;
    }, 950);
  }, []);

  useEffect(() => {
    return () => {
      if (wishPopTimerRef.current !== null) {
        window.clearTimeout(wishPopTimerRef.current);
      }
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const guidanceText = isHolding
    ? instructionHolding
    : fallingStar !== null
      ? instructionFalling
      : activeWish !== null
        ? instructionAfterWish
        : instructionIdle;

  const activeTheme = activeWish ? STRIP_THEMES[activeWish.wish.color] : null;

  return (
    <section
      aria-label="Wishes for your new year"
      className="relative flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#FCE6B8] via-[#FDF2DC] to-[#FBE8E0] px-4 pt-9 pb-[84px]"
    >
      {/* Centered Header */}
      <header className="relative z-10 shrink-0 text-center">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#D92B52]">
          {mockData.pages[2]?.badge ?? 'MAKE A WISH'}
        </p>
        <h2 className="mt-0.5 font-serif text-[25px] font-black leading-tight text-[#2D192B]">
          {mockData.pages[2]?.heading ?? 'Wishes for your new year'}
        </h2>
      </header>

      {/* Main Centered Wishing Stage */}
      <div
        onScroll={handleScroll}
        className={`wishes-scroll ${
          isScrolling ? 'is-scrolling' : ''
        } relative z-10 flex min-h-0 w-full max-w-[356px] flex-1 flex-col items-center justify-center overflow-y-auto touch-pan-y overscroll-y-contain px-1 pt-5 pb-2`}
      >
        <div className="relative flex w-full flex-col items-center overflow-visible">
          {/* Centered Enlarged Interactive 3D Wishing Jar */}
          <WishingJar3D
            isHolding={isHolding}
            onHoldingChange={setIsHolding}
            onReleaseShake={handleReleaseShake}
            launchPulse={launchPulse}
          />

          {/* Slow Inverted Parabolic Shooting Star Burst on Release */}
          <AnimatePresence>
            {fallingStar && (
              <ParabolicFallingStar
                key={`flight-${fallingStar.id}`}
                flightId={fallingStar.id}
                wish={fallingStar.wish}
                arcDir={fallingStar.arcDir}
              />
            )}
          </AnimatePresence>

          {/* Concise Dynamic Instruction Pill */}
          <motion.div
            animate={isHolding ? { scale: 1.03 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`relative z-20 mt-1 inline-flex max-w-[320px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-center shadow-[0_4px_14px_rgba(45,25,43,0.06)] backdrop-blur-sm transition-colors duration-200 ${
              isHolding
                ? 'border-[#F3C878] bg-[#FFF0D6]/95 text-[#6E3B18]'
                : 'border-[#F4D5DF] bg-[#FFFBF6]/85 text-[#5A374C]'
            }`}
          >
            <SparklesIcon
              className={`h-3.5 w-3.5 shrink-0 ${
                isHolding ? 'animate-spin text-[#D97706]' : 'animate-pulse text-[#D92B52]'
              }`}
            />
            <span className="text-[12px] font-semibold leading-snug">{guidanceText}</span>
          </motion.div>

          {/* Popped Random Wish Card Area */}
          <div className="relative z-20 mt-3 flex min-h-[82px] w-full max-w-[328px] shrink-0 items-start justify-center [perspective:900px]">
            <AnimatePresence mode="wait">
              {activeWish && activeTheme && (
                <div key={`wish-wrap-${activeWish.runId}`} className="relative w-full">
                  {/* Radial Starburst Glow When Wish Pops In */}
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: 1.45, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl blur-md"
                    style={{ backgroundColor: activeTheme.starGlow }}
                  />
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -26,
                      scale: 0.42,
                      rotate: activeWish.tilt * 2.4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotate: activeWish.tilt,
                    }}
                    exit={{ opacity: 0, scale: 0.82, y: 8 }}
                    whileHover={{ scale: 1.02, y: -1.5, rotate: activeWish.tilt * 0.45 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 20,
                    }}
                    style={{
                      backgroundImage: `linear-gradient(180deg, ${activeTheme.bg} 0%, ${activeTheme.bgTo} 100%), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(135, 95, 110, 0.06) 48px, rgba(135, 95, 110, 0.06) 49px)`,
                      borderColor: activeTheme.border,
                    }}
                    className="relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-2px_0_rgba(120,70,90,0.08),0_12px_24px_-6px_rgba(45,25,43,0.15),0_4px_8px_rgba(45,25,43,0.07)]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-4 -right-6 h-12 w-24 rotate-[18deg] bg-white/35 blur-[2px]"
                    />
                    <ThreeDStarBadge theme={activeTheme} idSuffix={activeWish.runId} />
                    <p className="relative z-10 text-[13.5px] font-semibold leading-snug text-[#2D192B]">
                      {activeWish.wish.text}
                    </p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
