import React from 'react';

interface ConfettiProps {
  show: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}>
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'][Math.floor(Math.random() * 5)],
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        </div>
      ))}
    </div>
  );
};
