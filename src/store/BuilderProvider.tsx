import * as React from "react";
import type { BuilderState, SiteSnapshot } from "@/types";
import { createInitialState } from "./initialState";
import { reducer, CONTENT_ACTIONS, type Action } from "./reducer";
import { snapshotOf } from "./selectors";
import { clone } from "@/lib/utils";

const KEY = "managr_builder_react_v1";

interface Ctx {
  state: BuilderState;
  dispatch: (a: Action) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderCtx = React.createContext<Ctx | null>(null);

function load(): BuilderState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...createInitialState(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return createInitialState();
}

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = React.useReducer(reducer, undefined, load);

  const history = React.useRef<SiteSnapshot[]>([snapshotOf(state)]);
  const pos = React.useRef(0);
  const [, force] = React.useReducer((x) => x + 1, 0);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout>>();

  // persist
  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // seed published + genesis version once
  React.useEffect(() => {
    if (!state.published) {
      const snap = snapshotOf(state);
      rawDispatch({
        type: "patch",
        patch: {
          published: snap,
          versions: state.versions.length
            ? state.versions
            : [{ id: "v-genesis", kind: "published", ts: Date.now() - 12096e5, summary: "Site created", author: "You", isLive: true, snap }],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = React.useCallback(
    (a: Action) => {
      if (CONTENT_ACTIONS.has(a.type)) {
        // snapshot current for undo, then simulate autosave
        history.current = history.current.slice(0, pos.current + 1);
        history.current.push(snapshotOf(reducerPeek(a)));
        if (history.current.length > 50) history.current.shift();
        pos.current = history.current.length - 1;

        rawDispatch({ type: "markSaved", state: "saving" });
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => rawDispatch({ type: "markSaved", state: "saved" }), 550);
      }
      rawDispatch(a);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  // compute "next" snapshot without committing (for accurate undo entries)
  function reducerPeek(a: Action): BuilderState {
    return reducer(state, a);
  }

  const restore = React.useCallback((snap: SiteSnapshot) => {
    rawDispatch({ type: "restoreSnapshot", snap: clone(snap) });
  }, []);

  const undo = React.useCallback(() => {
    if (pos.current <= 0) return;
    pos.current -= 1;
    restore(history.current[pos.current]);
    force();
  }, [restore]);

  const redo = React.useCallback(() => {
    if (pos.current >= history.current.length - 1) return;
    pos.current += 1;
    restore(history.current[pos.current]);
    force();
  }, [restore]);

  const value: Ctx = {
    state,
    dispatch,
    undo,
    redo,
    canUndo: pos.current > 0,
    canRedo: pos.current < history.current.length - 1,
  };

  return <BuilderCtx.Provider value={value}>{children}</BuilderCtx.Provider>;
}

export function useBuilder() {
  const ctx = React.useContext(BuilderCtx);
  if (!ctx) throw new Error("useBuilder must be used inside <BuilderProvider>");
  return ctx;
}
