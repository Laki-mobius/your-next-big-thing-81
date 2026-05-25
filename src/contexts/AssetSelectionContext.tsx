import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { sourceCatalog, SourceRecord, filterSources } from "@/data/source-catalog";

export interface AssetSelection {
  regions: string[];
  countries: string[];
  sourceTypes: string[];
  sourceNames: string[];
  sourceUrls: string[];
  attributes: string[];
  workflows: string[];
}

const EMPTY: AssetSelection = {
  regions: [], countries: [], sourceTypes: [], sourceNames: [],
  sourceUrls: [], attributes: [], workflows: [],
};

interface Ctx {
  selection: AssetSelection;
  setSelection: (s: AssetSelection) => void;
  hasSelection: boolean;
  /** Sources that are scoped by the asset-repository selection. If nothing was selected, all sources are returned. */
  scopedSources: SourceRecord[];
}

const AssetSelectionContext = createContext<Ctx | null>(null);

export function AssetSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<AssetSelection>(EMPTY);

  const hasSelection =
    selection.sourceNames.length > 0 ||
    selection.attributes.length > 0 ||
    selection.workflows.length > 0;

  const scopedSources = useMemo(() => {
    if (!hasSelection) return sourceCatalog;
    return filterSources({
      regions: selection.regions.length ? selection.regions : undefined,
      countries: selection.countries.length ? selection.countries : undefined,
      sourceTypes: selection.sourceTypes.length ? selection.sourceTypes : undefined,
      sourceNames: selection.sourceNames.length ? selection.sourceNames : undefined,
      workflows: selection.workflows.length ? selection.workflows : undefined,
    });
  }, [selection, hasSelection]);

  return (
    <AssetSelectionContext.Provider value={{ selection, setSelection, hasSelection, scopedSources }}>
      {children}
    </AssetSelectionContext.Provider>
  );
}

export function useAssetSelection() {
  const c = useContext(AssetSelectionContext);
  if (!c) throw new Error("useAssetSelection must be used inside AssetSelectionProvider");
  return c;
}
