import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface MoodOrbCanvasProps {
  scrollProgress: number; // 0 to 1
  activeSection: string;
  isCrisisActive?: boolean;
}

export const MoodOrbCanvas: React.FC<MoodOrbCanvasProps> = ({
  scrollProgress,
  activeSection,
  isCrisisActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1200 : 2800;
    const geometry = new THREE.BufferGeometry();
    const originalPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorSky = new THREE.Color('#7FA7C4');
    const colorSage = new THREE.Color('#8FAE95');
    const colorLavender = new THREE.Color('#B2A6D6');
    const colorSand = new THREE.Color('#E9E2D6');

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.65 + (Math.random() - 0.5) * 0.3;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const i3 = i * 3;
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      currentPositions[i3] = x;
      currentPositions[i3 + 1] = y;
      currentPositions[i3 + 2] = z;

      targetPositions[i3] = x;
      targetPositions[i3 + 1] = y;
      targetPositions[i3 + 2] = z;

      const mixedColor = colorSky.clone().lerp(colorSage, Math.random() * 0.6);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.085,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = geometry.attributes.color as THREE.BufferAttribute;

      const isDashboard = activeSection === 'dashboard';
      const isToolkit = activeSection === 'toolkit';
      const isCrisis = activeSection === 'crisis' || isCrisisActive;

      const motionSpeed = isCrisis ? 0.04 : isToolkit ? 0.75 : 1.1;

      let currentTargetColor1 = colorSky;
      let currentTargetColor2 = colorSage;

      if (scrollProgress > 0.3 && scrollProgress <= 0.6) {
        currentTargetColor1 = colorSage;
        currentTargetColor2 = colorLavender;
      } else if (scrollProgress > 0.6 && scrollProgress <= 0.82) {
        currentTargetColor1 = colorLavender;
        currentTargetColor2 = colorSky;
      } else if (scrollProgress > 0.82) {
        currentTargetColor1 = colorSky;
        currentTargetColor2 = colorSand;
      }

      const breathingPulse = Math.sin(elapsedTime * 1.4 * motionSpeed) * 0.14;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        const noiseX = Math.sin(ox * 1.6 + elapsedTime * 0.7 * motionSpeed) * 0.09;
        const noiseY = Math.cos(oy * 1.6 + elapsedTime * 0.7 * motionSpeed) * 0.09;
        const noiseZ = Math.sin(oz * 1.6 + elapsedTime * 0.7 * motionSpeed) * 0.09;

        if (isDashboard) {
          const progressAlongCurve = (i / particleCount) * 4.2 - 2.1;
          const waveY = Math.sin(progressAlongCurve * 2.8 + elapsedTime * 0.45) * 0.65 + (Math.sin(i * 8) * 0.12);
          const scatterZ = Math.cos(i * 4) * 0.45;

          targetPositions[i3] = progressAlongCurve * 1.35;
          targetPositions[i3 + 1] = waveY;
          targetPositions[i3 + 2] = scatterZ;
        } else if (isToolkit) {
          const breathScale = 1.0 + Math.sin(elapsedTime * 0.8) * 0.28;
          targetPositions[i3] = (ox + noiseX) * breathScale;
          targetPositions[i3 + 1] = (oy + noiseY) * breathScale;
          targetPositions[i3 + 2] = (oz + noiseZ) * breathScale;
        } else {
          const scale = 1.0 + breathingPulse;
          targetPositions[i3] = (ox + noiseX) * scale;
          targetPositions[i3 + 1] = (oy + noiseY) * scale;
          targetPositions[i3 + 2] = (oz + noiseZ) * scale;
        }

        currentPositions[i3] += (targetPositions[i3] - currentPositions[i3]) * 0.06;
        currentPositions[i3 + 1] += (targetPositions[i3 + 1] - currentPositions[i3 + 1]) * 0.06;
        currentPositions[i3 + 2] += (targetPositions[i3 + 2] - currentPositions[i3 + 2]) * 0.06;

        const mixRatio = (Math.sin(i + elapsedTime * 0.4) + 1) * 0.5;
        const targetColor = currentTargetColor1.clone().lerp(currentTargetColor2, mixRatio);

        colors[i3] += (targetColor.r - colors[i3]) * 0.05;
        colors[i3 + 1] += (targetColor.g - colors[i3 + 1]) * 0.05;
        colors[i3 + 2] += (targetColor.b - colors[i3 + 2]) * 0.05;
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Position the orb clearly on the right half of desktop viewport
      const targetPosX = isMobile ? 0 : isDashboard ? 0.6 : 1.75;
      const targetPosY = isMobile ? 0.8 : -0.1;

      particles.position.x += (targetPosX + mouseX - particles.position.x) * 0.04;
      particles.position.y += (targetPosY - mouseY - particles.position.y) * 0.04;
      particles.rotation.y = elapsedTime * 0.04 * motionSpeed;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, activeSection, scrollProgress, isCrisisActive]);

  if (prefersReducedMotion || !hasWebGL) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-end pr-12 lg:pr-24">
        <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-[#7FA7C4]/35 via-[#8FAE95]/25 to-[#B2A6D6]/35 blur-3xl opacity-80" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
