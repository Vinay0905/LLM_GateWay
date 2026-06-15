# Integration Tutorial: Bringing the Detectors Together in main.py

This tutorial explains how to update [main.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/main.py) to import the three detectors ([injection.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/injection.py), [jailbreak.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/jailbreak.py), [pii.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/pii.py)) and run them inside the FastAPI request lifecycle.

---

## 1. Request Flow Design

To optimize the latency of safety checks:
1. **Short-Circuit Fast Failures:** Run the rule-based injection checks first. If the local regex matches, block immediately without invoking any external API calls.
2. **Parallelize Heavy Tasks:** Run the PII redaction and the LLM-as-a-judge call concurrently using Python's `asyncio`.
3. **Harmonize Scores:** Compute the maximum score between the checks to report the final threat confidence score back to the Go Gateway.

---

## 2. Snippet-by-Snippet Explanation

### Snippet 1: Define Schemas
We update our Pydantic request and response schemas to match the contract expected by the Go gateway, including a new `pii_types_detected` list.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AnalyzerRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    verdict: str                  # "PASS" or "BLOCK"
    threat_type: str              # "none", "injection", "jailbreak", "pii"
    score: float                  # Final threat confidence score
    masked_prompt: str            # Prompt with redacted PII values
    pii_types_detected: list[str] = []
```

### Snippet 2: Coordinate Checks in the Route Handler
We write the async POST route for `/analyze`. 

```python
from detectors.injection import analyze_injection
from detectors.jailbreak import analyze_jailbreak
from detectors.pii import analyze_pii

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzerRequest) -> AnalyzeResponse:
    # 1. Short-circuit: Rule-based check
    is_injection, injection_score = analyze_injection(req.prompt)
    if is_injection:
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="injection",
            score=injection_score,
            masked_prompt=req.prompt,
            pii_types_detected=[]
        )

    # 2. Run PII detection and Jailbreak analysis.
    # Note: analyze_pii is CPU-bound (local), while analyze_jailbreak is I/O-bound (API call).
    # We await the jailbreak check while the current event loop processes other tasks.
    masked_prompt, detected_pii = analyze_pii(req.prompt)
    is_jailbreak, jailbreak_score = await analyze_jailbreak(req.prompt)

    # 3. Check if jailbreak LLM judge flagged the prompt
    if is_jailbreak:
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="jailbreak",
            score=jailbreak_score,
            masked_prompt=masked_prompt,
            pii_types_detected=detected_pii
        )

    # 4. If all checks pass, return verdict PASS
    # Score is the highest threat level detected among the components
    return AnalyzeResponse(
        verdict="PASS",
        threat_type="none",
        score=max(injection_score, jailbreak_score),
        masked_prompt=masked_prompt,
        pii_types_detected=detected_pii
    )
```

---

## 3. Production-Ready Code for `main.py`

Here is how your finished [main.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/main.py) integration should look:

```python
import logging
from fastapi import FastAPI
from pydantic import BaseModel

from detectors.injection import analyze_injection
from detectors.jailbreak import analyze_jailbreak
from detectors.pii import analyze_pii

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("safety_sidecar")

app = FastAPI(title="LLM Gateway Safety Sidecar")

class AnalyzerRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    verdict: str
    threat_type: str
    score: float
    masked_prompt: str
    pii_types_detected: list[str] = []

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzerRequest) -> AnalyzeResponse:
    logger.info("Received analyze request")
    
    # Layer 1: Rule-based Injection Check (immediate local short-circuit)
    is_injection, injection_score = analyze_injection(req.prompt)
    if is_injection:
        logger.info(f"Prompt blocked by Layer 1: Regex injection checker (Score: {injection_score})")
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="injection",
            score=injection_score,
            masked_prompt=req.prompt,
            pii_types_detected=[]
        )

    # Layer 2: PII Redaction (local processing)
    masked_prompt, detected_pii = analyze_pii(req.prompt)

    # Layer 3: LLM-as-a-Judge Jailbreak Classifier (async API request)
    is_jailbreak, jailbreak_score = await analyze_jailbreak(req.prompt)

    if is_jailbreak:
        logger.info(f"Prompt blocked by Layer 3: LLM Safety Judge (Score: {jailbreak_score})")
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="jailbreak",
            score=jailbreak_score,
            masked_prompt=masked_prompt,
            pii_types_detected=detected_pii
        )

    # All checks passed
    logger.info("Prompt passed all safety checks successfully")
    return AnalyzeResponse(
        verdict="PASS",
        threat_type="none",
        score=max(injection_score, jailbreak_score),
        masked_prompt=masked_prompt,
        pii_types_detected=detected_pii
    )
```
