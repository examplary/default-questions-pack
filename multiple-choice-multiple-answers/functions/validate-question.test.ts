import { describe, expect, it } from "vitest";

import validateQuestion from "./validate-question";

const validate = (settings: Record<string, unknown> | undefined) =>
  validateQuestion({
    question: {
      id: "q_1",
      type: "multiple-choice-multiple-answers",
      title: "Q",
      settings,
    },
  } as any);

const options = ["Helium", "Oxygen", "Neon", "Nitrogen"];

describe("validateQuestion", () => {
  it("accepts correct answers that are all options", () => {
    expect(validate({ options, correctAnswer: ["Helium", "Neon"] })).toEqual({
      valid: true,
    });
  });

  it("accepts every option being correct", () => {
    expect(validate({ options, correctAnswer: options })).toEqual({
      valid: true,
    });
  });

  it("needs settings", () => {
    expect(validate(undefined)).toEqual({
      valid: false,
      error: "There need to be at least two options.",
    });
  });

  it("rejects empty, non-string or duplicate options", () => {
    expect(validate({ options: ["A", ""], correctAnswer: ["A"] })).toEqual({
      valid: false,
      error: "Every option needs to be a non-empty string.",
    });
    expect(
      validate({ options: ["A", "B", "A"], correctAnswer: ["A"] }),
    ).toEqual({ valid: false, error: "All options need to be unique." });
  });

  it("needs a non-empty array of correct answers", () => {
    const error =
      "The correct answer needs to be an array with at least one option.";
    expect(validate({ options, correctAnswer: "Helium" })).toEqual({
      valid: false,
      error,
    });
    expect(validate({ options, correctAnswer: [] })).toEqual({
      valid: false,
      error,
    });
  });

  it("rejects the same correct answer twice", () => {
    expect(validate({ options, correctAnswer: ["Helium", "Helium"] })).toEqual({
      valid: false,
      error: "The correct answer contains the same option more than once.",
    });
  });

  it("needs every correct answer to exactly match an option", () => {
    expect(validate({ options, correctAnswer: ["Helium", "Argon"] })).toEqual({
      valid: false,
      error: 'The correct answer "Argon" is not exactly one of the options.',
    });
  });
});
