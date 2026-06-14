import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// --- CORE INTERFACES (Strictly matching your application architecture) ---

export interface Category {
  category_title: string;
  category_node_id: string;
  identity_definnition: string | null; 
  description: string | null;
  releated_categories: string[]; 
  indexed_sku_counts: number;
}

export interface Brand {
  brand_title: string;
  brand_node_id: string;
  identity_definnition: string | null;
  description: string | null;
  releated_categories: string[];
  related_brands: string[];
  indexed_sku_counts: number;
  Canonical_Slugs: string[];
}

export interface Sizes {
  size_label: string;
  size_node_id: string;
  identity_definnition: string | null;
  description: string | null;
  releated_categories: string[];
  related_brands: string[];
  indexed_sku_counts: number;
  Canonical_Slugs: string[];
}

export interface Colors {
  color_label: string;
  size_node_id: string; 
  identity_definnition: string | null;
  description: string | null;
  releated_categories: string[];
  related_brands: string[];
  indexed_sku_counts: number;
  Canonical_Slugs: string[];
  color_rgb: string | null;
  color_code: string | null;
}

export interface Weights {
  weight_unit_label: string;
  weight_symbal: string; 
  weight_node_id: string;  
  identity_definnition: string | null;
  description: string | null;
  indexed_sku_counts: number;
}



// Master context payload contract schema
interface TaxonomyMatrices {
  categories: Category[];
  brands: Brand[];
  sizes: Sizes[];
  colors: Colors[];
  weights: Weights[];
  isLoading: boolean;
  error: string | null;

  // Taxonomy Master Fetch Routine
  refreshTaxonomies: () => Promise<void>;

  // Append Methods
  addCategory: (entity: Category) => Promise<void>;
  addBrand: (entity: Brand) => Promise<void>;
  addSize: (entity: Sizes) => Promise<void>;
  addColor: (entity: Colors) => Promise<void>;
  addWeight: (entity: Weights) => Promise<void>;

  // Purge Routines
  removeCategory: (nodeId: string) => Promise<void>;
  removeBrand: (nodeId: string) => Promise<void>;
  removeSize: (nodeId: string) => Promise<void>;
  removeColor: (nodeId: string) => Promise<void>;
  removeWeight: (nodeId: string) => Promise<void>;
}

const TaxonomyMatricesContex = createContext<TaxonomyMatrices | undefined>(undefined);


const mockCategories: Category[] = [
  {
    category_title: "Gym Equipments",
    category_node_id: "CAT-GYM-01",
    identity_definnition: "Physical strength conditioning utilities",
    description: "Normalized tree containing free weights, resistance kits, and machine nodes.",
    releated_categories: ["CAT-SHOES-02"],
    indexed_sku_counts: 1420
  }
];

const mockBrands: Brand[] = [
  {
    brand_title: "Nike",
    brand_node_id: "BRD-NIKE-01",
    identity_definnition: "Global athletic sportswear manufacturer",
    description: "Primary brand tracker for cross-regional sports items.",
    releated_categories: ["CAT-SHOES-02"],
    related_brands: ["Adidas"],
    indexed_sku_counts: 890,
    Canonical_Slugs: ["nike-sports", "nike-active"]
  }
];

export function TaxonomyMatricesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [weights, setWeights] = useState<Weights[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshTaxonomies();
  }, []);

  const refreshTaxonomies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories(mockCategories);
      setBrands(mockBrands);
      setSizes([]);
      setColors([]);
      setWeights([]);
    } catch (err) {
      setError("Failed to construct systemic baseline taxonomy matrix maps.");
    } finally {
      setIsLoading(false);
    }
  };



  
  // --- MUTATION APPEND ROUTINES ---
  const addCategory = async (entity: Category) => {
    setCategories((prev) => [...prev, entity]);
  };

  const addBrand = async (entity: Brand) => {
    setBrands((prev) => [...prev, entity]);
  };

  const addSize = async (entity: Sizes) => {
    setSizes((prev) => [...prev, entity]);
  };

  const addColor = async (entity: Colors) => {
    setColors((prev) => [...prev, entity]);
  };

  const addWeight = async (entity: Weights) => {
    setWeights((prev) => [...prev, entity]);
  };

  // --- MUTATION PURGE ROUTINES ---
  const removeCategory = async (nodeId: string) => {
    setCategories((prev) => prev.filter((c) => c.category_node_id !== nodeId));
  };

  const removeBrand = async (nodeId: string) => {
    setBrands((prev) => prev.filter((b) => b.brand_node_id !== nodeId));
  };

  const removeSize = async (nodeId: string) => {
    setSizes((prev) => prev.filter((s) => s.size_node_id !== nodeId));
  };

  const removeColor = async (nodeId: string) => {
    setColors((prev) => prev.filter((c) => c.size_node_id !== nodeId));
  };

  const removeWeight = async (nodeId: string) => {
    setWeights((prev) => prev.filter((w) => w.weight_node_id !== nodeId));
  };

  const values: TaxonomyMatrices = {
    categories,
    brands,
    sizes,
    colors,
    weights,
    isLoading,
    error,
    refreshTaxonomies,
    addCategory,
    addBrand,
    addSize,
    addColor,
    addWeight,
    removeCategory,
    removeBrand,
    removeSize,
    removeColor,
    removeWeight
  };

  return (
    <TaxonomyMatricesContex.Provider value={values}>
      {children}
    </TaxonomyMatricesContex.Provider>
  );
}

// --- CONSUMER TRANSLATION HOOK LAYER ---
export function useTaxonomyMatrices() {
  const ctx = useContext(TaxonomyMatricesContex);
  if (!ctx) {
    throw new Error(
      "useTaxonomyMatrices must be executed exclusively inside a valid TaxonomyMatricesProvider tree boundary node structure."
    );
  }
  return ctx;
}