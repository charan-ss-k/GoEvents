
import React from 'react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';

interface DashboardCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  className,
  action
}) => {
  return (
    <BlurContainer className={cn("h-full flex flex-col", className)}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </BlurContainer>
  );
};

export default DashboardCard;
