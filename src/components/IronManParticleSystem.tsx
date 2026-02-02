import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const IronManParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle system
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    // Iron Man color palette - cyan, red, gold
    const colorPalette = [
      new THREE.Color('#00d4ff'), // Cyan (Arc Reactor)
      new THREE.Color('#ff3333'), // Red
      new THREE.Color('#ffaa00'), // Gold
      new THREE.Color('#00ffff'), // Bright Cyan
      new THREE.Color('#ff6600'), // Orange-Red
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles in a 3D space
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.00005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.00005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.000025;

      // Random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        uniform vec2 mousePosition;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Mouse influence
          float mouseDistance = length(vec2(pos.x, pos.y) - mousePosition * 50.0);
          float mouseInfluence = smoothstep(30.0, 0.0, mouseDistance);
          
          // Repel from mouse
          vec2 mouseDir = normalize(vec2(pos.x, pos.y) - mousePosition * 50.0);
          pos.x += mouseDir.x * mouseInfluence * 5.0;
          pos.y += mouseDir.y * mouseInfluence * 5.0;
          
          // Subtle wave motion
          pos.x += sin(time * 0.5 + position.y * 0.1) * 0.5;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = size * (50.0 / -mvPosition.z);
          gl_PointSize *= (1.0 + mouseInfluence * 2.0);
          
        vAlpha = 0.02 + mouseInfluence * 0.02;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Circular particle with glow
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vAlpha;
          
          // Core glow
          float core = 1.0 - smoothstep(0.0, 0.2, dist);
          vec3 finalColor = mix(vColor, vec3(1.0), core * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.01,
      blending: THREE.AdditiveBlending,
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const time = performance.now() * 0.000005;
      (material.uniforms.time as { value: number }).value = time;
      (material.uniforms.mousePosition as { value: THREE.Vector2 }).value.set(
        mouseRef.current.x,
        mouseRef.current.y
      );

      // Update particle positions
      const positionsArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positionsArray[i3] += velocities[i3];
        positionsArray[i3 + 1] += velocities[i3 + 1];
        positionsArray[i3 + 2] += velocities[i3 + 2];

        // Boundary wrapping
        if (positionsArray[i3] > 50) positionsArray[i3] = -50;
        if (positionsArray[i3] < -50) positionsArray[i3] = 50;
        if (positionsArray[i3 + 1] > 50) positionsArray[i3 + 1] = -50;
        if (positionsArray[i3 + 1] < -50) positionsArray[i3 + 1] = 50;
      }
      geometry.attributes.position.needsUpdate = true;

      // Update connection lines (only check nearby particles for performance)
      const linePositionsArray = lineGeometry.attributes.position.array as Float32Array;
      let lineIndex = 0;
      const maxDistance = 8;
      const maxConnections = 500;

      for (let i = 0; i < particleCount && lineIndex < maxConnections * 6; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount && lineIndex < maxConnections * 6; j++) {
          const j3 = j * 3;
          
          const dx = positionsArray[i3] - positionsArray[j3];
          const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
          const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            linePositionsArray[lineIndex++] = positionsArray[i3];
            linePositionsArray[lineIndex++] = positionsArray[i3 + 1];
            linePositionsArray[lineIndex++] = positionsArray[i3 + 2];
            linePositionsArray[lineIndex++] = positionsArray[j3];
            linePositionsArray[lineIndex++] = positionsArray[j3 + 1];
            linePositionsArray[lineIndex++] = positionsArray[j3 + 2];
          }
        }
      }
      
      // Clear remaining line positions
      for (let i = lineIndex; i < linePositionsArray.length; i++) {
        linePositionsArray[i] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Subtle camera movement
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.y = Math.cos(time * 0.15) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent', opacity: 0.05 }}
    />
  );
};
