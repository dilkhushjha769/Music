import React, { useState, useRef } from 'react';
import sounds from '../audio/soundEffects';

export default function LightPullerScene({ onLightsOn, girlfriendName = 'Angel' }) {
  const [isLightOn, setIsLightOn] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const MAX_DRAG = 90;
  const TRIGGER_THRESHOLD = 28;

  const triggerLights = () => {
    if (isLightOn) return;
    setIsLightOn(true);

    sounds.init();
    sounds.playLightSwitch();
    sounds.playSparkle();
    sounds.playWhoosh();
    sounds.startBackgroundMusic();

    // Smooth transition straight to the Heart scene without showing birthday text yet
    setTimeout(() => {
      if (onLightsOn) onLightsOn();
    }, 1100);
  };

  const handlePointerDown = (e) => {
    if (isLightOn) return;
    sounds.init();
    sounds.playTap();
    setIsDragging(true);
    startYRef.current = e.clientY - currentYRef.current;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isLightOn) return;
    const rawDelta = e.clientY - startYRef.current;
    if (rawDelta > 0) {
      const clampedY = Math.min(rawDelta * 0.75, MAX_DRAG);
      currentYRef.current = clampedY;
      setOffsetY(clampedY);
      if (clampedY > 15) {
        sounds.playStretch(clampedY / MAX_DRAG);
      }
    } else {
      currentYRef.current = 0;
      setOffsetY(0);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging || isLightOn) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const dist = currentYRef.current;
    setOffsetY(0);
    currentYRef.current = 0;

    if (dist >= TRIGGER_THRESHOLD || dist === 0) {
      triggerLights();
    }
  };

  const cordLength = 110 + offsetY;

  return (
    <div 
      className={`relative w-full h-full min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 select-none overflow-hidden px-4 ${
        isLightOn ? 'bg-[#FAF7F2]' : 'bg-[#140C12]'
      }`}
    >
      {/* Dark room subtle night ambient glow or illuminated radiance */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full pointer-events-none transition-all duration-1000"
        style={{
          background: isLightOn 
            ? 'radial-gradient(circle, rgba(255, 235, 200, 0.65) 0%, rgba(255, 210, 220, 0.35) 45%, transparent 75%)' 
            : 'radial-gradient(circle, rgba(255, 180, 200, 0.08) 0%, transparent 65%)',
        }}
      />

      {/* Hanging Ceiling Light Fixture + Pull Chain */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        
        {/* Ceiling Cord */}
        <div className="w-[3px] h-20 bg-gradient-to-b from-[#4A323D] to-[#735362]" />

        {/* Vintage Pendant Lamp Shade */}
        <div className="relative flex flex-col items-center">
          <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible filter drop-shadow-lg">
            <defs>
              <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLightOn ? '#FF8FA3' : '#422833'} />
                <stop offset="100%" stopColor={isLightOn ? '#E63956' : '#26151D'} />
              </linearGradient>
            </defs>
            <path d="M 40,0 L 80,0 L 115,55 L 5,55 Z" fill="url(#shadeGrad)" stroke="#B87D8F" strokeWidth="1.5" />
            <ellipse cx="60" cy="55" rx="55" ry="12" fill={isLightOn ? '#FFF0C2' : '#2D1822'} stroke="#B87D8F" strokeWidth="1.5" />
          </svg>

          {/* Glowing Light Bulb under the shade */}
          <div 
            className={`w-10 h-10 -mt-2 rounded-full transition-all duration-700 ${
              isLightOn 
                ? 'bg-[#FFF7D6] shadow-[0_0_90px_45px_rgba(255,230,150,0.9)] scale-110' 
                : 'bg-[#3A222C] shadow-none scale-95 opacity-80'
            }`}
          />
        </div>

        {/* The Interactive Hanging Pull-Cord */}
        <div 
          className="relative cursor-grab active:cursor-grabbing touch-none select-none flex flex-col items-center p-3"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translateY(${offsetY}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <svg width="40" height={cordLength} viewBox={`0 0 40 ${cordLength}`} className="overflow-visible">
            <line 
              x1="20" 
              y1="0" 
              x2="20" 
              y2={cordLength - 20} 
              stroke={isLightOn ? '#D49A1C' : '#8C6877'} 
              strokeWidth="2" 
              strokeDasharray="2 3" 
            />

            <g transform={`translate(20, ${cordLength - 16})`}>
              <circle cx="0" cy="0" r="26" fill="transparent" />
              <circle 
                cx="0" 
                cy="0" 
                r="11" 
                fill={isLightOn ? '#FFD166' : '#FF4B72'} 
                stroke="#FFF" 
                strokeWidth="2" 
                className="filter drop-shadow-md"
              />
              <text x="0" y="4" fontSize="11" textAnchor="middle" fill="#FFF">
                {isLightOn ? '✨' : '💡'}
              </text>
            </g>
          </svg>
        </div>

      </div>

      {/* Main Instructions: No Birthday message here, just turning on the light! */}
      <div className="relative z-10 text-center mt-52 transition-all duration-500">
        {!isLightOn ? (
          <div className="animate-fade-in flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C4889C] font-semibold">
              Shh... It's Dark in Here
            </span>
            <h1 className="text-2xl md:text-3xl font-serif text-[#FFF0F4] font-normal tracking-wide">
              Pull the cord to turn on the lights ✨
            </h1>
            <div className="mt-3 flex items-center gap-2 text-rose-300 font-playful text-lg animate-pulse">
              <span>Pull down or tap the glowing bulb</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center">
            <p className="text-base md:text-lg font-serif italic text-[#704250] animate-pulse">
              Let there be light... A secret surprise awaits ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
