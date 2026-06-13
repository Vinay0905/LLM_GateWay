export type GatewayChatRequest = {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  metadata?: Record<string, string>;
};

export type GatewayChatResponse = {
  output: string;
  provider: string;
  model: string;
};

export type GatewayError = {
  status: number;
  message: string;
  body?: string;
};

export type SnippetPreset = {
  id: string;
  title: string;
  description: string;
  model: string;
  payload: GatewayChatRequest;
  expected: string;
};

export type TutorialStep = {
  id: string;
  title: string;
  goal: string;
  payload: GatewayChatRequest;
  expectedStatus: number;
  explanation: string;
};
