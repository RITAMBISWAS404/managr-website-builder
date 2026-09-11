import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** grouped info surface (12px, no shadow) instead of an elevated entity (20px, e1) */
  flat?: boolean;
  /** quiet nested grouping — surface-2 background, subtle border */
  tone?: "surface" | "sunken";
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, flat, tone = "surface", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border",
        tone === "sunken" ? "border-border-subtle bg-surface-2" : "border-border bg-card",
        flat || tone === "sunken" ? "rounded-lg" : "rounded-2xl shadow-e1",
        "text-card-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col gap-1 p-4", className)} {...props} />,
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-section font-semibold", className)} {...props} />,
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-caption text-muted-foreground", className)} {...props} />,
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center gap-2 p-4 pt-0", className)} {...props} />,
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
