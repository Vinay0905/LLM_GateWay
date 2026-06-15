# Implementation Tutorial: PII Detection & Masking with Microsoft Presidio

This tutorial guides you through implementing an enterprise-grade PII detection and redaction module using **Microsoft Presidio** inside [pii.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/pii.py).

---

## 1. Prerequisites

Microsoft Presidio depends on a natural language processing model (spaCy) to perform Named Entity Recognition (NER).
Before running, you must install the dependencies and download the model:

```bash
# In your python environment:
pip install presidio-analyzer presidio-anonymizer
python -m spacy download en_core_web_sm
```

---

## 2. Core Concepts

* **AnalyzerEngine:** Performs entity recognition using ML models, regex, and lists.
* **AnonymizerEngine:** Replaces detected PII values with placeholders (e.g. `[EMAIL_ADDRESS]`, `[PHONE_NUMBER]`).
* **Custom Recognizers:** Presidio allows extending its capabilities by writing custom regular expression or dictionary matchers for local identifier forms (e.g. Indian Aadhaar card or PAN card).

---

## 3. Snippet-by-Snippet Explanation

### Snippet 1: Imports & Initialization
We import `presidio_analyzer` and `presidio_anonymizer`. We instantiate engines globally to avoid recreating them on every request (which is computationally expensive).

```python
from presidio_analyzer import AnalyzerEngine, PatternRecognizer, Pattern
from presidio_anonymizer import AnonymizerEngine

# Global instances of the engines for memory efficiency
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()
```

### Snippet 2: Adding Custom Recognizers (Indian Aadhaar & PAN Card)
Presidio supports international identifiers out of the box, but we can register custom regular expression rules to recognize country-specific documents like Aadhaar or PAN card.

```python
# 1. Define the Regex patterns and confidence scores
aadhaar_pattern = Pattern(
    name="aadhaar_pattern",
    regex=r"\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b",
    score=0.85
)
pan_pattern = Pattern(
    name="pan_pattern",
    regex=r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b",
    score=0.85
)

# 2. Wrap them inside Pattern Recognizers
aadhaar_recognizer = PatternRecognizer(
    supported_entity="IN_AADHAAR",
    patterns=[aadhaar_pattern]
)
pan_recognizer = PatternRecognizer(
    supported_entity="IN_PAN",
    patterns=[pan_pattern]
)

# 3. Add to the analyzer's registry
analyzer.registry.add_recognizer(aadhaar_recognizer)
analyzer.registry.add_recognizer(pan_recognizer)
```

### Snippet 3: Main Analyze Function
This function takes the prompt, scans it for a configured list of entity types (e.g., Email, Phone, Credit Card, SSN, PAN, Aadhaar), and masks/redacts the values.

```python
# The list of entities we want to check and anonymize
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
    Identifies PII within the prompt and replaces it with redacted tags.
    
    Returns:
        tuple: (masked_prompt: str, detected_types: list[str])
    """
    if not prompt or not prompt.strip():
        return prompt, []

    # 1. Scan the text for PII
    analyzer_results = analyzer.analyze(
        text=prompt,
        language="en",
        entities=TARGET_ENTITIES
    )

    # Extract unique types of PII detected
    detected_types = list(set([result.entity_type for result in analyzer_results]))

    if not analyzer_results:
        # Return unmodified prompt if no PII was detected
        return prompt, []

    # 2. Anonymize (replace matching blocks with placeholders)
    anonymized_result = anonymizer.anonymize(
        text=prompt,
        analyzer_results=analyzer_results
    )

    return anonymized_result.text, detected_types
```

---

## 4. Production-Ready Code for `pii.py`

Here is how your completed [pii.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/detectors/pii.py) should look:

```python
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
```
