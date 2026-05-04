

User Query
   ↓
Presearch (clean + tokenize + safety)
   ↓
AI Understanding Layer (LLM)
   ↓
Decision:
   ├── Not deterministic → follow-up + suggestions
   └── Deterministic → structured query
   ↓
Search (strict, deterministic)
   ↓
Refinement (filters, constraints)
   ↓
Ranking (scoring logic)
   ↓
AI Post-processing (summary + reasoning)
   ↓
Response to user