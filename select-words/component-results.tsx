import { FrontendResultsComponent } from "@examplary/ui";

import { SelectableText } from "./shared";

const ResultsComponent: FrontendResultsComponent = ({ question, answer }) => {
  if (!answer.value) return null;

  return (
    <SelectableText
      text={question.settings.text || ""}
      selected={(answer.value as string[]).map(Number)}
      showParts={question.settings.showParts !== false}
    />
  );
};

export default ResultsComponent;
