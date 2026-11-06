import { type Question } from "@examplary/schemas";

type ValidateQuestionResult = {
  valid: boolean;
  error?: string;
};

type Settings = {
  options?: unknown;
  correctAnswer?: unknown;
};

const invalid = (error: string): ValidateQuestionResult => ({
  valid: false,
  error,
});

export default function validateQuestion(input: {
  question: Question;
}): ValidateQuestionResult {
  const { options, correctAnswer } = (input.question.settings ??
    {}) as Settings;

  if (!Array.isArray(options) || options.length < 2) {
    return invalid("There need to be at least two options.");
  }
  if (options.some((option) => typeof option !== "string" || !option.trim())) {
    return invalid("Every option needs to be a non-empty image URL.");
  }
  if (new Set(options).size !== options.length) {
    return invalid("All options need to be unique.");
  }

  if (typeof correctAnswer !== "string" || !correctAnswer) {
    return invalid(
      "The correct answer needs to be set, as a single image URL.",
    );
  }
  if (!options.includes(correctAnswer)) {
    return invalid(
      `The correct answer "${correctAnswer}" is not exactly one of the image URLs in the options.`,
    );
  }

  return { valid: true };
}
