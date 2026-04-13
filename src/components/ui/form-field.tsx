"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement> & { as?: "input" };
type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };
type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    options: { value: string; label: string }[];
  };

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const baseStyles =
  "w-full bg-white border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors";

export function FormField(props: FormFieldProps) {
  const { label, error, required, className, ...rest } = props;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>

      {props.as === "textarea" ? (
        <textarea
          className={cn(baseStyles, "min-h-[120px] resize-y", className)}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : props.as === "select" ? (
        <select className={cn(baseStyles, className)} {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}>
          <option value="">Select...</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={cn(baseStyles, className)}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
