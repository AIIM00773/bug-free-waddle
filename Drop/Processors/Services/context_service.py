


import re
from typing import Dict
from ..types import SearchContext


class ContextService:
    def decide(self, context: SearchContext) -> str:
        # 1. Extract intent
        intent = self._extract_intent(context.cleaned_query)

        # 2. Extract structured signals
        budget_min, budget_max = self._extract_budget(context.cleaned_query)

        # 3. Classify query type
        is_deterministic = self._is_deterministic(intent)

        # 4. Confidence scoring
        confidence = self._compute_confidence(intent)

        # 5. Apply to context
        context.intent = intent
        context.is_deterministic = is_deterministic
        context.confidence_score = confidence
        context.budget_min = budget_min
        context.budget_max = budget_max

        # 6. Decide next step
        if confidence < 0.4:
            context.requires_followup = True
            return "followup"

        return "continue"



    # ---------------------------------------------------------
    # INTENT EXTRACTION
    # ---------------------------------------------------------

    def _extract_intent(self, query: str) -> Dict:
        intent = {
            "type": "unknown",
            "entities": [],
        }

        # simple heuristics (expand later)
        if any(word in query for word in ["buy", "price", "cost"]):
            intent["type"] = "purchase"

        elif any(word in query for word in ["best", "top", "recommended"]):
            intent["type"] = "discovery"

        elif any(word in query for word in ["cheap", "affordable"]):
            intent["type"] = "budget"


        # extract entities (very naive)
        intent["entities"] = query.split()

        return intent

    # ---------------------------------------------------------
    # BUDGET EXTRACTION
    # ---------------------------------------------------------

    def _extract_budget(self, query: str):
        # match numbers like "50000", "50k"
        numbers = re.findall(r"\d+", query)

        if not numbers:
            return None, None

        values = [float(n) for n in numbers]

        if len(values) == 1:
            return None, values[0]  # max budget

        return min(values), max(values)



    # ---------------------------------------------------------
    # QUERY TYPE
    # ---------------------------------------------------------

    def _is_deterministic(self, intent: Dict) -> bool:
        return intent.get("type") in ["purchase", "budget"]


    # ---------------------------------------------------------
    # CONFIDENCE
    # ---------------------------------------------------------

    def _compute_confidence(self, intent: Dict) -> float:
        if intent["type"] == "unknown":
            return 0.3

        if intent["type"] == "discovery":
            return 0.6

        if intent["type"] in ["purchase", "budget"]:
            return 0.8

        return 0.5