"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, MeshWobbleMaterial, Torus, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Portal() {
  const portalRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    portalRef.current.rotation.z = t * 0.5;
    portalRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <group>
      {/* Outer Glow Ring */}
      <Torus args={[3, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
      </Torus>
      
      {/* Inner Portal Mesh */}
      <Torus ref={portalRef} args={[2.8, 0.4, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <MeshDistortMaterial
          color="#bc13fe"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#bc13fe"
          emissiveIntensity={2}
        />
      </Torus>

      {/* Center Light */}
      <pointLight position={[0, 0, 0]} intensity={10} color="#bc13fe" />
    </group>
  );
}

function FloatingIcon({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.5;
    ref.current.rotation.y = t;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={ref} position={position}>
        <Box args={[0.5, 0.5, 0.5]} color={color} />
      </group>
    </Float>
  );
}

function Box({ args, color }: { args: [number, number, number], color: string }) {
  return (
    <mesh>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

function VideoDataStream() {
  const count = 20;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Move towards center
      dummy.position.set(
        (xFactor + Math.cos(t / 10) * factor) * (1 - (t % 1)),
        (yFactor + Math.sin(t / 10) * factor) * (1 - (t % 1)),
        (zFactor + Math.cos(t / 10) * factor) * (1 - (t % 1))
      );
      
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.2, 0.4]} />
      <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} transparent opacity={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[600px] w-full relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <Portal />
        
        <FloatingIcon position={[-5, 2, 0]} color="#ff0000" speed={0.5} /> {/* YT */}
        <FloatingIcon position={[5, -2, 0]} color="#e1306c" speed={0.7} /> {/* IG */}
        <FloatingIcon position={[4, 3, -2]} color="#00f2ff" speed={0.6} /> {/* TT */}
        
        <VideoDataStream />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-midnight" />
    </div>
  );
}
