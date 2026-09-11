import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-[42px] shrink-0 cursor-pointer items-center rounded-full border border-hair border-transparent transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=unchecked]:bg-[#e2e6ec]",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block size-[18px] translate-x-0.5 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[21px]" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
