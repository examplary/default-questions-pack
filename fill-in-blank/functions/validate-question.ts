import { type Question } from "@examplary/schemas";

type ValidateQuestionResult = {
  valid: boolean;
  error?: string;
};

type Settings = {
  text?: string;
  correctAnswer?: string[];
  choices?: string[][];
  exactValuesCaseInsensitive?: boolean;
};

const invalid = (error: string): ValidateQuestionResult => ({
  valid: false,
  error,
});

export default function validateQuestion(input: {
  question: Question;
}): ValidateQuestionResult {
  const { question } = input;

  const {
    text = "",
    correctAnswer = [],
    choices = [],
    exactValuesCaseInsensitive,
  } = question.settings as Settings;

  const blanks = text.split("___").length - 1;
  if (blanks === 0) {
    return invalid("The text needs at least one blank (___).");
  }
  if (blanks !== correctAnswer.length) {
    return invalid(
      `The number of blanks (${blanks}) does not match the number of correct answers (${correctAnswer.length}).`,
    );
  }

  // Mirrors the normalisation in responseProcessing
  const normalise = (value: string) =>
    exactValuesCaseInsensitive === true
      ? value.trim().toLowerCase()
      : value.trim();

  const isMissingFromChoices = (answer: string, index: number) => {
    const options = Array.isArray(choices) ? (choices[index] ?? []) : [];
    return (
      options.length > 0 &&
      !options.some((option) => normalise(option) === normalise(answer))
    );
  };

  const blank = correctAnswer.findIndex(isMissingFromChoices);
  if (blank !== -1) {
    return invalid(
      `The correct answer for blank ${blank + 1} is not one of its dropdown options.`,
    );
  }

  return { valid: true };
}
