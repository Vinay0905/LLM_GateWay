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