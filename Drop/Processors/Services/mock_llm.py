
class client :
    class chat:
        class completions:
            def create ():
                return None
            

            

def mock_llm(prompt: str) -> str:
    return """
    {
      "is_deterministic": true,
      "intent": "purchase",
      "product": "smartphone",
      "filters": {
        "brand": ["samsung"],
        "price_min": null,
        "price_max": 30000,
        "attributes": {}
      },
      "confidence": 0.85,
      "followup": null,
      "suggestions": []
    }
    """



def llm_client(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-5",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content