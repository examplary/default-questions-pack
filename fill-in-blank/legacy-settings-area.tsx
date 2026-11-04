import {
  cn,
  FrontendQuestionSettingsAreaComponent,
  Input,
  RichTextField,
} from "@examplary/ui";
import { Fragment } from "react";

import { parseChoices } from "./shared";

// The settings area for hosts on an older @examplary/ui, without blank chips
const LegacySettingsAreaComponent: FrontendQuestionSettingsAreaComponent = ({
  settings,
  setSetting,
  t,
}) => {
  const correctAnswer = (settings.correctAnswer as string[]) || [];
  const choices = parseChoices(settings.choices);

  const setChoices = (index: number, value: string) => {
    const next = [...choices];
    next[index] = value
      .split(";")
      .map((choice) => choice.trim())
      .filter(Boolean);
    setSetting(
      "choices",
      Array.from({ length: blanks }, (_, i) => next[i] ?? []),
    );
  };

  const insertBlank = () => {
    const current = settings.text || "";
    setSetting("text", current + " ___ ");
  };

  const blanks = (settings.text || "").split("___").length - 1;

  // Mirrors the normalisation in responseProcessing, so a dropdown blank is
  // only flagged when no option could ever be graded as correct
  const normalise = (value: string) =>
    settings.exactValuesCaseInsensitive === true
      ? value.trim().toLowerCase()
      : value.trim();

  const isAnswerMissingFromChoices = (index: number) => {
    const answer = correctAnswer[index]?.trim();
    const options = choices[index] ?? [];
    if (!answer || options.length === 0) return false;
    return !options.some((option) => normalise(option) === normalise(answer));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block font-semibold font-heading mb-1">
          {t("text")}
        </label>
        <RichTextField
          value={settings.text || ""}
          onChange={(value) => setSetting("text", value)}
          placeholder={t("placeholder")}
          className="w-full"
        />
        <div className="text-sm text-zinc-500 mt-1.5">
          {t("help")}{" "}
          <button
            className="text-black underline cursor-pointer"
            onClick={insertBlank}
          >
            {t("insert-blank")}
          </button>
        </div>
      </div>
      {blanks > 0 && (
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-1 gap-y-2">
          <span />
          <label className="font-semibold font-heading">
            {blanks > 1 ? t("correct-answers") : t("correct-answer")}
          </label>
          <label className="font-medium font-heading text-zinc-500">
            {t("choices")}
          </label>
          {Array.from({ length: blanks }).map((_, index) => {
            const invalid = isAnswerMissingFromChoices(index);
            return (
              <Fragment key={index}>
                <span>{index + 1}.</span>
                <Input
                  value={correctAnswer[index] || ""}
                  onChange={(e) => {
                    const next = [...correctAnswer];
                    next[index] = e.target.value;
                    setSetting("correctAnswer", next);
                  }}
                  aria-invalid={invalid}
                  title={invalid ? t("answer-not-in-choices") : undefined}
                  className={cn(
                    "min-w-24",
                    invalid && "border-red-500 focus:border-red-500",
                  )}
                />
                <Input
                  defaultValue={choices[index]?.join("; ") ?? ""}
                  onBlur={(e) => setChoices(index, e.target.value)}
                  placeholder={t("choices-placeholder")}
                  className="min-w-24"
                />
                {invalid && (
                  <div className="col-start-2 col-span-2 -mt-1 text-xs text-red-600">
                    {t("answer-not-in-choices")}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LegacySettingsAreaComponent;
