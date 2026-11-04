import { describe, expect, it } from "vitest";

import { parseChoices } from "./shared";

describe("parseChoices", () => {
  it("returns choices per blank", () => {
    expect(parseChoices([["is", "are"], []])).toEqual([["is", "are"], []]);
  });

  it("parses choices stored as a JSON string", () => {
    expect(parseChoices('[["is", "are"], ["was", "were"]]')).toEqual([
      ["is", "are"],
      ["was", "were"],
    ]);
  });

  it("turns a blank that is not a list into a free text blank", () => {
    expect(parseChoices(["is; are", ["was", "were"]])).toEqual([
      [],
      ["was", "were"],
    ]);
  });

  it("returns no choices for missing or unparseable values", () => {
    expect(parseChoices(undefined)).toEqual([]);
    expect(parseChoices("is; are")).toEqual([]);
    expect(parseChoices({ 0: ["is", "are"] })).toEqual([]);
  });
});
