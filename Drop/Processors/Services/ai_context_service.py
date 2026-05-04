import json
from typing import Dict, Any
from ..types  import SearchContext


class AIContextService:
    def __init__(self, llm_client, prompt_builder):
        """
        llm_client: function or client that sends prompt to LLM
        prompt_builder: function that builds full prompt
        """
        self.llm = llm_client
        self.build_prompt = prompt_builder

    # ---------------------------------------------------------
    # MAIN ENTRY
    # ---------------------------------------------------------

    def decide(self, context: SearchContext) -> str:
        prompt = self.build_prompt(context.cleaned_query)

        raw_response = self.llm(prompt)

        parsed = self._parse_response(raw_response)

        self._apply_to_context(context, parsed)

        if not parsed.get("is_deterministic", False):
            context.requires_followup = True
            return "followup"

        return "continue"
    

    

    # ---------------------------------------------------------
    # PARSING
    # ---------------------------------------------------------

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        try:
            data = json.loads(response_text)

            # minimal validation
            required_keys = [
                "is_deterministic",
                "intent",
                "product",
                "filters",
                "confidence",
            ]

            for key in required_keys:
                if key not in data:
                    raise ValueError(f"Missing key: {key}")

            return data

        except Exception:
            return self._fallback_response()

    def _fallback_response(self) -> Dict[str, Any]:
        return {
            "is_deterministic": False,
            "intent": "unknown",
            "product": "",
            "filters": {
                "brand": [],
                "price_min": None,
                "price_max": None,
                "attributes": {},
            },
            "confidence": 0.0,
            "followup": "Can you clarify your search?",
            "suggestions": [],
        }

    # ---------------------------------------------------------
    # APPLY TO CONTEXT
    # ---------------------------------------------------------

    def _apply_to_context(
        self, context: SearchContext, data: Dict[str, Any]
    ):
        context.intent = {
            "type": data.get("intent"),
            "product": data.get("product"),
        }

        filters = data.get("filters", {})

        context.preferred_brands = filters.get("brand", []) or []
        context.budget_min = filters.get("price_min")
        context.budget_max = filters.get("price_max")

        context.attributes.update(filters.get("attributes", {}))

        context.confidence_score = data.get("confidence", 0.0)
        context.is_deterministic = data.get("is_deterministic", False)

        # store AI extras
        context.ai_memory["followup"] = data.get("followup")
        context.ai_memory["suggestions"] = data.get("suggestions", [])