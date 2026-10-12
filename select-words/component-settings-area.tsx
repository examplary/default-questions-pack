import {
  FrontendQuestionSettingsAreaComponent,
  RichTextField,
} from "@examplary/ui";

import { countParts, SelectableText, toggleSelection } from "./shared";

const SettingsAreaComponent: FrontendQuestionSettingsAreaComponent = ({
  settings,
  setSetting,
  t,
}) => {
  const text = settings.text || "";
  const correctAnswer = (settings.correctAnswer as number[]) || [];

  return (
    <div className="space-y-5">
      <div>
        <label className="block font-semibold font-heading mb-1">
          {t("text")}
        </label>
        <RichTextField
          value={text}
          onChange={(value) => setSetting("text", value)}
          placeholder={t("placeholder")}
          className="w-full"
        />
        <div className="text-sm text-zinc-500 mt-1.5">{t("help")}</div>
      </div>
      {countParts(text) > 0 && (
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
            onToggle={(index) =>
              setSetting("correctAnswer", toggleSelection(correctAnswer, index))
            }
          />
        </div>
      )}
    </div>
  );
};

export default SettingsAreaComponent;
