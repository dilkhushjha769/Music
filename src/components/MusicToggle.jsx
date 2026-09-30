import React, { useState, useEffect } from 'react';
import sounds from '../audio/soundEffects';

export default function MusicToggle() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if sounds is already muted
    setIsMuted(sounds.isMuted);
    setIsPlaying(sounds.isMusicPlaying);

    const checkInterval = setInterval(() => {
      setIsPlaying(sounds.isMusicPlaying);
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  const handleToggle = () => {
    sounds.init();
    if (!sounds.isMusicPlaying) {
      sounds.startBackgroundMusic();
      setIsPlaying(true);
    }
    const mutedState = sounds.toggleMute();
    setIsMuted(mutedState);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        title={isMuted ? 'Unmute romantic music' : 'Mute music'}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-card border border-rose-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-[#8A3B4D] cursor-pointer"
      >
        <span className="text-base">
          {isMuted ? '🔇' : '🔊'}
        </span>

        {/* Animated wave bars if music is active */}
        {!isMuted && isPlaying ? (
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-full bg-[#E62248] rounded-full animate-[musicBar_0.8s_ease-in-out_infinite]" />
            <span className="w-0.5 h-full bg-[#FF6B8B] rounded-full animate-[musicBar_1.1s_ease-in-out_0.2s_infinite]" />
            <span className="w-0.5 h-full bg-[#E62248] rounded-full animate-[musicBar_0.9s_ease-in-out_0.4s_infinite]" />
          </div>
        ) : (
          <span className="text-xs font-sans text-[#A66E7A] font-medium hidden sm:inline">
            {isMuted ? 'Muted' : 'Music'}
          </span>
        )}
      </button>

      <style>{`
        @keyframes musicBar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
