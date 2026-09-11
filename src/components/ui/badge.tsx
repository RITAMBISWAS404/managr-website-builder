import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-pill font-semibold leading-none whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border border-border bg-surface text-muted-foreground",
        neutral: "bg-secondary text-secondary-foreground",
        success: "bg-success-surface text-success",
        warning: "bg-warning-surface text-warning",
        info: "bg-info-surface text-info",
        advanced: "bg-advanced-surface text-advanced",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { badgeVariants };
