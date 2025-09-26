import { useEffect, useState } from 'react';
import humanSilhouette from '@/assets/human-silhouette.jpg';

interface EvolutionDisplayProps {
  evolutionStage: number;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export const EvolutionDisplay = ({ evolutionStage, onLeftClick, onRightClick }: EvolutionDisplayProps) => {
  const [clickEffect, setClickEffect] = useState<'left' | 'right' | null>(null);

  const getGlowStyle = (stage: number) => {
    if (stage < 1) return {};
    
    const intensity = Math.min(stage * 0.2, 1);
    return {
      filter: `drop-shadow(0 0 ${20 + stage * 10}px hsl(var(--cosmic) / ${intensity}))`,
    };
  };

  const handleLeftClick = () => {
    onLeftClick();
    setClickEffect('left');
    setTimeout(() => setClickEffect(null), 200);
  };

  const handleRightClick = () => {
    onRightClick();
    setClickEffect('right');
    setTimeout(() => setClickEffect(null), 200);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Title - moved above the image */}
      <div className="mb-8 text-center z-10">
        <h1 className="text-5xl font-bold glow-cosmic mb-3">
          Infinite Mage
        </h1>
        <div className="text-cosmic text-lg font-medium">
          Path to Singularity
        </div>
      </div>

      {/* Main content container */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Clickable areas */}
        <div className="absolute inset-0 flex">
          {/* Left side - Knowledge */}
          <div 
            className={`w-1/2 clickable-area ${clickEffect === 'left' ? 'bg-knowledge/20' : 'hover:bg-knowledge/10'} transition-all duration-200 cursor-pointer flex items-center justify-center`}
            onClick={handleLeftClick}
          >
            <div className="text-knowledge text-center opacity-0 hover:opacity-60 transition-opacity">
              <div className="text-6xl mb-2">🔴</div>
              <div className="text-sm font-medium">Click for Knowledge</div>
            </div>
          </div>

          {/* Right side - Mana */}
          <div 
            className={`w-1/2 clickable-area ${clickEffect === 'right' ? 'bg-mana/20' : 'hover:bg-mana/10'} transition-all duration-200 cursor-pointer flex items-center justify-center`}
            onClick={handleRightClick}
          >
            <div className="text-mana text-center opacity-0 hover:opacity-60 transition-opacity">
              <div className="text-6xl mb-2">🔵</div>
              <div className="text-sm font-medium">Click for Mana</div>
            </div>
          </div>
        </div>

        {/* Human silhouette */}
        <div className="relative z-20 pointer-events-none">
          <img 
            src={humanSilhouette} 
            alt="Human Evolution" 
            className="h-80 w-100 evolution-glow"
            style={getGlowStyle(evolutionStage)}
          />
          
          {/* Evolution overlays */}
          {evolutionStage >= 1 && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cosmic rounded-full animate-pulse" 
                 style={{ boxShadow: '0 0 20px hsl(var(--cosmic))' }} />
          )}
          
          {evolutionStage >= 2 && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-cosmic to-transparent animate-pulse" />
          )}
          
          {evolutionStage >= 3 && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-cosmic/50 rounded-full animate-pulse" 
                 style={{ boxShadow: '0 0 30px hsl(var(--cosmic))' }} />
          )}
          
          {evolutionStage >= 4 && (
            <>
              <div className="absolute top-16 left-4 w-2 h-20 bg-cosmic/70 rotate-12 animate-pulse" />
              <div className="absolute top-16 right-4 w-2 h-20 bg-cosmic/70 -rotate-12 animate-pulse" />
            </>
          )}
          
          {evolutionStage >= 5 && (
            <div className="absolute inset-0 bg-gradient-radial from-cosmic/30 to-transparent animate-pulse" />
          )}
          
          {evolutionStage >= 6 && (
            <div className="absolute -inset-6 bg-gradient-radial from-evolution/20 via-cosmic/10 to-transparent animate-pulse" />
          )}
        </div>
      </div>

      {/* Stage indicator - moved to bottom with proper spacing */}
      <div className="mt-6 text-center">
        <div className="text-cosmic text-base font-medium">
          Evolution Stage: {evolutionStage}/6
        </div>
        {evolutionStage >= 6 && (
          <div className="text-evolution text-sm mt-1 animate-pulse">
            Ready for Singularity
          </div>
        )}
      </div>
    </div>
  );
};