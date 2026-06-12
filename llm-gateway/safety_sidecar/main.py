from fastapi import FastAPI 
from pydantic import BaseModel



# FastAPI Sidecar endpoint

app=FastAPI()
class AnalyzerRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    verdict: str
    threat_type: str
    score: float
    masked_prompt: str

@app.post("/analyze",response_model=AnalyzeResponse)
async def analyze(req: AnalyzerRequest)->AnalyzeResponse:
    blocked= "ignore previous instructions"in req.prompt.lower()

    if blocked:
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="injection",
            score=0.9,
            masked_prompt=req.prompt,
        )
    return AnalyzeResponse(
        verdict="PASS",
        threat_type="none",
        score=0.9,
        masked_prompt=req.prompt,
    )