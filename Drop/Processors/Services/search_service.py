from typing import List

from ..types import SearchContext, ResultItem
from ..constants import SUMPLE_PRODUCTS



class SearchService:
    def perform(self, context: SearchContext) -> List[ResultItem]:
        keywords = context.semantic_keywords

        results = []

        for product in SUMPLE_PRODUCTS:
            score, reasons = self._match_product(product, keywords)

            if score > 0:
                results.append(
                    ResultItem(
                        id=str(product.get("id")),
                        title=product.get("title"),
                        score=score,
                        price=product.get("price"),
                        currency=context.currency_in_use,
                        attributes=product,
                        match_reasons=reasons,
                    )
                )

        return results




    # ---------------------------------------------------------
    # MATCHING LOGIC
    # ---------------------------------------------------------

    def _match_product(self, product: dict, keywords: List[str]):
        title = product.get("title", "").lower()
        description = product.get("description", "").lower()

        score = 0.0
        reasons = []

        for kw in keywords:
            if kw in title:
                score += 2.0
                reasons.append(f"{kw} in title")

            elif kw in description:
                score += 1.0
                reasons.append(f"{kw} in description")

        return score, reasons