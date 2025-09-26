import { useEffect, useState } from 'react';

interface ResourceCounterProps {
  type: 'knowledge' | 'mana';
  amount: number;
  perSecond: number;
}

const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

export const ResourceCounter = ({ type, amount, perSecond }: ResourceCounterProps) => {
  const [displayAmount, setDisplayAmount] = useState(amount);

  useEffect(() => {
    setDisplayAmount(amount);
  }, [amount]);

  const isKnowledge = type === 'knowledge';
  const colorClass = isKnowledge ? 'text-knowledge' : 'text-mana';
  const glowClass = isKnowledge ? 'glow-knowledge' : 'glow-mana';
  const bgGradient = isKnowledge 
    ? 'bg-gradient-to-r from-knowledge/20 to-knowledge/5' 
    : 'bg-gradient-to-r from-mana/20 to-mana/5';

  return (
    <div className={`${bgGradient} p-4 rounded-lg border border-white/10 ${glowClass}`}>
      <div className="text-center">
        <div className={`text-sm font-medium ${colorClass} mb-1`}>
          {isKnowledge ? '🔴 Knowledge' : '🔵 Mana'}
        </div>
        <div className={`text-2xl font-bold ${colorClass} mb-2`}>
          {formatNumber(displayAmount)}
        </div>
        <div className="text-xs text-muted-foreground">
          +{formatNumber(perSecond)}/sec
        </div>
      </div>
    </div>
  );
};