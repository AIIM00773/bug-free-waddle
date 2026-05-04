"""
AI-Native Search Pipeline (Corrected & Aligned)
==============================================

Key Improvements:
- Consistent naming across all layers
- Strong typing with ResultItem
- Clean pipeline flow
- Removed ambiguous/unused fields
- Production-safe structure
"""

from __future__ import annotations

import logging
from typing import List


# Types imports

from ..types import ResultItem , SearchContext, ResultsContext


# ============================================================
# LOGGING CONFIGURATION
# ============================================================


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger("ai_search_engine")






# =============================================================
# ROUTE TO MODELS, AND ENGINES THT ACTUALLLY PROESS DATA 
# ============================================================
# ============================================================
# PROCESSOR (ORCHESTRATOR)
# ============================================================

class Processor:
    def __init__(
        self,
        presearch_service,
        context_service,
        search_service,
        refinement_service,
        ranking_service,
        filter_service,
        messaging_service,
        suggestion_service,
    ):
        self.presearch = presearch_service
        self.context_service = context_service
        self.search = search_service
        self.refinement = refinement_service
        self.ranking = ranking_service
        self.filters = filter_service
        self.messaging = messaging_service
        self.suggestions = suggestion_service

    # ---------------------------------------------------------
    # ENTRY POINT
    # ---------------------------------------------------------
    def run(self, context: SearchContext) -> ResultsContext:
        context = self._preprocess(context)

        decision = self._decide(context)
        if decision == "followup":
            return self._handle_followup(context)

        results = self._retrieve(context)

        if not results:
            return self._handle_no_results(context)

        # Only refine if necessary (optimization)
        if len(results) > 4:
            results = self._refine(context, results)

        return self._finalize(context, results)

    # ---------------------------------------------------------
    # PIPELINE STAGES
    # ---------------------------------------------------------

    def _preprocess(self, context: SearchContext) -> SearchContext:
        return self.presearch.handle(context)

    def _decide(self, context: SearchContext) -> str:
        return self.context_service.decide(context)

    def _retrieve(self, context: SearchContext) -> List[ResultItem]:
        return self.search.perform(context)

    def _refine(
        self, context: SearchContext, results: List[ResultItem]
    ) -> List[ResultItem]:
        refined = self.refinement.refine(context, results)
        return self.ranking.rank(context, refined)

    # ---------------------------------------------------------
    # OUTCOME HANDLERS
    # ---------------------------------------------------------

    def _handle_followup(self, context: SearchContext) -> ResultsContext:
        return self.messaging.presearch_followup(context)

    def _handle_no_results(self, context: SearchContext) -> ResultsContext:
        alternatives = self.suggestions.get_alternatives(context)
        return self.messaging.no_results(context, alternatives)

    def _finalize(
        self, context: SearchContext, results: List[ResultItem]
    ) -> ResultsContext:
        context.results = results
        context.search_completed = True

        context.filters = self.filters.generate(context, results)

        return self.messaging.success(context)
    



