# LLM Gateway — Functionality Flowcharts & Architecture Docs

This document maps out the detailed execution flows for every core feature inside the **LLM Gateway** project.

---

## 1. Request Lifecycle & Middleware Chain
Every request arriving at `/v1/chat` goes through a strict sequence of middlewares before routing to the LLM backend.

* **Code references:** [server.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/cmd/main.go) (setup), [auth.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/middleware/auth.go), [ratelimit.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/middleware/ratelimit.go)

```mermaid
flowchart TD
    Start([Inbound HTTP Request]) --> MethodCheck{Is POST?}
    MethodCheck -- No --> Ret405[Return 405 Method Not Allowed]
    MethodCheck -- Yes --> HeaderCheck{Has X-API-Key?}
    
    HeaderCheck -- No/Invalid --> Ret401[Return 401 Unauthorized]
    HeaderCheck -- Yes --> RateLimiter{Token Bucket Check}
    
    RateLimiter -- No Tokens --> Ret429[Return 429 Too Many Requests]
    RateLimiter -- Token Available --> SafetyCall[Call Python Safety Sidecar]
    
    SafetyCall --> SafetyVerdict{Verdict Decision}
    SafetyVerdict -- BLOCK --> Ret400[Return 400 Blocked by Safety]
    SafetyVerdict -- PASS --> Router[Model Selection & Routing]
    
    Router --> CircuitBreaker{Circuit Breaker Check}
    CircuitBreaker -- Open --> Ret503[Return 503 Service Unavailable]
    CircuitBreaker -- Closed/Half-Open --> Upstream[Forward to Upstream LLM]
    
    Upstream --> LogRequest[Write SHA256 Experiment Log]
    LogRequest --> Ret200[Return 200 OK Response to Client]
```

---

## 2. API Key Auth & Rate Limiting (Token Bucket)
Limits incoming traffic per API key using an in-memory token bucket.

* **Code references:** [auth.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/middleware/auth.go), [ratelimit.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/middleware/ratelimit.go)

```mermaid
flowchart TD
    In["Request Checked for Auth"] --> FetchBucket["Get or Create Bucket for API Key"]
    FetchBucket --> CalculateTokens["Refill Tokens based on time delta elapsed"]
    CalculateTokens --> CheckCapacity{"Tokens >= 1 ?"}
    
    CheckCapacity -- Yes --> ConsumeToken["Decrement Token count by 1"]
    ConsumeToken --> ForwardRequest["Forward to safety checks"]
    
    CheckCapacity -- No --> SetRetryHeader["Set Retry-After response header"]
    SetRetryHeader --> RejectRequest["Return 429 Too Many Requests"]
```

---

## 3. Safety Sidecar Orchestration (FastAPI)
Performs multi-layered threat analysis. Runs rule-based scanning, PII masking, and LLM-as-a-Judge jailbreak checking.

* **Code references:** [main.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/main.py), [injection.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/injection.py), [pii.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/pii.py), [jailbreak.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/jailbreak.py)

```mermaid
flowchart TD
    Recv[POST /analyze { prompt }] --> Layer1{Regex Injection Check}
    
    Layer1 -- Match Found --> BlockRegex[Immediate BLOCK: injection]
    
    Layer1 -- No Match --> RunAsync[Run Parallel Detectors]
    
    subgraph Parallel Safety Checks
        RunAsync --> DetectorPII[Microsoft Presidio PII Scanner]
        RunAsync --> DetectorLLM[LLM Zero-Shot Jailbreak Judge]
    end
    
    DetectorPII --> PIIVerdict{PII Found?}
    PIIVerdict -- Yes --> MaskPrompt[Replace PII with REDACTED]
    PIIVerdict -- No --> KeepPrompt[Keep Original Prompt]
    
    DetectorLLM --> LLMVerdict{Jailbreak Score >= 0.5?}
    LLMVerdict -- Yes --> BlockLLM[BLOCK: jailbreak]
    LLMVerdict -- No --> PassChecks[PASS safety check]
    
    BlockRegex --> ResponseBlock[Return verdict: BLOCK]
    BlockLLM --> ResponseBlock
    
    MaskPrompt --> CombineResult
    KeepPrompt --> CombineResult
    PassChecks --> CombineResult
    
    CombineResult --> ResponsePass[Return verdict: PASS with masked_prompt]
```

---

## 4. Model Selection & A/B Routing
Determines which backend model and API to target, supporting static target mapping or weighted A/B split.

* **Code reference:** [model_router.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/router/model_router.go)

