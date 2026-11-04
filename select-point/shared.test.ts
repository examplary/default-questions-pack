import { describe, expect, it } from "vitest";

import { parseAreas } from "./shared";

const circle = { shape: "circle", coords: [191, 393, 10] };

describe("parseAreas", () => {
  it("returns the areas", () => {
    expect(parseAreas([circle])).toEqual([circle]);
  });

  it("parses areas stored as a JSON string", () => {
    expect(parseAreas(JSON.stringify([circle]))).toEqual([circle]);
  });

  it("drops areas without coordinates", () => {
    expect(parseAreas([circle, { shape: "rect" }, "circle"])).toEqual([circle]);
  });

  it("returns no areas for missing or unparseable values", () => {
    expect(parseAreas(undefined)).toEqual([]);
    expect(parseAreas("circle at 191, 393")).toEqual([]);
  });
});
