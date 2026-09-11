import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-0 bg-surface shadow-modal transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-3/4 border-l border-border-subtle data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-border-subtle data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-md",
        bottom:
          "inset-x-0 bottom-0 max-h-[92vh] rounded-t-2xl border-t border-border-subtle data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        full: "inset-0 h-full w-full data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      },
    },
    defaultVariants: { side: "bottom" },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideClose?: boolean;
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "bottom", className, children, hideClose, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {(side === "bottom" || side === "full") && (
          <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-border" />
        )}
        {children}
        {!hideClose && (
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-0.5 border-b border-border-subtle px-4 pb-3 pt-1 pr-12", className)} {...props} />
);
const SheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-4 py-4", className)} {...props} />
);
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex gap-2 border-t border-border-subtle px-4 py-3 [&>*]:flex-1", className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-section font-bold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-caption text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent,
  SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription,
};
