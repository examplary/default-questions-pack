import { FrontendAssessmentComponent } from "@examplary/ui";

import { SelectableText, toggle } from "./shared";

const AssessmentComponent: FrontendAssessmentComponent = ({
  question,
  answer,
  saveAnswer,
  reviewMode,
}) => {
  const selected = (answer?.value as string[]) || [];

  return (
    <SelectableText
      text={question.settings.text || ""}
      selected={selected}
      correct={reviewMode ? question.settings.correctAnswer : []}
      showParts={question.settings.showParts !== false}
      onToggle={(part) => {
        const value = toggle(selected, part);
        saveAnswer({ value, completed: value.length > 0 });
      }}
    />
  );
};

export default AssessmentComponent;
