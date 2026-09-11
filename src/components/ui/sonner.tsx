import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-full !border-hair !bg-navy !text-navy-foreground !shadow-pop !text-caption !gap-2 !py-2.5 !px-4",
          actionButton: "!bg-white/15 !text-white !rounded-full",
        },
      }}
    />
  );
}

export { toast };
