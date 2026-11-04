import { FrontendQuestionSettingsAreaComponent } from "@examplary/ui";
import { useRef } from "react";

import { Blank } from "./blank";
import {
  BlankEditor,
  supportsBlankEditor,
  type BlankEditorHandle,
  type BlankOrder,
} from "./blank-editor";
import LegacySettingsAreaComponent from "./legacy-settings-area";
import { countBlanks, parseChoices } from "./shared";

const SettingsAreaComponent: FrontendQuestionSettingsAreaComponent = ({
  settings,
  setSetting,
  setMultipleSettings,
  t,
}) => {
  const text = settings.text || "";
  const blanks = countBlanks(text);
  const correctAnswer = (settings.correctAnswer as string[]) || [];
  const choices = parseChoices(settings.choices);
  const alternativeAnswers = parseChoices(settings.alternativeAnswers);

  // Fills the whole list up to the number of blanks, as holes would be saved
  // as null and break response processing
  const replaceAt = <T,>(list: T[], index: number, value: T, empty: T) =>
    Array.from({ length: blanks }, (_, i) =>
      i === index ? value : (list[i] ?? empty),
    );

  // Moves the settings of each blank along with it, when blanks are added or
  // removed in between others
  const reorder = <T,>(list: T[], order: BlankOrder, empty: T) =>
    order.map((index) =>
      typeof index === "number" ? (list[index] ?? empty) : empty,
    );

  // Mirrors the normalisation in responseProcessing, so a dropdown blank is
  // only flagged when an answer could never be picked
  const normalise = (value: string) =>
    settings.exactValuesCaseInsensitive === true
      ? value.trim().toLowerCase()
      : value.trim();

  const isMissingFromChoices = (index: number) => (answer: string) => {
    const options = choices[index] ?? [];
    if (!answer.trim() || options.length === 0) return false;
    return !options.some((option) => normalise(option) === normalise(answer));
  };

  const editor = useRef<BlankEditorHandle>(null);

  // A blank that was just added opens straight away, to fill in its answer
  const renderBlank = (index: number, isNew: boolean) => (
    <Blank
      defaultOpen={isNew}
      answers={[
        // Generated questions may have numbers as answers
        String(correctAnswer[index] ?? ""),
        ...(alternativeAnswers[index] ?? []),
      ]}
      choices={choices[index] ?? []}
      isMissingFromChoices={isMissingFromChoices(index)}
      // The first answer stays in `correctAnswer`, which is what generation,
      // export and the review placeholders use; the others are alternatives
      onAnswersChange={([answer = "", ...alternatives]) =>
        setMultipleSettings({
          correctAnswer: replaceAt(correctAnswer, index, answer, ""),
          alternativeAnswers: replaceAt(
            alternativeAnswers,
            index,
            alternatives.map((value) => value.trim()).filter(Boolean),
            [],
          ),
        })
      }
      onChoicesChange={(value) =>
        setSetting("choices", replaceAt(choices, index, value, []))
      }
      t={t}
    />
  );

  return (
    <div>
      <label className="block font-semibold font-heading mb-1">
        {t("text")}
      </label>
      <BlankEditor
        ref={editor}
        value={text}
        onChange={(value, order) =>
          order
            ? setMultipleSettings({
                text: value,
                // New blanks can start off with an answer
                correctAnswer: order.map((index) =>
                  typeof index === "number"
                    ? (correctAnswer[index] ?? "")
                    : index,
                ),
                alternativeAnswers: reorder(alternativeAnswers, order, []),
                choices: reorder(choices, order, []),
              })
            : setSetting("text", value)
        }
        placeholder={t("placeholder")}
        renderBlank={renderBlank}
      />
      <div className="text-sm text-zinc-500 mt-1.5">
        {t("help-chips")}{" "}
        <button
          className="text-black underline cursor-pointer"
          onClick={() => editor.current?.insertBlank()}
        >
          {t("insert-blank")}
        </button>
      </div>
    </div>
  );
};

export default supportsBlankEditor
  ? SettingsAreaComponent
  : LegacySettingsAreaComponent;
