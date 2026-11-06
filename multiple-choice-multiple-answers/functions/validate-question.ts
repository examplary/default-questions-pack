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
    return invalid("Every option needs to be a non-empty string.");
  }
  if (new Set(options).size !== options.length) {
    return invalid("All options need to be unique.");
  }

  if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
    return invalid(
      "The correct answer needs to be an array with at least one option.",
    );
  }
  if (new Set(correctAnswer).size !== correctAnswer.length) {
    return invalid(
      "The correct answer contains the same option more than once.",
    );
  }

  const missing = correctAnswer.find((answer) => !options.includes(answer));
  if (missing !== undefined) {
    return invalid(
      `The correct answer "${missing}" is not exactly one of the options.`,
    );
  }

  return { valid: true };
}
