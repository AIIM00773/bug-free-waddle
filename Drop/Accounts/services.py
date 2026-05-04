import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_AI_STUDIO_DROP_AI_API_KEY"))

def get_personalized_welcome(user_name="There"):
    """
    Fetches a greeting from Gemini based on the user's name and local context.
    """
    system_instruction = """
    You are an AI Shopping Assistant for a Kenyan mobile marketplace.
    
    CONTEXT:
    - Location: Juja/Nairobi, Kenya.
    - Weather: April is 'long rains' season (Showers/Overcast, ~24°C).
    - Economy: Inflation ~4.4%. 

    RULES:
    1. One sentence ONLY.
    2. Tone: Helpful peer (Breezy/Empathetic).
    3. Suggest a category for the rain (hoodies, umbrellas, boots, indoor games).
    4. Never say 'I checked the weather'.
    """

    user_context = f"User Name: {user_name}, Gender: Male."

    try:
        response = client.models.generate_content(
            model="gemini-3.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            ),
            contents=user_context
        )
        print(response.text.strip())
        return response.text.strip()
    except Exception as e:
        print(e)

        # Fallback greeting if API is down or quota 
        print(f"Hey {user_name}, stay dry and check out our new cozy hoodies for the rainy season!")
        return f"Hey {user_name}, stay dry and check out our new cozy hoodies for the rainy season!"