```mermaid
flowchart TD
    Parse[Read request payload 'model'] --> FindRule{Is Model ID in config?}
    
    FindRule -- No --> UseDefault[Map to default model: gemini-flash]
    FindRule -- Yes --> GetWeights[Get routing weights for Model ID]
    
    GetWeights --> IsSplit{Is split configured? e.g., 70% vs 30%}
    
    IsSplit -- No --> RouteSingle[Select configured provider model]
    
    IsSplit -- Yes --> GenerateRand[Generate random number R in 0-99]
    GenerateRand --> CompareWeights{Is R < weight_A?}
    
    CompareWeights -- Yes --> SelectTargetA[Select Provider A model]
    CompareWeights -- No --> SelectTargetB[Select Provider B model]
    
    UseDefault --> ResolveProvider
    RouteSingle --> ResolveProvider
    SelectTargetA --> ResolveProvider
    SelectTargetB --> ResolveProvider
    
    ResolveProvider[Map logical model to external provider target & API Key]
```

---

## 5. Upstream Resilience & Circuit Breaker
Protects the gateway from getting stuck on failing upstream providers (Gemini or Groq) by failing fast and applying exponential backoffs.

* **Code references:** [breaker.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/circuit/breaker.go), [resilience.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/providers/resilience.go)

```mermaid
flowchart TD
    StartBreaker[Request routed to Provider] --> GetStatus{State of Breaker?}
    
    GetStatus -- OPEN --> CheckCooldown{Cooldown expired?}
    CheckCooldown -- No --> FastFail[Fail Fast: Return 503]
    CheckCooldown -- Yes --> TransHalfOpen[Transition state to HALF-OPEN]
    
    TransHalfOpen --> RunRequest
    GetStatus -- CLOSED --> RunRequest[Run request with retry policy]
    GetStatus -- HALF-OPEN --> RunRequest
    
    RunRequest --> ExecuteRequest[Call Upstream API]
    ExecuteRequest --> CheckResult{Success?}
    
    CheckResult -- Yes --> HandleSuccess[Reset failure counter to 0]
    HandleSuccess --> CloseBreaker[Set state to CLOSED] --> ReturnResponse[Return Response]
    
    CheckResult -- No --> IncFailures[Increment failure counter]
    IncFailures --> ThresholdCheck{Failures >= Threshold?}
    
    ThresholdCheck -- Yes --> OpenBreaker[Set state to OPEN, start cooldown timer] --> HandleFail[Retry or return 503]
    ThresholdCheck -- No --> HandleFail
```

---

## 6. Structured Experiment Logging
Logs request-response telemetry asynchronously without saving sensitive prompt details (hashes them).

* **Code reference:** [experiment_log.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/internal/logger/experiment_log.go)

```mermaid
flowchart TD
    FinishReq[LLM Client Response Completed] --> ExtractMetrics[Collect Latency, Tokens, and Verdict Metadata]
    ExtractMetrics --> HashPrompt[Compute SHA256 Hash of prompt for privacy]
    HashPrompt --> CreateEntry[Build JSON Log entry structure]
    CreateEntry --> QueueWrite[Enqueue to asynchronous file logger]
    
    subgraph Async Logger Worker
        QueueWrite --> AppendFile[Append line to logs/experiment_log.jsonl]
    end
```

---

## 7. Next.js Showcase UI Flow
Describes how the user interface safely communicates with the gateway using server-side Next.js route proxies to hide API secrets.

* **Code reference:** [showcase_ui_improved](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/showcase_ui_improved) (Next.js app structure)

```mermaid
flowchart TD
    UserAction[User types message & hits Send] --> ClientPOST[Browser sends POST to App API: /api/chat]
    
    subgraph Next.js Node.js Server Route
        ClientPOST --> ReadEnvVars[Load GATEWAY_BASE_URL and GATEWAY_API_KEY]
        ReadEnvVars --> ForwardGateway[Forward request to Go Gateway /v1/chat]
        ForwardGateway --> RecvGateway[Receive Go Gateway Response]
    end
    
    RecvGateway --> SendClient[Send status & payload back to browser]
    
    SendClient --> ClientRender{Evaluate Status Code}
    ClientRender -- 200 OK --> ShowText[Render chatbot text response]
    ClientRender -- 400 Blocked --> ShowRedShield[Render warning: Blocked by Safety Sidecar]
    ClientRender -- 429 RateLimit --> ShowRetryPill[Render warning: Rate Limit Exceeded]
    ClientRender -- 503/502 Error --> ShowBreakerMsg[Render warning: Circuit Breaker Tripped]
```
