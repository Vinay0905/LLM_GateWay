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


def check_and_decode_payloads(text:str)->list[str]:
    """
        Scans the text for base64 or hex substirngs and returns decoded strings
    """

    decoded_payloads=[]

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