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
import { useTheme } from '../../context/ThemeContext';

/**
 * ShaderBackground:
 * Renders BOTH the interactive spotlight and the particle field directly using WebGPU shaders ('shaders/react').
 * - Spotlight: WebGPU <ChromaFlow visible={true}> creates a fluid, luminous cursor-tracking spotlight bloom
 * - Particles: WebGPU <DotGrid> mapped to chroma trail flow, masked with <LinearGradient> for sheen
 * - Interactive dynamics: <CursorRipples> and <FilmGrain>
 * - Fallback: Automatic seamless fallback to FlutedCanvas if WebGPU is unsupported
 */
export default function ShaderBackground({ className = "", opacity, style = {} }) {
  const [hasShaderError, setHasShaderError] = useState(false);
  const { isDark } = useTheme();
  const effectiveOpacity = opacity !== undefined ? (isDark ? opacity : Math.min(1, opacity + 0.15)) : (isDark ? 0.35 : 0.5);

  if (hasShaderError) {
    return <FlutedCanvas className={className} style={style} opacity={effectiveOpacity} isDark={isDark} />;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${isDark ? 'bg-[#0e0d0a]' : 'bg-[#fbfaf8]'} ${className}`}
      style={{ ...style, opacity: effectiveOpacity }}
    >
      <Shader 
        className="w-full h-full block absolute inset-0"
        onError={(err) => {
          console.warn("WebGPU Shader fallback triggered:", err);
          setHasShaderError(true);
        }}
      >
        {/* 1. Base Ambient Paper Backdrop Shader */}
        <LinearGradient
          colorA={isDark ? "#0e0d0a" : "#fbfaf8"}
          colorB={isDark ? "#161410" : "#f5f3ec"}
          colorSpace="hsl"
          end={{ x: 0, y: 1 }}
          start={{ x: 0, y: 0 }}
        />

        {/* 2. Interactive WebGPU Shader Simulation (ChromaFlow drives cursor fluid physics without murky body) */}
        <ChromaFlow
          id="trailFlow"
          baseColor="#00000000"
          upColor={isDark ? "#ed6f5c" : "#e0533c"}
          downColor={isDark ? "#e9b94a" : "#f59e0b"}
          leftColor={isDark ? "#d95a47" : "#f43f5e"}
          rightColor={isDark ? "#f08e7c" : "#fb923c"}
          intensity={isDark ? 1.2 : 1.3}
          radius={2.8}
          momentum={24}
          visible={false}
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
          colorA={isDark ? "#ed6f5c" : "#e0533c"}
          colorB={isDark ? "#e9b94a" : "#d99824"}
          colorSpace="hsl"
          end={{ x: 1, y: 0 }}
          maskSource="trailDots"
          start={{ x: 0, y: 1 }}
          blendMode={isDark ? "screen" : "multiply"}
        />

        {/* 5. Real-time Cursor Waves & Cinematic Grain */}
        <CursorRipples />
        <FilmGrain strength={isDark ? 0.06 : 0.03} />
      </Shader>
    </div>
  );
}
