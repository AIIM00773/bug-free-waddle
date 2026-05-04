

import json

def parse_ai_response(response_text: str) -> dict:
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
        # fallback safe response
        return {
            "is_deterministic": False,
            "intent": "unknown",
            "product": "",
            "filters": {},
            "confidence": 0.0,
            "followup": "Can you clarify your search?",
            "suggestions": [],
        }