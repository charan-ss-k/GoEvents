
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';

type TrendType = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: TrendType;
  trendValue: string;
  className?: string;
  showRupeeSymbol?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
  showRupeeSymbol = false
}) => {
  return (
    <BlurContainer className={cn("relative p-6", className)}>
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-muted-foreground">{title}</div>
        <div className="bg-secondary/70 rounded-full p-2">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="text-2xl font-bold mb-1">
        {showRupeeSymbol ? '₹' : ''}{value}
      </div>
      
      <div className={cn(
        "text-xs flex items-center",
        trend === 'up' && "text-green-500",
        trend === 'down' && "text-red-500",
        trend === 'neutral' && "text-muted-foreground"
      )}>
        {trendValue}
      </div>
    </BlurContainer>
  );
};

export default StatCard;
