from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


# ============================================================
# RESULT ITEM (CANONICAL REPRESENTATION )
# ============================================================

@dataclass
class ResultItem:
    id: str
    title: str
    score: float

    subtitle: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = "KSH"
    image_url: Optional[str] = None

    attributes: Dict[str, Any] = field(default_factory=dict)
    match_reasons: List[str] = field(default_factory=list)

    metadata: Dict[str, Any] = field(default_factory=dict)







# ============================================================
# SEARCH CONTEXT
# ============================================================

@dataclass
class SearchContext:
    raw_query: str
    user_id: Optional[str] = None

    cleaned_query: str = ""
    intent: Dict[str, Any] = field(default_factory=dict)

    categories: List[str] = field(default_factory=list)
    subcategories: List[str] = field(default_factory=list)
    domains: List[str] = field(default_factory=list)

    results: List[ResultItem] = field(default_factory=list)
    related_results: List[ResultItem] = field(default_factory=list)
    alternatives: List[ResultItem] = field(default_factory=list)

    filters: Dict[str, Any] = field(default_factory=dict)

    requires_followup: bool = False
    is_deterministic: bool = False
    search_completed: bool = False

    confidence_score: float = 0.0

    currency_in_use: str = "KSH"
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None

    ai_memory: Dict[str, Any] = field(default_factory=dict)
    attributes: Dict[str, Any] = field(default_factory=dict)

    semantic_keywords: List[str] = field(default_factory=list)
    preferred_brands: List[str] = field(default_factory=list)
    excluded_terms: List[str] = field(default_factory=list)

    retrieval_context: Dict[str, Any] = field(default_factory=dict)

    metadata: Dict[str, Any] = field(default_factory=dict)









# ============================================================
# RESPONSE CONTEXT
# ============================================================

@dataclass
class ResultsContext:
    return_type: str  # "results" | "no_results" | "clarification" | "error"
    message: str

    results: List[ResultItem] = field(default_factory=list)

    alternatives: List[ResultItem] = field(default_factory=list)
    related: List[ResultItem] = field(default_factory=list)

    suggestions: List[str] = field(default_factory=list) 
    filters_available: List[str] = field(default_factory=list)

    filter_reasons: List[str] = field(default_factory=list)

    confidence_score: float = 0.0
    requires_followup: bool = False

    closest_matches: List[ResultItem] = field(default_factory=list)

    metadata: Dict[str, Any] = field(default_factory=dict)





# ============================================================
# AI RESPOSE CONTEXT
# ============================================================
AIResponse = {
    "is_deterministic": bool,
    "intent": str,  # "purchase" | "discovery" | "comparison" | "unknown"
    "product": str,  # normalized product type
    "filters": {
        "brand": List[str],
        "price_min": Optional[float],
        "price_max": Optional[float],
        "attributes": Dict[str, Any]
    },
    "confidence": float,  # 0.0 - 1.0
    "followup": Optional[str],
    "suggestions": List[str]
}