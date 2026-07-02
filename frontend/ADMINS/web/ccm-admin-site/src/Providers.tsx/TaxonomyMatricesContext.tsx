import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// --- CORE INTERFACES ---
export interface Category {
  unique_id: string;
  name: string;
  description: string | null;
  related_categories: string[];
}

export interface Brand {
  unique_id: string;
  name: string;
  description: string | null;
  categories: string[];
  related_brands: string[];
}

export interface Size {
  unique_id: string;
  name: string;
  unit_symbol: string;
}

export interface Color {
  unique_id: string;
  name: string;
  identity_definition: string | null;
  hex_code: string | null;
}

export interface Weight {
  unique_id: string;
  unit_name: string;
  symbol: string;
}

export interface Tag {
  unique_id: string;
  name: string;
}

export interface Shape {
  unique_id: string;
  name: string;
}

export interface Country {
  unique_id: string;
  name: string;
  zip_code: string | null;
  is_setup_for_operation: boolean;
}

export interface Currency {
  unique_id: string;
  name: string;
  symbol: string | null;
  code: string;
  country: string;
  is_allowed: boolean;
  is_base_currency: boolean;
}

// --- TYPE DISCRIMINATORS ---
type TaxonomyType = "category" | "brand" | "size" | "color" | "weight" | "tag" | "shape" | "country" | "currency";
type AnyTaxonomyEntity = Category | Brand | Size | Color | Weight | Tag | Shape | Country | Currency;

interface TaxonomyMatrices {
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
  weights: Weight[];
  tags: Tag[];
  shapes: Shape[];
  countries: Country[];
  currencies: Currency[];
  isLoading: boolean;
  error: string | null;

  refreshTaxonomies: () => Promise<void>;

  // Append Methods
  addCategory: (entity: Omit<Category, 'unique_id'>) => Promise<void>;
  addBrand: (entity: Omit<Brand, 'unique_id'>) => Promise<void>;
  addSize: (entity: Omit<Size, 'unique_id'>) => Promise<void>;
  addColor: (entity: Omit<Color, 'unique_id'>) => Promise<void>;
  addWeight: (entity: Omit<Weight, 'unique_id'>) => Promise<void>;
  addTag: (entity: Omit<Tag, 'unique_id'>) => Promise<void>;
  addShape: (entity: Omit<Shape, 'unique_id'>) => Promise<void>;
  addCountry: (entity: Omit<Country, 'unique_id'>) => Promise<void>;
  addCurrency: (entity: Omit<Currency, 'unique_id'>) => Promise<void>;

  // Update Methods
  updateCategory: (entity: Category) => Promise<void>;
  updateBrand: (entity: Brand) => Promise<void>;
  updateSize: (entity: Size) => Promise<void>;
  updateColor: (entity: Color) => Promise<void>;
  updateWeight: (entity: Weight) => Promise<void>;
  updateTag: (entity: Tag) => Promise<void>;
  updateShape: (entity: Shape) => Promise<void>;
  updateCountry: (entity: Country) => Promise<void>;
  updateCurrency: (entity: Currency) => Promise<void>;

  // Purge Routines
  removeCategory: (nodeId: string) => Promise<void>;
  removeBrand: (nodeId: string) => Promise<void>;
  removeSize: (nodeId: string) => Promise<void>;
  removeColor: (nodeId: string) => Promise<void>;
  removeWeight: (nodeId: string) => Promise<void>;
  removeTag: (nodeId: string) => Promise<void>;
  removeShape: (nodeId: string) => Promise<void>;
  removeCountry: (nodeId: string) => Promise<void>;
  removeCurrency: (nodeId: string) => Promise<void>;
}

const BASE_TAXONOMY_URL = "http://127.0.0.1:8000/adm/root/api/v1/0e812203c3134ffeb059e8158a486250";

const TaxonomyMatricesContext = createContext<TaxonomyMatrices | undefined>(undefined);

