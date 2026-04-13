/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture, Environment, Lightformer, RoundedBox, Text } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

const lanyardTexture = '/lanyard.png';
useTexture.preload(lanyardTexture);

import './Lanyard.css';

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -2, 0],
  fov = 20,
  transparent = true
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 25 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity as any} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}

// Subcomponent extending group to design front overlay
const ICardContent = () => {
  return (
    <group position={[0, 0, 0.026]}>
      {/* Header bar */}
      <mesh position={[0, 1.0, 0]}>
        <planeGeometry args={[1.6, 0.25]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <Text position={[-0.7, 1.0, 0.01]} fontSize={0.08} color="white" anchorX="left" fontWeight="bold">
        ACCESS PROFILING SYSTEM
      </Text>

      {/* Main Avatar / Center piece */}
      <mesh position={[0, 0.2, 0]}>
        <planeGeometry args={[1.2, 1.1]} />
        <meshBasicMaterial color="#0c0c0c" />
      </mesh>
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[1.18, 1.08]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Techy lines in the display */}
      <mesh position={[0, 0.2, 0.02]}>
        <ringGeometry args={[0.3, 0.32, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0.02]}>
        <ringGeometry args={[0.4, 0.41, 64, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.4} />
      </mesh>
      <Text position={[0, 0.2, 0.02]} fontSize={0.12} color="white">
        R.K.S
      </Text>

      {/* Details Box */}
      <group position={[0, -0.65, 0]}>
        <Text position={[-0.7, 0, 0]} fontSize={0.15} color="white" anchorX="left" fontWeight={"bold"}>
          ROHIT K. SAHOO
        </Text>
        <Text position={[-0.7, -0.2, 0]} fontSize={0.08} color="#EF4444" anchorX="left" letterSpacing={0.1}>
          SYSTEM ARCHITECT
        </Text>
        <Text position={[-0.7, -0.4, 0]} fontSize={0.06} color="#888" anchorX="left">
          UPLINK: ACTIVE // ID 77218
        </Text>
        <div className="barcode">
        </div>
        {/* Simple barcode simulation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[-0.7 + i * 0.07, -0.7, 0]}>
            <planeGeometry args={[Math.random() * 0.04 + 0.01, 0.15]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 1.5,
    linearDamping: 2.5
  };

  const texture = useTexture(lanyardTexture);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0.4, 0], 0.4]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0.4, 0], 0.4]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0.4, 0], 0.4]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!j1.current || !j2.current || !j3.current || !fixed.current) return;
    
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      if (band.current) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 2.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody position={[0, -0.4, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -0.8, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.2, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -2.65, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
        >
          {/* Main Card Collider (Half Extents) => 1.6 x 2.25 x 0.05 approx */}
          <CuboidCollider args={[0.8, 1.125, 0.025]} />
          
          <group
            position={[0, -1.15, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {/* 3D Glassy Box */}
            <RoundedBox args={[1.6, 2.25, 0.05]} radius={0.05} smoothness={4}>
              <meshPhysicalMaterial
                color="#111111"
                metalness={0.7}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>

            {/* Front Contents */}
            <ICardContent />

            {/* Back Contents (Mirrored so it can be seen from behind) */}
            <group rotation={[0, Math.PI, 0]}>
              <ICardContent />
            </group>

            {/* Top metallic clip linking to the lanyard hole */}
            <mesh position={[0, 1.25, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
              <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
            </mesh>
            
            <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.1, 0.03, 16, 32]} />
              <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
