from typing import List
from ..types import SearchContext, ResultItem, ResultsContext


class MessagingService:

    # ---------------------------------------------------------
    # SUCCESS RESPONSE
    # ---------------------------------------------------------

    def success(self, context: SearchContext) -> ResultsContext:
        message = self._build_success_message(context)

        return ResultsContext(
            return_type="results",
            message=message,
            results=context.results,
            filters_available=list(context.filters.keys()),
            confidence_score=context.confidence_score,
        )

    # ---------------------------------------------------------
    # NO RESULTS
    # ---------------------------------------------------------

    def no_results(
        self, context: SearchContext, alternatives: List[ResultItem]
    ) -> ResultsContext:

        message = self._build_no_results_message(context)

        return ResultsContext(
            return_type="no_results",
            message=message,
            alternatives=alternatives,
            suggestions=self._suggest_queries(context),
            confidence_score=context.confidence_score,
        )

    # ---------------------------------------------------------
    # FOLLOW-UP (CLARIFICATION)
    # ---------------------------------------------------------

    def presearch_followup(self, context: SearchContext) -> ResultsContext:
        message = self._build_followup_message(context)

        return ResultsContext(
            return_type="clarification",
            message=message,
            requires_followup=True,
            suggestions=self._suggest_queries(context),
        )

    # ---------------------------------------------------------
    # MESSAGE BUILDERS
    # ---------------------------------------------------------

    def _build_success_message(self, context: SearchContext) -> str:
        count = len(context.results)

        if context.is_deterministic:
            return f"Found {count} matching results for your search."

        return f"Here are the best {count} options based on your query."

    def _build_no_results_message(self, context: SearchContext) -> str:
        return (
            "We couldn't find exact matches for your search. "
            "Here are some alternatives you might like."
        )

    def _build_followup_message(self, context: SearchContext) -> str:
        return (
            "Can you clarify what you're looking for? "
            "Try adding a brand, budget, or category."
        )

    # ---------------------------------------------------------
    # SUGGESTIONS
    # ---------------------------------------------------------

    def _suggest_queries(self, context: SearchContext) -> List[str]:
        suggestions = []

        base = context.cleaned_query

        if context.budget_max:
            suggestions.append(f"{base} under {int(context.budget_max)}")

        if context.preferred_brands:
            for brand in context.preferred_brands:
                suggestions.append(f"{brand} {base}")

        if not suggestions:
            suggestions.append(f"best {base}")
            suggestions.append(f"cheap {base}")

        return suggestions