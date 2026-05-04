import re
from typing import List




from ..constants import stopwords

from ..types import SearchContext



class PresearchService:
    def handle(self, context: SearchContext) -> SearchContext:
        query = context.raw_query

        # 1. Normalize text
        cleaned = self._clean_text(query)

        # 2. Tokenize
        tokens = self._tokenize(cleaned)

        # 3. Extract semantic keywords
        keywords = self._extract_keywords(tokens)

        # 4. Remove excluded terms if any
        keywords = self._apply_exclusions(keywords, context.excluded_terms)

        # 5. Update context
        context.cleaned_query = cleaned
        context.semantic_keywords = keywords

        return context





    # ---------------------------------------------------------
    # TEXT CLEANING
    # ---------------------------------------------------------

    def _clean_text(self, text: str) -> str:
        text = text.lower().strip()

        # remove special characters (keep numbers + letters)
        text = re.sub(r"[^\w\s]", " ", text)

        # collapse multiple spaces
        text = re.sub(r"\s+", " ", text)

        return text
    



    # ---------------------------------------------------------
    # TOKENIZATION
    # ---------------------------------------------------------

    def _tokenize(self, text: str) -> List[str]:
        return text.split()
    



    # ---------------------------------------------------------
    # KEYWORD EXTRACTION
    # ---------------------------------------------------------

    def _extract_keywords(self, tokens: List[str]) -> List[str]:
 
        return [t for t in tokens if t not in stopwords]
    


    # ---------------------------------------------------------
    # EXCLUSIONS
    # ---------------------------------------------------------

    def _apply_exclusions(
        self, keywords: List[str], excluded: List[str]
    ) -> List[str]:
        if not excluded:
            return keywords

        excluded_set = set(e.lower() for e in excluded)
        return [k for k in keywords if k not in excluded_set]