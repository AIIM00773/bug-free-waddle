



export interface Product {
    /** Unique structural identification index */
    id: number;
    title: string;
    price: string;
    originalPrice?: string;
    merchant: string | "Jumia" | "Kilimall" | "Masoko" | "SkyGarden" | "Carrefour" |
    "Naivas" | "Tuskys" | "Uchumi" | "Shopit" | "Zumi" | "Sokowatch" | "Bidco" |
    "TwigaFoods" | "FarmersChoice" | "MkulimaYoung" | "AgroCenta" | "iProcure" | string | null | undefined;
    rating: string;
    image: string;
    location: string;
    description: string;
    inStock: boolean;
}