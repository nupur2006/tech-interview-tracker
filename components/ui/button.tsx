import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
}

const variantStyles = {
  primary:
    "bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/25 hover:shadow-accent/40",
  secondary:
    "bg-brand-800 hover:bg-brand-700 text-brand-100 border border-brand-700",
  ghost: "bg-transparent hover:bg-white/5 text-brand-300 hover:text-white",
  danger:
    "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
        "disabled:opacity-50 disabled:pointer-events-none",
        "active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
