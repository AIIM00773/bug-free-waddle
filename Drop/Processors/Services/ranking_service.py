from typing import List
from ..types import SearchContext, ResultItem


class RankingService:
    def rank(
        self, context: SearchContext, results: List[ResultItem]
    ) -> List[ResultItem]:

        # 1. Apply final scoring adjustments
        for item in results:
            item.score = self._final_score(context, item)

        # 2. Sort (highest score first)
        ranked = sorted(results, key=lambda x: x.score, reverse=True)

        return ranked

    # ---------------------------------------------------------
    # FINAL SCORING
    # ---------------------------------------------------------

    def _final_score(self, context: SearchContext, item: ResultItem) -> float:
        score = item.score

        # -----------------------------------------------------
        # 1. Deterministic boost (exact intent match)
        # -----------------------------------------------------
        if context.is_deterministic:
            score *= 1.2

        # -----------------------------------------------------
        # 2. Budget proximity scoring
        # -----------------------------------------------------
        if context.budget_max and item.price:
            # closer to budget max is better (for perceived value)
            diff = abs(context.budget_max - item.price)
            score += max(0, 1 - (diff / context.budget_max))

        # -----------------------------------------------------
        # 3. Keyword density bonus
        # -----------------------------------------------------
        keyword_hits = len(item.match_reasons)
        score += keyword_hits * 0.3

        # -----------------------------------------------------
        # 4. Lightweight diversity penalty (optional)
        # -----------------------------------------------------
        # (prevents same brand dominating too much — simple version)
        if context.preferred_brands:
            if not any(
                brand.lower() in item.title.lower()
                for brand in context.preferred_brands
            ):
                score -= 0.2

        return score