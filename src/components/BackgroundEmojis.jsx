import React, { useEffect, useState } from 'react';

const EMOJIS = ['❤️', '💕', '🥰', '😘', '🫶', '✨', '🌸', '🎀', '🎁', '🦋', '🌙', '⭐'];

export default function BackgroundEmojis({ intensity = 'normal' }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const count = intensity === 'subtle' ? 12 : 20;
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 92 + 4,
      y: Math.random() * 90 + 5,
      size: Math.random() * 14 + 16, // 16px to 30px
      duration: Math.random() * 8 + 9, // 9s to 17s float
      delay: Math.random() * 5,
      floatX: (Math.random() - 0.5) * 40,
      floatY: -(Math.random() * 60 + 30),
      opacity: Math.random() * 0.35 + 0.25,
      rotation: (Math.random() - 0.5) * 40,
    }));
    setItems(generated);
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute inline-block transition-transform ease-out"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            filter: 'blur(0.2px)',
            animation: `floatEmoji ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
            transform: `rotate(${item.rotation}deg)`,
          }}
        >
          {item.emoji}
        </span>
      ))}
      <style>{`
        @keyframes floatEmoji {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-24px) rotate(8deg) scale(1.08);
          }
          100% {
            transform: translateY(-48px) rotate(-6deg) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
