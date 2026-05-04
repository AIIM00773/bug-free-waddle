

from typing import List
from ..types import SearchContext, ResultItem



class RefinementService:
    def refine(
        self, context: SearchContext, results: List[ResultItem]
    ) -> List[ResultItem]:

        refined = []

        for item in results:
            # 1. Apply filters
            if not self._passes_budget(context, item):
                continue

            if not self._passes_exclusions(context, item):
                continue

            # 2. Adjust score
            item.score = self._adjust_score(context, item)

            refined.append(item)

        return refined

    # ---------------------------------------------------------
    # FILTERS
    # ---------------------------------------------------------

    def _passes_budget(self, context: SearchContext, item: ResultItem) -> bool:
        if item.price is None:
            return True

        if context.budget_min and item.price < context.budget_min:
            return False

        if context.budget_max and item.price > context.budget_max:
            return False

        return True


    def _passes_exclusions(
        self, context: SearchContext, item: ResultItem
    ) -> bool:
        if not context.excluded_terms:
            return True

        text = (item.title or "").lower()

        for term in context.excluded_terms:
            if term.lower() in text:
                return False

        return True



    # ---------------------------------------------------------
    # SCORE ADJUSTMENT
    # ---------------------------------------------------------

    def _adjust_score(self, context: SearchContext, item: ResultItem) -> float:
        score = item.score

        # Boost preferred brands
        if context.preferred_brands:
            for brand in context.preferred_brands:
                if brand.lower() in item.title.lower():
                    score += 2.0
                    item.match_reasons.append(f"preferred brand: {brand}")

        # Slight boost for cheaper items if budget intent
        if context.budget_max and item.price:
            if item.price < context.budget_max:
                score += 0.5

        return score