
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BlurContainer: React.FC<BlurContainerProps> = ({ 
  children, 
  className,
  style
}) => {
  return (
    <div 
      className={cn(
        "glass-panel p-4 md:p-6 overflow-hidden relative",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
