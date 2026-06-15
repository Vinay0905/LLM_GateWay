import logging
from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern
from presidio_anonymizer import AnonymizerEngine

logger = logging.getLogger("safety_sidecar.pii")

# Instantiate engines once
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

# Custom Recognizer: Indian Aadhaar Number
aadhaar_pattern = Pattern(
    name="aadhaar_pattern",
    regex=r"\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b",
    score=0.85
)
aadhaar_recognizer = PatternRecognizer(
    supported_entity="IN_AADHAAR",
    patterns=[aadhaar_pattern]
)

# Custom Recognizer: Indian PAN Card
pan_pattern = Pattern(
    name="pan_pattern",
    regex=r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b",
    score=0.85
)
pan_recognizer = PatternRecognizer(
    supported_entity="IN_PAN",
    patterns=[pan_pattern]
)

# Register custom entities
analyzer.registry.add_recognizer(aadhaar_recognizer)
analyzer.registry.add_recognizer(pan_recognizer)

# Defined list of target entities to evaluate
TARGET_ENTITIES = [
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "CREDIT_CARD",
    "US_SSN",
    "IN_AADHAAR",
    "IN_PAN"
]

def analyze_pii(prompt: str) -> tuple[str, list[str]]:
    """
    Analyzes prompt text to identify and redact sensitive PII fields.
    
    Args:
        prompt (str): Raw input prompt
        
    Returns:
        tuple: (masked_prompt: str, detected_types: list[str])
    """
    if not prompt or not prompt.strip():
        return prompt, []

    try:
        # 1. Analyze text for target PII
        results = analyzer.analyze(
            text=prompt,
            language="en",
            entities=TARGET_ENTITIES
        )
        
        if not results:
            return prompt, []

        # Extract unique list of detected entity categories
        detected_types = list(set([res.entity_type for res in results]))

        # 2. Redact text values with placeholders (e.g., <EMAIL_ADDRESS>)
        anonymized = anonymizer.anonymize(
            text=prompt,
            analyzer_results=results
        )
        
        return anonymized.text, detected_types

    except Exception as e:
        logger.error(f"Error executing PII detection: {str(e)}")
        # In case of failure, return the original prompt and empty list (fail-safe)
        return prompt, []