import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = false 
}) => {
  return (
    <Card className={cn("p-6", gradient && "bg-gradient-to-br from-white to-surface", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={cn(
                  "mr-1",
                  trend === "up" ? "text-success" : "text-error"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success" : "text-error"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
          <ApperIcon name={icon} size={24} className="text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;