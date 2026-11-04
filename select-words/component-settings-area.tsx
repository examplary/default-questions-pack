import {
  FrontendQuestionSettingsAreaComponent,
  RichTextField,
} from "@examplary/ui";

import { getParts, SelectableText, toggle } from "./shared";

const SettingsAreaComponent: FrontendQuestionSettingsAreaComponent = ({
  settings,
  setSetting,
  setMultipleSettings,
  t,
}) => {
  const text = settings.text || "";
  const correctAnswer = (settings.correctAnswer as string[]) || [];

  // Parts edited out of the text can't be selected, so they stop counting
  const setText = (value: string) => {
    const parts = getParts(value);
    setMultipleSettings({
      text: value,
      correctAnswer: correctAnswer.filter((part) => parts.includes(part)),
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block font-semibold font-heading mb-1">
          {t("text")}
        </label>
        <RichTextField
          value={text}
          onChange={setText}
          placeholder={t("placeholder")}
          className="w-full"
        />
        <div className="text-sm text-zinc-500 mt-1.5">{t("help")}</div>
      </div>
      {getParts(text).length > 0 && (
        <div>
          <label className="block font-semibold font-heading mb-1">
            {t("correct-answer")}
          </label>
          <div className="text-sm text-zinc-500 mb-2">
            {t("correct-answer-help")}
          </div>
          <SelectableText
            text={text}
            selected={correctAnswer}
            onToggle={(part) =>
              setSetting("correctAnswer", toggle(correctAnswer, part))
            }
          />
        </div>
      )}
    </div>
  );
};

export default SettingsAreaComponent;
