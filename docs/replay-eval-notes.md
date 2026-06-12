# Replay Eval Notes

Replay evaluations should use a frozen dataset of prompts with expected safety outcomes.

For each sample:

- Send the prompt through the sidecar or gateway in a dry-run test environment.
- Capture the observed safety verdict and threat type.
- Compare observed verdict against the expected verdict.
- Accumulate true positives, false positives, true negatives, and false negatives.
- Report precision, recall, and false-positive rate before changing safety policy.

Keep raw prompts in the eval dataset only when it is stored locally and intentionally. Runtime experiment logs should continue to store prompt hashes, not raw prompt text.
