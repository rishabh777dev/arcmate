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
export default function ShaderBackground({ className = "", opacity, style = {} }) {
  const [hasShaderError, setHasShaderError] = useState(false);

  if (hasShaderError) {
    return <FlutedCanvas className={className} style={style} opacity={opacity} />;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0e0d0a] ${className}`}
      style={{ ...style, ...(opacity !== undefined ? { opacity } : {}) }}
    >
      <Shader 
        className="w-full h-full block absolute inset-0"
        onError={(err) => {
          console.warn("WebGPU Shader fallback triggered:", err);
          setHasShaderError(true);
        }}
      >
        {/* 1. Base Ambient Dark Paper Backdrop Shader */}
        <LinearGradient
          colorA="#0e0d0a"
          colorB="#161410"
          colorSpace="hsl"
          end={{ x: 0, y: 1 }}
          start={{ x: 0, y: 0 }}
        />

        {/* 2. Interactive WebGPU Shader Spotlight (ChromaFlow warm editorial fluid beam) */}
        <ChromaFlow
          id="trailFlow"
          baseColor="#0e0d0a"
          upColor="#ed6f5c"
          downColor="#e9b94a"
          leftColor="#d95a47"
          rightColor="#f08e7c"
          intensity={1.25}
          radius={3.0}
          momentum={24}
          visible={true}
          opacity={0.45}
          blendMode="screen"
        />

        {/* 3. Interactive Particle Grid driven by ChromaFlow liquid light */}
        <DotGrid
          id="trailDots"
          density={38}
          dotSize={{
            type: "map",
            source: "trailFlow",
            channel: "alpha",
            inputMax: 1,
            inputMin: 0,
            outputMax: 1,
            outputMin: 0
          }}
          twinkle={0.8}
          visible={false}
        />

        {/* 4. Linear Gradient masked to DotGrid particles for warm coral & amber sheen */}
        <LinearGradient
          colorA="#ed6f5c"
          colorB="#e9b94a"
          colorSpace="hsl"
          end={{ x: 1, y: 0 }}
          maskSource="trailDots"
          start={{ x: 0, y: 1 }}
          blendMode="screen"
        />

        {/* 5. Real-time Cursor Waves & Cinematic Grain */}
        <CursorRipples />
        <FilmGrain strength={0.06} />
      </Shader>
    </div>
  );
}
