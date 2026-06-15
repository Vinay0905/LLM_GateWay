# Implementation Tutorial: Rule-Based Prompt Injection Detector

This tutorial guides you through implementing a production-grade, high-performance rule-based detector in [injection.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/injection.py).

---

## 1. Core Concepts

A rule-based prompt injection detector is the **first line of defense**. It runs locally with near-zero latency (<2ms) and aims to catch:
1. **Direct Overrides:** Prompts that explicitly tell the system to disregard prior instructions.
2. **System Role Scavenging:** Attempts to extract the system prompt (e.g., "output everything above").
3. **Obfuscated Payloads:** Attacks encoded in Base64 or Hexadecimal to bypass simple text filters.

---

## 2. Snippet-by-Snippet Explanation

### Snippet 1: Importing Modules and Pre-Compiling Regex
In production, compiling regular expressions during initialization is critical. Re-compiling regex inside a function on every request degrades throughput.

```python
import re
import base64
import binascii

# Compile patterns once at the module level for optimal performance
INJECTION_PATTERNS = [
    # Captures: "Ignore previous instructions", "Ignore all instructions", "Ignore above"
    re.compile(r"ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions", re.IGNORECASE),
    
    # Captures: "Forget everything I said", "forget your rules", "disregard guidelines"
    re.compile(r"(?:forget|disregard)\s+(?:all\s+)?(?:your\s+)?(?:rules|instructions|guidelines|prompts)", re.IGNORECASE),
    
    # Captures: "you are now DAN", "act as DAN", "Do Anything Now"
    re.compile(r"(?:you\s+are\s+now|act\s+as)\s+dan\b|do\s+anything\s+now", re.IGNORECASE),
    
    # Captures: "system prompt override", "override system instructions"
    re.compile(r"system\s+prompt\s+override", re.IGNORECASE),
    
    # Captures: "output your system prompt", "reveal system instructions"
    re.compile(r"(?:reveal|output|display)\s+(?:your\s+)?(system|developer)\s+prompt", re.IGNORECASE),
]
```

### Snippet 2: Obfuscation Decoder (Base64 & Hex)
Attackers often attempt to bypass text matches by encoding their commands. We scan the incoming prompt for Base64 and Hexadecimal structures, decode them, and run our detectors on the decoded text.

```python
def check_and_decode_payloads(text: str) -> list[str]:
    """Scans the text for base64 or hex substrings and returns decoded strings."""
    decoded_payloads = []

    # 1. Check for Base64 pattern: letters, numbers, +, /, and padding (=)
    # Match strings of length 12+ that look like base64 to avoid false positive matches on short words
    base64_candidates = re.findall(r"\b[A-Za-z0-9+/]{12,}={0,2}\b", text)
    for candidate in base64_candidates:
        try:
            decoded_bytes = base64.b64decode(candidate, validate=True)
            decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
            # Only count as valid if it contains printable ASCII characters
            if decoded_str.isprintable() and len(decoded_str.strip()) > 5:
                decoded_payloads.append(decoded_str)
        except Exception:
            # Skip candidates that fail decoding validation
            pass

    # 2. Check for Hexadecimal patterns (e.g., 49676e6f7265...)
    # Match strings of hex characters (length 16+)
    hex_candidates = re.findall(r"\b[0-9a-fA-F]{16,}\b", text)
    for candidate in hex_candidates:
        try:
            decoded_bytes = binascii.unhexlify(candidate)
            decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
            if decoded_str.isprintable() and len(decoded_str.strip()) > 5:
                decoded_payloads.append(decoded_str)
        except Exception:
            pass

    return decoded_payloads
```

### Snippet 3: Main Analyze Function
This function coordinates the checks. It first checks the raw prompt. If clean, it decodes any hidden payloads and scans them.

```python
def analyze_injection(prompt: str) -> tuple[bool, float]:
    """
    Analyzes the prompt for injection signatures.
    Returns: (is_threat: bool, threat_score: float)
    """
    if not prompt or not prompt.strip():
        return False, 0.0

    # 1. Scan raw prompt using compiled regexes
    for pattern in INJECTION_PATTERNS:
        if pattern.search(prompt):
            return True, 0.95  # Match carries high confidence threat score

    # 2. Scan for and decode obfuscated sections
    decoded_contents = check_and_decode_payloads(prompt)
    for content in decoded_contents:
        for pattern in INJECTION_PATTERNS:
            if pattern.search(content):
                return True, 0.98  # Obfuscated injection carries even higher confidence

    return False, 0.0
```

---

## 3. Production-Ready Code for `injection.py`

Here is how your completed [injection.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/injection.py) should look:

```python
import re
import base64
import binascii

# Pre-compiled regexes for optimal processing speed
INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions", re.IGNORECASE),
    re.compile(r"(?:forget|disregard)\s+(?:all\s+)?(?:your\s+)?(?:rules|instructions|guidelines|prompts)", re.IGNORECASE),
    re.compile(r"(?:you\s+are\s+now|act\s+as)\s+dan\b|do\s+anything\s+now", re.IGNORECASE),
    re.compile(r"system\s+prompt\s+override", re.IGNORECASE),
    re.compile(r"(?:reveal|output|display)\s+(?:your\s+)?(?:system|developer)\s+prompt", re.IGNORECASE),
]

def check_and_decode_payloads(text: str) -> list[str]:
    """Extracts and decodes Base64 and Hex strings found inside the text."""
    decoded_payloads = []

    # Regex for Base64 (alphanumeric, +, /, with optional padding)
    base64_candidates = re.findall(r"\b[A-Za-z0-9+/]{12,}={0,2}\b", text)
    for candidate in base64_candidates:
        try:
            # validate=True ensures it is strict Base64
            decoded_bytes = base64.b64decode(candidate, validate=True)
            decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
            if decoded_str.isprintable() and len(decoded_str.strip()) > 5:
                decoded_payloads.append(decoded_str)
        except Exception:
            pass

    # Regex for Hexadecimal
    hex_candidates = re.findall(r"\b[0-9a-fA-F]{16,}\b", text)
    for candidate in hex_candidates:
        try:
            decoded_bytes = binascii.unhexlify(candidate)
            decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
            if decoded_str.isprintable() and len(decoded_str.strip()) > 5:
                decoded_payloads.append(decoded_str)
        except Exception:
            pass

    return decoded_payloads

def analyze_injection(prompt: str) -> tuple[bool, float]:
    """
    Determines if the prompt contains a static or obfuscated prompt injection signature.
    
    Returns:
        tuple: (is_threat: bool, score: float)
    """
    if not prompt or not prompt.strip():
        return False, 0.0

    # Step 1: Check the raw prompt
    for pattern in INJECTION_PATTERNS:
        if pattern.search(prompt):
            return True, 0.95

    # Step 2: Check obfuscated matches
    decoded_strings = check_and_decode_payloads(prompt)
    for decoded in decoded_strings:
        for pattern in INJECTION_PATTERNS:
            if pattern.search(decoded):
                return True, 0.98

    return False, 0.0
```
