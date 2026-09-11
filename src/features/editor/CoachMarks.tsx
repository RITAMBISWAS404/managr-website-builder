import { Button } from "@/components/ui/button";
import { useS, useDispatch } from "@/store/hooks";

export function CoachMarks() {
  const s = useS();
  const dispatch = useDispatch();
  if (s.onboarded) return null;

  return (
    <div className="fixed inset-x-2 bottom-[120px] z-[130] mx-auto max-w-sm rounded-xl bg-navy p-4 text-navy-foreground shadow-pop lg:inset-x-auto lg:right-6 lg:top-20 lg:bottom-auto">
      <p className="text-body leading-relaxed">
        <b>Your website.</b> Click a section to edit it · <b>Add</b> for more sections · <b>Preview</b> to see it as a
        visitor · edits stay in a draft until you <b>Publish</b>.
      </p>
      <div className="mt-3 flex justify-end">
        <Button size="sm" className="bg-white text-navy hover:bg-white/90" onClick={() => dispatch({ type: "patch", patch: { onboarded: true } })}>
          Got it
        </Button>
      </div>
    </div>
  );
}
