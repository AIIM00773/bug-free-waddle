

from typing import List, Dict, Any
from collections import defaultdict
from ..types import SearchContext, ResultItem


class FilterService:
    def generate(
        self, context: SearchContext, results: List[ResultItem]
    ) -> Dict[str, Any]:

        filters = {}

        # 1. Price filter
        price_filter = self._build_price_filter(results)
        if price_filter:
            filters["price"] = price_filter

        # 2. Brand filter
        brand_filter = self._build_brand_filter(results)
        if brand_filter:
            filters["brands"] = brand_filter

        # 3. Attribute filters (dynamic)
        attribute_filters = self._build_attribute_filters(results)
        if attribute_filters:
            filters["attributes"] = attribute_filters

        return filters

    # ---------------------------------------------------------
    # PRICE FILTER
    # ---------------------------------------------------------

    def _build_price_filter(self, results: List[ResultItem]):
        prices = [r.price for r in results if r.price is not None]

        if not prices:
            return None

        return {
            "min": min(prices),
            "max": max(prices),
        }

    # ---------------------------------------------------------
    # BRAND FILTER
    # ---------------------------------------------------------

    def _build_brand_filter(self, results: List[ResultItem]):
        brand_counts = defaultdict(int)

        for item in results:
            brand = self._extract_brand(item)
            if brand:
                brand_counts[brand] += 1

        if not brand_counts:
            return None

        return sorted(
            [{"brand": b, "count": c} for b, c in brand_counts.items()],
            key=lambda x: x["count"],
            reverse=True,
        )

    def _extract_brand(self, item: ResultItem) -> str:
        # naive: first word of title
        if not item.title:
            return None

        return item.title.split()[0].lower()

    # ---------------------------------------------------------
    # ATTRIBUTE FILTERS (DYNAMIC)
    # ---------------------------------------------------------

    def _build_attribute_filters(self, results: List[ResultItem]):
        attribute_map = defaultdict(lambda: defaultdict(int))

        for item in results:
            for key, value in item.attributes.items():
                if isinstance(value, (str, int, float)):
                    attribute_map[key][str(value)] += 1

        if not attribute_map:
            return None

        # format nicely
        formatted = {}

        for attr, values in attribute_map.items():
            formatted[attr] = sorted(
                [{"value": v, "count": c} for v, c in values.items()],
                key=lambda x: x["count"],
                reverse=True,
            )

        return formatted