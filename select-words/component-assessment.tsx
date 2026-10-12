import { FrontendAssessmentComponent } from "@examplary/ui";

import { SelectableText, toggleSelection } from "./shared";

const AssessmentComponent: FrontendAssessmentComponent = ({
  question,
  answer,
  saveAnswer,
  reviewMode,
}) => {
  // Answers store the positions of the selected parts as strings
  const selected = ((answer?.value as string[]) || []).map(Number);

  return (
    <SelectableText
      text={question.settings.text || ""}
      selected={selected}
      correct={reviewMode ? question.settings.correctAnswer : []}
      showParts={question.settings.showParts !== false}
      onToggle={(index) => {
        const value = toggleSelection(
          selected,
          index,
          question.settings.maxChoices,
        );
        saveAnswer({ value: value.map(String), completed: value.length > 0 });
      }}
    />
  );
};

export default AssessmentComponent;
