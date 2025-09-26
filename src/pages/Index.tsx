import { ResourceCounter } from '@/components/ResourceCounter';
import { EvolutionDisplay } from '@/components/EvolutionDisplay';
import { UpgradeTree } from '@/components/UpgradeTree';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { gameState, addKnowledge, addMana, purchaseUpgrade, canPurchase, resetGame } = useGameState();
  
  const handleKnowledgeClick = () => {
    const baseGain = 1;
    const totalGain = baseGain + Math.floor(gameState.knowledgePerSecond * 0.1);
    addKnowledge(totalGain);
  };

  const handleManaClick = () => {
    const baseGain = 1;
    const totalGain = baseGain + Math.floor(gameState.manaPerSecond * 0.1);
    addMana(totalGain);
  };

  // Check if ready for singularity
  const finalInsight = gameState.upgrades.find(u => u.id === 'k15')?.purchased;
  const finalFusion = gameState.upgrades.find(u => u.id === 'm15')?.purchased;
  const canReachSingularity = finalInsight && finalFusion;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Top Resource Bars */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-start">
          <div className="w-64">
            <ResourceCounter 
              type="knowledge" 
              amount={gameState.knowledge} 
              perSecond={gameState.knowledgePerSecond} 
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetGame}
              className="border-muted-foreground/30 hover:border-muted-foreground"
            >
              Reset Game
            </Button>
            {canReachSingularity && (
              <Button 
                variant="default"
                size="lg"
                className="bg-evolution hover:bg-evolution/80 glow-cosmic animate-pulse"
                onClick={() => {
                  // Trigger singularity
                  alert('🌟 SINGULARITY ACHIEVED! 🌟\n\nYou are Knowledge. You are Mana. You are Infinite.\n\nCongratulations on transcending humanity!');
                }}
              >
                🌟 ACHIEVE SINGULARITY 🌟
              </Button>
            )}
          </div>
          <div className="w-64">
            <ResourceCounter 
              type="mana" 
              amount={gameState.mana} 
              perSecond={gameState.manaPerSecond} 
            />
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="flex h-screen pt-32">
        {/* Knowledge Tree - Left */}
        <div className="w-80 h-full">
          <UpgradeTree 
            type="knowledge"
            upgrades={gameState.upgrades}
            onPurchase={purchaseUpgrade}
            canPurchase={canPurchase}
            currentCurrency={gameState.mana}
          />
        </div>

        {/* Center Evolution Display */}
        <div className="flex-1 h-full">
          <EvolutionDisplay 
            evolutionStage={gameState.evolutionStage}
            onLeftClick={handleKnowledgeClick}
            onRightClick={handleManaClick}
          />
        </div>

        {/* Mana Tree - Right */}
        <div className="w-80 h-full">
          <UpgradeTree 
            type="mana"
            upgrades={gameState.upgrades}
            onPurchase={purchaseUpgrade}
            canPurchase={canPurchase}
            currentCurrency={gameState.knowledge}
          />
        </div>
      </div>

      {/* Progress Indicators - moved to avoid overlap */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className="text-xs text-muted-foreground mb-2 bg-background/80 rounded px-2 py-1">
          Upgrades: {gameState.upgrades.filter(u => u.purchased).length}/30
        </div>
        {canReachSingularity && (
          <div className="text-evolution font-bold animate-pulse text-sm bg-background/80 rounded px-2 py-1">
            🔥 READY FOR SINGULARITY 🔥
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;