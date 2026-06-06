import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

export const LikeAnimation = () => {
  const [particles] = useState<Particle[]>(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 60 - 30,
      y: -(Math.random() * 80 + 40),
      size: Math.random() * 16 + 12,
      delay: Math.random() * 0.2,
      duration: Math.random() * 0.4 + 0.6,
      rotate: Math.random() * 60 - 30,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute text-red-500 animate-like-particle"
          style={{
            left: '50%',
            bottom: '40%',
            fontSize: `${particle.size}px`,
            transform: `translateX(-50%) rotate(${particle.rotate}deg)`,
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
          } as React.CSSProperties}
        >
          ❤️
        </span>
      ))}
    </div>
  );
};
