import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AssessmentComponent from "./component-assessment";
import { renderAssessment } from "../.tests/render-assessment";

const settings = { options: ["Paris", "Lyon", "Marseille"] };

describe("multiple choice (multiple-answers) feedback", () => {
  it("shows the feedback for each option it was given for", () => {
    renderAssessment(AssessmentComponent, {
      settings,
      answer: { value: ["Lyon"], completed: true },
      feedback: { byValue: { Lyon: "<p>Lyon is the second city.</p>" } },
    });

    expect(screen.getByText("Lyon is the second city.")).toBeTruthy();
  });

  it("shows no feedback before it's given", () => {
    renderAssessment(AssessmentComponent, { settings });

    expect(screen.queryByText("Lyon is the second city.")).toBeNull();
  });
});
