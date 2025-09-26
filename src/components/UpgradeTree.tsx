import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upgrade } from '@/hooks/useGameState';

interface UpgradeTreeProps {
  type: 'knowledge' | 'mana';
  upgrades: Upgrade[];
  onPurchase: (upgradeId: string) => void;
  canPurchase: (upgradeId: string) => boolean;
  currentCurrency: number;
}

const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

export const UpgradeTree = ({ type, upgrades, onPurchase, canPurchase, currentCurrency }: UpgradeTreeProps) => {
  const isKnowledge = type === 'knowledge';
  const filteredUpgrades = upgrades.filter(u => u.id.startsWith(isKnowledge ? 'k' : 'm'));
  
  const titleColor = isKnowledge ? 'text-knowledge' : 'text-mana';
  const borderColor = isKnowledge ? 'border-knowledge/30' : 'border-mana/30';
  const bgGradient = isKnowledge 
    ? 'bg-gradient-to-b from-knowledge/5 to-transparent' 
    : 'bg-gradient-to-b from-mana/5 to-transparent';

  return (
    <div className={`h-full ${bgGradient} p-4 border-r ${borderColor}`}>
      <div className="mb-6 text-center">
        <h2 className={`text-xl font-bold ${titleColor} mb-2`}>
          {isKnowledge ? '🔴 Knowledge Tree' : '🔵 Mana Tree'}
        </h2>
        <div className="text-xs text-muted-foreground">
          Costs {isKnowledge ? 'Mana' : 'Knowledge'}
        </div>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredUpgrades.map((upgrade) => {
          const affordable = canPurchase(upgrade.id);
          const purchased = upgrade.purchased;
          
          return (
            <Card key={upgrade.id} className={`p-3 border ${
              purchased 
                ? 'bg-green-500/20 border-green-500/50' 
                : affordable 
                  ? `border-${isKnowledge ? 'knowledge' : 'mana'}/50` 
                  : 'border-muted/30'
            }`}>
              <div className="space-y-2">
                <div className={`font-semibold text-sm ${
                  purchased ? 'text-green-400' : affordable ? titleColor : 'text-muted-foreground'
                }`}>
                  {upgrade.name}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {upgrade.description}
                </div>
                
                <div className="text-xs font-medium text-foreground">
                  {upgrade.effect}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    Cost: {formatNumber(upgrade.cost)} {isKnowledge ? '🔵' : '🔴'}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={purchased ? "secondary" : affordable ? "default" : "outline"}
                    onClick={() => onPurchase(upgrade.id)}
                    disabled={purchased || !affordable}
                    className={`text-xs px-2 py-1 ${
                      !purchased && affordable 
                        ? isKnowledge 
                          ? 'bg-knowledge hover:bg-knowledge/80' 
                          : 'bg-mana hover:bg-mana/80'
                        : ''
                    }`}
                  >
                    {purchased ? '✓ Owned' : affordable ? 'Buy' : 'Locked'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};