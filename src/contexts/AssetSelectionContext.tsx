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

export interface SavedConfig {
  id: string;
  name: string;
  selection: AssetSelection;
  createdAt: number;
  updatedAt: number;
}

const EMPTY: AssetSelection = {
  regions: [], countries: [], sourceTypes: [], sourceNames: [],
  sourceUrls: [], attributes: [], workflows: [],
};

interface Ctx {
  selection: AssetSelection;
  setSelection: (s: AssetSelection) => void;
  hasSelection: boolean;
  scopedSources: SourceRecord[];
  savedConfigs: SavedConfig[];
  activeConfigId: string | null;
  saveConfig: (name: string, selection: AssetSelection) => SavedConfig;
  updateConfig: (id: string, selection: AssetSelection) => void;
  renameConfig: (id: string, name: string) => void;
  deleteConfig: (id: string) => void;
  loadConfig: (id: string) => void;
}

const AssetSelectionContext = createContext<Ctx | null>(null);

export function AssetSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelectionState] = useState<AssetSelection>(EMPTY);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);

  const setSelection = (s: AssetSelection) => {
    setSelectionState(s);
  };

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

  const saveConfig = (name: string, sel: AssetSelection): SavedConfig => {
    const cfg: SavedConfig = {
      id: `cfg-${Date.now().toString(36)}`,
      name,
      selection: sel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSavedConfigs(prev => [...prev, cfg]);
    setActiveConfigId(cfg.id);
    setSelectionState(sel);
    return cfg;
  };

  const updateConfig = (id: string, sel: AssetSelection) => {
    setSavedConfigs(prev => prev.map(c => c.id === id ? { ...c, selection: sel, updatedAt: Date.now() } : c));
    setActiveConfigId(id);
    setSelectionState(sel);
  };

  const renameConfig = (id: string, name: string) => {
    setSavedConfigs(prev => prev.map(c => c.id === id ? { ...c, name, updatedAt: Date.now() } : c));
  };

  const deleteConfig = (id: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
    if (activeConfigId === id) {
      setActiveConfigId(null);
      setSelectionState(EMPTY);
    }
  };

  const loadConfig = (id: string) => {
    const cfg = savedConfigs.find(c => c.id === id);
    if (cfg) {
      setActiveConfigId(id);
      setSelectionState(cfg.selection);
    }
  };

  return (
    <AssetSelectionContext.Provider value={{
      selection, setSelection, hasSelection, scopedSources,
      savedConfigs, activeConfigId, saveConfig, updateConfig, renameConfig, deleteConfig, loadConfig,
    }}>
      {children}
    </AssetSelectionContext.Provider>
  );
}

export function useAssetSelection() {
  const c = useContext(AssetSelectionContext);
  if (!c) throw new Error("useAssetSelection must be used inside AssetSelectionProvider");
  return c;
}
