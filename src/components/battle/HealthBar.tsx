import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthBarProps {
  health: number;
  maxHealth: number;
  playerName: string;
  isPlayer?: boolean;
  avatar?: string;
}

export const HealthBar = ({ health, maxHealth, playerName, isPlayer = false, avatar }: HealthBarProps) => {
  const healthPercent = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercent > 60) return 'bg-green-500';
    if (healthPercent > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border",
      isPlayer ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold",
        isPlayer 
          ? "bg-gradient-to-br from-primary to-primary/60" 
          : "bg-gradient-to-br from-destructive to-destructive/60"
      )}>
        {avatar || playerName.charAt(0).toUpperCase()}
      </div>
      
      {/* Health Info */}
      <div className={cn("flex-1", !isPlayer && "text-right")}>
        <p className="font-semibold text-lg mb-2">{playerName}</p>
        
        {/* Health Bar Container */}
        <div className="h-6 bg-muted rounded-full overflow-hidden border-2 border-border">
          <motion.div
            className={cn("h-full rounded-full", getHealthColor())}
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
        
        {/* Health Text */}
        <p className="text-sm text-muted-foreground mt-1">
          {health} / {maxHealth} HP
        </p>
      </div>
    </div>
  );
};
