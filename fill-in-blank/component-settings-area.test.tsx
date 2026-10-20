import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import SettingsAreaComponent from "./component-settings-area";

const t = (key: string | string[]) => String(key);

// Stands in for the editor host: settings are saved straight away, and every
// write is kept to check what the settings area changed
const renderSettingsArea = (initialSettings: Record<string, any>) => {
  const writes: Record<string, any>[] = [];
  const current = { settings: initialSettings };

  const Host = () => {
    const [settings, setSettings] = useState(initialSettings);
    current.settings = settings;
    const save = (changes: Record<string, any>) => {
      writes.push(changes);
      setSettings((settings) => ({ ...settings, ...changes }));
    };
    const Component = SettingsAreaComponent as any;
    return (
      <Component
        settings={settings}
        setSetting={(id: string, value: any) => save({ [id]: value })}
        setMultipleSettings={save}
        t={t}
      />
    );
  };

  const result = render(<Host />);
  const editor = () =>
    (result.container.querySelector(".ProseMirror") as any)?.editor;
  const chips = () => result.container.querySelectorAll("[data-blank]");
  return { ...result, writes, current, editor, chips };
};

const insertBlank = () => {
  // Clicking the button moves the focus away from the editor first
  act(() => screen.getByText("insert-blank").focus());
  fireEvent.click(screen.getByText("insert-blank"));
};

describe("existing questions", () => {
  it.each([
    ["plain text", "The capital of France is ___ and of Spain ___."],
    [
      "rich text",
      "<p>The capital of <b>France</b> is ___ and of Spain ___.</p>",
    ],
  ])("shows the blanks of %s without changing anything", async (_, text) => {
    const { chips, writes } = renderSettingsArea({
      text,
      correctAnswer: ["Paris", "Madrid"],
      choices: '[["Paris", "Lyon"], []]',
    });

    await waitFor(() => expect(chips()).toHaveLength(2));
    expect(chips()[0].textContent).toContain("Paris");
    expect(chips()[1].textContent).toContain("Madrid");
    expect(writes).toEqual([]);
  });

  it("doesn't open the popover of blanks that were already there", async () => {
    const { chips } = renderSettingsArea({
      text: "<p>The capital of France is ___.</p>",
      correctAnswer: ["Paris"],
    });

    await waitFor(() => expect(chips()).toHaveLength(1));
    expect(screen.queryByText("correct-answer")).toBeNull();
  });

  it("shows answers that aren't strings", async () => {
    const { chips } = renderSettingsArea({
      text: "<p>The year was ___.</p>",
      correctAnswer: [1990],
    });

    await waitFor(() => expect(chips()).toHaveLength(1));
    expect(chips()[0].textContent).toContain("1990");
  });

  // The other question components, grading and the QTI export all look for
  // `___` in the text
  it("keeps storing blanks as plain underscores", async () => {
    const { chips, editor, current } = renderSettingsArea({
      text: "<p>The capital of France is ___.</p>",
      correctAnswer: ["Paris"],
    });
    await waitFor(() => expect(chips()).toHaveLength(1));

    // Typed one after the other at the cursor, which would jump to the end
    // if the editor's content were reset after the first change
    act(() => {
      editor().commands.setTextSelection(1);
      editor().commands.insertContent("So");
    });
    act(() => {
      editor().commands.insertContent(", ");
    });

    expect(current.settings.text).toBe(
      "<p>So, The capital of France is ___.</p>",
    );
  });
});

describe("adding and removing blanks", () => {
  const settings = {
    text: "<p>The cat sat on the ___.</p>",
    correctAnswer: ["mat"],
    alternativeAnswers: [["rug"]],
    choices: [["mat", "rug", "sofa"]],
  };

  it("adds a blank at the end without a cursor, and opens it", async () => {
    const { chips, current } = renderSettingsArea(settings);
    await waitFor(() => expect(chips()).toHaveLength(1));

    insertBlank();

    await waitFor(() =>
      expect(screen.getByText("correct-answer")).toBeTruthy(),
    );
    expect(current.settings.text).toBe("<p>The cat sat on the ___.___</p>");
    expect(current.settings.correctAnswer).toEqual(["mat", ""]);
  });

  it("moves the settings of the other blanks along", async () => {
    const { chips, editor, current } = renderSettingsArea(settings);
    await waitFor(() => expect(chips()).toHaveLength(1));

    act(() => {
      editor().commands.setTextSelection(4);
      editor().view.dom.focus();
    });
    fireEvent.focus(editor().view.dom);
    insertBlank();

    await waitFor(() =>
      expect(screen.getByText("correct-answer")).toBeTruthy(),
    );
    expect(current.settings.text).toBe("<p>The___ cat sat on the ___.</p>");
    expect(current.settings.correctAnswer).toEqual(["", "mat"]);
    expect(current.settings.alternativeAnswers).toEqual([[], ["rug"]]);
    expect(current.settings.choices).toEqual([[], ["mat", "rug", "sofa"]]);
  });

  it("uses the selected text as the answer", async () => {
    const { editor, current } = renderSettingsArea({
      text: "<p>The cat sat on the mat.</p>",
      correctAnswer: [],
    });
    await waitFor(() => expect(editor()).toBeTruthy());

    act(() => {
      editor().commands.setTextSelection({ from: 5, to: 8 });
      editor().view.dom.focus();
    });
    fireEvent.focus(editor().view.dom);
    insertBlank();

    await waitFor(() =>
      expect(screen.getByText("correct-answer")).toBeTruthy(),
    );
    expect(current.settings.text).toBe("<p>The ___ sat on the mat.</p>");
    expect(current.settings.correctAnswer).toEqual(["cat"]);
  });

  it("opens a blank typed as underscores", async () => {
    const { chips, editor } = renderSettingsArea(settings);
    await waitFor(() => expect(chips()).toHaveLength(1));

    act(() => {
      editor().commands.insertContentAt(1, "__");
    });
    expect(screen.queryByText("correct-answer")).toBeNull();
    act(() => {
      editor().commands.insertContentAt(3, "_");
    });

    await waitFor(() =>
      expect(screen.getByText("correct-answer")).toBeTruthy(),
    );
  });

  it("removes the settings of a removed blank", async () => {
    const { chips, editor, current } = renderSettingsArea({
      ...settings,
      text: "<p>A ___ B ___</p>",
      correctAnswer: ["a", "b"],
      alternativeAnswers: [[], ["bee"]],
      choices: [],
    });
    await waitFor(() => expect(chips()).toHaveLength(2));

    act(() => {
      editor().commands.deleteRange({ from: 3, to: 4 });
    });

    expect(current.settings.text).toBe("<p>A  B ___</p>");
    expect(current.settings.correctAnswer).toEqual(["b"]);
    expect(current.settings.alternativeAnswers).toEqual([["bee"]]);
  });
});
