import React from 'react';
import { clsx } from 'clsx';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  isHighPriority?: boolean;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  isHighPriority = false,
  className 
}: KPICardProps) {
  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={clsx(
      "bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200",
      isHighPriority && "ring-2 ring-red-100 border-red-200",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {Icon && (
              <Icon className={clsx(
                "w-5 h-5",
                isHighPriority ? "text-red-500" : "text-gray-400"
              )} />
            )}
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          
          <div className="mt-2">
            <p className={clsx(
              "text-2xl font-bold",
              isHighPriority ? "text-red-600" : "text-gray-900"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {trend && (
          <div className={clsx(
            "flex items-center space-x-1 text-sm font-medium",
            getTrendColor(trend.direction)
          )}>
            {React.createElement(getTrendIcon(trend.direction), { 
              className: "w-4 h-4" 
            })}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}