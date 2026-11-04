import { describe, expect, it } from "vitest";

import validateQuestion from "./validate-question";

const validate = (settings: Record<string, unknown>) =>
  validateQuestion({
    question: { id: "q_1", type: "fill-in-blank", title: "Q", settings },
  } as any);

describe("validateQuestion", () => {
  it("accepts a correct answer for every blank", () => {
    expect(
      validate({
        text: "Paris is in ___, Madrid in ___",
        correctAnswer: ["France", "Spain"],
      }),
    ).toEqual({ valid: true });
  });

  it("needs at least one blank", () => {
    expect(validate({ text: "No blanks here", correctAnswer: [] })).toEqual({
      valid: false,
      error: "The text needs at least one blank (___).",
    });
  });

  it("needs as many correct answers as blanks", () => {
    expect(validate({ text: "___ and ___", correctAnswer: ["one"] })).toEqual({
      valid: false,
      error:
        "The number of blanks (2) does not match the number of correct answers (1).",
    });
  });

  it("needs a blank's correct answer among its dropdown options", () => {
    expect(
      validate({
        text: "The sky ___ blue",
        correctAnswer: ["is"],
        choices: [["are", "was"]],
      }),
    ).toEqual({
      valid: false,
      error:
        "The correct answer for blank 1 is not one of its dropdown options.",
    });
  });

  it("compares with the options as the answers are graded", () => {
    const settings = {
      text: "The sky ___ blue",
      correctAnswer: [" IS "],
      choices: [["is", "are"]],
    };

    expect(validate(settings).valid).toBe(false);
    expect(validate({ ...settings, exactValuesCaseInsensitive: true })).toEqual(
      { valid: true },
    );
  });

  it("allows any answer for a blank without dropdown options", () => {
    expect(
      validate({
        text: "___ and ___",
        correctAnswer: ["a", "b"],
        choices: [[], ["b", "c"]],
      }),
    ).toEqual({ valid: true });
  });
});
