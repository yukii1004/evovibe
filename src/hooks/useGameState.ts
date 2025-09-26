import { useState, useEffect, useCallback } from 'react';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: 'knowledge' | 'mana';
  effect: string;
  purchased: boolean;
  unlocked: boolean;
  multiplier?: number;
  flatBonus?: number;
  requirement?: string;
}

export interface GameState {
  knowledge: number;
  mana: number;
  knowledgePerSecond: number;
  manaPerSecond: number;
  upgrades: Upgrade[];
  evolutionStage: number;
  lastTick: number;
}

const KNOWLEDGE_UPGRADES: Omit<Upgrade, 'purchased' | 'unlocked'>[] = [
  { id: 'k1', name: 'Old Books', description: 'Study ancient texts', cost: 10, costType: 'mana', effect: '+1 Knowledge/sec', flatBonus: 1 },
  { id: 'k2', name: 'Observation Notes', description: 'Document your findings', cost: 50, costType: 'mana', effect: '+2 Knowledge/sec', flatBonus: 2 },
  { id: 'k3', name: 'Basic Theory', description: 'Understand fundamentals', cost: 100, costType: 'mana', effect: 'x2 Knowledge gain', multiplier: 2 },
  { id: 'k4', name: 'Circle of Focus', description: 'Enhance concentration', cost: 250, costType: 'mana', effect: '+3 Knowledge/sec', flatBonus: 3 },
  { id: 'k5', name: 'Advanced Theorems', description: 'Complex mathematical insights', cost: 500, costType: 'mana', effect: 'x3 Knowledge gain', multiplier: 3 },
  { id: 'k6', name: 'Runic Studies', description: 'Decode ancient symbols', cost: 1000, costType: 'mana', effect: '+5 Knowledge/sec', flatBonus: 5 },
  { id: 'k7', name: 'Mana Resonance Theory', description: 'Knowledge scales with Mana spent', cost: 2500, costType: 'mana', effect: 'Knowledge boost from Mana', multiplier: 1.5 },
  { id: 'k8', name: 'Visualization Techniques', description: 'Mental projection mastery', cost: 5000, costType: 'mana', effect: 'x5 Knowledge gain', multiplier: 5 },
  { id: 'k9', name: 'Dimensional Theory', description: 'Understand space-time', cost: 10000, costType: 'mana', effect: 'x10 Knowledge gain', multiplier: 10 },
  { id: 'k10', name: 'Mana Circuits Optimization', description: 'Perfect energy flow', cost: 25000, costType: 'mana', effect: '+Knowledge per Mana/sec', flatBonus: 10 },
  { id: 'k11', name: 'Arcane Philosophy', description: 'Deep understanding', cost: 50000, costType: 'mana', effect: 'x2 global Knowledge', multiplier: 2 },
  { id: 'k12', name: 'Singularity Hypothesis', description: 'Theoretical breakthrough', cost: 100000, costType: 'mana', effect: 'Unlock final stage', flatBonus: 0 },
  { id: 'k13', name: 'Mana-Cognition Fusion', description: 'Mind and magic unite', cost: 250000, costType: 'mana', effect: 'x25 Knowledge gain', multiplier: 25 },
  { id: 'k14', name: 'Infinite Library', description: 'Access all knowledge', cost: 500000, costType: 'mana', effect: 'x50 Knowledge gain', multiplier: 50 },
  { id: 'k15', name: 'Final Insight', description: 'Truth of existence', cost: 1000000, costType: 'mana', effect: 'Required for Singularity', flatBonus: 0 },
];

