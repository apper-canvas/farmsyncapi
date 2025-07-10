import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item", 
  onAction,
  icon = "Seedling",
  className = "" 
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/5 inline-flex mb-6">
          <ApperIcon name={icon} size={64} className="text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8">{description}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" size={20} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;