const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 1;

const RED_FLAGS = [
  "jailbreak",
  "ignore previous instructions",
  "ignore all instructions",
  "disregard your instructions",
  "forget your instructions",
  "you are now",
  "act as if",
  "pretend you are",
];

export function validateUserMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = message.trim();

  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return { valid: false, error: "El mensaje no puede estar vacío." };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `El mensaje es demasiado largo (máximo ${MAX_MESSAGE_LENGTH} caracteres).`,
    };
  }

  const lower = trimmed.toLowerCase();
  for (const flag of RED_FLAGS) {
    if (lower.includes(flag)) {
      return {
        valid: false,
        error: "Mensaje no permitido. Por favor reformula tu pregunta.",
      };
    }
  }

  return { valid: true };
}

export function validateAIResponse(response: string): {
  valid: boolean;
  error?: string;
} {
  if (!response || response.trim().length === 0) {
    return { valid: false, error: "Respuesta vacía de la IA." };
  }

  if (response.length > 10000) {
    return { valid: false, error: "Respuesta demasiado larga." };
  }

  return { valid: true };
}
