import React, { useState } from 'react';
import { 
  Shader, 
  DotGrid, 
  ChromaFlow, 
  LinearGradient, 
  CursorRipples, 
  FilmGrain 
} from 'shaders/react';
import FlutedCanvas from './FlutedCanvas';

/**
 * ShaderBackground:
 * Renders BOTH the interactive spotlight and the particle field directly using WebGPU shaders ('shaders/react').
 * - Spotlight: WebGPU <ChromaFlow visible={true}> creates a fluid, luminous cursor-tracking spotlight bloom
 * - Particles: WebGPU <DotGrid> mapped to chroma trail flow, masked with <LinearGradient> for Paytm cyan/violet sheen
 * - Interactive dynamics: <CursorRipples> and <FilmGrain>
 * - Fallback: Automatic seamless fallback to FlutedCanvas if WebGPU is unsupported
 */
export default function ShaderBackground({ className = "" }) {
  const [hasShaderError, setHasShaderError] = useState(false);

  if (hasShaderError) {
    return <FlutedCanvas className={className} />;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07090E] ${className}`}>
      <Shader 
        className="w-full h-full block absolute inset-0"
        onError={(err) => {
          console.warn("WebGPU Shader fallback triggered:", err);
          setHasShaderError(true);
        }}
      >
        {/* 1. Base Ambient Dark Backdrop Shader */}
        <LinearGradient
          colorA="#07090E"
          colorB="#0B0D14"
          colorSpace="hsl"
          end={{ x: 0, y: 1 }}
          start={{ x: 0, y: 0 }}
        />

        {/* 2. Interactive WebGPU Shader Spotlight (ChromaFlow fluid luminous beam following cursor) */}
        <ChromaFlow
          id="trailFlow"
          baseColor="#07090E"
          upColor="#00BAF2"
          downColor="#002970"
          leftColor="#7C3AED"
          rightColor="#00BAF2"
          intensity={1.5}
          radius={3.2}
          momentum={28}
          visible={true}
          opacity={0.55}
          blendMode="screen"
        />

        {/* 3. Interactive Particle Grid driven by ChromaFlow liquid light */}
        <DotGrid
          id="trailDots"
          density={42}
          dotSize={{
            type: "map",
            source: "trailFlow",
            channel: "alpha",
            inputMax: 1,
            inputMin: 0,
            outputMax: 1,
            outputMin: 0
          }}
          twinkle={0.85}
          visible={false}
        />

        {/* 4. Linear Gradient masked to DotGrid particles for luminous cyan/violet sheen */}
        <LinearGradient
          colorA="#00BAF2"
          colorB="#A78BFA"
          colorSpace="hsl"
          end={{ x: 1, y: 0 }}
          maskSource="trailDots"
          start={{ x: 0, y: 1 }}
          blendMode="screen"
        />

        {/* 5. Real-time Cursor Waves & Cinematic Grain */}
        <CursorRipples />
        <FilmGrain strength={0.07} />
      </Shader>
    </div>
  );
}
