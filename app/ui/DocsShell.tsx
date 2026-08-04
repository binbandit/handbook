import type { ReactNode } from "react";
import { DesktopSidebar, MobileHeader } from "./Navigation";

export function DocsShell({
  activeSlug,
  children,
}: {
  activeSlug: string;
  children: ReactNode;
}) {
  return (
    <div className="docs-shell">
      <DesktopSidebar activeSlug={activeSlug} />
      <div className="docs-stage">
        <MobileHeader activeSlug={activeSlug} />
        {children}
      </div>
    </div>
  );
}
