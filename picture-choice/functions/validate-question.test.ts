import { describe, expect, it } from "vitest";

import validateQuestion from "./validate-question";

const validate = (settings: Record<string, unknown> | undefined) =>
  validateQuestion({
    question: { id: "q_1", type: "picture-choice", title: "Q", settings },
  } as any);

const options = ["https://x.test/a.jpg", "https://x.test/b.jpg"];

describe("validateQuestion", () => {
  it("accepts a correct answer that is one of the image URLs", () => {
    expect(
      validate({ options, correctAnswer: "https://x.test/b.jpg" }),
    ).toEqual({ valid: true });
  });

  it("accepts image data URLs", () => {
    const dataUrl = "data:image/svg+xml,%3Csvg%3E";
    expect(
      validate({
        options: [dataUrl, ...options.slice(1)],
        correctAnswer: dataUrl,
      }),
    ).toEqual({ valid: true });
  });

  it("needs settings", () => {
    expect(validate(undefined)).toEqual({
      valid: false,
      error: "There need to be at least two options.",
    });
  });

  it("rejects empty or duplicate options", () => {
    expect(
      validate({ options: [options[0], ""], correctAnswer: options[0] }),
    ).toEqual({
      valid: false,
      error: "Every option needs to be a non-empty image URL.",
    });
    expect(
      validate({
        options: [options[0], options[0]],
        correctAnswer: options[0],
      }),
    ).toEqual({ valid: false, error: "All options need to be unique." });
  });

  it("rejects options that are not image URLs", () => {
    expect(
      validate({
        options: ["not an image URL", "also not an image URL"],
        correctAnswer: "not an image URL",
      }),
    ).toEqual({
      valid: false,
      error: "Every option needs to be a non-empty image URL.",
    });
  });

  it("needs a correct answer", () => {
    expect(validate({ options })).toEqual({
      valid: false,
      error: "The correct answer needs to be set, as a single image URL.",
    });
  });

  it("needs the correct answer to exactly match an option", () => {
    expect(
      validate({ options, correctAnswer: "https://x.test/c.jpg" }),
    ).toEqual({
      valid: false,
      error:
        'The correct answer "https://x.test/c.jpg" is not exactly one of the image URLs in the options.',
    });
  });
});
