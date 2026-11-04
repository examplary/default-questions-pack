import { describe, expect, it } from "vitest";

import { getParts, toggle } from "./shared";

describe("getParts", () => {
  it("lists the parts in brackets", () => {
    expect(getParts("<p>The [cat] [sat] on the [mat].</p>")).toEqual([
      "cat",
      "sat",
      "mat",
    ]);
  });

  it("leaves math alone", () => {
    expect(
      getParts("<p>A [note] on <inline-math>[0, 1]</inline-math>.</p>"),
    ).toEqual(["note"]);
  });
});

describe("toggle", () => {
  it("selects and deselects a part", () => {
    expect(toggle(["cat"], "sat")).toEqual(["cat", "sat"]);
    expect(toggle(["cat", "sat"], "cat")).toEqual(["sat"]);
  });
});
