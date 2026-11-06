import { describe, expect, it } from "vitest";

import validateQuestion from "./validate-question";

const validate = (settings: Record<string, unknown> | undefined) =>
  validateQuestion({
    question: { id: "q_1", type: "true-false", title: "Q", settings },
  } as any);

describe("validateQuestion", () => {
  it.each(["true", "false"])("accepts %s as a string", (correctAnswer) => {
    expect(validate({ correctAnswer })).toEqual({ valid: true });
  });

  it.each([true, false, "True", "yes", undefined])(
    "rejects %s",
    (correctAnswer) => {
      expect(validate({ correctAnswer })).toEqual({
        valid: false,
        error:
          'The correct answer needs to be the string "true" or "false", not a boolean or any other value.',
      });
    },
  );

  it("handles missing settings", () => {
    expect(validate(undefined).valid).toBe(false);
  });
});
