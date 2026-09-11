import * as React from "react";

export type Overlay =
  | null
  | "publish"
  | "versions"
  | "design"
  | "command"
  | "responsive"
  | "pagePick"
  | "editorMore"
  | "mobileSection"
  | "mobileLayers"
  | "mobileAdd";

interface EditorUI {
  overlay: Overlay;
  open: (o: Overlay) => void;
  close: () => void;
}

const Ctx = React.createContext<EditorUI | null>(null);

export function EditorUIProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = React.useState<Overlay>(null);
  const value = React.useMemo<EditorUI>(
    () => ({ overlay, open: setOverlay, close: () => setOverlay(null) }),
    [overlay],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditorUI() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useEditorUI must be used inside <EditorUIProvider>");
  return ctx;
}
