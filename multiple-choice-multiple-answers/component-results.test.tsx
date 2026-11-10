import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ResultsComponent from "./component-results";

describe("multiple choice (multiple-answers) results", () => {
  it("shows the feedback for the picked option", () => {
    const Component = ResultsComponent as any;
    render(
      <Component
        question={{ settings: { options: ["Paris", "Lyon"] } }}
        answer={{ value: ["Lyon"] }}
        feedback={{ byValue: { Lyon: "<p>Second city.</p>" } }}
      />,
    );

    expect(screen.getByText("Second city.")).toBeTruthy();
  });
});
