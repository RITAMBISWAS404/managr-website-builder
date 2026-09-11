import { useBuilder } from "./BuilderProvider";
import * as sel from "./selectors";

/** ergonomic selector hook: const s = useS(); const dispatch = useDispatch(); */
export function useS() {
  return useBuilder().state;
}
export function useDispatch() {
  return useBuilder().dispatch;
}

export function useDerived() {
  const { state } = useBuilder();
  return {
    advActive: sel.advActive(state),
    canEdit: sel.canEdit(state),
    canPublish: sel.canPublish(state),
    canBilling: sel.canBilling(state),
    structureLocked: sel.structureLocked(state),
    brandingLocked: sel.brandingLocked(state),
    url: sel.siteUrl(state),
    accent: sel.siteAccent(state),
    properties: sel.properties(state),
    publicProperties: sel.publicProperties(state),
    page: sel.currentPage(state),
    check: sel.siteCheck(state),
    dirty: sel.draftDirty(state),
    respIssues: sel.respIssues(state),
  };
}
