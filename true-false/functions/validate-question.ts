import { type Question } from "@examplary/schemas";

type ValidateQuestionResult = {
  valid: boolean;
  error?: string;
};

export default function validateQuestion(input: {
  question: Question;
}): ValidateQuestionResult {
  const correctAnswer = input.question.settings?.correctAnswer;

  if (correctAnswer !== "true" && correctAnswer !== "false") {
    return {
      valid: false,
      error:
        'The correct answer needs to be the string "true" or "false", not a boolean or any other value.',
    };
  }

  return { valid: true };
}