export function TaxonomyMatricesProvider({ children }: { children: ReactNode }) {
  // State Declarations
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [weights, setWeights] = useState<Weight[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- UTILITY: AUTH HEADERS ---
  const getAuthHeaders = (): HeadersInit => {
    try {
      const tokensRaw = sessionStorage.getItem("soko_ai_admin_token");
      if (!tokensRaw) return { "Content-Type": "application/json" };
      
      const parsed = JSON.parse(tokensRaw);
      return {
        "Content-Type": "application/json",
        "Authorization": parsed?.access ? `Bearer ${parsed.access}` : "",
      };
    } catch (e) {
      console.error("Critical Token Extraction Fault:", e);
      return { "Content-Type": "application/json" };
    }
  };

  // --- CORE SYSTEM ROUTINES ---
  const refreshTaxonomies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_TAXONOMY_URL}/taxonomies/`, {
        method: "GET",
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();

      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setSizes(data.sizes || []);
      setColors(data.colors || []);
      setWeights(data.weights || []);
      setTags(data.tags || []);
      setShapes(data.shapes || []);
      setCountries(data.countries || []);
      setCurrencies(data.currencies || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to construct systemic baseline taxonomy matrix maps.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTaxonomies();
  }, []);

  // --- DYNAMIC DISPATCH LOOKUP REGISTRY ---
  // Recomputed on execution to capture active closures instead of initial empty arrays
  const getListSetter = (type: TaxonomyType): React.Dispatch<React.SetStateAction<any[]>> => {
    const setters: Record<TaxonomyType, React.Dispatch<React.SetStateAction<any[]>>> = {
      category: setCategories,
      brand: setBrands,
      size: setSizes,
      color: setColors,
      weight: setWeights,
      tag: setTags,
      shape: setShapes,
      country: setCountries,
      currency: setCurrencies,
    };
    return setters[type];
  };

  // --- REUSABLE GENERIC NETWORK MUTATION CORE (Creates & Updates) ---
  const mutateTaxonomy = async (type: TaxonomyType, entity: Partial<AnyTaxonomyEntity>, isNew: boolean) => {
    const setList = getListSetter(type);
    
    // Generates completely clean, trailing-slash explicit Django URLs
    const url = isNew 
      ? `${BASE_TAXONOMY_URL}/taxonomies/${type}/` 
      : `${BASE_TAXONOMY_URL}/taxonomies/${type}/update/${entity.unique_id}/`;
    
    try {
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(entity)
      });
      
      if (!response.ok) throw new Error(`Server mutation rejected for ${type}.`);
      const updatedNode = await response.json();

      // Optimistic layout sync engines
      if (isNew) {
        setList((prev) => [...prev, updatedNode]);
      } else {
        setList((prev) => prev.map((item) => item.unique_id === entity.unique_id ? updatedNode : item));
      }
    } catch (err) {
      console.error(`Matrix sync rollback on type [${type}]:`, err);
      throw err;
    }
  };

  // --- REUSABLE GENERIC PURGE ENGINE ---
  const purgeTaxonomy = async (type: TaxonomyType, nodeId: string) => {
    const setList = getListSetter(type);
    
    try {
      const response = await fetch(`${BASE_TAXONOMY_URL}/taxonomies/${type}/purge/${nodeId}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error(`Server rejection payload status response received.`);
      
      setList((prev) => prev.filter((item) => item.unique_id !== nodeId));
    } catch (err) {
      console.error(`Matrix deletion failure on type [${type}]:`, err);
      throw err;
    }
  };

  const values: TaxonomyMatrices = {
    categories, brands, sizes, colors, weights, tags, shapes, countries, currencies, isLoading, error,
    refreshTaxonomies,

    // Append Engine Bindings
    addCategory: (entity) => mutateTaxonomy("category", entity, true),
    addBrand: (entity) => mutateTaxonomy("brand", entity, true),
    addSize: (entity) => mutateTaxonomy("size", entity, true),
    addColor: (entity) => mutateTaxonomy("color", entity, true),
    addWeight: (entity) => mutateTaxonomy("weight", entity, true),
    addTag: (entity) => mutateTaxonomy("tag", entity, true),
    addShape: (entity) => mutateTaxonomy("shape", entity, true),
    addCountry: (entity) => mutateTaxonomy("country", entity, true),
    addCurrency: (entity) => mutateTaxonomy("currency", entity, true),

    // Update Engine Bindings
    updateCategory: (entity) => mutateTaxonomy("category", entity, false),
    updateBrand: (entity) => mutateTaxonomy("brand", entity, false),
    updateSize: (entity) => mutateTaxonomy("size", entity, false),
    updateColor: (entity) => mutateTaxonomy("color", entity, false),
    updateWeight: (entity) => mutateTaxonomy("weight", entity, false),
    updateTag: (entity) => mutateTaxonomy("tag", entity, false),
    updateShape: (entity) => mutateTaxonomy("shape", entity, false),
    updateCountry: (entity) => mutateTaxonomy("country", entity, false),
    updateCurrency: (entity) => mutateTaxonomy("currency", entity, false),

    // Purge Engine Bindings
    removeCategory: (nodeId) => purgeTaxonomy("category", nodeId),
    removeBrand: (nodeId) => purgeTaxonomy("brand", nodeId),
    removeSize: (nodeId) => purgeTaxonomy("size", nodeId),
    removeColor: (nodeId) => purgeTaxonomy("color", nodeId),
    removeWeight: (nodeId) => purgeTaxonomy("weight", nodeId),
    removeTag: (nodeId) => purgeTaxonomy("tag", nodeId),
    removeShape: (nodeId) => purgeTaxonomy("shape", nodeId),
    removeCountry: (nodeId) => purgeTaxonomy("country", nodeId),
    removeCurrency: (nodeId) => purgeTaxonomy("currency", nodeId),
  };

  return (
    <TaxonomyMatricesContext.Provider value={values}>
      {children}
    </TaxonomyMatricesContext.Provider>
  );
}

export function useTaxonomyMatrices() {
  const ctx = useContext(TaxonomyMatricesContext);
  if (!ctx) throw new Error("useTaxonomyMatrices must be executed exclusively inside a valid TaxonomyMatricesProvider.");
  return ctx;
}