import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ResultsComponent from "./component-results";

const settings = {
  left: ["Apple", "Banana"],
  right: ["Red", "Yellow"],
  correctAnswer: ["Apple = Red", "Banana = Yellow"],
};

const renderResults = (layout?: string) =>
  render(
    <ResultsComponent
      {...({
        question: { id: "q1", settings: { ...settings, layout } },
        answer: { value: ["Apple = Red", "Banana = Yellow"] },
      } as any)}
    />,
  ).container.firstElementChild!;

describe("results layout", () => {
  it("stacks the pairs for the vertical layout", () => {
    expect(renderResults("vertical").className).not.toContain("md:flex-row!");
  });

  it("puts the pairs side by side for the horizontal layout", () => {
    expect(renderResults("horizontal").className).toContain("md:flex-row!");
  });

  it("falls back to vertical when there are too many items", () => {
    const many = ["A", "B", "C", "D", "E"];
    const { container } = render(
      <ResultsComponent
        {...({
          question: {
            id: "q1",
            settings: { left: many, right: many, layout: "horizontal" },
          },
          answer: { value: ["A = A"] },
        } as any)}
      />,
    );
    expect(container.firstElementChild!.className).not.toContain(
      "md:flex-row!",
    );
  });
});
