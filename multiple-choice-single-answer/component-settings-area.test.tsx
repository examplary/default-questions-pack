import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SettingsAreaComponent from "./component-settings-area";

const renderSettingsArea = (byValue: Record<string, string>) => {
  const setFeedbackByValue = vi.fn();
  const Component = SettingsAreaComponent as any;
  const result = render(
    <Component
      question={{ feedback: { predefined: { enabled: true, byValue } } }}
      settings={{ options: ["Paris", "Lyon"], correctAnswer: "Paris" }}
      setMultipleSettings={vi.fn()}
      setFeedbackByValue={setFeedbackByValue}
      t={(key: string) => key}
    />,
  );
  const optionEditor = (index: number) =>
    (result.container.querySelectorAll(".ProseMirror")[index] as any).editor;
  return { ...result, setFeedbackByValue, optionEditor };
};

describe("multiple choice (single-answer) option feedback", () => {
  it("offers feedback for every option", () => {
    const { getAllByTitle } = renderSettingsArea({});

    expect(getAllByTitle("option-feedback")).toHaveLength(2);
  });

  it("moves an option's feedback along when the option is renamed", () => {
    const { optionEditor, setFeedbackByValue } = renderSettingsArea({
      Lyon: "<p>Second city.</p>",
    });

    act(() =>
      optionEditor(1).commands.setContent("Lyons", { emitUpdate: true }),
    );

    // Options are stored as the editor's HTML
    expect(setFeedbackByValue).toHaveBeenCalledWith({
      Lyon: null,
      "<p>Lyons</p>": "<p>Second city.</p>",
    });
  });

  it("leaves feedback alone when renaming an option without any", () => {
    const { optionEditor, setFeedbackByValue } = renderSettingsArea({});

    act(() =>
      optionEditor(1).commands.setContent("Lyons", { emitUpdate: true }),
    );

    expect(setFeedbackByValue).not.toHaveBeenCalled();
  });
});
