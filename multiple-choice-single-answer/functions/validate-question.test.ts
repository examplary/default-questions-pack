import { describe, expect, it } from "vitest";

import validateQuestion from "./validate-question";

const validate = (settings: Record<string, unknown> | undefined) =>
  validateQuestion({
    question: {
      id: "q_1",
      type: "multiple-choice-single-answer",
      title: "Q",
      settings,
    },
  } as any);

const options = ["Sydney", "Canberra", "Melbourne"];

describe("validateQuestion", () => {
  it("accepts a correct answer that is one of the options", () => {
    expect(validate({ options, correctAnswer: "Canberra" })).toEqual({
      valid: true,
    });
  });

  it("needs settings", () => {
    expect(validate(undefined)).toEqual({
      valid: false,
      error: "There need to be at least two options.",
    });
  });

  it("needs options to be an array of at least two", () => {
    expect(validate({ options: "Sydney", correctAnswer: "Sydney" }).valid).toBe(
      false,
    );
    expect(
      validate({ options: ["Sydney"], correctAnswer: "Sydney" }).valid,
    ).toBe(false);
  });

  it("rejects empty or non-string options", () => {
    const error = "Every option needs to be a non-empty string.";
    expect(validate({ options: ["A", " "], correctAnswer: "A" })).toEqual({
      valid: false,
      error,
    });
    expect(validate({ options: ["A", 2], correctAnswer: "A" })).toEqual({
      valid: false,
      error,
    });
  });

  it("rejects duplicate options", () => {
    expect(validate({ options: ["A", "B", "A"], correctAnswer: "A" })).toEqual({
      valid: false,
      error: "All options need to be unique.",
    });
  });

  it("needs a correct answer", () => {
    expect(validate({ options }).valid).toBe(false);
    expect(validate({ options, correctAnswer: ["Canberra"] }).valid).toBe(
      false,
    );
  });

  it("needs the correct answer to exactly match an option", () => {
    expect(validate({ options, correctAnswer: "canberra" })).toEqual({
      valid: false,
      error: 'The correct answer "canberra" is not exactly one of the options.',
    });
  });
});