const MANA_UPGRADES: Omit<Upgrade, 'purchased' | 'unlocked'>[] = [
  { id: 'm1', name: 'Meditation', description: 'Basic energy cultivation', cost: 10, costType: 'knowledge', effect: '+1 Mana/sec', flatBonus: 1 },
  { id: 'm2', name: 'Mana Breathing', description: 'Controlled energy flow', cost: 50, costType: 'knowledge', effect: 'x2 Mana regen', multiplier: 2 },
  { id: 'm3', name: 'Mana Threads', description: 'Weave energy patterns', cost: 100, costType: 'knowledge', effect: '+2 Mana/sec', flatBonus: 2 },
  { id: 'm4', name: 'Vein Expansion', description: 'Widen energy channels', cost: 250, costType: 'knowledge', effect: 'x2 Mana regen', multiplier: 2 },
  { id: 'm5', name: 'Mana Heart', description: 'Core energy source', cost: 500, costType: 'knowledge', effect: 'x5 Mana regen', multiplier: 5 },
  { id: 'm6', name: 'Pool Expansion', description: 'Increase capacity', cost: 1000, costType: 'knowledge', effect: '+3 Mana/sec', flatBonus: 3 },
  { id: 'm7', name: 'Visualization', description: 'Mental mana projection', cost: 2500, costType: 'knowledge', effect: 'Mana boost from Knowledge', multiplier: 1.5 },
  { id: 'm8', name: 'Elemental Sparks', description: 'Harness elemental forces', cost: 5000, costType: 'knowledge', effect: 'x3 Mana regen', multiplier: 3 },
  { id: 'm9', name: 'Elemental Mastery', description: 'Command all elements', cost: 10000, costType: 'knowledge', effect: 'x10 Mana regen', multiplier: 10 },
  { id: 'm10', name: 'Time Dilation', description: 'Manipulate temporal flow', cost: 25000, costType: 'knowledge', effect: '50% offline production', flatBonus: 5 },
  { id: 'm11', name: 'Spellcasting Practice', description: 'Perfect magical technique', cost: 50000, costType: 'knowledge', effect: 'Gain Mana from Knowledge clicks', flatBonus: 0 },
  { id: 'm12', name: 'Reality Anchor', description: 'Stabilize existence', cost: 100000, costType: 'knowledge', effect: 'Scales with upgrades', multiplier: 2 },
  { id: 'm13', name: 'Mana Overflow', description: 'Unlimited energy flow', cost: 250000, costType: 'knowledge', effect: 'x20 Mana regen', multiplier: 20 },
  { id: 'm14', name: 'World-Breaker Spell', description: 'Reality-shaping magic', cost: 500000, costType: 'knowledge', effect: 'x100 Mana regen', multiplier: 100 },
  { id: 'm15', name: 'Final Fusion', description: 'Ultimate magical state', cost: 1000000, costType: 'knowledge', effect: 'Required for Singularity', flatBonus: 0 },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('infinite-mage-save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastTick: Date.now(),
        };
      } catch {
        // fallthrough to default state
      }
    }
    
    return {
      knowledge: 0,
      mana: 0,
      knowledgePerSecond: 1,
      manaPerSecond: 1,
      upgrades: [
        ...KNOWLEDGE_UPGRADES.map(u => ({ ...u, purchased: false, unlocked: true })),
        ...MANA_UPGRADES.map(u => ({ ...u, purchased: false, unlocked: true })),
      ],
      evolutionStage: 0,
      lastTick: Date.now(),
    };
  });

  // Save game state
  useEffect(() => {
    localStorage.setItem('infinite-mage-save', JSON.stringify(gameState));
  }, [gameState]);

  // Game tick for passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const deltaTime = (now - prev.lastTick) / 1000; // seconds
        
        return {
          ...prev,
          knowledge: prev.knowledge + (prev.knowledgePerSecond * deltaTime),
          mana: prev.mana + (prev.manaPerSecond * deltaTime),
          lastTick: now,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const addKnowledge = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      knowledge: prev.knowledge + amount,
    }));
  }, []);

  const addMana = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      mana: prev.mana + amount,
    }));
  }, []);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgrade = prev.upgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased) return prev;

      const cost = upgrade.cost;
      const hasEnoughCurrency = upgrade.costType === 'knowledge' 
        ? prev.knowledge >= cost 
        : prev.mana >= cost;

      if (!hasEnoughCurrency) return prev;

      const newState = { ...prev };
      
      // Deduct cost
      if (upgrade.costType === 'knowledge') {
        newState.knowledge -= cost;
      } else {
        newState.mana -= cost;
      }

      // Mark upgrade as purchased
      newState.upgrades = prev.upgrades.map(u => 
        u.id === upgradeId ? { ...u, purchased: true } : u
      );

      // Apply upgrade effects
      if (upgrade.flatBonus) {
        if (upgrade.id.startsWith('k')) {
          newState.knowledgePerSecond += upgrade.flatBonus;
        } else {
          newState.manaPerSecond += upgrade.flatBonus;
        }
      }

      if (upgrade.multiplier) {
        if (upgrade.id.startsWith('k')) {
          newState.knowledgePerSecond *= upgrade.multiplier;
        } else {
          newState.manaPerSecond *= upgrade.multiplier;
        }
      }

      // Update evolution stage based on purchased upgrades
      const purchasedCount = newState.upgrades.filter(u => u.purchased).length;
      newState.evolutionStage = Math.floor(purchasedCount / 5);

      return newState;
    });
  }, []);

  const canPurchase = useCallback((upgradeId: string) => {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return false;

    return upgrade.costType === 'knowledge' 
      ? gameState.knowledge >= upgrade.cost 
      : gameState.mana >= upgrade.cost;
  }, [gameState]);

  const resetGame = useCallback(() => {
    localStorage.removeItem('infinite-mage-save');
    window.location.reload();
  }, []);

  return {
    gameState,
    addKnowledge,
    addMana,
    purchaseUpgrade,
    canPurchase,
    resetGame,
  };
};