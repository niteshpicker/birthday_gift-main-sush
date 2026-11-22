import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';

export type CakeVariant = 'cover' | 'candles';

export interface BirthdayCake3DProps {
  dragHint?: string;
  variant?: CakeVariant;
  windIntensity?: number;
  candlesLit?: boolean;
  /** Number shown on the cake topper, e.g. "32" */
  age?: string;
}

interface SprinkleSpec {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

interface DripSpec {
  angle: number;
  length: number;
  radius: number;
}

interface CandleSpec {
  id: number;
  x: number;
  z: number;
  height: number;
  color: string;
  stripeColor: string;
  phase: number;
}

const SPRINKLE_COLORS = ['#FF8FB1', '#FFE07D', '#9CE0CC', '#A8C8F9', '#FFFDF9', '#F79D7E'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Macaron({
  position,
  rotationY = 0,
  tilt = 0,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY?: number;
  tilt?: number;
  color: string;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[tilt, rotationY, 0]} scale={scale}>
      {/* Bottom shell */}
      <mesh position={[0, 0.035, 0]} scale={[1, 0.5, 1]} castShadow>
        <sphereGeometry args={[0.135, 20, 14]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {/* Cream filling */}
      <mesh position={[0, 0.068, 0]} castShadow>
        <cylinderGeometry args={[0.125, 0.125, 0.038, 20]} />
        <meshStandardMaterial color="#FFF9F2" roughness={0.35} />
      </mesh>
      {/* Top shell */}
      <mesh position={[0, 0.1, 0]} scale={[1, 0.52, 1]} castShadow>
        <sphereGeometry args={[0.135, 20, 14]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
    </group>
  );
}

function MeringueKiss({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.105, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.092, 0.075, 12]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <coneGeometry args={[0.056, 0.085, 12]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * Glossy 3D number topper built from real font geometry,
 * so it can show any digits (e.g. "32").
 */
function NumberTopper({
  position,
  value = '32',
}: {
  position: [number, number, number];
  value?: string;
}) {
  const geo = useMemo(() => {
    const font = new FontLoader().parse(helvetiker as any);
    const g = new TextGeometry(value, {
      font,
      size: 0.32,
      depth: 0.06, // use `height: 0.06` if your three.js is older than r163
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 5,
    } as any);
    g.center();
    return g;
  }, [value]);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <group position={position} rotation={[0, 0, 0.04]}>
      {/* Gold rim behind */}
      <mesh geometry={geo} scale={[1.05, 1.05, 0.8]} position={[0, 0, -0.015]} castShadow>
        <meshStandardMaterial color="#FFEAA7" roughness={0.28} metalness={0.22} />
      </mesh>
      {/* Glossy red number */}
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial
          color="#E12D53"
          roughness={0.14}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>
      {/* Cream-gold topper pick */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
        <meshStandardMaterial color="#FFEAA7" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

function createGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 250, 224, 0.98)');
  grad.addColorStop(0.24, 'rgba(255, 214, 120, 0.72)');
  grad.addColorStop(0.55, 'rgba(255, 165, 64, 0.28)');
  grad.addColorStop(1, 'rgba(255, 138, 36, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Candle({
  spec,
  windIntensity,
  candlesLit,
  glowTexture,
  variant,
}: {
  spec: CandleSpec;
  windIntensity: number;
  candlesLit: boolean;
  glowTexture: THREE.CanvasTexture | null;
  variant: CakeVariant;
}) {
  const flameGroupRef = useRef<THREE.Group>(null);
  const flameOuterRef = useRef<THREE.Mesh>(null);
  const flameInnerRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const wisp1Ref = useRef<THREE.Mesh>(null);
  const wisp2Ref = useRef<THREE.Mesh>(null);
  const wisp3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = spec.phase;
    const wind = THREE.MathUtils.clamp(windIntensity, 0, 1);

    if (flameGroupRef.current) {
      flameGroupRef.current.visible = candlesLit;
      if (candlesLit) {
        const speed = 1 + wind * 2.1;
        const flickerX =
          1 + Math.sin(t * 11 * speed + p) * (0.11 + wind * 0.1) + Math.cos(t * 17 * speed + p) * 0.06;
        const flickerY = 1 + Math.sin(t * 9 * speed + p * 1.4) * (0.15 + wind * 0.16);
        const sway = Math.sin(t * (6.5 + wind * 14) + p) * (0.08 + wind * 0.16);

        flameGroupRef.current.rotation.z = -wind * 0.88 + sway;
        flameGroupRef.current.rotation.x = wind * 0.22;
        flameGroupRef.current.scale.set(
          flickerX * (1 - wind * 0.22),
          flickerY * (1 + wind * 0.56),
          flickerX * (1 - wind * 0.18)
        );
      }
    }

    if (haloRef.current) {
      haloRef.current.visible = candlesLit;
      if (candlesLit) {
        const baseScale = variant === 'candles' ? 1.08 : 0.45;
        const haloPulse = 1 + Math.sin(t * (8 + wind * 12) + p) * 0.09;
        const s = baseScale * haloPulse * (1 - wind * 0.18);
        haloRef.current.scale.set(s, s, 1);
        haloRef.current.position.set(
          wind * 0.045,
          spec.height + 0.12 - wind * 0.015,
          -0.02
        );
        const mat = haloRef.current.material as THREE.SpriteMaterial;
        mat.opacity = (variant === 'candles' ? 0.92 : 0.42) * (1 - wind * 0.22);
      }
    }

    // Smoke wisps: soft ember trace when lit, full rising curly wisps when blown out
    const cycleRate = candlesLit ? 0.45 : 0.58;
    const smokeHeight = candlesLit ? 0.34 : 0.68;
    const peakOpacity = candlesLit ? 0.18 : 0.5;
    const driftAmp = candlesLit ? 0.025 : 0.065;

    const w1 = (t * cycleRate + p) % 1;
    if (wisp1Ref.current) {
      wisp1Ref.current.position.set(
        Math.sin(t * 3 + p) * driftAmp + (candlesLit ? 0 : w1 * 0.05),
        spec.height + (candlesLit ? 0.22 : 0.08) + w1 * smokeHeight,
        Math.cos(t * 2.5 + p) * (driftAmp * 0.6)
      );
      const s1 = (candlesLit ? 0.7 : 0.55) + w1 * (candlesLit ? 0.9 : 1.35);
      wisp1Ref.current.scale.setScalar(s1);
      (wisp1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        Math.sin(w1 * Math.PI) * peakOpacity;
    }

    const w2 = (t * cycleRate + p + 0.35) % 1;
    if (wisp2Ref.current) {
      wisp2Ref.current.position.set(
        Math.cos(t * 2.8 + p) * driftAmp - (candlesLit ? 0 : w2 * 0.04),
        spec.height + (candlesLit ? 0.24 : 0.1) + w2 * (smokeHeight * 1.1),
        Math.sin(t * 2.2 + p) * (driftAmp * 0.6)
      );
      const s2 = (candlesLit ? 0.6 : 0.5) + w2 * (candlesLit ? 1.05 : 1.45);
      wisp2Ref.current.scale.setScalar(s2);
      (wisp2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        Math.sin(w2 * Math.PI) * (peakOpacity * 0.85);
    }

    const w3 = (t * cycleRate + p + 0.7) % 1;
    if (wisp3Ref.current) {
      wisp3Ref.current.visible = !candlesLit;
      if (!candlesLit) {
        wisp3Ref.current.position.set(
          Math.sin(t * 2.4 + p * 2) * 0.055,
          spec.height + 0.09 + w3 * 0.72,
          Math.cos(t * 2.1 + p) * 0.03
        );
        const s3 = 0.65 + w3 * 1.5;
        wisp3Ref.current.scale.setScalar(s3);
        (wisp3Ref.current.material as THREE.MeshBasicMaterial).opacity =
          Math.sin(w3 * Math.PI) * 0.38;
      }
    }
  });

  return (
    <group position={[spec.x, 0, spec.z]}>
      {/* Wax body */}
      <mesh position={[0, spec.height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.052, spec.height, 18]} />
        <meshStandardMaterial color={spec.color} roughness={0.35} />
      </mesh>
      {/* Decorative candy stripes */}
      {[0.25, 0.52, 0.78].map((ratio, i) => (
        <mesh
          key={i}
          position={[0, spec.height * ratio, 0]}
          rotation={[0.25, 0, 0.18]}
        >
          <torusGeometry args={[0.049, 0.008, 8, 18]} />
          <meshStandardMaterial color={spec.stripeColor} roughness={0.3} />
        </mesh>
      ))}
      {/* Wick */}
      <mesh position={[0, spec.height + 0.025, 0]}>
        <cylinderGeometry args={[0.006, 0.007, 0.06, 8]} />
        <meshStandardMaterial color="#3A2830" roughness={0.8} />
      </mesh>
      {/* Additive Warm Golden Radial Halo */}
      {glowTexture && (
        <sprite ref={haloRef} position={[0, spec.height + 0.11, -0.02]}>
          <spriteMaterial
            map={glowTexture}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            opacity={variant === 'candles' ? 0.82 : 0.42}
          />
        </sprite>
      )}
      {/* Pivoted Flame Group */}
      <group ref={flameGroupRef} position={[0, spec.height + 0.048, 0]}>
        <mesh ref={flameOuterRef} position={[0, 0.055, 0]}>
          <coneGeometry args={[0.042, 0.145, 14]} />
          <meshBasicMaterial color="#FF9D2E" transparent opacity={0.92} />
        </mesh>
        <mesh ref={flameInnerRef} position={[0, 0.042, 0]}>
          <coneGeometry args={[0.024, 0.098, 12]} />
          <meshBasicMaterial color="#FFF8C7" />
        </mesh>
      </group>
      {/* Rising smoke wisps */}
      <mesh ref={wisp1Ref}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh ref={wisp2Ref}>
        <sphereGeometry args={[0.024, 10, 10]} />
        <meshBasicMaterial color="#FFF5F7" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh ref={wisp3Ref} visible={false}>
        <sphereGeometry args={[0.026, 10, 10]} />
        <meshBasicMaterial color="#F8EFF3" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CakeScene({
  targetRotationRef,
  isDraggingRef,
  variant,
  windIntensity,
  candlesLit,
  age,
}: {
  targetRotationRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  variant: CakeVariant;
  windIntensity: number;
  candlesLit: boolean;
  age: string;
}) {
  const cakeGroupRef = useRef<THREE.Group>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);

  const glowTexture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
    };
  }, [glowTexture]);

  // Pedestal profile via LatheGeometry for smooth ceramic curves
  const pedestalGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.76, 0),
      new THREE.Vector2(0.78, 0.045),
      new THREE.Vector2(0.68, 0.09),
      new THREE.Vector2(0.35, 0.16),
      new THREE.Vector2(0.22, 0.34),
      new THREE.Vector2(0.18, 0.56),
      new THREE.Vector2(0.23, 0.72),
      new THREE.Vector2(0.45, 0.8),
      new THREE.Vector2(1.48, 0.85),
      new THREE.Vector2(1.56, 0.9),
      new THREE.Vector2(1.56, 0.96),
      new THREE.Vector2(1.48, 0.99),
      new THREE.Vector2(0, 0.99),
    ];
    return new THREE.LatheGeometry(points, 48);
  }, []);

  // Bottom tier sprinkles
  const bottomSprinkles = useMemo<SprinkleSpec[]>(() => {
    const items: SprinkleSpec[] = [];
    const radius = 1.255;
    for (let i = 0; i < 68; i++) {
      const angle = (i / 68) * Math.PI * 2 + seededRandom(i + 1) * 0.09;
      const y = -0.34 + seededRandom(i + 20) * 0.68;
      items.push({
        id: i,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rotation: [
          (seededRandom(i + 40) - 0.5) * 1.4,
          -angle,
          (seededRandom(i + 60) - 0.5) * 1.8,
        ],
        color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      });
    }
    return items;
  }, []);

  // Top tier sprinkles
  const topSprinkles = useMemo<SprinkleSpec[]>(() => {
    const items: SprinkleSpec[] = [];
    const radius = 0.925;
    for (let i = 0; i < 42; i++) {
      const angle = (i / 42) * Math.PI * 2 + seededRandom(i + 100) * 0.1;
      const y = -0.26 + seededRandom(i + 120) * 0.36;
      items.push({
        id: i,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        rotation: [
          (seededRandom(i + 140) - 0.5) * 1.3,
          -angle,
          (seededRandom(i + 160) - 0.5) * 1.8,
        ],
        color: SPRINKLE_COLORS[(i + 2) % SPRINKLE_COLORS.length],
      });
    }
    return items;
  }, []);

  // Top glaze sprinkles
  const topGlazeSprinkles = useMemo<SprinkleSpec[]>(() => {
    const items: SprinkleSpec[] = [];
    for (let i = 0; i < 26; i++) {
      const angle = seededRandom(i + 200) * Math.PI * 2;
      const dist = 0.18 + seededRandom(i + 230) * 0.58;
      items.push({
        id: i,
        position: [Math.cos(angle) * dist, 0.415, Math.sin(angle) * dist],
        rotation: [Math.PI / 2, seededRandom(i + 260) * Math.PI, 0],
        color: SPRINKLE_COLORS[(i + 1) % SPRINKLE_COLORS.length],
      });
    }
    return items;
  }, []);

  // White icing drips around top tier
  const drips = useMemo<DripSpec[]>(() => {
    const count = 20;
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      length: 0.15 + ((Math.sin(i * 2.1) + 1) / 2) * 0.25,
      radius: i % 2 === 0 ? 0.056 : 0.044,
    }));
  }, []);

  // 5 Pastel Candles
  const candles = useMemo<CandleSpec[]>(
    () => [
      { id: 1, x: -0.44, z: -0.1, height: 0.48, color: '#9CE0CC', stripeColor: '#FFFDF9', phase: 0.2 },
      { id: 2, x: -0.22, z: -0.32, height: 0.54, color: '#F9DE7E', stripeColor: '#F7A8B8', phase: 1.5 },
      { id: 3, x: 0.0, z: -0.38, height: 0.58, color: '#F79EB3', stripeColor: '#FFFDF9', phase: 2.7 },
      { id: 4, x: 0.22, z: -0.31, height: 0.52, color: '#BFA3E8', stripeColor: '#FFFDF9', phase: 3.9 },
      { id: 5, x: 0.44, z: -0.08, height: 0.46, color: '#F5959E', stripeColor: '#FFE082', phase: 5.1 },
    ],
    []
  );

  // Ledge macarons & meringues around bottom tier top
  const ledgeItems = useMemo(() => {
    const count = 16;
    const colors = ['#FBE285', '#A8E4CB', '#F7A8B8'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.07;
      return {
        angle,
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        isMacaron: i % 2 === 0,
        color: colors[(i / 2) % colors.length | 0],
      };
    });
  }, []);

  // Top tier macarons & meringues
  const topRingItems = useMemo(() => {
    const count = 10;
    const colors = ['#A8E4CB', '#F7A8B8', '#FBE285'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + 0.15;
      const r = 0.69;
      return {
        angle,
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        isMacaron: i % 2 === 0,
        color: colors[(i / 2) % colors.length | 0],
      };
    });
  }, []);

  useFrame(({ clock }, delta) => {
    if (!cakeGroupRef.current) return;

    const t = clock.getElapsedTime();
    const idleSway = isDraggingRef.current ? 0 : Math.sin(t * 0.8) * 0.11;
    cakeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      cakeGroupRef.current.rotation.y,
      targetRotationRef.current + idleSway,
      Math.min(1, delta * 10)
    );

    const lightLerp = Math.min(1, delta * 5.5);

    if (candleLightRef.current) {
      const targetCandleIntensity = candlesLit
        ? (variant === 'candles' ? 2.35 : 1.55) +
          Math.sin(t * 10) * 0.18 +
          Math.cos(t * 17) * 0.1 +
          windIntensity * 0.4
        : 0;
      candleLightRef.current.intensity = THREE.MathUtils.lerp(
        candleLightRef.current.intensity,
        targetCandleIntensity,
        Math.min(1, delta * 10)
      );
    }

    if (hemiLightRef.current) {
      const targetHemi = candlesLit ? (variant === 'candles' ? 0.94 : 1.15) : 0.42;
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(
        hemiLightRef.current.intensity,
        targetHemi,
        lightLerp
      );
    }

    if (keyLightRef.current) {
      const targetKey = candlesLit ? (variant === 'candles' ? 1.08 : 1.35) : 0.48;
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        targetKey,
        lightLerp
      );
    }

    if (fillLightRef.current) {
      const targetFill = candlesLit ? (variant === 'candles' ? 0.5 : 0.65) : 0.34;
      fillLightRef.current.intensity = THREE.MathUtils.lerp(
        fillLightRef.current.intensity,
        targetFill,
        lightLerp
      );
    }
  });

  const groupPosition: [number, number, number] =
    variant === 'candles' ? [0, -1.32, 0] : [0, -1.36, 0];
  const groupScale = variant === 'candles' ? 0.8 : 0.85;

  return (
    <>
      <hemisphereLight
        ref={hemiLightRef}
        args={['#FFF8F2', '#F3CFD9', variant === 'candles' ? 0.94 : 1.15]}
      />
      <directionalLight
        ref={keyLightRef}
        position={[4, 6, 5]}
        intensity={variant === 'candles' ? 1.08 : 1.35}
        color="#FFF9F4"
        castShadow
      />
      <directionalLight
        ref={fillLightRef}
        position={[-4, 3, -3]}
        intensity={variant === 'candles' ? 0.5 : 0.65}
        color="#FFE4EC"
      />
      <pointLight
        ref={candleLightRef}
        position={[0, 1.98, 0.28]}
        color="#FFCF7D"
        intensity={variant === 'candles' ? 2.35 : 1.6}
        distance={6}
      />

      <group ref={cakeGroupRef} position={groupPosition} scale={groupScale}>
        {/* Soft shadow disc on floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <circleGeometry args={[1.1, 36]} />
          <meshBasicMaterial color="#C89AA6" transparent opacity={0.14} />
        </mesh>

        {/* White ceramic pedestal stand */}
        <mesh geometry={pedestalGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#FCF9F7"
            roughness={0.14}
            metalness={0.04}
            clearcoat={0.85}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Bottom Tier: Pastel Lavender */}
        <group position={[0, 1.41, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.24, 1.25, 0.86, 48]} />
            <meshStandardMaterial color="#C9ACEA" roughness={0.55} />
          </mesh>
          {/* Rounded top frosting shoulder */}
          <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.042, 12, 48]} />
            <meshStandardMaterial color="#CEB3EC" roughness={0.52} />
          </mesh>
          {/* Bottom bead pearl border */}
          {Array.from({ length: 34 }, (_, i) => {
            const angle = (i / 34) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 1.25, -0.4, Math.sin(angle) * 1.25]}
              >
                <sphereGeometry args={[0.062, 12, 12]} />
                <meshStandardMaterial color="#D5BBEF" roughness={0.45} />
              </mesh>
            );
          })}
          {/* Lavender side sprinkles */}
          {bottomSprinkles.map((s) => (
            <mesh key={s.id} position={s.position} rotation={s.rotation}>
              <capsuleGeometry args={[0.016, 0.068, 4, 8]} />
              <meshStandardMaterial color={s.color} roughness={0.35} />
            </mesh>
          ))}
        </group>

        {/* Ledge macarons & meringues */}
        <group position={[0, 1.84, 0]}>
          {ledgeItems.map((item, idx) =>
            item.isMacaron ? (
              <Macaron
                key={idx}
                position={[item.x, 0, item.z]}
                rotationY={-item.angle + Math.PI / 2}
                tilt={0.14}
                color={item.color}
                scale={0.95}
              />
            ) : (
              <MeringueKiss key={idx} position={[item.x, 0, item.z]} scale={0.92} />
            )
          )}
        </group>

        {/* Top Tier: Pastel Pink with White Drip Icing */}
        <group position={[0, 2.21, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.91, 0.92, 0.76, 48]} />
            <meshStandardMaterial color="#FAA9BF" roughness={0.5} />
          </mesh>

          {/* White top icing glaze */}
          <mesh position={[0, 0.37, 0]} castShadow>
            <cylinderGeometry args={[0.92, 0.93, 0.07, 48]} />
            <meshPhysicalMaterial
              color="#FFFDF9"
              roughness={0.22}
              clearcoat={0.6}
              clearcoatRoughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.89, 0.048, 12, 48]} />
            <meshPhysicalMaterial color="#FFFDF9" roughness={0.22} clearcoat={0.6} />
          </mesh>

          {/* White icing drips */}
          {drips.map((drip, idx) => {
            const x = Math.cos(drip.angle) * 0.915;
            const z = Math.sin(drip.angle) * 0.915;
            return (
              <group key={idx}>
                <mesh position={[x, 0.36 - drip.length / 2, z]}>
                  <cylinderGeometry args={[drip.radius, drip.radius * 0.88, drip.length, 12]} />
                  <meshPhysicalMaterial color="#FFFDF9" roughness={0.22} clearcoat={0.6} />
                </mesh>
                <mesh position={[x, 0.36 - drip.length, z]}>
                  <sphereGeometry args={[drip.radius * 0.96, 12, 12]} />
                  <meshPhysicalMaterial color="#FFFDF9" roughness={0.22} clearcoat={0.6} />
                </mesh>
              </group>
            );
          })}

          {/* Top tier side sprinkles */}
          {topSprinkles.map((s) => (
            <mesh key={s.id} position={s.position} rotation={s.rotation}>
              <capsuleGeometry args={[0.015, 0.06, 4, 8]} />
              <meshStandardMaterial color={s.color} roughness={0.35} />
            </mesh>
          ))}

          {/* Top glaze sprinkles */}
          {topGlazeSprinkles.map((s) => (
            <mesh key={s.id} position={s.position} rotation={s.rotation}>
              <capsuleGeometry args={[0.014, 0.055, 4, 8]} />
              <meshStandardMaterial color={s.color} roughness={0.35} />
            </mesh>
          ))}

          {/* Top surface ring of macarons and meringues */}
          <group position={[0, 0.405, 0]}>
            {topRingItems.map((item, idx) =>
              item.isMacaron ? (
                <Macaron
                  key={idx}
                  position={[item.x, 0, item.z]}
                  rotationY={-item.angle + Math.PI / 2}
                  tilt={0.12}
                  color={item.color}
                  scale={0.85}
                />
              ) : (
                <MeringueKiss key={idx} position={[item.x, 0, item.z]} scale={0.85} />
              )
            )}

            {/* Center glossy 3D number cake topper */}
            <NumberTopper position={[0, 0.22, 0.14]} value={age} />

            {/* 5 Pastel Candles with animated flames, halos & smoke */}
            {candles.map((candle) => (
              <Candle
                key={candle.id}
                spec={candle}
                windIntensity={windIntensity}
                candlesLit={candlesLit}
                glowTexture={glowTexture}
                variant={variant}
              />
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

export function BirthdayCake3D({
  dragHint = '',
  variant = 'cover',
  windIntensity = 0,
  candlesLit = true,
  age = '31',
}: BirthdayCake3DProps) {
  const targetRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    lastPointerXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    targetRotationRef.current += dx * 0.012;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const cameraConfig =
    variant === 'candles'
      ? { position: [0, 1.5, 6.35] as [number, number, number], fov: 35 }
      : { position: [0, 1.5, 6.2] as [number, number, number], fov: 35 };

  return (
    <div
      className={`relative h-full w-full touch-none select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      role="img"
      aria-label="Interactive 3D two-tier birthday cake. Drag horizontally to rotate."
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={cameraConfig}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <CakeScene
          targetRotationRef={targetRotationRef}
          isDraggingRef={isDraggingRef}
          variant={variant}
          windIntensity={windIntensity}
          candlesLit={candlesLit}
          age={age}
        />
      </Canvas>

      {/* Subtle drag hint */}
      {dragHint ? (
        <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-white/55 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-[#9D828C] backdrop-blur-sm">
            {dragHint}
          </span>
        </div>
      ) : null}
    </div>
  );
}
