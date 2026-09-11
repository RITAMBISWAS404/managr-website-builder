import { PublishDialog } from "./PublishDialog";
import { VersionsSheet } from "./VersionsSheet";
import { DesignSheet } from "./DesignSheet";
import { CommandMenu } from "./CommandMenu";
import { ResponsiveSheet } from "./ResponsiveSheet";
import { PagePickSheet, EditorMoreSheet, MobileLayersSheet, MobileAddSheet, MobileSectionSheet } from "./MobileSheets";

export function EditorOverlays() {
  return (
    <>
      <PublishDialog />
      <VersionsSheet />
      <DesignSheet />
      <CommandMenu />
      <ResponsiveSheet />
      <PagePickSheet />
      <EditorMoreSheet />
      <MobileLayersSheet />
      <MobileAddSheet />
      <MobileSectionSheet />
    </>
  );
}
