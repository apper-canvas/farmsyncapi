import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  className, 
  children, 
  required = false,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children || <Input {...props} />}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;