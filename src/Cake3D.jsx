import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Flame = ({ position, isBlown }) => {
  const flameRef = useRef();

  useFrame(({ clock }) => {
    if (!isBlown && flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 20) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 25) * 0.05;
    }
  });

  if (isBlown) return null;

  return (
    <group position={position}>
      <mesh ref={flameRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffcc00" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.06, 0.25, 12]} />
        <meshBasicMaterial color="#ff5500" />
      </mesh>
      <pointLight color="#ffaa00" distance={8} intensity={4} />
    </group>
  );
};

const Candle = ({ position, isBlown }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.2} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.041, 0.041, 0.8, 8]} />
        <meshBasicMaterial color="#ff0055" wireframe opacity={0.2} transparent />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.06, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <Flame position={[0, 0.85, 0]} isBlown={isBlown} />
      {isBlown && <Smoke position={[0, 0.9, 0]} />}
    </group>
  );
};

const Smoke = ({ position }) => {
  const groupRef = useRef();
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y += 0.01;
      groupRef.current.children.forEach((child, i) => {
        child.position.x = Math.sin(clock.elapsedTime * 2 + i) * 0.05;
        child.material.opacity = Math.max(0, 0.8 - clock.elapsedTime * 0.2);
        child.scale.setScalar(1 + clock.elapsedTime * 0.8);
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 1].map(i => (
        <mesh key={i} position={[0, i * 0.1, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#aaaaaa" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const Sprinkles = ({ radius, yPos, count, colors }) => {
  const sprinkles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ position: [x, yPos, z], rotation: [rotX, rotY, rotZ], color });
    }
    return temp;
  }, [count, radius, yPos, colors]);

  return (
    <group>
      {sprinkles.map((props, i) => (
        <mesh key={i} position={props.position} rotation={props.rotation}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
      ))}
    </group>
  );
};

const Cherries = ({ radius, yPos, count }) => {
  const cherries = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push([x, yPos, z]);
    }
    return temp;
  }, [count, radius, yPos]);

  return (
    <group>
      {cherries.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshPhysicalMaterial color="#d90429" roughness={0.1} clearcoat={1} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

const StarDecorations = ({ radius, yPos, count }) => {
  const stars = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.PI / count); // offset from cherries
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push([x, yPos, z]);
    }
    return temp;
  }, [count, radius, yPos]);

  return (
    <group>
      {stars.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 4, 0, 0]}>
          <octahedronGeometry args={[0.12]} />
          <meshPhysicalMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const FrostingDollops = ({ radius, yPos, count }) => {
  const dollops = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push([x, yPos, z]);
    }
    return temp;
  }, [count, radius, yPos]);

  return (
    <group>
      {dollops.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.4} clearcoat={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.12, 0.2, 16]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.4} clearcoat={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const IcingDrips = ({ radius, yPos, count, color }) => {
  const drips = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const length = 0.2 + Math.random() * 0.5;
      temp.push({ position: [x, yPos - length/2 + 0.05, z], length });
    }
    return temp;
  }, [count, radius, yPos]);

  return (
    <group>
      {drips.map((props, i) => (
        <mesh key={i} position={props.position}>
          <capsuleGeometry args={[0.08, props.length, 8, 16]} />
          <meshPhysicalMaterial color={color} roughness={0.1} clearcoat={1} transmission={0.1} thickness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export default function Cake3D({ isBlown }) {
  const cakeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffc2d1",
    roughness: 0.6,
    clearcoat: 0.1,
  }), []);

  const midCakeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffb5a7",
    roughness: 0.6,
    clearcoat: 0.1,
  }), []);

  const topCakeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#f8edeb",
    roughness: 0.6,
    clearcoat: 0.1,
  }), []);

  const icingMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.1,
    transmission: 0.1,
    thickness: 0.2,
    clearcoat: 0.5,
  }), []);

  const plateMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#1a1a1a",
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const sprinkleColors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#ffb7c5"];

  return (
    <Canvas 
      shadows={false}
      camera={{ position: [0, 6, 14], fov: 45 }} 
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#2c1b3d', 10, 30]} />
      
      <Sky sunPosition={[0, -1, -1]} turbidity={2} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
      
      <ambientLight intensity={0.5} color="#ffb7c5" />
      <directionalLight position={[-5, 8, -5]} intensity={0.8} color="#9ba9ff" />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ff69b4" />
      
      <OrbitControls 
        autoRotate={!isBlown} 
        autoRotateSpeed={1} 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.1} 
        minPolarAngle={Math.PI / 4}
      />
      
      <group position={[0, -1.5, 0]}>
        {/* Plate */}
        <mesh position={[0, -0.1, 0]} material={plateMaterial}>
          <cylinderGeometry args={[4.2, 4.6, 0.2, 32]} />
        </mesh>

        {/* Bottom Tier */}
        <mesh position={[0, 0.5, 0]} material={cakeMaterial}>
          <cylinderGeometry args={[3.2, 3.2, 1.0, 32]} />
        </mesh>
        <mesh position={[0, 1.0, 0]} material={icingMaterial}>
          <cylinderGeometry args={[3.25, 3.25, 0.15, 32]} />
        </mesh>
        <IcingDrips count={24} radius={3.2} yPos={1.0} color="#ffffff" />
        <FrostingDollops count={12} radius={3.0} yPos={1.1} />
        <Sprinkles count={60} radius={2.8} yPos={1.08} colors={sprinkleColors} />
        <Cherries count={6} radius={2.9} yPos={1.0} />

        {/* Middle Tier */}
        <mesh position={[0, 1.5, 0]} material={midCakeMaterial}>
          <cylinderGeometry args={[2.4, 2.4, 1.0, 32]} />
        </mesh>
        <mesh position={[0, 2.0, 0]} material={icingMaterial}>
          <cylinderGeometry args={[2.45, 2.45, 0.15, 32]} />
        </mesh>
        <IcingDrips count={16} radius={2.4} yPos={2.0} color="#ffffff" />
        <FrostingDollops count={8} radius={2.2} yPos={2.1} />
        <Sprinkles count={50} radius={2.0} yPos={2.08} colors={sprinkleColors} />
        <StarDecorations count={8} radius={2.5} yPos={1.8} />

        {/* Top Tier */}
        <mesh position={[0, 2.5, 0]} material={topCakeMaterial}>
          <cylinderGeometry args={[1.6, 1.6, 1.0, 32]} />
        </mesh>
        <mesh position={[0, 3.0, 0]} material={icingMaterial}>
          <cylinderGeometry args={[1.65, 1.65, 0.15, 32]} />
        </mesh>
        <IcingDrips count={12} radius={1.6} yPos={3.0} color="#ffffff" />
        <FrostingDollops count={6} radius={1.4} yPos={3.1} />
        <Sprinkles count={40} radius={1.1} yPos={3.08} colors={sprinkleColors} />
        <Cherries count={6} radius={1.3} yPos={3.0} />

        {/* Candles on Top Tier */}
        <Candle position={[-0.5, 3.05, 0]} isBlown={isBlown} />
        <Candle position={[0.5, 3.05, 0]} isBlown={isBlown} />
        <Candle position={[0, 3.05, 0.5]} isBlown={isBlown} />

        {/* Floating Sakura/Pink Sparkles */}
        <Sparkles count={50} scale={10} size={5} speed={0.3} opacity={0.8} color="#ffb7c5" />
      </group>
      
      <ContactShadows position={[0, -1.55, 0]} opacity={0.6} scale={14} blur={2.5} far={4} frames={1} />
    </Canvas>
  );
}
