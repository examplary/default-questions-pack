import { describe, expect, it } from "vitest";

import { countParts, toggleSelection } from "./shared";

describe("countParts", () => {
  it("counts the bracketed parts", () => {
    expect(countParts("<p>The [cat] [sat] on the [mat].</p>")).toBe(3);
    expect(countParts("No parts")).toBe(0);
  });
});

describe("toggleSelection", () => {
  it("selects and deselects a part", () => {
    expect(toggleSelection([1], 2)).toEqual([1, 2]);
    expect(toggleSelection([1, 2], 1)).toEqual([2]);
  });

  it("drops the earliest selection at the limit", () => {
    expect(toggleSelection([0], 2, 1)).toEqual([2]);
    expect(toggleSelection([0, 1], 2, 2)).toEqual([1, 2]);
  });
});
